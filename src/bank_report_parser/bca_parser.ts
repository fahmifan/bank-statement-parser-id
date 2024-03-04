import { TextItem } from "pdfjs-dist/types/src/display/api";
import { FnAskPassword, FnUpdatePassword, TrxRecord } from "./shared";
import pdfjs from '../pdfjs';

export async function parseBCAStatement(
	buf: ArrayBuffer,
	askPassword: FnAskPassword,
	askRetryPassword: FnAskPassword,
): Promise<TrxRecord[]> {
	const loadingTask = pdfjs.getDocument(buf);
	loadingTask.onPassword = (
		updatePassword: FnUpdatePassword,
		reason: number,
	) => {
		if (reason === pdfjs.PasswordResponses.NEED_PASSWORD) {
			const password = askPassword();
			updatePassword(password);
		}
		if (reason === pdfjs.PasswordResponses.INCORRECT_PASSWORD) {
			const password = askRetryPassword();
			updatePassword(password);
		}
	};

	const pdfdoc = await loadingTask.promise;

	const allRecs: TrxRecord[] = [];
	for (let pageNum = 1; pageNum <= pdfdoc.numPages; pageNum++) {
		const page = await pdfdoc.getPage(pageNum);
		const txts = await page.getTextContent();
		const items = txts.items as TextItem[];
		const recs = parseBCAItems(items);
		allRecs.push(...recs);
	}

	return allRecs;
}

const dateRgx: RegExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
const moneyRgx: RegExp = /^\d{1,3}(,\d{3})*\.\d{2}$/;

export function parseBCAItems(items: TextItem[] = []): TrxRecord[] {
	const periodeIdx = items.findIndex((rec: TextItem) => rec.str === "PERIODE");
	const periode = items[periodeIdx + 4].str;
	const tahun = parseInt(periode.split(" ")[1], 10);

	// find saldo awal
	const saldoIdx: number = items.findIndex(
		(rec: TextItem) => rec.str === "SALDO",
	);

	const startIdx: number = saldoIdx + 2;
	const rows: string[][] = [];

	// build rows
	let rowsIdx: number = startIdx;
	while (rowsIdx < items.length) {
		const row: string[] = [];
		let i: number = rowsIdx;
		for (; i < items.length; i++) {
			rowsIdx++;
			const rec: TextItem = items[i];
			if (rec.hasEOL) {
				if (rec.str !== "") {
					row.push(rec.str);
				}
				break;
			}
			if (rec.str === "") {
				continue;
			}

			row.push(rec.str);
		}
		if (row.length === 0) {
			continue;
		}

		// stop
		const str: string = row.join("").trim().toLowerCase();
		if (str === "bersambung ke halaman berikut") {
			break;
		}

		rows.push(row);
	}

	const txrecs: TrxRecord[] = [];

	// build tx records
	let irow = 0;
	for (const row of rows) {
		const txrec: TrxRecord = {
			tahun,
			ket: "",
			tgl: "",
			type: "saldo_awal",
			mutasi: 0.0,
			saldo: 0.0,
		};
		irow++;

		const endParse =
			irow > rows.length - 5 && row.join("").includes("SALDO AWAL :");
		if (endParse) {
			break;
		}

		let i = 0;
		while (i < row.length) {
			if (row[i].trim() === "") {
				i++;
				continue;
			}

			if (dateRgx.test(row[i])) {
				txrec.tgl = row[i];
				i++;
				continue;
			}

			const isMutasi = moneyRgx.test(row[i]);
			if (isMutasi) {
				const isTwoNextEOL: boolean = i + 2 === row.length;
				const isTwoNextDebit: boolean =
					!isTwoNextEOL &&
					row[i + 2] !== undefined &&
					row[i + 2].toLowerCase() === "db";

				const isTwoNextSaldo: boolean =
					!isTwoNextEOL &&
					row[i + 2] !== undefined &&
					moneyRgx.test(row[i + 2]);

				const isFourNextSaldo: boolean =
					!isTwoNextEOL &&
					row[i + 4] !== undefined &&
					moneyRgx.test(row[i + 4]);

				const currIdx = i;
				txrec.mutasi = parseFloat(row[currIdx].replace(/,/g, ""));
				i++;

				txrec.type = "credit";
				if (isTwoNextDebit) {
					txrec.type = "debit";
					i += 2;
				} else if (isTwoNextSaldo) {
					txrec.saldo = parseFloat(row[currIdx + 2].replace(/,/g, ""));
					i += 2;
				}

				if (!isTwoNextSaldo && isFourNextSaldo) {
					txrec.saldo = parseFloat(row[currIdx + 4].replace(/,/g, ""));
					i += 2;
				}

				continue;
			}

			if (row[i].toUpperCase() === "DB" || row[i].toUpperCase() === "CR") {
				i++;
				continue;
			}

			// build keterangan
			txrec.ket += `${row[i]} `;
			i++;
		}

		if (txrec.ket && txrec.ket !== "") {
			txrec.ket = txrec.ket.trim();
			if (txrec.ket.toUpperCase() === "SALDO AWAL") {
				txrec.type = "saldo_awal";
			}
		}

		// part of previous txrec ketrangan
		if ((!txrec.tgl || txrec.tgl === "") && txrec.ket !== "") {
			if (txrecs.length === 0 || !txrecs[txrecs.length - 1]) {
				continue;
			}
			txrecs[txrecs.length - 1].ket += ` ${txrec.ket}`;
			continue;
		}

		txrecs.push(txrec);
	}

	return txrecs;
}

import { TextItem } from "pdfjs-dist/types/src/display/api";
import { parseMandiriItems } from "./mandiri_parser";
import payload from "./test_data.payload_mandiri";

import { it, expect } from 'vitest'

it("ok parseMandiriItems", () => {
	const arg = payload as unknown as TextItem[]

	const res = parseMandiriItems(2023, payload as unknown as TextItem[]);
	console.log(JSON.stringify(res));
	expect(res).toMatchObject([
		{
			ket: "Saldo Awal",
			tgl: "01/09",
			tahun: 2023,
			type: "saldo_awal",
			mutasi: 659470,
			saldo: 0,
		},
		{
			ket: "-MONTHLY CARD CHARGE 987654321",
			tgl: "05/09",
			tahun: 2023,
			type: "debit",
			mutasi: 5500,
			saldo: 653970,
		},
		{
			ket: "Tarif Link -123 /001122/ATB-001122 987654321 AFMT SESAMA",
			tgl: "07/09",
			tahun: 2023,
			type: "debit",
			mutasi: 500000,
			saldo: 153970,
		},
		{
			ket: "Tarif Link -001122 /001122/ATB-001122 987654321 AFMT SESAMA",
			tgl: "07/09",
			tahun: 2023,
			type: "debit",
			mutasi: 7500,
			saldo: 146470,
		},
		{
			ket: "-UBP987654321",
			tgl: "10/09",
			tahun: 2023,
			type: "debit",
			mutasi: 20000,
			saldo: 126470,
		},
		{
			ket: "-20230916CENAIDJA987654321 CENAIDJA/JOHN DOE 987654321 -",
			tgl: "16/09",
			tahun: 2023,
			type: "credit",
			mutasi: 1000000,
			saldo: 1126470,
		},
		{
			ket: "-987654321 987654321=",
			tgl: "16/09",
			tahun: 2023,
			type: "debit",
			mutasi: 508206,
			saldo: 618264,
		},
		{
			ket: "Biaya Adm -",
			tgl: "30/09",
			tahun: 2023,
			type: "debit",
			mutasi: 12500,
			saldo: 605764,
		},
	]);
});

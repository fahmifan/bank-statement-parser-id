import { TextItem } from "pdfjs-dist/types/src/display/api";
import { parseBCAItems } from "./bca_parser";
import payload from "./test_data.payload_bca";
import {it, expect} from 'vitest'

it("ok parseItems", () => {
	const res = parseBCAItems(payload as unknown as TextItem[]);

	expect(res).toMatchObject([
		{
			ket: "SALDO AWAL",
			tgl: "01/09",
			tahun: 2023,
			type: "saldo_awal",
			mutasi: 5964293.22,
			saldo: 0,
		},
		{
			ket: "DEBIT DOMESTIK TRN DEBIT DOM 008 RUMAH SAKIT UMUM P",
			tgl: "01/09",
			tahun: 2023,
			type: "debit",
			mutasi: 497833,
			saldo: 5466460.22,
		},
		{
			ket: "TRSF E-BANKING 0209/FTSCY/WS95271 500000.00 JEAN DEAN",
			tgl: "02/09",
			tahun: 2023,
			type: "debit",
			mutasi: 500000,
			saldo: 0,
		},
		{
			ket: "TRSF E-BANKING 0209/FTFVA/WS95271 88888/GO-PAY CUSTO - - 9876543221",
			tgl: "02/09",
			tahun: 2023,
			type: "debit",
			mutasi: 121000,
			saldo: 4845460.22,
		},
		{
			ket: "KARTU DEBIT WARUNG SESAMA 987654321",
			tgl: "03/09",
			tahun: 2023,
			type: "debit",
			mutasi: 143500,
			saldo: 4701960.22,
		},
		{
			ket: "TRSF E-BANKING 0409/FTSCY/WS95271 200000.00 JEAN DEAN",
			tgl: "04/09",
			tahun: 2023,
			type: "debit",
			mutasi: 200000,
			saldo: 4501960.22,
		},
		{
			ket: "TRSF E-BANKING 0509/FTSCY/WS95031 200000.00 pinjam kemarin JEAN DEAN",
			tgl: "05/09",
			tahun: 2023,
			type: "credit",
			mutasi: 200000,
			saldo: 0,
		},
		{
			ket: "KARTU DEBIT ALFAMRT B958 RGB2 987654321",
			tgl: "05/09",
			tahun: 2023,
			type: "debit",
			mutasi: 101900,
			saldo: 0,
		},
		{
			ket: "KARTU DEBIT BORMA,BANDUNG 987654321",
			tgl: "05/09",
			tahun: 2023,
			type: "debit",
			mutasi: 264200,
			saldo: 4335860.22,
		},
		{
			ket: "TRSF E-BANKING 0709/PYBCA/WS95051 ID085 PAY JANUARI 2023 GTA SAN ANDREAS",
			tgl: "07/09",
			tahun: 2023,
			type: "credit",
			mutasi: 23000000,
			saldo: 3335860.22,
		},
		{
			ket: "TRSF E-BANKING 0809/FTSCY/WS95271 1000000.00 JOHN DOE MAN",
			tgl: "08/09",
			tahun: 2023,
			type: "debit",
			mutasi: 1000000,
			saldo: 3335860.22,
		},
		{
			ket: "TRSF E-BANKING 0909/FTSCY/WS95271 3000000.00 JEAN DEAN",
			tgl: "09/09",
			tahun: 2023,
			type: "debit",
			mutasi: 3000000,
			saldo: 23335860.22,
		},
		{
			ket: "TRSF E-BANKING 1009/FTFVA/WS95221 61001/ONEKLIK GOPA - - 987654321QWERT",
			tgl: "10/09",
			tahun: 2023,
			type: "debit",
			mutasi: 199500,
			saldo: 23136360.22,
		},
		{
			ket: "TRANSAKSI DEBIT TGL: QR 014 00000.00PRJT SP",
			tgl: "14/09",
			tahun: 2023,
			type: "debit",
			mutasi: 95000,
			saldo: 0,
		},
		{
			ket: "TRANSAKSI DEBIT TGL: QR 014 00000.00PRJT SP",
			tgl: "14/09",
			tahun: 2023,
			type: "debit",
			mutasi: 44000,
			saldo: 0,
		},
		{
			ket: "TRANSAKSI DEBIT TGL: QR 898 00000.00DUMM 99",
			tgl: "14/09",
			tahun: 2023,
			type: "debit",
			mutasi: 45000,
			saldo: 0,
		},
		{
			ket: "KARTU DEBIT KKK HHHH AAA- 987654231",
			tgl: "14/09",
			tahun: 2023,
			type: "debit",
			mutasi: 589000,
			saldo: 4363360.22,
		},
	]);
});
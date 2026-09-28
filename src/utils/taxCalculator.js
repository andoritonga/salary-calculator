// PPh 21 Tarif Efektif Rata-Rata (TER) berdasarkan PP 58/2023 & PMK 168/2023

export const PTKP_LIST = [
  { code: 'TK/0', label: 'TK/0 - Tidak Kawin, 0 Tanggungan (Rp 54 Jt)', category: 'A', ptkp: 54000000 },
  { code: 'TK/1', label: 'TK/1 - Tidak Kawin, 1 Tanggungan (Rp 58.5 Jt)', category: 'A', ptkp: 58500000 },
  { code: 'TK/2', label: 'TK/2 - Tidak Kawin, 2 Tanggungan (Rp 63 Jt)', category: 'B', ptkp: 63000000 },
  { code: 'TK/3', label: 'TK/3 - Tidak Kawin, 3 Tanggungan (Rp 67.5 Jt)', category: 'B', ptkp: 67500000 },
  { code: 'K/0', label: 'K/0 - Kawin, 0 Tanggungan (Rp 58.5 Jt)', category: 'A', ptkp: 58500000 },
  { code: 'K/1', label: 'K/1 - Kawin, 1 Tanggungan (Rp 63 Jt)', category: 'B', ptkp: 63000000 },
  { code: 'K/2', label: 'K/2 - Kawin, 2 Tanggungan (Rp 67.5 Jt)', category: 'B', ptkp: 67500000 },
  { code: 'K/3', label: 'K/3 - Kawin, 3 Tanggungan (Rp 72 Jt)', category: 'C', ptkp: 72000000 },
]

// TER Kategori A brackets (max, rate)
const TER_A = [
  { max: 5400000, rate: 0.0 },
  { max: 5650000, rate: 0.0025 },
  { max: 5950000, rate: 0.005 },
  { max: 6300000, rate: 0.0075 },
  { max: 6750000, rate: 0.01 },
  { max: 7500000, rate: 0.0125 },
  { max: 8550000, rate: 0.015 },
  { max: 9650000, rate: 0.0175 },
  { max: 10050000, rate: 0.02 },
  { max: 10350000, rate: 0.0225 },
  { max: 10700000, rate: 0.025 },
  { max: 11050000, rate: 0.03 },
  { max: 11600000, rate: 0.035 },
  { max: 12500000, rate: 0.04 },
  { max: 13750000, rate: 0.05 },
  { max: 15100000, rate: 0.06 },
  { max: 16950000, rate: 0.07 },
  { max: 19750000, rate: 0.08 },
  { max: 24150000, rate: 0.09 },
  { max: 26450000, rate: 0.10 },
  { max: 28000000, rate: 0.11 },
  { max: 30050000, rate: 0.12 },
  { max: 32400000, rate: 0.13 },
  { max: 35400000, rate: 0.14 },
  { max: 39100000, rate: 0.15 },
  { max: 43850000, rate: 0.16 },
  { max: 47800000, rate: 0.17 },
  { max: 51400000, rate: 0.18 },
  { max: 56300000, rate: 0.19 },
  { max: 62200000, rate: 0.20 },
  { max: 68600000, rate: 0.21 },
  { max: 77500000, rate: 0.22 },
  { max: 89000000, rate: 0.23 },
  { max: 103000000, rate: 0.24 },
  { max: 125000000, rate: 0.25 },
  { max: 157000000, rate: 0.26 },
  { max: 206000000, rate: 0.27 },
  { max: 337000000, rate: 0.28 },
  { max: 454000000, rate: 0.29 },
  { max: 550000000, rate: 0.30 },
  { max: 695000000, rate: 0.31 },
  { max: 910000000, rate: 0.32 },
  { max: 1400000000, rate: 0.33 },
  { max: Infinity, rate: 0.34 },
]

// TER Kategori B brackets
const TER_B = [
  { max: 6200000, rate: 0.0 },
  { max: 6500000, rate: 0.0025 },
  { max: 6850000, rate: 0.005 },
  { max: 7300000, rate: 0.0075 },
  { max: 9200000, rate: 0.01 },
  { max: 10750000, rate: 0.015 },
  { max: 11250000, rate: 0.02 },
  { max: 11600000, rate: 0.025 },
  { max: 12600000, rate: 0.03 },
  { max: 13600000, rate: 0.04 },
  { max: 14950000, rate: 0.05 },
  { max: 16400000, rate: 0.06 },
  { max: 18450000, rate: 0.07 },
  { max: 21850000, rate: 0.08 },
  { max: 26000000, rate: 0.09 },
  { max: 27700000, rate: 0.10 },
  { max: 29350000, rate: 0.11 },
  { max: 31450000, rate: 0.12 },
  { max: 33950000, rate: 0.13 },
  { max: 37100000, rate: 0.14 },
  { max: 41100000, rate: 0.15 },
  { max: 45800000, rate: 0.16 },
  { max: 49500000, rate: 0.17 },
  { max: 53800000, rate: 0.18 },
  { max: 58500000, rate: 0.19 },
  { max: 64000000, rate: 0.20 },
  { max: 71000000, rate: 0.21 },
  { max: 80000000, rate: 0.22 },
  { max: 93000000, rate: 0.23 },
  { max: 109000000, rate: 0.24 },
  { max: 129000000, rate: 0.25 },
  { max: 163000000, rate: 0.26 },
  { max: 211000000, rate: 0.27 },
  { max: 374000000, rate: 0.28 },
  { max: 459000000, rate: 0.29 },
  { max: 555000000, rate: 0.30 },
  { max: 704000000, rate: 0.31 },
  { max: 957000000, rate: 0.32 },
  { max: 1405000000, rate: 0.33 },
  { max: Infinity, rate: 0.34 },
]

// TER Kategori C brackets
const TER_C = [
  { max: 6600000, rate: 0.0 },
  { max: 6950000, rate: 0.0025 },
  { max: 7350000, rate: 0.005 },
  { max: 7800000, rate: 0.0075 },
  { max: 8850000, rate: 0.01 },
  { max: 9800000, rate: 0.0125 },
  { max: 10950000, rate: 0.015 },
  { max: 11200000, rate: 0.0175 },
  { max: 12050000, rate: 0.02 },
  { max: 12950000, rate: 0.03 },
  { max: 14150000, rate: 0.04 },
  { max: 15550000, rate: 0.05 },
  { max: 17050000, rate: 0.06 },
  { max: 19500000, rate: 0.07 },
  { max: 22700000, rate: 0.08 },
  { max: 26600000, rate: 0.09 },
  { max: 28100000, rate: 0.10 },
  { max: 30100000, rate: 0.11 },
  { max: 32600000, rate: 0.12 },
  { max: 35400000, rate: 0.13 },
  { max: 38900000, rate: 0.14 },
  { max: 43000000, rate: 0.15 },
  { max: 47400000, rate: 0.16 },
  { max: 51200000, rate: 0.17 },
  { max: 55800000, rate: 0.18 },
  { max: 60400000, rate: 0.19 },
  { max: 66700000, rate: 0.20 },
  { max: 74500000, rate: 0.21 },
  { max: 83200000, rate: 0.22 },
  { max: 95600000, rate: 0.23 },
  { max: 110000000, rate: 0.24 },
  { max: 134000000, rate: 0.25 },
  { max: 169000000, rate: 0.26 },
  { max: 221000000, rate: 0.27 },
  { max: 390000000, rate: 0.28 },
  { max: 463000000, rate: 0.29 },
  { max: 561000000, rate: 0.30 },
  { max: 709000000, rate: 0.31 },
  { max: 965000000, rate: 0.32 },
  { max: 1419000000, rate: 0.33 },
  { max: Infinity, rate: 0.34 },
]

export const BPJS_CONFIG = {
  KESEHATAN_MAX_CAP: 12000000, // Rp 12.000.000 max base
  KESEHATAN_EMPLOYEE_RATE: 0.01, // 1%
  KESEHATAN_EMPLOYER_RATE: 0.04, // 4%
  JP_MAX_CAP: 10042300, // Plafon Jaminan Pensiun regulasi terkini
  JP_EMPLOYEE_RATE: 0.01, // 1%
  JP_EMPLOYER_RATE: 0.02, // 2%
  JHT_EMPLOYEE_RATE: 0.02, // 2%
  JHT_EMPLOYER_RATE: 0.037, // 3.7%
  JKK_EMPLOYER_RATE: 0.0024, // 0.24% risiko rendah
  JKM_EMPLOYER_RATE: 0.003, // 0.30%
}

export function getTerRate(grossMonthly, category) {
  const table = category === 'B' ? TER_B : category === 'C' ? TER_C : TER_A
  const bracket = table.find(b => grossMonthly <= b.max)
  return bracket ? bracket.rate : 0.34
}

export function calculateSalary({
  basicSalary = 0,
  fixedAllowance = 0,
  otherAllowance = 0,
  ptkpCode = 'TK/0',
  includeBpjsCompanyInTax = true,
  enableBpjsKesehatan = true,
  enableBpjsKetenagakerjaan = true,
  jpMaxCap = BPJS_CONFIG.JP_MAX_CAP,
  kesMaxCap = BPJS_CONFIG.KESEHATAN_MAX_CAP,
}) {
  const basic = Math.max(0, Number(basicSalary) || 0)
  const fixed = Math.max(0, Number(fixedAllowance) || 0)
  const other = Math.max(0, Number(otherAllowance) || 0)

  // Dasar perhitungan BPJS (Gaji Pokok + Tunjangan Tetap)
  const bpjsBase = basic + fixed
  const cashGross = basic + fixed + other

  // BPJS Kesehatan
  const kesBase = Math.min(bpjsBase, kesMaxCap)
  const bpjsKesEmployee = enableBpjsKesehatan ? kesBase * BPJS_CONFIG.KESEHATAN_EMPLOYEE_RATE : 0
  const bpjsKesEmployer = enableBpjsKesehatan ? kesBase * BPJS_CONFIG.KESEHATAN_EMPLOYER_RATE : 0

  // BPJS Ketenagakerjaan
  const bpjsJhtEmployee = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JHT_EMPLOYEE_RATE : 0
  const bpjsJhtEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JHT_EMPLOYER_RATE : 0

  const jpBase = Math.min(bpjsBase, jpMaxCap)
  const bpjsJpEmployee = enableBpjsKetenagakerjaan ? jpBase * BPJS_CONFIG.JP_EMPLOYEE_RATE : 0
  const bpjsJpEmployer = enableBpjsKetenagakerjaan ? jpBase * BPJS_CONFIG.JP_EMPLOYER_RATE : 0

  const bpjsJkkEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JKK_EMPLOYER_RATE : 0
  const bpjsJkmEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JKM_EMPLOYER_RATE : 0

  // Total premi perusahaan yang menambah penghasilan bruto untuk PPh 21
  const companyPremiTaxable = bpjsKesEmployer + bpjsJkkEmployer + bpjsJkmEmployer

  // Penghasilan Bruto untuk Pajak PPh 21
  const taxableGross = includeBpjsCompanyInTax ? (cashGross + companyPremiTaxable) : cashGross

  // PPh 21 TER
  const ptkp = PTKP_LIST.find(p => p.code === ptkpCode) || PTKP_LIST[0]
  const terRate = getTerRate(taxableGross, ptkp.category)
  const pph21TerMonthly = Math.round(taxableGross * terRate)

  // Total Potongan Karyawan
  const totalEmployeeDeductions =
    bpjsKesEmployee +
    bpjsJhtEmployee +
    bpjsJpEmployee +
    pph21TerMonthly

  // Total Beban Perusahaan
  const totalEmployerContributions =
    bpjsKesEmployer +
    bpjsJhtEmployer +
    bpjsJpEmployer +
    bpjsJkkEmployer +
    bpjsJkmEmployer

  // Net Take Home Pay (THP)
  const netSalary = Math.max(0, cashGross - totalEmployeeDeductions)

  return {
    basic,
    fixed,
    other,
    cashGross,
    taxableGross,
    ptkp,
    terCategory: ptkp.category,
    terRate,
    terPercentage: (terRate * 100).toFixed(2),
    pph21Monthly: pph21TerMonthly,
    bpjs: {
      employee: {
        kesehatan: bpjsKesEmployee,
        jht: bpjsJhtEmployee,
        jp: bpjsJpEmployee,
        total: bpjsKesEmployee + bpjsJhtEmployee + bpjsJpEmployee,
      },
      employer: {
        kesehatan: bpjsKesEmployer,
        jht: bpjsJhtEmployer,
        jp: bpjsJpEmployer,
        jkk: bpjsJkkEmployer,
        jkm: bpjsJkmEmployer,
        total: totalEmployerContributions,
      },
      bases: {
        kesBase,
        jpBase,
        regularBase: bpjsBase,
      }
    },
    totalDeductions: totalEmployeeDeductions,
    totalEmployerCost: cashGross + totalEmployerContributions,
    netSalary,
  }
}

export function formatIDR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

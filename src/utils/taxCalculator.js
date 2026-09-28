// PPh 21 Tarif Efektif Rata-Rata (TER) PP 58/2023 & PMK 168/2023 + Pasal 17 UU HPP

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

// Perhitungan PPh 21 Tarif Pasal 17 UU HPP Tahunan
export function calculateAnnualPph21(pkp) {
  if (pkp <= 0) return 0
  let remaining = pkp
  let tax = 0

  // Lapisan 1: 0 - 60 jt @ 5%
  const t1 = Math.min(remaining, 60000000)
  tax += t1 * 0.05
  remaining -= t1

  // Lapisan 2: > 60 jt - 250 jt (190 jt) @ 15%
  if (remaining > 0) {
    const t2 = Math.min(remaining, 190000000)
    tax += t2 * 0.15
    remaining -= t2
  }

  // Lapisan 3: > 250 jt - 500 jt (250 jt) @ 25%
  if (remaining > 0) {
    const t3 = Math.min(remaining, 250000000)
    tax += t3 * 0.25
    remaining -= t3
  }

  // Lapisan 4: > 500 jt - 5 Miliar (4.5 M) @ 30%
  if (remaining > 0) {
    const t4 = Math.min(remaining, 4500000000)
    tax += t4 * 0.30
    remaining -= t4
  }

  // Lapisan 5: > 5 Miliar @ 35%
  if (remaining > 0) {
    tax += remaining * 0.35
  }

  return Math.round(tax)
}

export function calculateSalary({
  basicSalary = 0,
  fixedAllowance = 0,
  annualBonus = 0, // Tunjangan tidak tetap / bonus tahunan (dihitung per tahun)
  ptkpCode = 'TK/0',
  taxMethod = 'gross', // 'gross' | 'gross_up' | 'nett'
  includeBpjsCompanyInTax = true,
  enableBpjsKesehatan = true,
  enableBpjsKetenagakerjaan = true,
  annualMonths = 13, // 12 bulan gaji pokok + 1 bulan THR
  jpMaxCap = BPJS_CONFIG.JP_MAX_CAP,
  kesMaxCap = BPJS_CONFIG.KESEHATAN_MAX_CAP,
}) {
  const basic = Math.max(0, Number(basicSalary) || 0)
  const fixed = Math.max(0, Number(fixedAllowance) || 0)
  const bonusAnnual = Math.max(0, Number(annualBonus) || 0)

  // ==========================================
  // 1. PERHITUNGAN BULANAN (MONTHLY ROUTINE)
  // ==========================================
  const monthlyCashGross = basic + fixed
  const bpjsBase = basic + fixed

  // BPJS Bulanan
  const kesBase = Math.min(bpjsBase, kesMaxCap)
  const monthlyBpjsKesEmployee = enableBpjsKesehatan ? kesBase * BPJS_CONFIG.KESEHATAN_EMPLOYEE_RATE : 0
  const monthlyBpjsKesEmployer = enableBpjsKesehatan ? kesBase * BPJS_CONFIG.KESEHATAN_EMPLOYER_RATE : 0

  const monthlyBpjsJhtEmployee = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JHT_EMPLOYEE_RATE : 0
  const monthlyBpjsJhtEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JHT_EMPLOYER_RATE : 0

  const jpBase = Math.min(bpjsBase, jpMaxCap)
  const monthlyBpjsJpEmployee = enableBpjsKetenagakerjaan ? jpBase * BPJS_CONFIG.JP_EMPLOYEE_RATE : 0
  const monthlyBpjsJpEmployer = enableBpjsKetenagakerjaan ? jpBase * BPJS_CONFIG.JP_EMPLOYER_RATE : 0

  const monthlyBpjsJkkEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JKK_EMPLOYER_RATE : 0
  const monthlyBpjsJkmEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JKM_EMPLOYER_RATE : 0

  // Premi perusahaan yang menambah bruto pajak PPh 21 bulanan
  const monthlyCompanyPremiTaxable = monthlyBpjsKesEmployer + monthlyBpjsJkkEmployer + monthlyBpjsJkmEmployer
  const monthlyTaxableGross = includeBpjsCompanyInTax ? (monthlyCashGross + monthlyCompanyPremiTaxable) : monthlyCashGross

  // PPh 21 TER Bulanan
  const ptkp = PTKP_LIST.find(p => p.code === ptkpCode) || PTKP_LIST[0]
  const terRate = getTerRate(monthlyTaxableGross, ptkp.category)
  const monthlyPph21 = Math.round(monthlyTaxableGross * terRate)

  const monthlyEmployeeBpjsTotal = monthlyBpjsKesEmployee + monthlyBpjsJhtEmployee + monthlyBpjsJpEmployee

  // Skema Pajak (Tax Method):
  // - gross: Karyawan menanggung PPh 21
  // - gross_up: Perusahaan menanggung tunjangan PPh 21 sehingga PPh 21 tidak memotong THP
  // - nett: Perusahaan menanggung PPh 21 dan BPJS Karyawan
  let monthlyTaxAllowance = 0
  let monthlyEmployeeDeductions = monthlyPph21 + monthlyEmployeeBpjsTotal

  if (taxMethod === 'gross_up') {
    monthlyTaxAllowance = monthlyPph21
    monthlyEmployeeDeductions = monthlyEmployeeBpjsTotal
  } else if (taxMethod === 'nett') {
    monthlyTaxAllowance = monthlyPph21
    monthlyEmployeeDeductions = 0
  }

  const monthlyEmployerContributions =
    monthlyBpjsKesEmployer +
    monthlyBpjsJhtEmployer +
    monthlyBpjsJpEmployer +
    monthlyBpjsJkkEmployer +
    monthlyBpjsJkmEmployer +
    monthlyTaxAllowance +
    (taxMethod === 'nett' ? monthlyEmployeeBpjsTotal : 0)

  const monthlyNetSalary = Math.max(0, monthlyCashGross - monthlyEmployeeDeductions)
  const monthlyTotalEmployerCost = monthlyCashGross + monthlyEmployerContributions

  // ==========================================
  // 2. PERHITUNGAN TAHUNAN (ANNUAL CALCULATION)
  // ==========================================
  const thrMultiplier = annualMonths > 12 ? (annualMonths - 12) : 0
  const annualBasic = (basic * 12) + (basic * thrMultiplier)
  const annualFixed = (fixed * 12) + (fixed * thrMultiplier)
  const annualCashGross = annualBasic + annualFixed + bonusAnnual

  // BPJS Tahunan
  const annualBpjsKesEmployee = monthlyBpjsKesEmployee * 12
  const annualBpjsKesEmployer = monthlyBpjsKesEmployer * 12
  const annualBpjsJhtEmployee = monthlyBpjsJhtEmployee * annualMonths
  const annualBpjsJhtEmployer = monthlyBpjsJhtEmployer * annualMonths
  const annualBpjsJpEmployee = monthlyBpjsJpEmployee * 12
  const annualBpjsJpEmployer = monthlyBpjsJpEmployer * 12
  const annualBpjsJkkEmployer = monthlyBpjsJkkEmployer * annualMonths
  const annualBpjsJkmEmployer = monthlyBpjsJkmEmployer * annualMonths

  const annualEmployeeBpjsTotal =
    annualBpjsKesEmployee +
    annualBpjsJhtEmployee +
    annualBpjsJpEmployee

  const annualCompanyPremiTaxable = annualBpjsKesEmployer + annualBpjsJkkEmployer + annualBpjsJkmEmployer
  const annualTaxableGross = includeBpjsCompanyInTax ? (annualCashGross + annualCompanyPremiTaxable) : annualCashGross

  // Biaya jabatan: 5% dari Bruto, maksimal Rp 6.000.000 / tahun
  const annualBiayaJabatan = Math.min(annualTaxableGross * 0.05, 6000000)
  const annualEmployeePensionDeduction = annualBpjsJhtEmployee + annualBpjsJpEmployee

  const annualNetIncome = Math.max(0, annualTaxableGross - annualBiayaJabatan - annualEmployeePensionDeduction)
  const annualPkp = Math.max(0, Math.floor((annualNetIncome - ptkp.ptkp) / 1000) * 1000)
  const annualPph21 = calculateAnnualPph21(annualPkp)

  let annualTaxAllowance = 0
  let annualEmployeeDeductions = annualPph21 + annualEmployeeBpjsTotal

  if (taxMethod === 'gross_up') {
    annualTaxAllowance = annualPph21
    annualEmployeeDeductions = annualEmployeeBpjsTotal
  } else if (taxMethod === 'nett') {
    annualTaxAllowance = annualPph21
    annualEmployeeDeductions = 0
  }

  const annualEmployerBpjsTotal =
    annualBpjsKesEmployer +
    annualBpjsJhtEmployer +
    annualBpjsJpEmployer +
    annualBpjsJkkEmployer +
    annualBpjsJkmEmployer +
    annualTaxAllowance +
    (taxMethod === 'nett' ? annualEmployeeBpjsTotal : 0)

  const annualNetSalary = Math.max(0, annualCashGross - annualEmployeeDeductions)
  const annualTotalEmployerCost = annualCashGross + annualEmployerBpjsTotal

  return {
    basic,
    fixed,
    bonusAnnual,
    annualMonths,
    ptkp,
    taxMethod,
    terCategory: ptkp.category,
    terRate,
    terPercentage: (terRate * 100).toFixed(2),

    // Data Per Bulan
    monthly: {
      basic,
      fixed,
      cashGross: monthlyCashGross,
      taxableGross: monthlyTaxableGross,
      pph21: monthlyPph21,
      taxAllowance: monthlyTaxAllowance,
      bpjs: {
        kesEmployee: monthlyBpjsKesEmployee,
        jhtEmployee: monthlyBpjsJhtEmployee,
        jpEmployee: monthlyBpjsJpEmployee,
        totalEmployee: monthlyEmployeeBpjsTotal,
        kesEmployer: monthlyBpjsKesEmployer,
        jhtEmployer: monthlyBpjsJhtEmployer,
        jpEmployer: monthlyBpjsJpEmployer,
        jkkEmployer: monthlyBpjsJkkEmployer,
        jkmEmployer: monthlyBpjsJkmEmployer,
        totalEmployer: monthlyEmployerContributions,
      },
      totalDeductions: monthlyEmployeeDeductions,
      netSalary: monthlyNetSalary,
      totalEmployerCost: monthlyTotalEmployerCost,
    },

    // Data Per Tahun
    annual: {
      basic: annualBasic,
      fixed: annualFixed,
      bonus: bonusAnnual,
      cashGross: annualCashGross,
      taxableGross: annualTaxableGross,
      biayaJabatan: annualBiayaJabatan,
      pkp: annualPkp,
      pph21: annualPph21,
      taxAllowance: annualTaxAllowance,
      bpjs: {
        kesEmployee: annualBpjsKesEmployee,
        jhtEmployee: annualBpjsJhtEmployee,
        jpEmployee: annualBpjsJpEmployee,
        totalEmployee: annualEmployeeBpjsTotal,
        kesEmployer: annualBpjsKesEmployer,
        jhtEmployer: annualBpjsJhtEmployer,
        jpEmployer: annualBpjsJpEmployer,
        jkkEmployer: annualBpjsJkkEmployer,
        jkmEmployer: annualBpjsJkmEmployer,
        totalEmployer: annualEmployerBpjsTotal,
      },
      totalDeductions: annualEmployeeDeductions,
      netSalary: annualNetSalary,
      totalEmployerCost: annualTotalEmployerCost,
    }
  }
}

// Simulasi Bulan Pencairan THR / Bonus Khusus (Lonjakan TER Bulanan)
export function calculateBonusMonthSimulation({
  basicSalary = 0,
  fixedAllowance = 0,
  disbursedAmount = 0, // Nominal THR atau Bonus yang cair di bulan tsb
  ptkpCode = 'TK/0',
  taxMethod = 'gross',
  includeBpjsCompanyInTax = true,
  enableBpjsKesehatan = true,
  enableBpjsKetenagakerjaan = true,
}) {
  const basic = Math.max(0, Number(basicSalary) || 0)
  const fixed = Math.max(0, Number(fixedAllowance) || 0)
  const extra = Math.max(0, Number(disbursedAmount) || 0)

  // Regular month calculation
  const regular = calculateSalary({
    basicSalary: basic,
    fixedAllowance: fixed,
    annualBonus: 0,
    ptkpCode,
    taxMethod,
    includeBpjsCompanyInTax,
    enableBpjsKesehatan,
    enableBpjsKetenagakerjaan,
  })

  // Disbursed month
  const disbursedCashGross = basic + fixed + extra
  const bpjsBase = basic + fixed // BPJS tetap berdasar gaji pokok + tunjangan tetap

  const kesBase = Math.min(bpjsBase, BPJS_CONFIG.KESEHATAN_MAX_CAP)
  const kesEmployee = enableBpjsKesehatan ? kesBase * BPJS_CONFIG.KESEHATAN_EMPLOYEE_RATE : 0
  const kesEmployer = enableBpjsKesehatan ? kesBase * BPJS_CONFIG.KESEHATAN_EMPLOYER_RATE : 0

  const jhtEmployee = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JHT_EMPLOYEE_RATE : 0
  const jhtEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JHT_EMPLOYER_RATE : 0

  const jpBase = Math.min(bpjsBase, BPJS_CONFIG.JP_MAX_CAP)
  const jpEmployee = enableBpjsKetenagakerjaan ? jpBase * BPJS_CONFIG.JP_EMPLOYEE_RATE : 0
  const jpEmployer = enableBpjsKetenagakerjaan ? jpBase * BPJS_CONFIG.JP_EMPLOYER_RATE : 0

  const jkkEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JKK_EMPLOYER_RATE : 0
  const jkmEmployer = enableBpjsKetenagakerjaan ? bpjsBase * BPJS_CONFIG.JKM_EMPLOYER_RATE : 0

  const companyPremiTaxable = kesEmployer + jkkEmployer + jkmEmployer
  const disbursedTaxableGross = includeBpjsCompanyInTax ? (disbursedCashGross + companyPremiTaxable) : disbursedCashGross

  const ptkp = PTKP_LIST.find(p => p.code === ptkpCode) || PTKP_LIST[0]
  const bonusMonthTerRate = getTerRate(disbursedTaxableGross, ptkp.category)
  const bonusMonthPph21 = Math.round(disbursedTaxableGross * bonusMonthTerRate)

  const employeeBpjsTotal = kesEmployee + jhtEmployee + jpEmployee

  let employeeDeductions = bonusMonthPph21 + employeeBpjsTotal
  if (taxMethod === 'gross_up') {
    employeeDeductions = employeeBpjsTotal
  } else if (taxMethod === 'nett') {
    employeeDeductions = 0
  }

  const disbursedNetSalary = Math.max(0, disbursedCashGross - employeeDeductions)

  return {
    regularMonthlyGross: regular.monthly.cashGross,
    regularMonthlyNet: regular.monthly.netSalary,
    regularTerRate: regular.terRate,
    regularTerPct: regular.terPercentage,
    regularPph21: regular.monthly.pph21,

    disbursedExtra: extra,
    disbursedCashGross,
    disbursedTerRate: bonusMonthTerRate,
    disbursedTerPct: (bonusMonthTerRate * 100).toFixed(2),
    disbursedPph21: bonusMonthPph21,
    disbursedBpjs: employeeBpjsTotal,
    disbursedTotalDeductions: employeeDeductions,
    disbursedNetSalary,
    extraNetReceived: disbursedNetSalary - regular.monthly.netSalary,
  }
}

// Reverse Calculator: Hitung Gross Salary yang dibutuhkan dari Target Net THP Bulanan
export function findRequiredGrossForTargetNet({
  targetNet = 0,
  fixedAllowance = 0,
  ptkpCode = 'TK/0',
  taxMethod = 'gross',
  includeBpjsCompanyInTax = true,
  enableBpjsKesehatan = true,
  enableBpjsKetenagakerjaan = true,
}) {
  const target = Math.max(0, Number(targetNet) || 0)
  if (target <= 0) return 0

  if (taxMethod === 'nett') {
    // Di skema nett murni, basic = targetNet - fixed
    return Math.max(0, target - fixedAllowance)
  }

  // Binary search target basic
  let low = Math.max(0, target - fixedAllowance)
  let high = (target + fixedAllowance) * 2.5
  let bestBasic = low
  let bestDiff = Infinity

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2
    const calc = calculateSalary({
      basicSalary: mid,
      fixedAllowance,
      annualBonus: 0,
      ptkpCode,
      taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan,
      enableBpjsKetenagakerjaan,
    })

    const net = calc.monthly.netSalary
    const diff = net - target

    if (Math.abs(diff) < bestDiff) {
      bestDiff = Math.abs(diff)
      bestBasic = Math.round(mid)
    }

    if (net < target) {
      low = mid
    } else {
      high = mid
    }
  }

  // Linear scan +/- 50.000 to find exact round amount
  for (let candidate = Math.max(0, bestBasic - 50000); candidate <= bestBasic + 60000; candidate += 1000) {
    const calc = calculateSalary({
      basicSalary: candidate,
      fixedAllowance,
      annualBonus: 0,
      ptkpCode,
      taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan,
      enableBpjsKetenagakerjaan,
    })
    if (calc.monthly.netSalary >= target) {
      return candidate
    }
  }

  return bestBasic
}

export function formatIDR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format integer dengan pemisah ribuan titik (contoh: 15.000.000)
export function formatNumberWithDots(val) {
  if (val === undefined || val === null || val === '') return ''
  const num = typeof val === 'number' ? val : Number(String(val).replace(/\D/g, ''))
  if (isNaN(num)) return ''
  return num.toLocaleString('id-ID')
}

// Parse string berpemisah titik ke integer murni
export function parseNumberFromDots(str) {
  if (!str) return 0
  const cleaned = String(str).replace(/\D/g, '')
  return cleaned ? parseInt(cleaned, 10) : 0
}

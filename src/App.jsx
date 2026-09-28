import React, { useState, useMemo } from 'react'
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  Layers,
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock
} from 'lucide-react'
import {
  calculateSalary,
  formatIDR,
  PTKP_LIST,
  formatNumberWithDots
} from './utils/taxCalculator'
import CurrencyInput from './components/CurrencyInput'

export default function App() {
  // Existing salary state
  const [existingBasic, setExistingBasic] = useState(15000000)
  const [existingFixed, setExistingFixed] = useState(2000000)
  const [existingAnnualBonus, setExistingAnnualBonus] = useState(15000000) // Tunjangan tidak tetap / bonus per tahun
  const [existingPtkp, setExistingPtkp] = useState('TK/0')

  // Negotiation target state
  const [targetIncreasePct, setTargetIncreasePct] = useState(20)

  // Offering salary state
  const [offeringBasic, setOfferingBasic] = useState(19000000)
  const [offeringFixed, setOfferingFixed] = useState(2500000)
  const [offeringAnnualBonus, setOfferingAnnualBonus] = useState(25000000) // Tunjangan tidak tetap / bonus per tahun
  const [offeringPtkp, setOfferingPtkp] = useState('TK/0')

  // Settings
  const [enableBpjsKes, setEnableBpjsKes] = useState(true)
  const [enableBpjsTk, setEnableBpjsTk] = useState(true)
  const [includeBpjsCompanyInTax, setIncludeBpjsCompanyInTax] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [annualMultiplier, setAnnualMultiplier] = useState(13) // 12 bulan + 1 bulan THR
  const [activeTab, setActiveTab] = useState('both') // 'monthly' | 'annual' | 'both'
  const [copied, setCopied] = useState(false)

  // Calculations
  const existingCalc = useMemo(() => {
    return calculateSalary({
      basicSalary: existingBasic,
      fixedAllowance: existingFixed,
      annualBonus: existingAnnualBonus,
      ptkpCode: existingPtkp,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [existingBasic, existingFixed, existingAnnualBonus, existingPtkp, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  const offeringCalc = useMemo(() => {
    return calculateSalary({
      basicSalary: offeringBasic,
      fixedAllowance: offeringFixed,
      annualBonus: offeringAnnualBonus,
      ptkpCode: offeringPtkp,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [offeringBasic, offeringFixed, offeringAnnualBonus, offeringPtkp, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Target calculation based on targetIncreasePct over existing monthly cash gross
  const targetMonthlyGross = useMemo(() => {
    const factor = 1 + targetIncreasePct / 100
    return Math.round(existingCalc.monthly.cashGross * factor)
  }, [existingCalc.monthly.cashGross, targetIncreasePct])

  const targetCalc = useMemo(() => {
    const totalExistingMonthly = existingCalc.monthly.cashGross || 1
    const basicRatio = existingCalc.basic / totalExistingMonthly
    const fixedRatio = existingCalc.fixed / totalExistingMonthly
    const bonusRatio = existingAnnualBonus > 0 ? (1 + targetIncreasePct / 100) : 0

    return calculateSalary({
      basicSalary: Math.round(targetMonthlyGross * basicRatio),
      fixedAllowance: Math.round(targetMonthlyGross * fixedRatio),
      annualBonus: Math.round(existingAnnualBonus * bonusRatio),
      ptkpCode: existingPtkp,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [targetMonthlyGross, existingCalc, existingAnnualBonus, targetIncreasePct, existingPtkp, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Monthly Deltas: Offering vs Existing
  const deltaMonthlyGross = offeringCalc.monthly.cashGross - existingCalc.monthly.cashGross
  const deltaMonthlyGrossPct = existingCalc.monthly.cashGross > 0 ? (deltaMonthlyGross / existingCalc.monthly.cashGross) * 100 : 0

  const deltaMonthlyNet = offeringCalc.monthly.netSalary - existingCalc.monthly.netSalary
  const deltaMonthlyNetPct = existingCalc.monthly.netSalary > 0 ? (deltaMonthlyNet / existingCalc.monthly.netSalary) * 100 : 0

  // Annual Deltas: Offering vs Existing
  const deltaAnnualGross = offeringCalc.annual.cashGross - existingCalc.annual.cashGross
  const deltaAnnualGrossPct = existingCalc.annual.cashGross > 0 ? (deltaAnnualGross / existingCalc.annual.cashGross) * 100 : 0

  const deltaAnnualNet = offeringCalc.annual.netSalary - existingCalc.annual.netSalary
  const deltaAnnualNetPct = existingCalc.annual.netSalary > 0 ? (deltaAnnualNet / existingCalc.annual.netSalary) * 100 : 0

  // Copy Summary text
  const copySummary = () => {
    const text = `📊 Ringkasan Komparasi Gaji & Offering:

🗓️ PER BULAN (MONTHLY ROUTINE):
• Existing: Gross ${formatIDR(existingCalc.monthly.cashGross)} | Net THP: ${formatIDR(existingCalc.monthly.netSalary)}
• Target (+${targetIncreasePct}%): Gross ${formatIDR(targetCalc.monthly.cashGross)} | Net THP: ${formatIDR(targetCalc.monthly.netSalary)}
• Offering: Gross ${formatIDR(offeringCalc.monthly.cashGross)} | Net THP: ${formatIDR(offeringCalc.monthly.netSalary)}
• Selisih Net THP Bulanan: ${deltaMonthlyNet >= 0 ? '+' : ''}${formatIDR(deltaMonthlyNet)}/bln (${deltaMonthlyNetPct.toFixed(1)}%)

📅 PER TAHUN (ANNUAL - Gaji ${annualMultiplier}x + Bonus/Tunjangan Tidak Tetap):
• Existing: Gross ${formatIDR(existingCalc.annual.cashGross)} | Net THP: ${formatIDR(existingCalc.annual.netSalary)}
• Target: Gross ${formatIDR(targetCalc.annual.cashGross)} | Net THP: ${formatIDR(targetCalc.annual.netSalary)}
• Offering: Gross ${formatIDR(offeringCalc.annual.cashGross)} | Net THP: ${formatIDR(offeringCalc.annual.netSalary)}
• Selisih Net THP Tahunan: ${deltaAnnualNet >= 0 ? '+' : ''}${formatIDR(deltaAnnualNet)}/thn (${deltaAnnualNetPct.toFixed(1)}%)

Dihitung berdasarkan PPh 21 TER PMK 168/PP 58 & BPJS Ketenagakerjaan & Kesehatan.`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Preset helper
  const applyTargetToOffering = () => {
    setOfferingBasic(targetCalc.basic)
    setOfferingFixed(targetCalc.fixed)
    setOfferingAnnualBonus(targetCalc.bonusAnnual)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
              <Calculator className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Kalkulator Gaji & Offering
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  PPh 21 TER (PMK 168)
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Simulasi gaji bersih (THP) per bulan & per tahun dengan separator angka rapi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Salin ringkasan ke clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Ringkasan</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pengaturan</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Advanced Drawer/Panel */}
      {showAdvanced && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Komponen BPJS
              </span>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBpjsKes}
                  onChange={(e) => setEnableBpjsKes(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
                />
                <span>BPJS Kesehatan (1% Karyawan, 4% Perusahaan, Plafon Rp 12 Jt)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBpjsTk}
                  onChange={(e) => setEnableBpjsTk(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
                />
                <span>BPJS TK (JHT 2%, JP 1% Plafon Rp 10.04 Jt, JKK & JKM)</span>
              </label>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" /> Dasar Perhitungan Pajak
              </span>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={includeBpjsCompanyInTax}
                  onChange={(e) => setIncludeBpjsCompanyInTax(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
                />
                <span>Sesuai Regulasi: Premi JKK, JKM, BPJS Kes perusahaan menambah bruto PPh 21</span>
              </label>
              <p className="text-[11px] text-slate-400">
                Nonaktifkan jika kantor Anda memotong PPh 21 murni dari penghasilan tunai karyawan.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Multiplier Gaji Tahunan
              </span>
              <label className="block mb-1 text-slate-400">Jumlah Bulan Gaji Pokok (termasuk THR):</label>
              <div className="flex gap-2">
                {[12, 13, 14, 15].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setAnnualMultiplier(months)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      annualMultiplier === months
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {months}x
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">
                Standard: 13x (12 bulan gaji pokok + 1 bulan THR).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Dual Highlight Card (Per Bulan & Per Tahun) */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Monthly Highlight */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Kenaikan Bersih Per Bulan (Monthly THP)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  deltaMonthlyNet >= 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {deltaMonthlyNetPct >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {deltaMonthlyNet >= 0 ? '+' : ''}{formatIDR(deltaMonthlyNet)}
                </span>
                <span className="text-xs text-slate-400">/bulan</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span>Existing: <strong className="text-slate-200">{formatIDR(existingCalc.monthly.netSalary)}</strong></span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Offering: <strong className="text-emerald-400">{formatIDR(offeringCalc.monthly.netSalary)}</strong></span>
              </div>
            </div>

            {/* Annual Highlight */}
            <div className="space-y-2 md:pl-6 pt-4 md:pt-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Kenaikan Bersih Per Tahun (Annual THP)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  deltaAnnualNet >= 0
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {deltaAnnualNetPct >= 0 ? '+' : ''}{deltaAnnualNetPct.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  deltaAnnualNet >= 0 ? 'text-sky-400' : 'text-rose-400'
                }`}>
                  {deltaAnnualNet >= 0 ? '+' : ''}{formatIDR(deltaAnnualNet)}
                </span>
                <span className="text-xs text-slate-400">/tahun ({annualMultiplier}x + Bonus)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span>Existing: <strong className="text-slate-200">{formatIDR(existingCalc.annual.netSalary)}</strong></span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Offering: <strong className="text-sky-400">{formatIDR(offeringCalc.annual.netSalary)}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Columns Input / Controller */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Existing Salary */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">1. Gaji Existing</h2>
                    <p className="text-[11px] text-slate-400">Pekerjaan saat ini</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Saat Ini
                </span>
              </div>

              <div className="space-y-3.5">
                <CurrencyInput
                  label="Gaji Pokok (Basic Salary)"
                  badge="Per Bulan"
                  value={existingBasic}
                  onChange={setExistingBasic}
                  placeholder="0"
                />

                <CurrencyInput
                  label="Tunjangan Tetap (Fixed Allowance)"
                  badge="Per Bulan"
                  value={existingFixed}
                  onChange={setExistingFixed}
                  placeholder="0"
                />

                {/* Tunjangan Tidak Tetap / Bonus (Pertahun) */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <CurrencyInput
                    label="Tunjangan Tidak Tetap / Bonus"
                    badge="Pertahun"
                    subtitle="*Hanya dihitung dalam akumulasi tahunan (tidak masuk komponen bulanan rutin)"
                    value={existingAnnualBonus}
                    onChange={setExistingAnnualBonus}
                    placeholder="0"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      Status PTKP
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      TER Kategori {existingCalc.terCategory}
                    </span>
                  </div>
                  <select
                    value={existingPtkp}
                    onChange={(e) => setExistingPtkp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {PTKP_LIST.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Existing Sub-Summary: Per Bulan & Per Tahun */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 bg-slate-950/50 -mx-5 -mb-5 p-5 rounded-b-2xl space-y-3">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">HASIL PER BULAN:</span>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Bruto Bulanan</span>
                  <span className="text-slate-200 font-medium">{formatIDR(existingCalc.monthly.cashGross)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Potongan (PPh 21 TER + BPJS)</span>
                  <span className="text-rose-400 font-medium">-{formatIDR(existingCalc.monthly.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800 font-bold">
                  <span className="text-white">Net THP Bulanan</span>
                  <span className="text-emerald-400">{formatIDR(existingCalc.monthly.netSalary)}</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                <span className="text-[11px] font-bold text-sky-400 block mb-1">HASIL PER TAHUN:</span>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Bruto Tahunan (+Bonus)</span>
                  <span className="text-slate-200 font-medium">{formatIDR(existingCalc.annual.cashGross)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Total Potongan Setahun</span>
                  <span className="text-rose-400 font-medium">-{formatIDR(existingCalc.annual.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800 font-bold">
                  <span className="text-white">Net THP Tahunan</span>
                  <span className="text-sky-400">{formatIDR(existingCalc.annual.netSalary)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Negotiation Target */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-sky-900/40 flex flex-col justify-between shadow-lg relative">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">2. Ekspektasi Negosiasi</h2>
                    <p className="text-[11px] text-slate-400">Target kenaikan yang wajar</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  +{targetIncreasePct}%
                </span>
              </div>

              {/* Quick Buttons */}
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Pilihan Cepat Persentase:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 15, 20, 25, 30, 35, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTargetIncreasePct(pct)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                        targetIncreasePct === pct
                          ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      +{pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Atur Kenaikan Bebas:</span>
                  <span className="font-bold text-sky-400">+{targetIncreasePct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={targetIncreasePct}
                  onChange={(e) => setTargetIncreasePct(Number(e.target.value))}
                  className="w-full accent-sky-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0%</span>
                  <span>+30% (Standard Pindah)</span>
                  <span>+100%</span>
                </div>
              </div>

              {/* Dual Target Box: Monthly & Annual */}
              <div className="space-y-2.5">
                <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3 space-y-1.5">
                  <span className="text-[11px] font-bold text-sky-300 block">TARGET PER BULAN:</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Target Bruto Bulanan</span>
                    <span className="font-semibold text-white">{formatIDR(targetCalc.monthly.cashGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Estimasi Net THP Bulanan</span>
                    <span className="font-bold text-emerald-400">{formatIDR(targetCalc.monthly.netSalary)}</span>
                  </div>
                </div>

                <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3 space-y-1.5">
                  <span className="text-[11px] font-bold text-sky-300 block">TARGET PER TAHUN:</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Target Bruto Tahunan</span>
                    <span className="font-semibold text-white">{formatIDR(targetCalc.annual.cashGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Estimasi Net THP Tahunan</span>
                    <span className="font-bold text-sky-400">{formatIDR(targetCalc.annual.netSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-5 pt-4">
              <button
                type="button"
                onClick={applyTargetToOffering}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center gap-1.5 transition"
              >
                <span>Terapkan Target ini ke Kolom Offering</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: New Offering */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-emerald-900/40 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">3. Tawaran Gaji (Offering)</h2>
                    <p className="text-[11px] text-slate-400">Perusahaan baru</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Offering
                </span>
              </div>

              <div className="space-y-3.5">
                <CurrencyInput
                  label="Gaji Pokok Ditawarkan"
                  badge="Per Bulan"
                  value={offeringBasic}
                  onChange={setOfferingBasic}
                  placeholder="0"
                  highlight={true}
                />

                <CurrencyInput
                  label="Tunjangan Tetap Ditawarkan"
                  badge="Per Bulan"
                  value={offeringFixed}
                  onChange={setOfferingFixed}
                  placeholder="0"
                />

                {/* Tunjangan Tidak Tetap / Bonus Tahunan Ditawarkan */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <CurrencyInput
                    label="Tunjangan Tidak Tetap / Bonus Ditawarkan"
                    badge="Pertahun"
                    subtitle="*Hanya dihitung dalam akumulasi tahunan (tidak masuk komponen bulanan rutin)"
                    value={offeringAnnualBonus}
                    onChange={setOfferingAnnualBonus}
                    placeholder="0"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      Status PTKP
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      TER Kategori {offeringCalc.terCategory}
                    </span>
                  </div>
                  <select
                    value={offeringPtkp}
                    onChange={(e) => setOfferingPtkp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {PTKP_LIST.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Offering Sub-Summary: Per Bulan & Per Tahun */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 bg-slate-950/50 -mx-5 -mb-5 p-5 rounded-b-2xl space-y-3">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">HASIL PER BULAN:</span>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Bruto Bulanan</span>
                  <span className="text-slate-200 font-medium">{formatIDR(offeringCalc.monthly.cashGross)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Potongan (PPh 21 TER + BPJS)</span>
                  <span className="text-rose-400 font-medium">-{formatIDR(offeringCalc.monthly.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800 font-bold">
                  <span className="text-white">Net THP Bulanan</span>
                  <span className="text-emerald-400">{formatIDR(offeringCalc.monthly.netSalary)}</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                <span className="text-[11px] font-bold text-sky-400 block mb-1">HASIL PER TAHUN:</span>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Bruto Tahunan (+Bonus)</span>
                  <span className="text-slate-200 font-medium">{formatIDR(offeringCalc.annual.cashGross)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Total Potongan Setahun</span>
                  <span className="text-rose-400 font-medium">-{formatIDR(offeringCalc.annual.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800 font-bold">
                  <span className="text-white">Net THP Tahunan</span>
                  <span className="text-sky-400">{formatIDR(offeringCalc.annual.netSalary)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Comparison Table with Tab Switcher */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Tabel Komparasi Rinci & Rincian Potongan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bandingkan hasil per bulan dan per tahun secara akurat
              </p>
            </div>

            {/* Tab Filter Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'both'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tampilkan Keduanya
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'monthly'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hanya Per Bulan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('annual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'annual'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hanya Per Tahun
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                  <th className="py-3.5 px-4 font-semibold">Komponen Gaji</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Existing (Saat Ini)</th>
                  <th className="py-3.5 px-4 font-semibold text-right text-sky-400">Target Negosiasi</th>
                  <th className="py-3.5 px-4 font-semibold text-right text-emerald-400">Offering (Tawaran)</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Selisih Offering</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                
                {/* ==================================================== */}
                {/* 1. BAGIAN PER BULAN (MONTHLY)                         */}
                {/* ==================================================== */}
                {(activeTab === 'both' || activeTab === 'monthly') && (
                  <>
                    <tr className="bg-emerald-950/30 text-emerald-400 font-bold">
                      <td colSpan={5} className="py-2.5 px-4 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        1. Perhitungan Rutin Bulanan (Per Bulan)
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40">
                      <td className="py-3 px-4 font-medium text-slate-200">Gaji Pokok (Basic Salary)</td>
                      <td className="py-3 px-4 text-right text-slate-300">{formatIDR(existingCalc.basic)}</td>
                      <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.basic)}</td>
                      <td className="py-3 px-4 text-right text-emerald-300 font-semibold">{formatIDR(offeringCalc.basic)}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-300">
                        {offeringCalc.basic - existingCalc.basic >= 0 ? '+' : ''}
                        {formatIDR(offeringCalc.basic - existingCalc.basic)}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40">
                      <td className="py-3 px-4 font-medium text-slate-200">Tunjangan Tetap</td>
                      <td className="py-3 px-4 text-right text-slate-300">{formatIDR(existingCalc.fixed)}</td>
                      <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.fixed)}</td>
                      <td className="py-3 px-4 text-right text-emerald-300 font-semibold">{formatIDR(offeringCalc.fixed)}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-300">
                        {offeringCalc.fixed - existingCalc.fixed >= 0 ? '+' : ''}
                        {formatIDR(offeringCalc.fixed - existingCalc.fixed)}
                      </td>
                    </tr>

                    <tr className="bg-slate-950/40 font-bold border-y border-slate-700/60">
                      <td className="py-3 px-4 text-slate-100">Total Penghasilan Bruto Bulanan</td>
                      <td className="py-3 px-4 text-right text-white">{formatIDR(existingCalc.monthly.cashGross)}</td>
                      <td className="py-3 px-4 text-right text-sky-400">{formatIDR(targetCalc.monthly.cashGross)}</td>
                      <td className="py-3 px-4 text-right text-emerald-400">{formatIDR(offeringCalc.monthly.cashGross)}</td>
                      <td className={`py-3 px-4 text-right ${deltaMonthlyGross >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {deltaMonthlyGross >= 0 ? '+' : ''}{formatIDR(deltaMonthlyGross)} ({deltaMonthlyGrossPct.toFixed(1)}%)
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40 text-rose-300">
                      <td className="py-3 px-4">
                        <span className="font-medium">PPh 21 TER Bulanan</span>
                        <span className="block text-[10px] text-slate-500">
                          Tarif Efektif: {existingCalc.terPercentage}% vs {offeringCalc.terPercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.monthly.pph21)}</td>
                      <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.monthly.pph21)}</td>
                      <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.monthly.pph21)}</td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        {offeringCalc.monthly.pph21 - existingCalc.monthly.pph21 > 0 ? '+' : ''}
                        {formatIDR(offeringCalc.monthly.pph21 - existingCalc.monthly.pph21)}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40 text-rose-300">
                      <td className="py-3 px-4">
                        <span className="font-medium">BPJS Kesehatan (1% Pekerja)</span>
                        <span className="block text-[10px] text-slate-500">Dasar maks Rp 12.000.000 (plafon Rp 120.000)</span>
                      </td>
                      <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.monthly.bpjs.kesEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.monthly.bpjs.kesEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.monthly.bpjs.kesEmployee)}</td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        {offeringCalc.monthly.bpjs.kesEmployee - existingCalc.monthly.bpjs.kesEmployee !== 0
                          ? formatIDR(offeringCalc.monthly.bpjs.kesEmployee - existingCalc.monthly.bpjs.kesEmployee)
                          : 'Rp 0'}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40 text-rose-300">
                      <td className="py-3 px-4">
                        <span className="font-medium">BPJS Ketenagakerjaan (JHT 2% + JP 1%)</span>
                        <span className="block text-[10px] text-slate-500">JHT tanpa batas plafon, JP plafon Rp 10.04 Jt</span>
                      </td>
                      <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.monthly.bpjs.jhtEmployee + existingCalc.monthly.bpjs.jpEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.monthly.bpjs.jhtEmployee + targetCalc.monthly.bpjs.jpEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.monthly.bpjs.jhtEmployee + offeringCalc.monthly.bpjs.jpEmployee)}</td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        -{formatIDR((offeringCalc.monthly.bpjs.jhtEmployee + offeringCalc.monthly.bpjs.jpEmployee) - (existingCalc.monthly.bpjs.jhtEmployee + existingCalc.monthly.bpjs.jpEmployee))}
                      </td>
                    </tr>

                    <tr className="bg-rose-950/20 font-semibold text-rose-400 border-t border-rose-900/30">
                      <td className="py-3 px-4">Total Potongan Karyawan / Bulan</td>
                      <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.monthly.totalDeductions)}</td>
                      <td className="py-3 px-4 text-right">-{formatIDR(targetCalc.monthly.totalDeductions)}</td>
                      <td className="py-3 px-4 text-right">-{formatIDR(offeringCalc.monthly.totalDeductions)}</td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        {offeringCalc.monthly.totalDeductions - existingCalc.monthly.totalDeductions > 0 ? '+' : ''}
                        {formatIDR(offeringCalc.monthly.totalDeductions - existingCalc.monthly.totalDeductions)}
                      </td>
                    </tr>

                    <tr className="bg-emerald-950/40 text-white font-extrabold text-sm border-t-2 border-emerald-500/50">
                      <td className="py-4 px-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>NET TAKE HOME PAY (THP) / BULAN</span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-200">{formatIDR(existingCalc.monthly.netSalary)}</td>
                      <td className="py-4 px-4 text-right text-sky-400">{formatIDR(targetCalc.monthly.netSalary)}</td>
                      <td className="py-4 px-4 text-right text-emerald-400 text-base">{formatIDR(offeringCalc.monthly.netSalary)}</td>
                      <td className={`py-4 px-4 text-right text-base ${deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {deltaMonthlyNet >= 0 ? '+' : ''}{formatIDR(deltaMonthlyNet)} ({deltaMonthlyNetPct.toFixed(1)}%)
                      </td>
                    </tr>
                  </>
                )}

                {/* ==================================================== */}
                {/* 2. BAGIAN PER TAHUN (ANNUAL)                          */}
                {/* ==================================================== */}
                {(activeTab === 'both' || activeTab === 'annual') && (
                  <>
                    <tr className="bg-sky-950/30 text-sky-400 font-bold border-t-4 border-slate-950">
                      <td colSpan={5} className="py-2.5 px-4 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        2. Akumulasi Total Tahunan (Per Tahun - Termasuk Bonus / Tunjangan Tidak Tetap)
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40">
                      <td className="py-3 px-4 font-medium text-slate-200">
                        Akumulasi Gaji Pokok ({annualMultiplier}x Bulan termasuk THR)
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">{formatIDR(existingCalc.annual.basic)}</td>
                      <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.annual.basic)}</td>
                      <td className="py-3 px-4 text-right text-emerald-300 font-semibold">{formatIDR(offeringCalc.annual.basic)}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-300">
                        +{formatIDR(offeringCalc.annual.basic - existingCalc.annual.basic)}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40">
                      <td className="py-3 px-4 font-medium text-slate-200">
                        Akumulasi Tunjangan Tetap ({annualMultiplier}x Bulan)
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">{formatIDR(existingCalc.annual.fixed)}</td>
                      <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.annual.fixed)}</td>
                      <td className="py-3 px-4 text-right text-emerald-300 font-semibold">{formatIDR(offeringCalc.annual.fixed)}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-300">
                        +{formatIDR(offeringCalc.annual.fixed - existingCalc.annual.fixed)}
                      </td>
                    </tr>

                    {/* Tunjangan Tidak Tetap / Bonus Tahunan */}
                    <tr className="hover:bg-slate-850/40 bg-sky-950/10">
                      <td className="py-3 px-4 font-semibold text-sky-300">
                        ⭐ Tunjangan Tidak Tetap / Bonus Tahunan
                        <span className="block text-[10px] text-slate-500 font-normal">
                          Variabel / bonus kinerja yang dibayarkan per tahun
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">{formatIDR(existingCalc.annual.bonus)}</td>
                      <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.annual.bonus)}</td>
                      <td className="py-3 px-4 text-right text-emerald-300 font-semibold">{formatIDR(offeringCalc.annual.bonus)}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-300">
                        {offeringCalc.annual.bonus - existingCalc.annual.bonus >= 0 ? '+' : ''}
                        {formatIDR(offeringCalc.annual.bonus - existingCalc.annual.bonus)}
                      </td>
                    </tr>

                    <tr className="bg-slate-950/40 font-bold border-y border-slate-700/60">
                      <td className="py-3 px-4 text-slate-100">Total Penghasilan Bruto Setahun</td>
                      <td className="py-3 px-4 text-right text-white">{formatIDR(existingCalc.annual.cashGross)}</td>
                      <td className="py-3 px-4 text-right text-sky-400">{formatIDR(targetCalc.annual.cashGross)}</td>
                      <td className="py-3 px-4 text-right text-emerald-400">{formatIDR(offeringCalc.annual.cashGross)}</td>
                      <td className={`py-3 px-4 text-right ${deltaAnnualGross >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {deltaAnnualGross >= 0 ? '+' : ''}{formatIDR(deltaAnnualGross)} ({deltaAnnualGrossPct.toFixed(1)}%)
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40 text-rose-300">
                      <td className="py-3 px-4">
                        <span className="font-medium">PPh 21 Setahun (Tarif Pasal 17 UU HPP)</span>
                        <span className="block text-[10px] text-slate-500">
                          Perhitungan PPh 21 tahunan setelah biaya jabatan & iuran pensiun
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.annual.pph21)}</td>
                      <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.annual.pph21)}</td>
                      <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.annual.pph21)}</td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        {offeringCalc.annual.pph21 - existingCalc.annual.pph21 > 0 ? '+' : ''}
                        {formatIDR(offeringCalc.annual.pph21 - existingCalc.annual.pph21)}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-850/40 text-rose-300">
                      <td className="py-3 px-4">
                        <span className="font-medium">Total Iuran BPJS Pekerja Setahun</span>
                        <span className="block text-[10px] text-slate-500">BPJS Kes (12x) + BPJS TK (JHT & JP)</span>
                      </td>
                      <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.annual.bpjs.totalEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.annual.bpjs.totalEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.annual.bpjs.totalEmployee)}</td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        -{formatIDR(offeringCalc.annual.bpjs.totalEmployee - existingCalc.annual.bpjs.totalEmployee)}
                      </td>
                    </tr>

                    <tr className="bg-sky-950/40 text-white font-extrabold text-sm border-t-2 border-sky-500/50">
                      <td className="py-4 px-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-sky-400" />
                        <span>NET TAKE HOME PAY (THP) / TAHUN</span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-200">{formatIDR(existingCalc.annual.netSalary)}</td>
                      <td className="py-4 px-4 text-right text-sky-400">{formatIDR(targetCalc.annual.netSalary)}</td>
                      <td className="py-4 px-4 text-right text-sky-300 text-base">{formatIDR(offeringCalc.annual.netSalary)}</td>
                      <td className={`py-4 px-4 text-right text-base ${deltaAnnualNet >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                        {deltaAnnualNet >= 0 ? '+' : ''}{formatIDR(deltaAnnualNet)} ({deltaAnnualNetPct.toFixed(1)}%)
                      </td>
                    </tr>
                  </>
                )}

              </tbody>
            </table>
          </div>
        </section>

        {/* Informational Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Pemisahan Bulanan vs Tahunan</h4>
              <p className="text-slate-400 leading-relaxed">
                Tunjangan tidak tetap / bonus tidak dimasukkan ke dalam gaji rutin bulanan karena sifatnya variabel atau dibayarkan tahunan. Dengan kalkulator ini, Anda dapat melihat pendapatan kas pasti setiap bulan sekaligus proyeksi total tabungan bersih setahun secara transparan.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">PPh 21 TER PMK 168 / PP 58 Tahun 2023</h4>
              <p className="text-slate-400 leading-relaxed">
                Pemotongan bulanan menggunakan tarif efektif rata-rata (TER Kategori A, B, atau C). Pada akhir tahun (masa pajak Desember), pajak tahunan dihitung dengan tarif progresif Pasal 17 UU HPP dikurangi akumulasi TER yang telah dipotong selama tahun berjalan.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          Kalkulator Gaji & Offering © 2026. Berdasarkan PP No. 58/2023 & PMK No. 168/2023. Dibuat dengan React & Tailwind CSS.
        </p>
      </footer>
    </div>
  )
}

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
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react'
import {
  calculateSalary,
  formatIDR,
  PTKP_LIST,
  BPJS_CONFIG
} from './utils/taxCalculator'

export default function App() {
  // Existing salary state
  const [existingBasic, setExistingBasic] = useState(15000000)
  const [existingFixed, setExistingFixed] = useState(2000000)
  const [existingOther, setExistingOther] = useState(0)
  const [existingPtkp, setExistingPtkp] = useState('TK/0')

  // Negotiation target state
  const [targetIncreasePct, setTargetIncreasePct] = useState(20)

  // Offering salary state
  const [offeringBasic, setOfferingBasic] = useState(19000000)
  const [offeringFixed, setOfferingFixed] = useState(2500000)
  const [offeringOther, setOfferingOther] = useState(0)
  const [offeringPtkp, setOfferingPtkp] = useState('TK/0')

  // Settings
  const [enableBpjsKes, setEnableBpjsKes] = useState(true)
  const [enableBpjsTk, setEnableBpjsTk] = useState(true)
  const [includeBpjsCompanyInTax, setIncludeBpjsCompanyInTax] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [annualMultiplier, setAnnualMultiplier] = useState(13) // 12 bulan + 1 bulan THR
  const [copied, setCopied] = useState(false)

  // Calculations
  const existingCalc = useMemo(() => {
    return calculateSalary({
      basicSalary: existingBasic,
      fixedAllowance: existingFixed,
      otherAllowance: existingOther,
      ptkpCode: existingPtkp,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [existingBasic, existingFixed, existingOther, existingPtkp, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

  const offeringCalc = useMemo(() => {
    return calculateSalary({
      basicSalary: offeringBasic,
      fixedAllowance: offeringFixed,
      otherAllowance: offeringOther,
      ptkpCode: offeringPtkp,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [offeringBasic, offeringFixed, offeringOther, offeringPtkp, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

  // Target calculation based on targetIncreasePct over existing cash gross
  const targetExpectedGross = useMemo(() => {
    const factor = 1 + targetIncreasePct / 100
    return Math.round(existingCalc.cashGross * factor)
  }, [existingCalc.cashGross, targetIncreasePct])

  const targetCalc = useMemo(() => {
    // Pro-rate basic and fixed based on existing ratio
    const totalExisting = existingCalc.cashGross || 1
    const basicRatio = existingCalc.basic / totalExisting
    const fixedRatio = existingCalc.fixed / totalExisting
    const otherRatio = existingCalc.other / totalExisting

    return calculateSalary({
      basicSalary: Math.round(targetExpectedGross * basicRatio),
      fixedAllowance: Math.round(targetExpectedGross * fixedRatio),
      otherAllowance: Math.round(targetExpectedGross * otherRatio),
      ptkpCode: existingPtkp,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [targetExpectedGross, existingCalc, existingPtkp, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

  // Deltas: Offering vs Existing
  const deltaGross = offeringCalc.cashGross - existingCalc.cashGross
  const deltaGrossPct = existingCalc.cashGross > 0 ? (deltaGross / existingCalc.cashGross) * 100 : 0

  const deltaNet = offeringCalc.netSalary - existingCalc.netSalary
  const deltaNetPct = existingCalc.netSalary > 0 ? (deltaNet / existingCalc.netSalary) * 100 : 0

  const deltaAnnualNet = deltaNet * annualMultiplier

  // Helper to copy summary
  const copySummary = () => {
    const text = `📊 Komparasi Gaji & Offering:
- Gaji Existing (Gross): ${formatIDR(existingCalc.cashGross)} | Net THP: ${formatIDR(existingCalc.netSalary)}
- Target Ekspektasi (+${targetIncreasePct}%): Gross ${formatIDR(targetCalc.cashGross)} | Net THP: ${formatIDR(targetCalc.netSalary)}
- Tawaran Baru (Gross): ${formatIDR(offeringCalc.cashGross)} | Net THP: ${formatIDR(offeringCalc.netSalary)}
- Selisih Net THP: ${deltaNet >= 0 ? '+' : ''}${formatIDR(deltaNet)}/bulan (${deltaNetPct.toFixed(1)}%)
- Kenaikan Bersih Setahun (${annualMultiplier}x): ${deltaAnnualNet >= 0 ? '+' : ''}${formatIDR(deltaAnnualNet)}
Dihitung dengan aturan PPh 21 TER (PMK 168/PP 58) & BPJS.`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Quick preset helper to apply target directly to offering
  const applyTargetToOffering = () => {
    setOfferingBasic(targetCalc.basic)
    setOfferingFixed(targetCalc.fixed)
    setOfferingOther(targetCalc.other)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-40">
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
                Simulasi komparasi gaji existing vs tawaran baru & negosiasi real-time
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
                  <span className="text-emerald-400">Tersalin!</span>
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
              <span>Pengaturan BPJS & Pajak</span>
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
                <span>Sesuai Regulasi: Premi JKK, JKM, BPJS Kes dari Perusahaan menambah bruto PPh 21</span>
              </label>
              <p className="text-[11px] text-slate-400">
                Nonaktifkan jika perusahaan Anda menghitung PPh 21 hanya dari bruto tunai langsung.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Proyeksi Tahunan
              </span>
              <label className="block mb-1 text-slate-400">Jumlah Bulan Gaji / Tahun (dengan THR / Bonus):</label>
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
        
        {/* Quick Result Highlight Card */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Ringkasan Kenaikan Bersih (THP)
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  deltaNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {deltaNet >= 0 ? '+' : ''}{formatIDR(deltaNet)}
                  <span className="text-base font-normal text-slate-400">/bulan</span>
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  deltaNet >= 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {deltaNetPct >= 0 ? '+' : ''}{deltaNetPct.toFixed(1)}% Net THP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Kenaikan tahunan ({annualMultiplier}x gaji):{' '}
                <strong className={deltaAnnualNet >= 0 ? 'text-slate-200' : 'text-rose-300'}>
                  {deltaAnnualNet >= 0 ? '+' : ''}{formatIDR(deltaAnnualNet)}
                </strong>{' '}
                setelah potongan pajak & BPJS.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">Existing Net THP</span>
                <span className="text-sm font-semibold text-slate-200">{formatIDR(existingCalc.netSalary)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-[11px] text-slate-400 block">Offering Net THP</span>
                <span className="text-sm font-semibold text-emerald-400">{formatIDR(offeringCalc.netSalary)}</span>
              </div>
              <div className="border-l border-slate-700 pl-3">
                <span className="text-[11px] text-slate-400 block">Target Negosiasi</span>
                <span className="text-sm font-semibold text-sky-400">{formatIDR(targetCalc.netSalary)}</span>
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
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Gaji Pokok (Basic Salary)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={existingBasic}
                      onChange={(e) => setExistingBasic(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="Contoh: 15000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Tunjangan Tetap (Fixed Allowance)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={existingFixed}
                      onChange={(e) => setExistingFixed(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Tunjangan Lainnya / Tidak Tetap
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={existingOther}
                      onChange={(e) => setExistingOther(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
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

            {/* Existing Sub-Summary */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 bg-slate-950/40 -mx-5 -mb-5 p-5 rounded-b-2xl">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400">Penghasilan Bruto (Cash)</span>
                <span className="font-semibold text-white">{formatIDR(existingCalc.cashGross)}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400">
                  PPh 21 TER ({existingCalc.terPercentage}%)
                </span>
                <span className="text-rose-400 font-medium">-{formatIDR(existingCalc.pph21Monthly)}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400">Total BPJS Pekerja</span>
                <span className="text-rose-400 font-medium">-{formatIDR(existingCalc.bpjs.employee.total)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300">Net Take Home Pay (THP)</span>
                <span className="text-base font-bold text-emerald-400">{formatIDR(existingCalc.netSalary)}</span>
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
              <div className="mb-5">
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
                  <span>0% (Sama)</span>
                  <span>+30% (Standard Pindah)</span>
                  <span>+100% (2x Lipat)</span>
                </div>
              </div>

              {/* Target Calculation Box */}
              <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Target Gross Salary</span>
                  <span className="font-bold text-white">{formatIDR(targetCalc.cashGross)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Estimasi Net THP Bersih</span>
                  <span className="font-bold text-sky-400">{formatIDR(targetCalc.netSalary)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-sky-800/30 text-[11px]">
                  <span className="text-slate-400">Selisih Net THP Target</span>
                  <span className="text-sky-300 font-semibold">
                    +{formatIDR(targetCalc.netSalary - existingCalc.netSalary)}/bln
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-5 pt-4">
              <button
                type="button"
                onClick={applyTargetToOffering}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center gap-1.5 transition"
              >
                <span>Terapkan Target ini ke Form Offering</span>
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
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Gaji Pokok Ditawarkan
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={offeringBasic}
                      onChange={(e) => setOfferingBasic(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="Contoh: 19000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Tunjangan Tetap Ditawarkan
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={offeringFixed}
                      onChange={(e) => setOfferingFixed(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Tunjangan Lainnya / Tidak Tetap
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={offeringOther}
                      onChange={(e) => setOfferingOther(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>
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

            {/* Offering Sub-Summary */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 bg-slate-950/40 -mx-5 -mb-5 p-5 rounded-b-2xl">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400">Penghasilan Bruto (Cash)</span>
                <span className="font-semibold text-white">{formatIDR(offeringCalc.cashGross)}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400">
                  PPh 21 TER ({offeringCalc.terPercentage}%)
                </span>
                <span className="text-rose-400 font-medium">-{formatIDR(offeringCalc.pph21Monthly)}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400">Total BPJS Pekerja</span>
                <span className="text-rose-400 font-medium">-{formatIDR(offeringCalc.bpjs.employee.total)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300">Net Take Home Pay (THP)</span>
                <span className="text-base font-bold text-emerald-400">{formatIDR(offeringCalc.netSalary)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Side-by-Side Comparison Table */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Tabel Komparasi Detail & Rincian Potongan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbandingan komponen gaji pokok, tunjangan, pajak PPh 21 TER (PMK 168), dan BPJS
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Kategori PTKP: {existingPtkp}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                  <th className="py-3.5 px-4 font-semibold">Komponen Gaji</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Existing (Saat Ini)</th>
                  <th className="py-3.5 px-4 font-semibold text-right text-sky-400">Target Ekspektasi</th>
                  <th className="py-3.5 px-4 font-semibold text-right text-emerald-400">Offering (Tawaran)</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Selisih (Offering vs Existing)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* Basic Salary */}
                <tr className="hover:bg-slate-850/40">
                  <td className="py-3 px-4 font-medium text-slate-200">Gaji Pokok (Basic)</td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatIDR(existingCalc.basic)}</td>
                  <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.basic)}</td>
                  <td className="py-3 px-4 text-right text-emerald-300">{formatIDR(offeringCalc.basic)}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-300">
                    {offeringCalc.basic - existingCalc.basic >= 0 ? '+' : ''}
                    {formatIDR(offeringCalc.basic - existingCalc.basic)}
                  </td>
                </tr>

                {/* Fixed Allowance */}
                <tr className="hover:bg-slate-850/40">
                  <td className="py-3 px-4 font-medium text-slate-200">Tunjangan Tetap</td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatIDR(existingCalc.fixed)}</td>
                  <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.fixed)}</td>
                  <td className="py-3 px-4 text-right text-emerald-300">{formatIDR(offeringCalc.fixed)}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-300">
                    {offeringCalc.fixed - existingCalc.fixed >= 0 ? '+' : ''}
                    {formatIDR(offeringCalc.fixed - existingCalc.fixed)}
                  </td>
                </tr>

                {/* Other Allowance */}
                <tr className="hover:bg-slate-850/40">
                  <td className="py-3 px-4 font-medium text-slate-200">Tunjangan Tidak Tetap / Lainnya</td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatIDR(existingCalc.other)}</td>
                  <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.other)}</td>
                  <td className="py-3 px-4 text-right text-emerald-300">{formatIDR(offeringCalc.other)}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-300">
                    {offeringCalc.other - existingCalc.other >= 0 ? '+' : ''}
                    {formatIDR(offeringCalc.other - existingCalc.other)}
                  </td>
                </tr>

                {/* Gross Cash Header */}
                <tr className="bg-slate-950/40 font-bold border-y border-slate-700/60">
                  <td className="py-3 px-4 text-slate-100">Total Penghasilan Bruto (Cash)</td>
                  <td className="py-3 px-4 text-right text-white">{formatIDR(existingCalc.cashGross)}</td>
                  <td className="py-3 px-4 text-right text-sky-400">{formatIDR(targetCalc.cashGross)}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">{formatIDR(offeringCalc.cashGross)}</td>
                  <td className={`py-3 px-4 text-right ${deltaGross >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {deltaGross >= 0 ? '+' : ''}{formatIDR(deltaGross)} ({deltaGrossPct.toFixed(1)}%)
                  </td>
                </tr>

                {/* PPh 21 TER */}
                <tr className="hover:bg-slate-850/40 text-rose-300">
                  <td className="py-3 px-4">
                    <span className="font-medium">PPh 21 TER (Tarif Efektif Bulanan)</span>
                    <span className="block text-[10px] text-slate-500">
                      Existing: {existingCalc.terPercentage}% | Offering: {offeringCalc.terPercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.pph21Monthly)}</td>
                  <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.pph21Monthly)}</td>
                  <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.pph21Monthly)}</td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    {offeringCalc.pph21Monthly - existingCalc.pph21Monthly > 0 ? '+' : ''}
                    {formatIDR(offeringCalc.pph21Monthly - existingCalc.pph21Monthly)}
                  </td>
                </tr>

                {/* BPJS Kesehatan */}
                <tr className="hover:bg-slate-850/40 text-rose-300">
                  <td className="py-3 px-4">
                    <span className="font-medium">BPJS Kesehatan (1% Pekerja)</span>
                    <span className="block text-[10px] text-slate-500">
                      Dasar maks Rp 12.000.000 / bln (Plafon Rp 120.000)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.bpjs.employee.kesehatan)}</td>
                  <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.bpjs.employee.kesehatan)}</td>
                  <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.bpjs.employee.kesehatan)}</td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    {offeringCalc.bpjs.employee.kesehatan - existingCalc.bpjs.employee.kesehatan !== 0
                      ? formatIDR(offeringCalc.bpjs.employee.kesehatan - existingCalc.bpjs.employee.kesehatan)
                      : 'Rp 0'}
                  </td>
                </tr>

                {/* BPJS TK: JHT */}
                <tr className="hover:bg-slate-850/40 text-rose-300">
                  <td className="py-3 px-4">
                    <span className="font-medium">BPJS TK - JHT (2% Pekerja)</span>
                    <span className="block text-[10px] text-slate-500">
                      Tabungan hari tua (tanpa plafon)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.bpjs.employee.jht)}</td>
                  <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.bpjs.employee.jht)}</td>
                  <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.bpjs.employee.jht)}</td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    -{formatIDR(offeringCalc.bpjs.employee.jht - existingCalc.bpjs.employee.jht)}
                  </td>
                </tr>

                {/* BPJS TK: JP */}
                <tr className="hover:bg-slate-850/40 text-rose-300">
                  <td className="py-3 px-4">
                    <span className="font-medium">BPJS TK - Jaminan Pensiun (1% Pekerja)</span>
                    <span className="block text-[10px] text-slate-500">
                      Plafon Rp 10.042.300 (Maks potongan Rp 100.423)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.bpjs.employee.jp)}</td>
                  <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.bpjs.employee.jp)}</td>
                  <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{formatIDR(offeringCalc.bpjs.employee.jp)}</td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    {offeringCalc.bpjs.employee.jp - existingCalc.bpjs.employee.jp !== 0
                      ? formatIDR(offeringCalc.bpjs.employee.jp - existingCalc.bpjs.employee.jp)
                      : 'Rp 0'}
                  </td>
                </tr>

                {/* Total Deductions */}
                <tr className="bg-rose-950/20 font-semibold text-rose-400 border-t border-rose-900/30">
                  <td className="py-3 px-4">Total Potongan Karyawan / Bulan</td>
                  <td className="py-3 px-4 text-right">-{formatIDR(existingCalc.totalDeductions)}</td>
                  <td className="py-3 px-4 text-right">-{formatIDR(targetCalc.totalDeductions)}</td>
                  <td className="py-3 px-4 text-right">-{formatIDR(offeringCalc.totalDeductions)}</td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    {offeringCalc.totalDeductions - existingCalc.totalDeductions > 0 ? '+' : ''}
                    {formatIDR(offeringCalc.totalDeductions - existingCalc.totalDeductions)}
                  </td>
                </tr>

                {/* Final Net THP */}
                <tr className="bg-emerald-950/30 text-white font-extrabold text-sm border-t-2 border-emerald-500/50">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Net Take Home Pay (THP) / Bulan</span>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-200">{formatIDR(existingCalc.netSalary)}</td>
                  <td className="py-4 px-4 text-right text-sky-400">{formatIDR(targetCalc.netSalary)}</td>
                  <td className="py-4 px-4 text-right text-emerald-400 text-base">{formatIDR(offeringCalc.netSalary)}</td>
                  <td className={`py-4 px-4 text-right text-base ${deltaNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {deltaNet >= 0 ? '+' : ''}{formatIDR(deltaNet)} ({deltaNetPct.toFixed(1)}%)
                  </td>
                </tr>

                {/* Annual Projected Net */}
                <tr className="bg-slate-950 text-slate-300 text-xs">
                  <td className="py-3 px-4 font-medium">
                    Proyeksi THP Bersih Tahunan ({annualMultiplier}x Bulan Gaji)
                  </td>
                  <td className="py-3 px-4 text-right">{formatIDR(existingCalc.netSalary * annualMultiplier)}</td>
                  <td className="py-3 px-4 text-right text-sky-300">{formatIDR(targetCalc.netSalary * annualMultiplier)}</td>
                  <td className="py-3 px-4 text-right text-emerald-300 font-bold">
                    {formatIDR(offeringCalc.netSalary * annualMultiplier)}
                  </td>
                  <td className={`py-3 px-4 text-right font-bold ${deltaAnnualNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {deltaAnnualNet >= 0 ? '+' : ''}{formatIDR(deltaAnnualNet)}
                  </td>
                </tr>

                {/* Employer Side Cost */}
                <tr className="bg-slate-950/70 text-slate-400 text-[11px]">
                  <td className="py-2.5 px-4">
                    Total Biaya Ditanggung Perusahaan (Gaji + BPJS Perusahaan)
                  </td>
                  <td className="py-2.5 px-4 text-right">{formatIDR(existingCalc.totalEmployerCost)}</td>
                  <td className="py-2.5 px-4 text-right">{formatIDR(targetCalc.totalEmployerCost)}</td>
                  <td className="py-2.5 px-4 text-right text-slate-200 font-semibold">{formatIDR(offeringCalc.totalEmployerCost)}</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">
                    +{formatIDR(offeringCalc.totalEmployerCost - existingCalc.totalEmployerCost)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Insights & Tips for Negotiation */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Tips Negosiasi Gaji Bersih (THP)</h4>
              <p className="text-slate-400 leading-relaxed">
                Kenaikan gross tidak selalu berbanding lurus dengan kenaikan THP karena tarif TER bertambah secara progresif (bracket pajak bisa naik jika menembus batas tertentu). Selalu acukan negosiasi ke nominal <strong>Take Home Pay (THP)</strong> yang ingin Anda terima di rekening setiap bulan.
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
                Skema TER berlaku untuk pemotongan pajak masa Januari s/d November. Pada masa pajak Desember, perusahaan akan melakukan perhitungan kembali menggunakan tarif Pasal 17 UU HPP disetahunkan dikurangi total TER yang sudah dipotong.
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

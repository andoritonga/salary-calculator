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
  Clock,
  Printer,
  Gift,
  HelpCircle,
  Sliders,
  RotateCcw
} from 'lucide-react'
import {
  calculateSalary,
  calculateBonusMonthSimulation,
  findRequiredGrossForTargetNet,
  formatIDR,
  PTKP_LIST,
  formatNumberWithDots
} from './utils/taxCalculator'
import CurrencyInput from './components/CurrencyInput'

export default function App() {
  // Existing salary state
  const [existingBasic, setExistingBasic] = useState(15000000)
  const [existingFixed, setExistingFixed] = useState(2000000)
  const [existingAnnualBonus, setExistingAnnualBonus] = useState(15000000) // Bonus tahunan
  const [existingPtkp, setExistingPtkp] = useState('TK/0')
  const [existingTaxMethod, setExistingTaxMethod] = useState('gross') // 'gross' | 'gross_up' | 'nett'

  // Negotiation target state
  const [negotiationMode, setNegotiationMode] = useState('percentage') // 'percentage' | 'reverse_net'
  const [targetIncreasePct, setTargetIncreasePct] = useState(20)
  const [targetNetInput, setTargetNetInput] = useState(18000000)

  // Offering salary state
  const [offeringBasic, setOfferingBasic] = useState(19000000)
  const [offeringFixed, setOfferingFixed] = useState(2500000)
  const [offeringAnnualBonus, setOfferingAnnualBonus] = useState(25000000) // Bonus tahunan
  const [offeringPtkp, setOfferingPtkp] = useState('TK/0')
  const [offeringTaxMethod, setOfferingTaxMethod] = useState('gross') // 'gross' | 'gross_up' | 'nett'

  // THR / Bonus Month Simulator state
  const [showBonusSimulator, setShowBonusSimulator] = useState(true)
  const [selectedSimulatorTarget, setSelectedSimulatorTarget] = useState('offering') // 'existing' | 'offering'
  const [customDisbursedAmount, setCustomDisbursedAmount] = useState(19000000) // THR/Bonus

  // Global Settings
  const [enableBpjsKes, setEnableBpjsKes] = useState(true)
  const [enableBpjsTk, setEnableBpjsTk] = useState(true)
  const [includeBpjsCompanyInTax, setIncludeBpjsCompanyInTax] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [annualMultiplier, setAnnualMultiplier] = useState(13) // 12 bulan + 1 bulan THR
  const [activeTab, setActiveTab] = useState('both') // 'monthly' | 'annual' | 'both'
  const [copied, setCopied] = useState(false)

  // Calculations: Existing
  const existingCalc = useMemo(() => {
    return calculateSalary({
      basicSalary: existingBasic,
      fixedAllowance: existingFixed,
      annualBonus: existingAnnualBonus,
      ptkpCode: existingPtkp,
      taxMethod: existingTaxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [existingBasic, existingFixed, existingAnnualBonus, existingPtkp, existingTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Calculations: Offering
  const offeringCalc = useMemo(() => {
    return calculateSalary({
      basicSalary: offeringBasic,
      fixedAllowance: offeringFixed,
      annualBonus: offeringAnnualBonus,
      ptkpCode: offeringPtkp,
      taxMethod: offeringTaxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [offeringBasic, offeringFixed, offeringAnnualBonus, offeringPtkp, offeringTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Reverse Calculation: Target Net -> Required Gross
  const requiredGrossFromTargetNet = useMemo(() => {
    return findRequiredGrossForTargetNet({
      targetNet: targetNetInput,
      fixedAllowance: existingFixed,
      ptkpCode: existingPtkp,
      taxMethod: offeringTaxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [targetNetInput, existingFixed, existingPtkp, offeringTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

  // Target calculation based on active mode
  const targetCalc = useMemo(() => {
    if (negotiationMode === 'reverse_net') {
      return calculateSalary({
        basicSalary: requiredGrossFromTargetNet,
        fixedAllowance: existingFixed,
        annualBonus: existingAnnualBonus,
        ptkpCode: existingPtkp,
        taxMethod: offeringTaxMethod,
        includeBpjsCompanyInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
        annualMonths: annualMultiplier,
      })
    } else {
      // Percentage mode
      const factor = 1 + targetIncreasePct / 100
      const targetMonthlyGross = Math.round(existingCalc.monthly.cashGross * factor)
      const totalExistingMonthly = existingCalc.monthly.cashGross || 1
      const basicRatio = existingCalc.basic / totalExistingMonthly
      const fixedRatio = existingCalc.fixed / totalExistingMonthly
      const bonusRatio = existingAnnualBonus > 0 ? (1 + targetIncreasePct / 100) : 0

      return calculateSalary({
        basicSalary: Math.round(targetMonthlyGross * basicRatio),
        fixedAllowance: Math.round(targetMonthlyGross * fixedRatio),
        annualBonus: Math.round(existingAnnualBonus * bonusRatio),
        ptkpCode: existingPtkp,
        taxMethod: offeringTaxMethod,
        includeBpjsCompanyInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
        annualMonths: annualMultiplier,
      })
    }
  }, [negotiationMode, requiredGrossFromTargetNet, targetIncreasePct, existingCalc, existingFixed, existingAnnualBonus, existingPtkp, offeringTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Bonus Month Simulator calculation
  const bonusSimulation = useMemo(() => {
    const isOffering = selectedSimulatorTarget === 'offering'
    const basic = isOffering ? offeringBasic : existingBasic
    const fixed = isOffering ? offeringFixed : existingFixed
    const ptkp = isOffering ? offeringPtkp : existingPtkp
    const taxMethod = isOffering ? offeringTaxMethod : existingTaxMethod

    return calculateBonusMonthSimulation({
      basicSalary: basic,
      fixedAllowance: fixed,
      disbursedAmount: customDisbursedAmount,
      ptkpCode: ptkp,
      taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [selectedSimulatorTarget, offeringBasic, existingBasic, offeringFixed, existingFixed, customDisbursedAmount, offeringPtkp, existingPtkp, offeringTaxMethod, existingTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

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

Skema Pajak: Existing (${existingTaxMethod.toUpperCase()}) vs Offering (${offeringTaxMethod.toUpperCase()})

🗓️ PER BULAN (MONTHLY ROUTINE):
• Existing: Gross ${formatIDR(existingCalc.monthly.cashGross)} | Net THP: ${formatIDR(existingCalc.monthly.netSalary)}
• Target: Gross ${formatIDR(targetCalc.monthly.cashGross)} | Net THP: ${formatIDR(targetCalc.monthly.netSalary)}
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

  // Print / Save PDF
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur sticky top-0 z-40 no-print">
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
                Simulasi gaji bersih, reverse target net-to-gross, skema pajak & simulator THR/bonus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Cetak atau simpan sebagai file PDF"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Cetak / PDF</span>
            </button>
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
                  <span>Salin Teks</span>
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
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4 animate-in slide-in-from-top duration-200 no-print">
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
        
        {/* Printable Document Header (Only shown during printing) */}
        <div className="hidden print:block mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Ringkasan Negosiasi & Komparasi Gaji</h1>
          <p className="text-xs text-slate-600">
            Dihitung berdasarkan PPh 21 TER (PMK No. 168/2023 & PP No. 58/2023) serta BPJS Ketenagakerjaan & Kesehatan.
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
        </div>

        {/* Dual Highlight Card (Per Bulan & Per Tahun) */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden print-clean">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none no-print" />
          
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
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
          
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
                <div className="flex items-center gap-1.5">
                  <select
                    value={existingTaxMethod}
                    onChange={(e) => setExistingTaxMethod(e.target.value)}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none"
                    title="Pilih skema pemotongan pajak"
                  >
                    <option value="gross">Gross (Standar)</option>
                    <option value="gross_up">Gross-Up (Tunjangan Pajak)</option>
                    <option value="nett">Nett (Pajak Ditanggung)</option>
                  </select>
                </div>
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
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-emerald-400">HASIL PER BULAN:</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Skema {existingTaxMethod}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Bruto Bulanan</span>
                  <span className="text-slate-200 font-medium">{formatIDR(existingCalc.monthly.cashGross)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Potongan Karyawan</span>
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

          {/* Card 2: Negotiation Target & Reverse Calculator */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-sky-900/40 flex flex-col justify-between shadow-lg relative">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">2. Ekspektasi Negosiasi</h2>
                    <p className="text-[11px] text-slate-400">Target kenaikan yang wajar</p>
                  </div>
                </div>
              </div>

              {/* Mode Switcher: Persentase Kenaikan vs Reverse Calculator */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
                <button
                  type="button"
                  onClick={() => setNegotiationMode('percentage')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
                    negotiationMode === 'percentage'
                      ? 'bg-sky-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mode Persentase (+%)
                </button>
                <button
                  type="button"
                  onClick={() => setNegotiationMode('reverse_net')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
                    negotiationMode === 'reverse_net'
                      ? 'bg-sky-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Reverse (Net ➔ Gross)
                </button>
              </div>

              {/* View 1: Percentage Mode */}
              {negotiationMode === 'percentage' ? (
                <>
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
                </>
              ) : (
                /* View 2: Reverse Calculator Mode (Target Net -> Gross) */
                <div className="space-y-3 mb-4">
                  <div className="bg-sky-950/20 border border-sky-800/30 p-3 rounded-xl">
                    <CurrencyInput
                      label="Berapa Net THP Bulanan yang Anda Inginkan?"
                      badge="Target Net"
                      subtitle="Kalkulator akan menghitung mundur Gross Basic yang harus Anda minta ke HR"
                      value={targetNetInput}
                      onChange={setTargetNetInput}
                      placeholder="Contoh: 18000000"
                      highlight={true}
                    />
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-[11px] text-slate-400 block font-semibold">HASIL PERHITUNGAN BALIK:</span>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Gaji Pokok Gross yang Harus Diminta:</span>
                      <strong className="text-emerald-400 text-sm">{formatIDR(requiredGrossFromTargetNet)}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Kenaikan dari gaji saat ini:</span>
                      <span className="text-sky-300 font-semibold">
                        {existingCalc.monthly.cashGross > 0
                          ? `+${(((requiredGrossFromTargetNet + existingFixed) - existingCalc.monthly.cashGross) / existingCalc.monthly.cashGross * 100).toFixed(1)}% Gross`
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dual Target Box: Monthly & Annual */}
              <div className="space-y-2">
                <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-2.5 space-y-1">
                  <span className="text-[11px] font-bold text-sky-300 block">TARGET HASIL PER BULAN:</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Target Bruto Bulanan</span>
                    <span className="font-semibold text-white">{formatIDR(targetCalc.monthly.cashGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Estimasi Net THP Bulanan</span>
                    <span className="font-bold text-emerald-400">{formatIDR(targetCalc.monthly.netSalary)}</span>
                  </div>
                </div>

                <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-2.5 space-y-1">
                  <span className="text-[11px] font-bold text-sky-300 block">TARGET HASIL PER TAHUN:</span>
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
            <div className="mt-4 pt-3 border-t border-slate-800/80">
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
                <div className="flex items-center gap-1.5">
                  <select
                    value={offeringTaxMethod}
                    onChange={(e) => setOfferingTaxMethod(e.target.value)}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 focus:outline-none"
                    title="Pilih skema pemotongan pajak di perusahaan baru"
                  >
                    <option value="gross">Gross (Standar)</option>
                    <option value="gross_up">Gross-Up (Tunjangan Pajak)</option>
                    <option value="nett">Nett (Pajak Ditanggung)</option>
                  </select>
                </div>
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
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-emerald-400">HASIL PER BULAN:</span>
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">Skema {offeringTaxMethod}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Bruto Bulanan</span>
                  <span className="text-slate-200 font-medium">{formatIDR(offeringCalc.monthly.cashGross)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Potongan Karyawan</span>
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

        {/* Feature 3: Simulator Bulan THR / Bonus Cair (Lonjakan Tarif TER) */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl border border-indigo-900/40 p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  Simulator Slip Gaji Bulan Saat THR / Bonus Cair
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Lonjakan Tarif TER
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lihat simulasi slip gaji dan dampak kenaikan bracket tarif TER saat menerima THR atau Bonus tahunan di bulan tertentu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 no-print">
              <span className="text-xs text-slate-400">Simulasikan untuk:</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSimulatorTarget('existing')
                    setCustomDisbursedAmount(existingBasic)
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
                    selectedSimulatorTarget === 'existing'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Existing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSimulatorTarget('offering')
                    setCustomDisbursedAmount(offeringBasic)
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
                    selectedSimulatorTarget === 'offering'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Offering
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            {/* Input THR/Bonus Amount */}
            <div className="space-y-3 no-print">
              <CurrencyInput
                label="Nominal THR / Bonus yang Cair di Bulan Ini:"
                badge="Sekali Cair"
                subtitle="Biasanya 1x Basic Salary (THR) atau nominal bonus tahunan"
                value={customDisbursedAmount}
                onChange={setCustomDisbursedAmount}
                placeholder="0"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomDisbursedAmount(selectedSimulatorTarget === 'offering' ? offeringBasic : existingBasic)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700"
                >
                  Setara 1x Basic (THR)
                </button>
                <button
                  type="button"
                  onClick={() => setCustomDisbursedAmount((selectedSimulatorTarget === 'offering' ? offeringBasic : existingBasic) * 2)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700"
                >
                  Setara 2x Basic
                </button>
              </div>
            </div>

            {/* Comparison Cards: Regular Month vs Bonus Month */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Slip Bulan Biasa */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300">Slip Bulan Biasa (Rutin)</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    TER {bonusSimulation.regularTerPct}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Bruto Bulan Biasa</span>
                  <span className="text-slate-200 font-semibold">{formatIDR(bonusSimulation.regularMonthlyGross)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Potongan PPh 21 TER</span>
                  <span className="text-rose-400 font-medium">-{formatIDR(bonusSimulation.regularPph21)}</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="font-bold text-white">Net Diterima di Rekening:</span>
                  <span className="font-bold text-emerald-400">{formatIDR(bonusSimulation.regularMonthlyNet)}</span>
                </div>
              </div>

              {/* Slip Bulan Saat Bonus/THR Cair */}
              <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-700/50 space-y-2 relative">
                <div className="flex justify-between items-center pb-2 border-b border-indigo-900/60">
                  <span className="text-xs font-bold text-indigo-300">Slip Saat Bonus / THR Cair</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40">
                    Naik ke TER {bonusSimulation.disbursedTerPct}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Total Bruto di Bulan Ini</span>
                  <span className="text-white font-semibold">{formatIDR(bonusSimulation.disbursedCashGross)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Potongan PPh 21 TER Bulan Ini</span>
                  <span className="text-rose-400 font-bold">-{formatIDR(bonusSimulation.disbursedPph21)}</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-indigo-900/60">
                  <span className="font-bold text-white">Total Masuk Rekening di Bulan Ini:</span>
                  <span className="font-extrabold text-indigo-300 text-sm">{formatIDR(bonusSimulation.disbursedNetSalary)}</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Detailed Comparison Table with Tab Switcher */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden print-clean">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Tabel Komparasi Rinci & Rincian Potongan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bandingkan hasil per bulan dan per tahun secara akurat (Existing: {existingTaxMethod.toUpperCase()} vs Offering: {offeringTaxMethod.toUpperCase()})
              </p>
            </div>

            {/* Tab Filter Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto no-print">
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
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Existing ({existingTaxMethod.toUpperCase()})
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right text-sky-400">Target Negosiasi</th>
                  <th className="py-3.5 px-4 font-semibold text-right text-emerald-400">
                    Offering ({offeringTaxMethod.toUpperCase()})
                  </th>
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
                          {offeringTaxMethod === 'gross_up' && ' (Ditanggung Kantor via Tunjangan Pajak)'}
                          {offeringTaxMethod === 'nett' && ' (Ditanggung Penuh Perusahaan)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {existingTaxMethod === 'gross' ? `-${formatIDR(existingCalc.monthly.pph21)}` : 'Ditanggung Kantor'}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.monthly.pph21)}</td>
                      <td className="py-3 px-4 text-right text-rose-400 font-semibold">
                        {offeringTaxMethod === 'gross' ? `-${formatIDR(offeringCalc.monthly.pph21)}` : 'Ditanggung Kantor'}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">
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
                      <td className="py-3 px-4 text-right">
                        {existingTaxMethod === 'gross' ? `-${formatIDR(existingCalc.annual.pph21)}` : 'Ditanggung Kantor'}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-300/80">-{formatIDR(targetCalc.annual.pph21)}</td>
                      <td className="py-3 px-4 text-right text-rose-400 font-semibold">
                        {offeringTaxMethod === 'gross' ? `-${formatIDR(offeringCalc.annual.pph21)}` : 'Ditanggung Kantor'}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">
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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs no-print">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Pemisahan Bulanan vs Tahunan</h4>
              <p className="text-slate-400 leading-relaxed">
                Tunjangan tidak tetap / bonus tidak dimasukkan ke dalam gaji rutin bulanan karena sifatnya variabel atau dibayarkan tahunan. Pajak atas bonus sudah diperhitungkan secara akurat dalam total tahunan (Pasal 17 UU HPP).
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Lonjakan Bracket TER Saat THR</h4>
              <p className="text-slate-400 leading-relaxed">
                Di bulan saat THR atau Bonus tahunan dicairkan, bruto Anda melonjak sehingga tarif TER bulan tersebut otomatis berpindah ke bracket yang lebih tinggi. Simulator di atas membantu Anda mengantisipasi nominal bersih slip bulan tersebut.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Reverse Calculator (Net ➔ Gross)</h4>
              <p className="text-slate-400 leading-relaxed">
                Gunakan tab <em>Reverse</em> di kolom ekspektasi negosiasi untuk mengetahui persis berapa nominal Basic Salary Gross yang harus diminta ke pihak rekruter/HRD agar THP bersih di rekening sesuai harapan Anda.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 no-print">
        <p>
          Kalkulator Gaji & Offering © 2026. Berdasarkan PP No. 58/2023 & PMK No. 168/2023. Dibuat dengan React & Tailwind CSS.
        </p>
      </footer>
    </div>
  )
}

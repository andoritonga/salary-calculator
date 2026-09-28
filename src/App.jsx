import React, { useState, useMemo, useEffect } from 'react'
import {
  Calculator,
  ArrowRight,
  TrendingUp,
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
  Scale,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Briefcase
} from 'lucide-react'
import {
  calculateSalary,
  calculateBonusMonthSimulation,
  calculateDecemberTrueUp,
  findRequiredGrossForTargetNet,
  formatIDR,
  PTKP_LIST,
  formatNumberWithDots
} from './utils/taxCalculator'
import CurrencyInput from './components/CurrencyInput'

const INITIAL_OFFERINGS = [
  {
    id: 'offering-1',
    name: 'Offering A',
    basic: 19000000,
    fixed: 2500000,
    annualBonus: 25000000,
    ptkp: 'TK/0',
    taxMethod: 'gross',
  }
]

export default function App() {
  // Navigation: Main Focus Tabs
  // 'compare' (Default) | 'negotiate' | 'simulator'
  const [activeMainTab, setActiveMainTab] = useState('compare')

  // Privacy Mode
  const [privacyMode, setPrivacyMode] = useState(() => {
    return localStorage.getItem('salary_privacy_mode') === 'true'
  })

  // Existing salary state (persisted)
  const [existingBasic, setExistingBasic] = useState(() => {
    const saved = localStorage.getItem('salary_calc_existing_basic')
    return saved !== null ? Number(saved) : 15000000
  })
  const [existingFixed, setExistingFixed] = useState(() => {
    const saved = localStorage.getItem('salary_calc_existing_fixed')
    return saved !== null ? Number(saved) : 2000000
  })
  const [existingAnnualBonus, setExistingAnnualBonus] = useState(() => {
    const saved = localStorage.getItem('salary_calc_existing_bonus')
    return saved !== null ? Number(saved) : 15000000
  })
  const [existingPtkp, setExistingPtkp] = useState(() => {
    return localStorage.getItem('salary_calc_existing_ptkp') || 'TK/0'
  })
  const [existingTaxMethod, setExistingTaxMethod] = useState(() => {
    return localStorage.getItem('salary_calc_existing_tax_method') || 'gross'
  })

  // Multi-Offering state (persisted)
  const [offerings, setOfferings] = useState(() => {
    const saved = localStorage.getItem('salary_calc_offerings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {}
    }
    return INITIAL_OFFERINGS
  })

  const [activeOfferingId, setActiveOfferingId] = useState(() => {
    return offerings[0]?.id || 'offering-1'
  })

  // Negotiation target state
  const [negotiationMode, setNegotiationMode] = useState('percentage') // 'percentage' | 'reverse_net'
  const [targetIncreasePct, setTargetIncreasePct] = useState(20)
  const [targetNetInput, setTargetNetInput] = useState(18000000)

  // Simulator target state
  const [selectedSimulatorTarget, setSelectedSimulatorTarget] = useState('offering') // 'existing' | 'offering'
  const [customDisbursedAmount, setCustomDisbursedAmount] = useState(19000000) // THR/Bonus

  // Global Settings
  const [enableBpjsKes, setEnableBpjsKes] = useState(true)
  const [enableBpjsTk, setEnableBpjsTk] = useState(true)
  const [includeBpjsCompanyInTax, setIncludeBpjsCompanyInTax] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [annualMultiplier, setAnnualMultiplier] = useState(13)
  const [tablePeriod, setTablePeriod] = useState('both') // 'both' | 'monthly' | 'annual'
  const [copied, setCopied] = useState(false)

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('salary_privacy_mode', privacyMode)
  }, [privacyMode])

  useEffect(() => {
    localStorage.setItem('salary_calc_existing_basic', existingBasic)
    localStorage.setItem('salary_calc_existing_fixed', existingFixed)
    localStorage.setItem('salary_calc_existing_bonus', existingAnnualBonus)
    localStorage.setItem('salary_calc_existing_ptkp', existingPtkp)
    localStorage.setItem('salary_calc_existing_tax_method', existingTaxMethod)
  }, [existingBasic, existingFixed, existingAnnualBonus, existingPtkp, existingTaxMethod])

  useEffect(() => {
    localStorage.setItem('salary_calc_offerings', JSON.stringify(offerings))
  }, [offerings])

  // Active Offering helper
  const activeOffering = useMemo(() => {
    return offerings.find(o => o.id === activeOfferingId) || offerings[0] || INITIAL_OFFERINGS[0]
  }, [offerings, activeOfferingId])

  const updateActiveOffering = (updates) => {
    setOfferings(prev =>
      prev.map(off => off.id === activeOffering.id ? { ...off, ...updates } : off)
    )
  }

  const handleAddOffering = () => {
    const count = offerings.length + 1
    const alphabet = String.fromCharCode(65 + count - 1)
    const newId = `offering-${Date.now()}`
    const newOffering = {
      id: newId,
      name: `Offering ${alphabet}`,
      basic: Math.round(existingBasic * 1.25),
      fixed: existingFixed,
      annualBonus: existingAnnualBonus,
      ptkp: existingPtkp,
      taxMethod: 'gross',
    }
    setOfferings(prev => [...prev, newOffering])
    setActiveOfferingId(newId)
  }

  const handleDeleteOffering = (id) => {
    if (offerings.length <= 1) return
    const remaining = offerings.filter(o => o.id !== id)
    setOfferings(remaining)
    if (activeOfferingId === id) {
      setActiveOfferingId(remaining[0].id)
    }
  }

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

  // Calculations: Active Offering
  const offeringCalc = useMemo(() => {
    return calculateSalary({
      basicSalary: activeOffering.basic,
      fixedAllowance: activeOffering.fixed,
      annualBonus: activeOffering.annualBonus,
      ptkpCode: activeOffering.ptkp,
      taxMethod: activeOffering.taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [activeOffering, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Reverse Calculation: Target Net -> Required Gross
  const requiredGrossFromTargetNet = useMemo(() => {
    return findRequiredGrossForTargetNet({
      targetNet: targetNetInput,
      fixedAllowance: existingFixed,
      ptkpCode: existingPtkp,
      taxMethod: activeOffering.taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [targetNetInput, existingFixed, existingPtkp, activeOffering.taxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

  // Target calculation based on active mode
  const targetCalc = useMemo(() => {
    if (negotiationMode === 'reverse_net') {
      return calculateSalary({
        basicSalary: requiredGrossFromTargetNet,
        fixedAllowance: existingFixed,
        annualBonus: existingAnnualBonus,
        ptkpCode: existingPtkp,
        taxMethod: activeOffering.taxMethod,
        includeBpjsCompanyInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
        annualMonths: annualMultiplier,
      })
    } else {
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
        taxMethod: activeOffering.taxMethod,
        includeBpjsCompanyInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
        annualMonths: annualMultiplier,
      })
    }
  }, [negotiationMode, requiredGrossFromTargetNet, targetIncreasePct, existingCalc, existingFixed, existingAnnualBonus, existingPtkp, activeOffering.taxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Bonus Month Simulator calculation
  const bonusSimulation = useMemo(() => {
    const isOffering = selectedSimulatorTarget === 'offering'
    const basic = isOffering ? activeOffering.basic : existingBasic
    const fixed = isOffering ? activeOffering.fixed : existingFixed
    const ptkp = isOffering ? activeOffering.ptkp : existingPtkp
    const taxMethod = isOffering ? activeOffering.taxMethod : existingTaxMethod

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
  }, [selectedSimulatorTarget, activeOffering, existingBasic, existingFixed, customDisbursedAmount, existingPtkp, existingTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

  // December True-Up calculation
  const decemberTrueUp = useMemo(() => {
    const isOffering = selectedSimulatorTarget === 'offering'
    const basic = isOffering ? activeOffering.basic : existingBasic
    const fixed = isOffering ? activeOffering.fixed : existingFixed
    const bonus = isOffering ? activeOffering.annualBonus : existingAnnualBonus
    const ptkp = isOffering ? activeOffering.ptkp : existingPtkp
    const taxMethod = isOffering ? activeOffering.taxMethod : existingTaxMethod

    return calculateDecemberTrueUp({
      basicSalary: basic,
      fixedAllowance: fixed,
      annualBonus: bonus,
      ptkpCode: ptkp,
      taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [selectedSimulatorTarget, activeOffering, existingBasic, existingFixed, existingAnnualBonus, existingPtkp, existingTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Deltas
  const deltaMonthlyGross = offeringCalc.monthly.cashGross - existingCalc.monthly.cashGross
  const deltaMonthlyGrossPct = existingCalc.monthly.cashGross > 0 ? (deltaMonthlyGross / existingCalc.monthly.cashGross) * 100 : 0

  const deltaMonthlyNet = offeringCalc.monthly.netSalary - existingCalc.monthly.netSalary
  const deltaMonthlyNetPct = existingCalc.monthly.netSalary > 0 ? (deltaMonthlyNet / existingCalc.monthly.netSalary) * 100 : 0

  const deltaAnnualNet = offeringCalc.annual.netSalary - existingCalc.annual.netSalary
  const deltaAnnualNetPct = existingCalc.annual.netSalary > 0 ? (deltaAnnualNet / existingCalc.annual.netSalary) * 100 : 0

  // Privacy format wrapper
  const renderIDR = (val) => {
    const formatted = formatIDR(val)
    if (!privacyMode) return formatted
    return (
      <span className="blur-[4px] select-none hover:blur-none transition-all duration-150 cursor-pointer inline-block" title="Arahkan kursor untuk melihat angka">
        {formatted}
      </span>
    )
  }

  // Copy Summary text
  const copySummary = () => {
    const text = `📊 Ringkasan Komparasi Gaji & Offering (${activeOffering.name}):

Skema Pajak: Existing (${existingTaxMethod.toUpperCase()}) vs ${activeOffering.name} (${activeOffering.taxMethod.toUpperCase()})

🗓️ PER BULAN:
• Existing: Gross ${formatIDR(existingCalc.monthly.cashGross)} | Net THP: ${formatIDR(existingCalc.monthly.netSalary)}
• ${activeOffering.name}: Gross ${formatIDR(offeringCalc.monthly.cashGross)} | Net THP: ${formatIDR(offeringCalc.monthly.netSalary)}
• Selisih Net THP: ${deltaMonthlyNet >= 0 ? '+' : ''}${formatIDR(deltaMonthlyNet)}/bln (${deltaMonthlyNetPct.toFixed(1)}%)

📅 PER TAHUN (${annualMultiplier}x Gaji + Bonus):
• Existing Net THP: ${formatIDR(existingCalc.annual.netSalary)}
• ${activeOffering.name} Net THP: ${formatIDR(offeringCalc.annual.netSalary)}
• Selisih Bersih Tahunan: ${deltaAnnualNet >= 0 ? '+' : ''}${formatIDR(deltaAnnualNet)}/thn

Dihitung berdasarkan regulasi PPh 21 TER (PMK 168/2023) & BPJS.`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Apply target to active offering
  const applyTargetToOffering = () => {
    updateActiveOffering({
      basic: targetCalc.basic,
      fixed: targetCalc.fixed,
      annualBonus: targetCalc.bonusAnnual,
    })
    setActiveMainTab('compare')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Header (Minimalist & Flat) */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-40 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
              <Calculator className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight block">Kalkulator Gaji</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">PPh 21 TER & BPJS</span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium border transition ${
                privacyMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
              title={privacyMode ? 'Matikan Mode Privasi' : 'Aktifkan Mode Privasi (Sensor Angka)'}
            >
              {privacyMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
              <span className="hidden md:inline ml-1.5">{privacyMode ? 'Disensor' : 'Privasi'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
              title="Cetak atau simpan sebagai PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline ml-1.5">PDF</span>
            </button>

            <button
              onClick={copySummary}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
              title="Salin ringkasan"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden md:inline ml-1.5">{copied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
              title="Pengaturan BPJS & Gaji"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-4 animate-in slide-in-from-top duration-200 no-print">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300">
            <div>
              <span className="font-semibold text-white block mb-2">Komponen BPJS</span>
              <label className="flex items-center gap-2 mb-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBpjsKes}
                  onChange={(e) => setEnableBpjsKes(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 bg-slate-800"
                />
                <span>BPJS Kesehatan (1% Karyawan, 4% Perusahaan)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBpjsTk}
                  onChange={(e) => setEnableBpjsTk(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 bg-slate-800"
                />
                <span>BPJS TK (JHT 2%, JP 1% Plafon Rp 10.04 Jt)</span>
              </label>
            </div>

            <div>
              <span className="font-semibold text-white block mb-2">Dasar Perhitungan Pajak</span>
              <label className="flex items-center gap-2 cursor-pointer mb-1.5">
                <input
                  type="checkbox"
                  checked={includeBpjsCompanyInTax}
                  onChange={(e) => setIncludeBpjsCompanyInTax(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 bg-slate-800"
                />
                <span>Premi JKK, JKM, BPJS Kes perusahaan menambah bruto</span>
              </label>
              <span className="text-[11px] text-slate-500 block">Sesuai ketentuan perpajakan PMK 168/2023.</span>
            </div>

            <div>
              <span className="font-semibold text-white block mb-2">Multiplier Tahunan (THR)</span>
              <div className="flex gap-2 mb-1.5">
                {[12, 13, 14, 15].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setAnnualMultiplier(months)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                      annualMultiplier === months
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {months}x
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 block">13x = 12 bulan gaji + 1 bulan THR.</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Focus Segmented Tabs (Clean Linear Style) */}
      <div className="border-b border-slate-850 bg-slate-950 px-4 sm:px-6 pt-3 no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setActiveMainTab('compare')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
                activeMainTab === 'compare'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Komparasi Gaji</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('negotiate')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
                activeMainTab === 'negotiate'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Alat Negosiasi & Target</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('simulator')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
                activeMainTab === 'simulator'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Slip THR & Desember</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Printable Header */}
        <div className="hidden print:block mb-6 border-b pb-3">
          <h1 className="text-xl font-bold text-slate-900">Ringkasan Komparasi Gaji & Offering</h1>
          <p className="text-xs text-slate-600">
            Penawaran: {activeOffering.name} | PPh 21 TER PMK 168 & BPJS | Dicetak pada: {new Date().toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: KOMPARASI GAJI (UTAMA & CLEAN)                    */}
        {/* ======================================================== */}
        {activeMainTab === 'compare' && (
          <div className="space-y-6">
            
            {/* Clean Hero Summary Metric */}
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-sm print-clean">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Selisih Kenaikan Bersih (Take Home Pay)
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className={`text-3xl font-bold tracking-tight ${
                      deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {deltaMonthlyNet >= 0 ? '+' : ''}{renderIDR(deltaMonthlyNet)}
                    </span>
                    <span className="text-xs text-slate-400">/bulan</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      deltaMonthlyNet >= 0
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {deltaMonthlyNetPct >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">
                    Kenaikan setahun ({annualMultiplier}x + Bonus):{' '}
                    <strong className={deltaAnnualNet >= 0 ? 'text-slate-200' : 'text-rose-300'}>
                      {deltaAnnualNet >= 0 ? '+' : ''}{renderIDR(deltaAnnualNet)}
                    </strong>
                  </span>
                </div>

                {/* Compact Comparison Badges */}
                <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800/70 shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Gaji Saat Ini</span>
                    <span className="text-xs font-semibold text-slate-200">{renderIDR(existingCalc.monthly.netSalary)}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <div>
                    <span className="text-[10px] text-emerald-400 block uppercase font-medium">{activeOffering.name}</span>
                    <span className="text-xs font-bold text-emerald-400">{renderIDR(offeringCalc.monthly.netSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Clean Comparison Form (Existing vs Offering) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
              
              {/* Kolom 1: Existing */}
              <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <h2 className="text-sm font-bold text-white">Gaji Saat Ini (Existing)</h2>
                  </div>
                  <select
                    value={existingTaxMethod}
                    onChange={(e) => setExistingTaxMethod(e.target.value)}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
                    title="Skema Pajak"
                  >
                    <option value="gross">Gross</option>
                    <option value="gross_up">Gross-Up</option>
                    <option value="nett">Nett</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <CurrencyInput
                    label="Gaji Pokok"
                    badge="Per Bulan"
                    value={existingBasic}
                    onChange={setExistingBasic}
                    placeholder="0"
                    isPrivacy={privacyMode}
                  />

                  <CurrencyInput
                    label="Tunjangan Tetap"
                    badge="Per Bulan"
                    value={existingFixed}
                    onChange={setExistingFixed}
                    placeholder="0"
                    isPrivacy={privacyMode}
                  />

                  <CurrencyInput
                    label="Tunjangan Tidak Tetap / Bonus"
                    badge="Pertahun"
                    subtitle="*Dihitung dalam akumulasi tahunan"
                    value={existingAnnualBonus}
                    onChange={setExistingAnnualBonus}
                    placeholder="0"
                    isPrivacy={privacyMode}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-300">Status PTKP</label>
                      <span className="text-[10px] text-emerald-400 font-semibold">TER Kategori {existingCalc.terCategory}</span>
                    </div>
                    <select
                      value={existingPtkp}
                      onChange={(e) => setExistingPtkp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                    >
                      {PTKP_LIST.map((p) => (
                        <option key={p.code} value={p.code}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub-Metric Summary (Clean) */}
                <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Net THP Bulanan:</span>
                  <span className="font-bold text-white text-sm">{renderIDR(existingCalc.monthly.netSalary)}</span>
                </div>
              </div>

              {/* Kolom 2: Offering (With Integrated Multi-Offering Tabs) */}
              <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-5 space-y-4">
                
                {/* Offering Header with Tabs inside */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                  <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 pr-2">
                    {offerings.map((off) => (
                      <button
                        key={off.id}
                        type="button"
                        onClick={() => setActiveOfferingId(off.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
                          activeOfferingId === off.id
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {off.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddOffering}
                      className="p-1 rounded text-slate-500 hover:text-slate-300 transition"
                      title="Tambah Penawaran Lain"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <select
                      value={activeOffering.taxMethod}
                      onChange={(e) => updateActiveOffering({ taxMethod: e.target.value })}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
                      title="Skema Pajak"
                    >
                      <option value="gross">Gross</option>
                      <option value="gross_up">Gross-Up</option>
                      <option value="nett">Nett</option>
                    </select>

                    {offerings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteOffering(activeOffering.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Hapus penawaran ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Offering Input Form */}
                <div className="space-y-3">
                  <CurrencyInput
                    label="Gaji Pokok Ditawarkan"
                    badge="Per Bulan"
                    value={activeOffering.basic}
                    onChange={(val) => updateActiveOffering({ basic: val })}
                    placeholder="0"
                    highlight={true}
                    isPrivacy={privacyMode}
                  />

                  <CurrencyInput
                    label="Tunjangan Tetap Ditawarkan"
                    badge="Per Bulan"
                    value={activeOffering.fixed}
                    onChange={(val) => updateActiveOffering({ fixed: val })}
                    placeholder="0"
                    isPrivacy={privacyMode}
                  />

                  <CurrencyInput
                    label="Tunjangan Tidak Tetap / Bonus"
                    badge="Pertahun"
                    subtitle="*Dihitung dalam akumulasi tahunan"
                    value={activeOffering.annualBonus}
                    onChange={(val) => updateActiveOffering({ annualBonus: val })}
                    placeholder="0"
                    isPrivacy={privacyMode}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-300">Status PTKP</label>
                      <span className="text-[10px] text-emerald-400 font-semibold">TER Kategori {offeringCalc.terCategory}</span>
                    </div>
                    <select
                      value={activeOffering.ptkp}
                      onChange={(e) => updateActiveOffering({ ptkp: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                    >
                      {PTKP_LIST.map((p) => (
                        <option key={p.code} value={p.code}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub-Metric Summary (Clean) */}
                <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Net THP Bulanan:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                      ({deltaMonthlyNet >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%)
                    </span>
                  </span>
                </div>
              </div>

            </div>

            {/* Ramping Table Comparison */}
            <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl overflow-hidden shadow-sm print-clean">
              <div className="p-4 border-b border-slate-850 flex items-center justify-between no-print">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Rincian Detail Komparasi
                </span>
                
                {/* Table Filter Tabs */}
                <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setTablePeriod('both')}
                    className={`px-2.5 py-1 rounded font-medium transition ${
                      tablePeriod === 'both' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setTablePeriod('monthly')}
                    className={`px-2.5 py-1 rounded font-medium transition ${
                      tablePeriod === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bulanan
                  </button>
                  <button
                    type="button"
                    onClick={() => setTablePeriod('annual')}
                    className={`px-2.5 py-1 rounded font-medium transition ${
                      tablePeriod === 'annual' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tahunan
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 text-[11px]">
                      <th className="py-2.5 px-4 font-semibold">Komponen</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Existing ({existingTaxMethod.toUpperCase()})</th>
                      <th className="py-2.5 px-4 font-semibold text-right text-emerald-400">{activeOffering.name} ({activeOffering.taxMethod.toUpperCase()})</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Selisih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    
                    {/* Bulanan */}
                    {(tablePeriod === 'both' || tablePeriod === 'monthly') && (
                      <>
                        <tr className="bg-slate-950/30 text-[11px] font-bold text-slate-400">
                          <td colSpan={4} className="py-1.5 px-4">KOMPONEN BULANAN (MONTHLY)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 text-slate-300">Gaji Pokok</td>
                          <td className="py-2 px-4 text-right text-slate-400">{renderIDR(existingCalc.basic)}</td>
                          <td className="py-2 px-4 text-right text-slate-200">{renderIDR(offeringCalc.basic)}</td>
                          <td className="py-2 px-4 text-right text-slate-400">+{renderIDR(offeringCalc.basic - existingCalc.basic)}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 text-slate-300">Tunjangan Tetap</td>
                          <td className="py-2 px-4 text-right text-slate-400">{renderIDR(existingCalc.fixed)}</td>
                          <td className="py-2 px-4 text-right text-slate-200">{renderIDR(offeringCalc.fixed)}</td>
                          <td className="py-2 px-4 text-right text-slate-400">+{renderIDR(offeringCalc.fixed - existingCalc.fixed)}</td>
                        </tr>
                        <tr className="font-semibold text-slate-200 bg-slate-950/20">
                          <td className="py-2 px-4">Bruto Bulanan</td>
                          <td className="py-2 px-4 text-right">{renderIDR(existingCalc.monthly.cashGross)}</td>
                          <td className="py-2 px-4 text-right">{renderIDR(offeringCalc.monthly.cashGross)}</td>
                          <td className="py-2 px-4 text-right text-emerald-400">+{renderIDR(deltaMonthlyGross)}</td>
                        </tr>
                        <tr className="text-rose-400/90">
                          <td className="py-2 px-4">PPh 21 TER ({existingCalc.terPercentage}% vs {offeringCalc.terPercentage}%)</td>
                          <td className="py-2 px-4 text-right">-{renderIDR(existingCalc.monthly.pph21)}</td>
                          <td className="py-2 px-4 text-right">-{renderIDR(offeringCalc.monthly.pph21)}</td>
                          <td className="py-2 px-4 text-right text-slate-400">{renderIDR(offeringCalc.monthly.pph21 - existingCalc.monthly.pph21)}</td>
                        </tr>
                        <tr className="text-rose-400/90">
                          <td className="py-2 px-4">Iuran BPJS Karyawan (Kes + TK)</td>
                          <td className="py-2 px-4 text-right">-{renderIDR(existingCalc.monthly.bpjs.totalEmployee)}</td>
                          <td className="py-2 px-4 text-right">-{renderIDR(offeringCalc.monthly.bpjs.totalEmployee)}</td>
                          <td className="py-2 px-4 text-right text-slate-400">-{renderIDR(offeringCalc.monthly.bpjs.totalEmployee - existingCalc.monthly.bpjs.totalEmployee)}</td>
                        </tr>
                        <tr className="font-bold text-white bg-emerald-950/20 border-t border-slate-700/50">
                          <td className="py-2.5 px-4 text-emerald-400">NET THP / BULAN</td>
                          <td className="py-2.5 px-4 text-right">{renderIDR(existingCalc.monthly.netSalary)}</td>
                          <td className="py-2.5 px-4 text-right text-emerald-400">{renderIDR(offeringCalc.monthly.netSalary)}</td>
                          <td className="py-2.5 px-4 text-right text-emerald-400">+{renderIDR(deltaMonthlyNet)} ({deltaMonthlyNetPct.toFixed(1)}%)</td>
                        </tr>
                      </>
                    )}

                    {/* Tahunan */}
                    {(tablePeriod === 'both' || tablePeriod === 'annual') && (
                      <>
                        <tr className="bg-slate-950/30 text-[11px] font-bold text-slate-400">
                          <td colSpan={4} className="py-1.5 px-4">AKUMULASI TAHUNAN ({annualMultiplier}x GAJI + BONUS)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 text-slate-300">Tunjangan Tidak Tetap / Bonus</td>
                          <td className="py-2 px-4 text-right text-slate-400">{renderIDR(existingCalc.annual.bonus)}</td>
                          <td className="py-2 px-4 text-right text-slate-200">{renderIDR(offeringCalc.annual.bonus)}</td>
                          <td className="py-2 px-4 text-right text-slate-400">+{renderIDR(offeringCalc.annual.bonus - existingCalc.annual.bonus)}</td>
                        </tr>
                        <tr className="font-semibold text-slate-200 bg-slate-950/20">
                          <td className="py-2 px-4">Total Bruto Setahun</td>
                          <td className="py-2 px-4 text-right">{renderIDR(existingCalc.annual.cashGross)}</td>
                          <td className="py-2 px-4 text-right">{renderIDR(offeringCalc.annual.cashGross)}</td>
                          <td className="py-2 px-4 text-right text-emerald-400">+{renderIDR(deltaAnnualGross)}</td>
                        </tr>
                        <tr className="text-rose-400/90">
                          <td className="py-2 px-4">PPh 21 Setahun (Pasal 17)</td>
                          <td className="py-2 px-4 text-right">-{renderIDR(existingCalc.annual.pph21)}</td>
                          <td className="py-2 px-4 text-right">-{renderIDR(offeringCalc.annual.pph21)}</td>
                          <td className="py-2 px-4 text-right text-slate-400">{renderIDR(offeringCalc.annual.pph21 - existingCalc.annual.pph21)}</td>
                        </tr>
                        <tr className="text-rose-400/90">
                          <td className="py-2 px-4">Total Iuran BPJS Setahun</td>
                          <td className="py-2 px-4 text-right">-{renderIDR(existingCalc.annual.bpjs.totalEmployee)}</td>
                          <td className="py-2 px-4 text-right">-{renderIDR(offeringCalc.annual.bpjs.totalEmployee)}</td>
                          <td className="py-2 px-4 text-right text-slate-400">-{renderIDR(offeringCalc.annual.bpjs.totalEmployee - existingCalc.annual.bpjs.totalEmployee)}</td>
                        </tr>
                        <tr className="font-bold text-white bg-sky-950/20 border-t border-slate-700/50">
                          <td className="py-2.5 px-4 text-sky-400">NET THP / TAHUN</td>
                          <td className="py-2.5 px-4 text-right">{renderIDR(existingCalc.annual.netSalary)}</td>
                          <td className="py-2.5 px-4 text-right text-sky-400">{renderIDR(offeringCalc.annual.netSalary)}</td>
                          <td className="py-2.5 px-4 text-right text-sky-400">+{renderIDR(deltaAnnualNet)} ({deltaAnnualNetPct.toFixed(1)}%)</td>
                        </tr>
                      </>
                    )}

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ALAT NEGOSIASI (SLIDER & REVERSE NET-TO-GROSS)    */}
        {/* ======================================================== */}
        {activeMainTab === 'negotiate' && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 space-y-5">
              
              {/* Toggle Mode */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setNegotiationMode('percentage')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    negotiationMode === 'percentage'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mode Persentase (+%)
                </button>
                <button
                  type="button"
                  onClick={() => setNegotiationMode('reverse_net')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    negotiationMode === 'reverse_net'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Reverse (Target Net ➔ Gross)
                </button>
              </div>

              {/* View 1: Percentage */}
              {negotiationMode === 'percentage' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-2">Preset Kenaikan:</label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {[10, 15, 20, 25, 30, 35, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setTargetIncreasePct(pct)}
                          className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                            targetIncreasePct === pct
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-950 border-slate-850 text-slate-300 hover:text-white'
                          }`}
                        >
                          +{pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-400">Slider Bebas:</span>
                      <span className="font-bold text-emerald-400">+{targetIncreasePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={targetIncreasePct}
                      onChange={(e) => setTargetIncreasePct(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                /* View 2: Reverse */
                <div className="space-y-3">
                  <CurrencyInput
                    label="Berapa Net THP Bulanan yang Anda Inginkan?"
                    badge="Target Bersih"
                    subtitle="Kalkulator akan menghitung mundur nominal Gross yang harus Anda minta ke HR"
                    value={targetNetInput}
                    onChange={setTargetNetInput}
                    placeholder="Contoh: 18000000"
                    highlight={true}
                    isPrivacy={privacyMode}
                  />

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1.5 text-xs">
                    <span className="text-slate-400 block">Gaji Pokok Gross yang Harus Diminta:</span>
                    <strong className="text-emerald-400 text-xl block">{renderIDR(requiredGrossFromTargetNet)}</strong>
                    <span className="text-[11px] text-slate-500 block">
                      Sudah memperhitungkan pemotongan PPh 21 TER dan BPJS Karyawan.
                    </span>
                  </div>
                </div>
              )}

              {/* Target Summary Result */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-850 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Gross Bulanan:</span>
                  <span className="font-semibold text-white">{renderIDR(targetCalc.monthly.cashGross)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimasi Net THP Bulanan:</span>
                  <span className="font-bold text-emerald-400 text-sm">{renderIDR(targetCalc.monthly.netSalary)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-850 text-slate-400">
                  <span>Target Net Setahun:</span>
                  <span className="font-semibold text-slate-200">{renderIDR(targetCalc.annual.netSalary)}</span>
                </div>
              </div>

              {/* Apply to active offering */}
              <button
                type="button"
                onClick={applyTargetToOffering}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-1.5 shadow"
              >
                <span>Terapkan Angka Target ini ke {activeOffering.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SLIP KHUSUS (THR & DESEMBER TRUE-UP)              */}
        {/* ======================================================== */}
        {activeMainTab === 'simulator' && (
          <div className="space-y-6">
            
            {/* Target Selector */}
            <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800/70">
              <span className="text-xs text-slate-400">Simulasikan untuk data:</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSimulatorTarget('existing')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition ${
                    selectedSimulatorTarget === 'existing'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Existing
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSimulatorTarget('offering')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition ${
                    selectedSimulatorTarget === 'offering'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {activeOffering.name}
                </button>
              </div>
            </div>

            {/* Section 1: Slip Bulan Saat THR / Bonus Cair */}
            <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-850">
                <Gift className="w-4 h-4 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Simulator Slip Saat THR / Bonus Cair</h3>
                  <p className="text-[11px] text-slate-400">Lonjakan tarif TER bulanan akibat penerimaan bonus/THR</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-2">
                  <CurrencyInput
                    label="Nominal THR / Bonus Cair:"
                    badge="Sekali Cair"
                    value={customDisbursedAmount}
                    onChange={setCustomDisbursedAmount}
                    placeholder="0"
                    isPrivacy={privacyMode}
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCustomDisbursedAmount(selectedSimulatorTarget === 'offering' ? activeOffering.basic : existingBasic)}
                      className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded text-[10px] border border-slate-800"
                    >
                      1x Basic (THR)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomDisbursedAmount((selectedSimulatorTarget === 'offering' ? activeOffering.basic : existingBasic) * 2)}
                      className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded text-[10px] border border-slate-800"
                    >
                      2x Basic
                    </button>
                  </div>
                </div>

                {/* Slip Biasa */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-850 text-slate-400">
                    <span>Slip Bulan Biasa</span>
                    <span className="font-semibold text-slate-300">TER {bonusSimulation.regularTerPct}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Bruto:</span>
                    <span className="text-slate-200">{renderIDR(bonusSimulation.regularMonthlyGross)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>PPh 21 TER:</span>
                    <span>-{renderIDR(bonusSimulation.regularPph21)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-850 font-bold text-white">
                    <span>THP Biasa:</span>
                    <span className="text-slate-200">{renderIDR(bonusSimulation.regularMonthlyNet)}</span>
                  </div>
                </div>

                {/* Slip Bulan Cair THR */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/30 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-850 text-emerald-400">
                    <span className="font-bold">Slip Saat THR/Bonus Cair</span>
                    <span className="font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20">TER {bonusSimulation.disbursedTerPct}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Bruto Total:</span>
                    <span className="text-white">{renderIDR(bonusSimulation.disbursedCashGross)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>PPh 21 TER:</span>
                    <span>-{renderIDR(bonusSimulation.disbursedPph21)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-850 font-bold text-white">
                    <span>Total Uang Cair:</span>
                    <span className="text-emerald-400 font-extrabold">{renderIDR(bonusSimulation.disbursedNetSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: True-Up PPh 21 Masa Desember */}
            <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-850">
                <Scale className="w-4 h-4 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Rekonsiliasi PPh 21 Masa Desember (True-Up)</h3>
                  <p className="text-[11px] text-slate-400">Penyesuaian akhir tahun antara akumulasi TER Jan–Nov vs Pasal 17 setahun</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-1.5">
                  <span className="text-slate-400 block font-semibold">1. Pajak Jan–Nov (11 Bulan)</span>
                  <div className="flex justify-between text-slate-400">
                    <span>Rutin / Bulan:</span>
                    <span className="text-slate-200">{renderIDR(decemberTrueUp.regularMonthlyTerTax)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-850 text-slate-300 font-semibold">
                    <span>Total Terpotong:</span>
                    <span>{renderIDR(decemberTrueUp.totalPaidJanNov)}</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-1.5">
                  <span className="text-slate-400 block font-semibold">2. Pajak Setahun (Pasal 17)</span>
                  <div className="flex justify-between text-slate-400">
                    <span>Kalkulasi Setahun:</span>
                    <span className="text-slate-200">{renderIDR(decemberTrueUp.totalAnnualTax)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-850 text-slate-300 font-semibold">
                    <span>Sisa Pajak Des:</span>
                    <span>{renderIDR(decemberTrueUp.decemberPph21)}</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-1.5">
                  <span className="text-slate-400 block font-semibold">3. Slip Gaji Desember</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PPh 21 Desember:</span>
                    <span className="font-semibold text-rose-400">-{renderIDR(decemberTrueUp.decemberPph21)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-850 font-bold">
                    <span className="text-white">THP Desember:</span>
                    <span className="text-emerald-400 font-extrabold">{renderIDR(decemberTrueUp.decemberNetSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-850 py-4 text-center text-xs text-slate-500 no-print">
        <p>Kalkulator Gaji & Offering © 2026. PPh 21 TER (PMK 168/2023) & BPJS.</p>
      </footer>
    </div>
  )
}

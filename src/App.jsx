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

  const deltaAnnualGross = offeringCalc.annual.cashGross - existingCalc.annual.cashGross
  const deltaAnnualGrossPct = existingCalc.annual.cashGross > 0 ? (deltaAnnualGross / existingCalc.annual.cashGross) * 100 : 0

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
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-b from-emerald-500/5 via-slate-800/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 1. Header */}
      <header className="border-b border-slate-800/70 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/15">
              <Calculator className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Kalkulator Gaji & Offering</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PPh 21 TER
                </span>
              </div>
              <span className="text-xs text-slate-400 block">Simulasi komparasi gaji, PPh 21 TER PMK 168 & BPJS</span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150 flex items-center gap-1.5 shadow-sm ${
                privacyMode
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-500/10'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title={privacyMode ? 'Matikan Mode Privasi' : 'Aktifkan Mode Privasi (Sensor Angka)'}
            >
              {privacyMode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{privacyMode ? 'Sensor Aktif' : 'Privasi'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
              title="Cetak atau simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={copySummary}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
              title="Salin ringkasan"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 shadow-sm ${
                showAdvanced
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title="Pengaturan BPJS & Gaji"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Opsi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 sm:px-6 py-4 animate-in slide-in-from-top duration-200 no-print">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/70">
              <span className="font-semibold text-white block mb-2.5">Komponen BPJS</span>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
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

            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/70">
              <span className="font-semibold text-white block mb-2.5">Dasar Perhitungan Pajak</span>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={includeBpjsCompanyInTax}
                  onChange={(e) => setIncludeBpjsCompanyInTax(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 bg-slate-800"
                />
                <span>Premi JKK, JKM, BPJS Kes perusahaan menambah bruto</span>
              </label>
              <span className="text-[11px] text-slate-400 block leading-relaxed">Sesuai ketentuan perpajakan PMK 168/2023.</span>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/70">
              <span className="font-semibold text-white block mb-2.5">Multiplier Tahunan (THR)</span>
              <div className="flex gap-2 mb-2">
                {[12, 13, 14, 15].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setAnnualMultiplier(months)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                      annualMultiplier === months
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {months}x
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-400 block">13x = 12 bulan gaji pokok + 1 bulan THR.</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Focus Segmented Navigation (Floating Modern Pill Control) */}
      <nav className="flex justify-center pt-5 pb-1 px-4 no-print">
        <div className="inline-flex p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg shadow-black/25 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveMainTab('compare')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
              activeMainTab === 'compare'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Komparasi Gaji</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('negotiate')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
              activeMainTab === 'negotiate'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Alat Negosiasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
              activeMainTab === 'simulator'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Slip THR & Desember</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
        
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
            
            {/* Clean Hero Summary Metric Card */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden print-clean">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Kenaikan Bersih (Take Home Pay)
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      deltaMonthlyNet >= 0
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {deltaMonthlyNetPct >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2.5">
                    <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                      deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {deltaMonthlyNet >= 0 ? '+' : ''}{renderIDR(deltaMonthlyNet)}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 font-medium">/bulan</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Kenaikan akumulasi setahun ({annualMultiplier}x gaji + bonus):{' '}
                    <strong className={deltaAnnualNet >= 0 ? 'text-slate-200' : 'text-rose-300'}>
                      {deltaAnnualNet >= 0 ? '+' : ''}{renderIDR(deltaAnnualNet)}/thn
                    </strong>
                  </p>
                </div>

                {/* Compact Comparative Flow */}
                <div className="flex items-center gap-3 bg-slate-950/60 p-3.5 sm:p-4 rounded-xl border border-slate-800/80 shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wide">Gaji Saat Ini</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">{renderIDR(existingCalc.monthly.netSalary)}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-400 font-semibold block uppercase tracking-wide">{activeOffering.name}</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400">{renderIDR(offeringCalc.monthly.netSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dedicated Multi-Offering Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/70 p-3 px-4 rounded-2xl no-print">
              <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1.5 mr-1">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  Penawaran:
                </span>
                {offerings.map((off) => (
                  <div
                    key={off.id}
                    onClick={() => setActiveOfferingId(off.id)}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all shrink-0 ${
                      activeOfferingId === off.id
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{off.name}</span>
                    {offerings.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteOffering(off.id)
                        }}
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Hapus penawaran ini"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOffering}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-dashed border-slate-750 transition shrink-0"
                  title="Tambah penawaran lain"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Tawaran</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 hidden sm:block">
                Membandingkan dengan: <strong className="text-emerald-400">{activeOffering.name}</strong>
              </div>
            </div>

            {/* 2-Column Clean Comparison Form (Existing vs Offering) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
              
              {/* Kolom 1: Existing */}
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
                        <Building2 className="w-4 h-4 text-slate-300" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">Gaji Saat Ini (Existing)</h2>
                        <p className="text-[11px] text-slate-400">Kondisi pekerjaan saat ini</p>
                      </div>
                    </div>
                    <select
                      value={existingTaxMethod}
                      onChange={(e) => setExistingTaxMethod(e.target.value)}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-950/80 text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
                      title="Skema Pajak"
                    >
                      <option value="gross">Gross (Standar)</option>
                      <option value="gross_up">Gross-Up</option>
                      <option value="nett">Nett</option>
                    </select>
                  </div>

                  <div className="space-y-3.5">
                    <CurrencyInput
                      label="Gaji Pokok (Basic Salary)"
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
                      subtitle="*Dihitung dalam akumulasi tahunan (tidak masuk komponen bulanan rutin)"
                      value={existingAnnualBonus}
                      onChange={setExistingAnnualBonus}
                      placeholder="0"
                      isPrivacy={privacyMode}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-slate-300">Status PTKP</label>
                        <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          TER Kategori {existingCalc.terCategory}
                        </span>
                      </div>
                      <select
                        value={existingPtkp}
                        onChange={(e) => setExistingPtkp(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/70 transition"
                      >
                        {PTKP_LIST.map((p) => (
                          <option key={p.code} value={p.code}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sub-Metric Summary (Clean & Complete) */}
                <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Bruto Bulanan:</span>
                    <span className="text-slate-200 font-medium">{renderIDR(existingCalc.monthly.cashGross)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Potongan (PPh 21 TER + BPJS):</span>
                    <span className="text-rose-400 font-medium">-{renderIDR(existingCalc.monthly.totalDeductions)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold">
                    <span className="text-white text-xs">Net THP Bulanan:</span>
                    <span className="text-white text-base font-extrabold">{renderIDR(existingCalc.monthly.netSalary)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Akumulasi Net Setahun:</span>
                    <span className="text-slate-300">{renderIDR(existingCalc.annual.netSalary)}</span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Offering */}
              <div className="bg-slate-900/70 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">{activeOffering.name}</h2>
                        <p className="text-[11px] text-emerald-400">Penawaran yang dievaluasi</p>
                      </div>
                    </div>
                    <select
                      value={activeOffering.taxMethod}
                      onChange={(e) => updateActiveOffering({ taxMethod: e.target.value })}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-950/80 text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
                      title="Skema Pajak"
                    >
                      <option value="gross">Gross (Standar)</option>
                      <option value="gross_up">Gross-Up</option>
                      <option value="nett">Nett</option>
                    </select>
                  </div>

                  <div className="space-y-3.5">
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
                      subtitle="*Dihitung dalam akumulasi tahunan (tidak masuk komponen bulanan rutin)"
                      value={activeOffering.annualBonus}
                      onChange={(val) => updateActiveOffering({ annualBonus: val })}
                      placeholder="0"
                      isPrivacy={privacyMode}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-slate-300">Status PTKP</label>
                        <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          TER Kategori {offeringCalc.terCategory}
                        </span>
                      </div>
                      <select
                        value={activeOffering.ptkp}
                        onChange={(e) => updateActiveOffering({ ptkp: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/70 transition"
                      >
                        {PTKP_LIST.map((p) => (
                          <option key={p.code} value={p.code}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sub-Metric Summary (Clean & Complete) */}
                <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Bruto Bulanan:</span>
                    <span className="text-slate-200 font-medium">{renderIDR(offeringCalc.monthly.cashGross)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Potongan (PPh 21 TER + BPJS):</span>
                    <span className="text-rose-400 font-medium">-{renderIDR(offeringCalc.monthly.totalDeductions)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold">
                    <span className="text-white text-xs">Net THP Bulanan:</span>
                    <div className="text-right">
                      <span className="text-emerald-400 text-base font-extrabold">{renderIDR(offeringCalc.monthly.netSalary)}</span>
                      <span className="text-xs font-semibold text-emerald-400 ml-1.5">
                        ({deltaMonthlyNet >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Akumulasi Net Setahun:</span>
                    <span className="text-emerald-300/90 font-medium">{renderIDR(offeringCalc.annual.netSalary)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Ramping Table Comparison */}
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm print-clean">
              <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between no-print">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" />
                  Rincian Detail Komparasi
                </span>
                
                {/* Table Filter Tabs */}
                <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setTablePeriod('both')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      tablePeriod === 'both' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setTablePeriod('monthly')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      tablePeriod === 'monthly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bulanan
                  </button>
                  <button
                    type="button"
                    onClick={() => setTablePeriod('annual')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      tablePeriod === 'annual' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tahunan
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xs">
                      <th className="py-3 px-4 sm:px-6 font-semibold">Komponen</th>
                      <th className="py-3 px-4 font-semibold text-right">Existing ({existingTaxMethod.toUpperCase()})</th>
                      <th className="py-3 px-4 font-semibold text-right text-emerald-400">{activeOffering.name} ({activeOffering.taxMethod.toUpperCase()})</th>
                      <th className="py-3 px-4 sm:px-6 font-semibold text-right">Selisih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    
                    {/* Bulanan */}
                    {(tablePeriod === 'both' || tablePeriod === 'monthly') && (
                      <>
                        <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                          <td colSpan={4} className="py-2 px-4 sm:px-6 uppercase tracking-wider">Komponen Bulanan (Monthly Routine)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-slate-300">Gaji Pokok (Basic)</td>
                          <td className="py-2.5 px-4 text-right text-slate-400">{renderIDR(existingCalc.basic)}</td>
                          <td className="py-2.5 px-4 text-right text-slate-200">{renderIDR(offeringCalc.basic)}</td>
                          <td className="py-2.5 px-4 sm:px-6 text-right text-slate-300">{(offeringCalc.basic - existingCalc.basic) >= 0 ? '+' : ''}{renderIDR(offeringCalc.basic - existingCalc.basic)}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-slate-300">Tunjangan Tetap</td>
                          <td className="py-2.5 px-4 text-right text-slate-400">{renderIDR(existingCalc.fixed)}</td>
                          <td className="py-2.5 px-4 text-right text-slate-200">{renderIDR(offeringCalc.fixed)}</td>
                          <td className="py-2.5 px-4 sm:px-6 text-right text-slate-400">{(offeringCalc.fixed - existingCalc.fixed) >= 0 ? '+' : ''}{renderIDR(offeringCalc.fixed - existingCalc.fixed)}</td>
                        </tr>
                        <tr className="font-semibold text-slate-200 bg-slate-950/25">
                          <td className="py-2.5 px-4 sm:px-6">Bruto Bulanan</td>
                          <td className="py-2.5 px-4 text-right">{renderIDR(existingCalc.monthly.cashGross)}</td>
                          <td className="py-2.5 px-4 text-right">{renderIDR(offeringCalc.monthly.cashGross)}</td>
                          <td className={`py-2.5 px-4 sm:px-6 text-right ${deltaMonthlyGross >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{deltaMonthlyGross >= 0 ? '+' : ''}{renderIDR(deltaMonthlyGross)}</td>
                        </tr>
                        <tr className="text-rose-400/90">
                          <td className="py-2.5 px-4 sm:px-6">PPh 21 TER ({existingCalc.terPercentage}% vs {offeringCalc.terPercentage}%)</td>
                          <td className="py-2.5 px-4 text-right">-{renderIDR(existingCalc.monthly.pph21)}</td>
                          <td className="py-2.5 px-4 text-right">-{renderIDR(offeringCalc.monthly.pph21)}</td>
                          <td className="py-2.5 px-4 sm:px-6 text-right text-slate-400">{(offeringCalc.monthly.pph21 - existingCalc.monthly.pph21) >= 0 ? '+' : ''}{renderIDR(offeringCalc.monthly.pph21 - existingCalc.monthly.pph21)}</td>
                        </tr>
                        <tr className="text-rose-400/90">
                          <td className="py-2.5 px-4 sm:px-6">Iuran BPJS Karyawan (Kes + TK)</td>
                          <td className="py-2.5 px-4 text-right">-{renderIDR(existingCalc.monthly.bpjs.totalEmployee)}</td>
                          <td className="py-2.5 px-4 text-right">-{renderIDR(offeringCalc.monthly.bpjs.totalEmployee)}</td>
                          <td className="py-2.5 px-4 sm:px-6 text-right text-slate-400">{(offeringCalc.monthly.bpjs.totalEmployee - existingCalc.monthly.bpjs.totalEmployee) >= 0 ? '+' : ''}{renderIDR(offeringCalc.monthly.bpjs.totalEmployee - existingCalc.monthly.bpjs.totalEmployee)}</td>
                        </tr>
                        <tr className="font-bold text-white bg-emerald-950/20 border-t border-slate-700/50">
                          <td className="py-3 px-4 sm:px-6 text-emerald-400">NET THP / BULAN</td>
                          <td className="py-3 px-4 text-right">{renderIDR(existingCalc.monthly.netSalary)}</td>
                          <td className="py-3 px-4 text-right text-emerald-400">{renderIDR(offeringCalc.monthly.netSalary)}</td>
                          <td className={`py-3 px-4 sm:px-6 text-right ${deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{deltaMonthlyNet >= 0 ? '+' : ''}{renderIDR(deltaMonthlyNet)} ({deltaMonthlyNetPct >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%)</td>
                        </tr>
                      </>
                    )}

                    {/* Tahunan */}
                    {(tablePeriod === 'both' || tablePeriod === 'annual') && (
                      <>
                        <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                          <td colSpan={4} className="py-2 px-4 sm:px-6 uppercase tracking-wider">Akumulasi Tahunan ({annualMultiplier}x Gaji Pokok + Bonus)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-slate-300">Tunjangan Tidak Tetap / Bonus</td>
                          <td className="py-2.5 px-4 text-right text-slate-400">{renderIDR(existingCalc.annual.bonus)}</td>
                          <td className="py-2.5 px-4 text-right text-slate-200">{renderIDR(offeringCalc.annual.bonus)}</td>
                          <td className="py-2.5 px-4 sm:px-6 text-right text-slate-400">{(offeringCalc.annual.bonus - existingCalc.annual.bonus) >= 0 ? '+' : ''}{renderIDR(offeringCalc.annual.bonus - existingCalc.annual.bonus)}</td>
                        </tr>
                        <tr className="font-semibold text-slate-200 bg-slate-950/25">
                          <td className="py-2.5 px-4 sm:px-6">Total Bruto Setahun</td>
                          <td className="py-2.5 px-4 text-right">{renderIDR(existingCalc.annual.cashGross)}</td>
                          <td className="py-2.5 px-4 text-right">{renderIDR(offeringCalc.annual.cashGross)}</td>
                          <td className={`py-2.5 px-4 sm:px-6 text-right ${deltaAnnualGross >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{deltaAnnualGross >= 0 ? '+' : ''}{renderIDR(deltaAnnualGross)}</td>
                        </tr>
                        <tr className="text-rose-400/90">
                          <td className="py-2.5 px-4 sm:px-6">PPh 21 Setahun (Pasal 17)</td>
                          <td className="py-2.5 px-4 text-right">-{renderIDR(existingCalc.annual.pph21)}</td>
                          <td className="py-2.5 px-4 text-right">-{renderIDR(offeringCalc.annual.pph21)}</td>
                          <td className="py-2.5 px-4 sm:px-6 text-right text-slate-400">{(offeringCalc.annual.pph21 - existingCalc.annual.pph21) >= 0 ? '+' : ''}{renderIDR(offeringCalc.annual.pph21 - existingCalc.annual.pph21)}</td>
                        </tr>
                        <tr className="text-rose-400/90">
                          <td className="py-2.5 px-4 sm:px-6">Total Iuran BPJS Setahun</td>
                          <td className="py-2.5 px-4 text-right">-{renderIDR(existingCalc.annual.bpjs.totalEmployee)}</td>
                          <td className="py-2.5 px-4 text-right">-{renderIDR(offeringCalc.annual.bpjs.totalEmployee)}</td>
                          <td className="py-2.5 px-4 sm:px-6 text-right text-slate-400">{(offeringCalc.annual.bpjs.totalEmployee - existingCalc.annual.bpjs.totalEmployee) >= 0 ? '+' : ''}{renderIDR(offeringCalc.annual.bpjs.totalEmployee - existingCalc.annual.bpjs.totalEmployee)}</td>
                        </tr>
                        <tr className="font-bold text-white bg-sky-950/20 border-t border-slate-700/50">
                          <td className="py-3 px-4 sm:px-6 text-sky-400">NET THP / TAHUN</td>
                          <td className="py-3 px-4 text-right">{renderIDR(existingCalc.annual.netSalary)}</td>
                          <td className="py-3 px-4 text-right text-sky-400">{renderIDR(offeringCalc.annual.netSalary)}</td>
                          <td className={`py-3 px-4 sm:px-6 text-right ${deltaAnnualNet >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>{deltaAnnualNet >= 0 ? '+' : ''}{renderIDR(deltaAnnualNet)} ({deltaAnnualNetPct >= 0 ? '+' : ''}{deltaAnnualNetPct.toFixed(1)}%)</td>
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
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
              
              {/* Toggle Mode */}
              <div className="flex bg-slate-950/70 p-1.5 rounded-xl border border-slate-800 gap-1.5">
                <button
                  type="button"
                  onClick={() => setNegotiationMode('percentage')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    negotiationMode === 'percentage'
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mode Persentase (+%)
                </button>
                <button
                  type="button"
                  onClick={() => setNegotiationMode('reverse_net')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    negotiationMode === 'reverse_net'
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Reverse (Target Net ➔ Gross)
                </button>
              </div>

              {/* View 1: Percentage */}
              {negotiationMode === 'percentage' ? (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-2.5">Preset Target Kenaikan:</label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {[10, 15, 20, 25, 30, 35, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setTargetIncreasePct(pct)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition ${
                            targetIncreasePct === pct
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                              : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          +{pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-400">Atur Bebas (Slider):</span>
                      <span className="font-bold text-emerald-400 text-sm">+{targetIncreasePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={targetIncreasePct}
                      onChange={(e) => setTargetIncreasePct(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-950 h-2.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                /* View 2: Reverse */
                <div className="space-y-4">
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

                  <div className="bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                    <span className="text-slate-400 block font-medium">Gaji Pokok Gross yang Harus Diminta:</span>
                    <strong className="text-emerald-400 text-2xl font-extrabold block">{renderIDR(requiredGrossFromTargetNet)}</strong>
                    <span className="text-[11px] text-slate-400 block">
                      Sudah memperhitungkan pemotongan PPh 21 TER ({offeringCalc.terPercentage}%) dan BPJS Karyawan.
                    </span>
                  </div>
                </div>
              )}

              {/* Target Summary Result */}
              <div className="bg-slate-950/50 p-4 sm:p-5 rounded-xl border border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Gross Bulanan:</span>
                  <span className="font-semibold text-white">{renderIDR(targetCalc.monthly.cashGross)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimasi Net THP Bulanan:</span>
                  <span className="font-bold text-emerald-400 text-sm">{renderIDR(targetCalc.monthly.netSalary)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-slate-400">
                  <span>Target Net Setahun:</span>
                  <span className="font-semibold text-slate-200">{renderIDR(targetCalc.annual.netSalary)}</span>
                </div>
              </div>

              {/* Apply to active offering */}
              <button
                type="button"
                onClick={applyTargetToOffering}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15"
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
            <div className="flex items-center justify-between bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 shadow-sm">
              <span className="text-xs font-medium text-slate-300">Simulasikan untuk data:</span>
              <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedSimulatorTarget('existing')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSimulatorTarget === 'existing'
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Gaji Saat Ini
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSimulatorTarget('offering')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSimulatorTarget === 'offering'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {activeOffering.name}
                </button>
              </div>
            </div>

            {/* Section 1: Slip Bulan Saat THR / Bonus Cair */}
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-800">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Gift className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Simulator Slip Saat THR / Bonus Cair</h3>
                  <p className="text-[11px] text-slate-400">Lonjakan tarif TER bulanan akibat penerimaan bonus/THR</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div className="space-y-3">
                  <CurrencyInput
                    label="Nominal THR / Bonus Cair:"
                    badge="Sekali Cair"
                    value={customDisbursedAmount}
                    onChange={setCustomDisbursedAmount}
                    placeholder="0"
                    isPrivacy={privacyMode}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomDisbursedAmount(selectedSimulatorTarget === 'offering' ? activeOffering.basic : existingBasic)}
                      className="px-2.5 py-1.5 bg-slate-950/70 hover:bg-slate-800 text-slate-300 rounded-lg text-xs border border-slate-800 transition"
                    >
                      1x Basic (THR)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomDisbursedAmount((selectedSimulatorTarget === 'offering' ? activeOffering.basic : existingBasic) * 2)}
                      className="px-2.5 py-1.5 bg-slate-950/70 hover:bg-slate-800 text-slate-300 rounded-lg text-xs border border-slate-800 transition"
                    >
                      2x Basic
                    </button>
                  </div>
                </div>

                {/* Slip Biasa */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                    <span className="font-medium">Slip Bulan Biasa</span>
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
                  <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-white">
                    <span>THP Biasa:</span>
                    <span className="text-slate-200">{renderIDR(bonusSimulation.regularMonthlyNet)}</span>
                  </div>
                </div>

                {/* Slip Bulan Cair THR */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-500/40 space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-emerald-400">
                    <span className="font-bold">Saat THR/Bonus Cair</span>
                    <span className="font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">TER {bonusSimulation.disbursedTerPct}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Bruto Total:</span>
                    <span className="text-white font-medium">{renderIDR(bonusSimulation.disbursedCashGross)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>PPh 21 TER:</span>
                    <span>-{renderIDR(bonusSimulation.disbursedPph21)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-white">
                    <span>Total Uang Cair:</span>
                    <span className="text-emerald-400 font-extrabold text-sm">{renderIDR(bonusSimulation.disbursedNetSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: True-Up PPh 21 Masa Desember */}
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-800">
                <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
                  <Scale className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Rekonsiliasi PPh 21 Masa Desember (True-Up)</h3>
                  <p className="text-[11px] text-slate-400">Penyesuaian akhir tahun antara akumulasi TER Jan–Nov vs Pasal 17 setahun</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <span className="text-slate-400 block font-semibold">1. Pajak Jan–Nov (11 Bulan)</span>
                  <div className="flex justify-between text-slate-400">
                    <span>Rutin / Bulan:</span>
                    <span className="text-slate-200">{renderIDR(decemberTrueUp.regularMonthlyTerTax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-slate-300 font-semibold">
                    <span>Total Terpotong:</span>
                    <span>{renderIDR(decemberTrueUp.totalPaidJanNov)}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <span className="text-slate-400 block font-semibold">2. Pajak Setahun (Pasal 17)</span>
                  <div className="flex justify-between text-slate-400">
                    <span>Kalkulasi Setahun:</span>
                    <span className="text-slate-200">{renderIDR(decemberTrueUp.totalAnnualTax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-slate-300 font-semibold">
                    <span>Sisa Pajak Des:</span>
                    <span>{renderIDR(decemberTrueUp.decemberPph21)}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <span className="text-slate-400 block font-semibold">3. Slip Gaji Desember</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PPh 21 Desember:</span>
                    <span className="font-semibold text-rose-400">-{renderIDR(decemberTrueUp.decemberPph21)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                    <span className="text-white">THP Desember:</span>
                    <span className="text-emerald-400 font-extrabold text-sm">{renderIDR(decemberTrueUp.decemberNetSalary)}</span>
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

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
  Briefcase,
  X,
  Users,
  Globe,
  Download,
  Smartphone,
  Settings2
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
import { translations, getPTKPLabel } from './translations'
import CurrencyInput from './components/CurrencyInput'

const INITIAL_OFFERINGS = [
  {
    id: 'offering-1',
    name: 'Offering A',
    basic: 19000000,
    fixed: 2500000,
    annualBonus: 25000000,
    taxMethod: 'gross',
  }
]

export default function App() {
  // Language State: 'id' | 'en'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('salary_calc_lang') || 'id'
  })

  // Translation helper
  const t = (key, params = {}) => {
    let str = translations[lang]?.[key] || translations['id']?.[key] || key
    Object.keys(params).forEach(k => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k])
    })
    return str
  }

  // Modal Pop-ups
  const [showNegotiateModal, setShowNegotiateModal] = useState(false)
  const [showSpecialSlipsModal, setShowSpecialSlipsModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  // Unified PTKP status (Global for both existing and all offerings)
  const [ptkpStatus, setPtkpStatus] = useState(() => {
    return localStorage.getItem('salary_calc_ptkp') || localStorage.getItem('salary_calc_existing_ptkp') || 'TK/0'
  })

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

  // Mobile / PWA States
  const [mobileSection, setMobileSection] = useState('both') // 'existing' | 'offering' | 'both'
  const [activeMobileNav, setActiveMobileNav] = useState('form') // 'form' | 'breakdown'
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPwaBanner, setShowPwaBanner] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showStickyKpi, setShowStickyKpi] = useState(false)

  // PWA standalone & install detection + scroll detection
  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    setIsStandalone(checkStandalone)

    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      const dismissed = localStorage.getItem('salary_calc_pwa_dismissed')
      if (!dismissed && !checkStandalone) {
        setShowPwaBanner(true)
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 340) {
        setShowStickyKpi(true)
      } else {
        setShowStickyKpi(false)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPwaBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismissPwa = () => {
    setShowPwaBanner(false)
    localStorage.setItem('salary_calc_pwa_dismissed', 'true')
  }

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('salary_calc_lang', lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem('salary_privacy_mode', privacyMode)
  }, [privacyMode])

  useEffect(() => {
    localStorage.setItem('salary_calc_ptkp', ptkpStatus)
  }, [ptkpStatus])

  useEffect(() => {
    localStorage.setItem('salary_calc_existing_basic', existingBasic)
    localStorage.setItem('salary_calc_existing_fixed', existingFixed)
    localStorage.setItem('salary_calc_existing_bonus', existingAnnualBonus)
    localStorage.setItem('salary_calc_existing_tax_method', existingTaxMethod)
  }, [existingBasic, existingFixed, existingAnnualBonus, existingTaxMethod])

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
      ptkpCode: ptkpStatus,
      taxMethod: existingTaxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [existingBasic, existingFixed, existingAnnualBonus, ptkpStatus, existingTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Calculations: Active Offering
  const offeringCalc = useMemo(() => {
    return calculateSalary({
      basicSalary: activeOffering.basic,
      fixedAllowance: activeOffering.fixed,
      annualBonus: activeOffering.annualBonus,
      ptkpCode: ptkpStatus,
      taxMethod: activeOffering.taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [activeOffering, ptkpStatus, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Reverse Calculation: Target Net -> Required Gross
  const requiredGrossFromTargetNet = useMemo(() => {
    return findRequiredGrossForTargetNet({
      targetNet: targetNetInput,
      fixedAllowance: existingFixed,
      ptkpCode: ptkpStatus,
      taxMethod: activeOffering.taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [targetNetInput, existingFixed, ptkpStatus, activeOffering.taxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

  // Target calculation based on active mode
  const targetCalc = useMemo(() => {
    if (negotiationMode === 'reverse_net') {
      return calculateSalary({
        basicSalary: requiredGrossFromTargetNet,
        fixedAllowance: existingFixed,
        annualBonus: existingAnnualBonus,
        ptkpCode: ptkpStatus,
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
        ptkpCode: ptkpStatus,
        taxMethod: activeOffering.taxMethod,
        includeBpjsCompanyInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
        annualMonths: annualMultiplier,
      })
    }
  }, [negotiationMode, requiredGrossFromTargetNet, targetIncreasePct, existingCalc, existingFixed, existingAnnualBonus, ptkpStatus, activeOffering.taxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

  // Bonus Month Simulator calculation
  const bonusSimulation = useMemo(() => {
    const isOffering = selectedSimulatorTarget === 'offering'
    const basic = isOffering ? activeOffering.basic : existingBasic
    const fixed = isOffering ? activeOffering.fixed : existingFixed
    const taxMethod = isOffering ? activeOffering.taxMethod : existingTaxMethod

    return calculateBonusMonthSimulation({
      basicSalary: basic,
      fixedAllowance: fixed,
      disbursedAmount: customDisbursedAmount,
      ptkpCode: ptkpStatus,
      taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [selectedSimulatorTarget, activeOffering, existingBasic, existingFixed, customDisbursedAmount, ptkpStatus, existingTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk])

  // December True-Up calculation
  const decemberTrueUp = useMemo(() => {
    const isOffering = selectedSimulatorTarget === 'offering'
    const basic = isOffering ? activeOffering.basic : existingBasic
    const fixed = isOffering ? activeOffering.fixed : existingFixed
    const bonus = isOffering ? activeOffering.annualBonus : existingAnnualBonus
    const taxMethod = isOffering ? activeOffering.taxMethod : existingTaxMethod

    return calculateDecemberTrueUp({
      basicSalary: basic,
      fixedAllowance: fixed,
      annualBonus: bonus,
      ptkpCode: ptkpStatus,
      taxMethod,
      includeBpjsCompanyInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [selectedSimulatorTarget, activeOffering, existingBasic, existingFixed, existingAnnualBonus, ptkpStatus, existingTaxMethod, includeBpjsCompanyInTax, enableBpjsKes, enableBpjsTk, annualMultiplier])

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

  // Render pill badge for deltas
  const renderDeltaBadge = (delta, isDeduction = false) => {
    if (Math.round(delta) === 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60 font-mono tabular-nums">
          Rp 0
        </span>
      )
    }

    const isPositive = delta > 0
    let colorClass = ''
    if (isDeduction) {
      colorClass = isPositive
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    } else {
      colorClass = isPositive
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    }

    const sign = isPositive ? '+' : '-'
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border font-mono tabular-nums ${colorClass}`}>
        {sign}{renderIDR(Math.abs(delta))}
      </span>
    )
  }

  // Copy Summary text
  const copySummary = () => {
    const text = `${t('copySummaryTitle', { name: activeOffering.name })}

${t('copySummaryTaxScheme', { name: activeOffering.name, existingTax: existingTaxMethod.toUpperCase(), offeringTax: activeOffering.taxMethod.toUpperCase() })}

${t('copySummaryMonthlyHeader')}
${t('copySummaryExistingMonthly', { gross: formatIDR(existingCalc.monthly.cashGross), net: formatIDR(existingCalc.monthly.netSalary) })}
${t('copySummaryOfferingMonthly', { name: activeOffering.name, gross: formatIDR(offeringCalc.monthly.cashGross), net: formatIDR(offeringCalc.monthly.netSalary) })}
${t('copySummaryDeltaMonthly', { sign: deltaMonthlyNet >= 0 ? '+' : '', delta: formatIDR(deltaMonthlyNet), pct: deltaMonthlyNetPct.toFixed(1) })}

${t('copySummaryAnnualHeader', { multiplier: annualMultiplier })}
${t('copySummaryExistingAnnual', { net: formatIDR(existingCalc.annual.netSalary) })}
${t('copySummaryOfferingAnnual', { name: activeOffering.name, net: formatIDR(offeringCalc.annual.netSalary) })}
${t('copySummaryDeltaAnnual', { sign: deltaAnnualNet >= 0 ? '+' : '', delta: formatIDR(deltaAnnualNet) })}

${t('copySummaryFooter')}`

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
    setShowNegotiateModal(false)
  }

  // Clear all salary figures to zero
  const handleClearAllToZero = () => {
    setExistingBasic(0)
    setExistingFixed(0)
    setExistingAnnualBonus(0)
    setOfferings(prev => prev.map(o => ({
      ...o,
      basic: 0,
      fixed: 0,
      annualBonus: 0
    })))
    setShowResetModal(false)
  }

  // Reset all state to default demo values
  const handleResetToDemo = () => {
    setExistingBasic(15000000)
    setExistingFixed(2000000)
    setExistingAnnualBonus(15000000)
    setExistingTaxMethod('gross')
    setPtkpStatus('TK/0')
    setOfferings(INITIAL_OFFERINGS)
    setActiveOfferingId('offering-1')
    setAnnualMultiplier(13)
    setShowResetModal(false)
  }

  // Clear specific existing card
  const handleClearExisting = () => {
    setExistingBasic(0)
    setExistingFixed(0)
    setExistingAnnualBonus(0)
  }

  // Clear specific active offering card
  const handleClearActiveOffering = () => {
    updateActiveOffering({
      basic: 0,
      fixed: 0,
      annualBonus: 0
    })
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-b from-emerald-500/5 via-slate-800/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 1. Header (Sticky App Bar with Safe Area) */}
      <header className="border-b border-slate-800/70 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-40 pt-safe no-print transition-all w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/15 shrink-0">
              <Calculator className="w-4 h-4 text-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">{t('appTitle')}</span>
                <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  PPh 21 TER
                </span>
                {isStandalone && (
                  <span className="hidden xs:inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    APP
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block truncate">{t('appSubtitle')}</span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Toggle: ID / EN */}
            <button
              type="button"
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1 sm:gap-1.5 shadow-sm"
              title={t('langToggleTitle')}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="flex items-center text-[11px] font-bold">
                <span className={lang === 'id' ? 'text-emerald-400' : 'text-slate-500'}>ID</span>
                <span className="text-slate-600 mx-0.5">/</span>
                <span className={lang === 'en' ? 'text-emerald-400' : 'text-slate-500'}>EN</span>
              </span>
            </button>

            {/* Privacy Mode */}
            <button
              type="button"
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium border transition-all duration-150 flex items-center gap-1.5 shadow-sm ${
                privacyMode
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-500/10'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title={privacyMode ? t('privacyTitleOn') : t('privacyTitleOff')}
            >
              {privacyMode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{privacyMode ? t('privacyActive') : t('privacyInactive')}</span>
            </button>

            {/* PDF (Desktop Only) */}
            <button
              onClick={() => window.print()}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all items-center gap-1.5 shadow-sm"
              title={t('pdfTitle')}
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('pdf')}</span>
            </button>

            {/* Copy (Desktop Only) */}
            <button
              onClick={copySummary}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all items-center gap-1.5 shadow-sm"
              title={t('copyTitle')}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? t('copied') : t('copy')}</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
              title={t('resetTitle')}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{t('reset')}</span>
            </button>

            {/* Options (Desktop Only - mobile uses bottom dock Tab 5) */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`hidden md:flex px-3 py-1.5 rounded-xl text-xs font-medium border transition-all items-center gap-1.5 shadow-sm ${
                showAdvanced
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title={t('optionsTitle')}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('options')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="bg-slate-900/95 border-b border-slate-800/80 px-4 sm:px-6 py-4 animate-in slide-in-from-top duration-200 no-print">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Header of Drawer */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-bold text-white">{t('optionsTitle')}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title={t('closeMenu')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs text-slate-300">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/70">
                <span className="font-semibold text-white block mb-2.5">{t('bpjsComponentTitle')}</span>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBpjsKes}
                    onChange={(e) => setEnableBpjsKes(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 bg-slate-800"
                  />
                  <span>{t('bpjsKesLabel')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBpjsTk}
                    onChange={(e) => setEnableBpjsTk(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 bg-slate-800"
                  />
                  <span>{t('bpjsTkLabel')}</span>
                </label>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/70">
                <span className="font-semibold text-white block mb-2.5">{t('taxBaseTitle')}</span>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={includeBpjsCompanyInTax}
                    onChange={(e) => setIncludeBpjsCompanyInTax(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 bg-slate-800"
                  />
                  <span>{t('taxBaseLabel')}</span>
                </label>
                <span className="text-[11px] text-slate-400 block leading-relaxed">{t('taxBaseNote')}</span>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/70">
                <span className="font-semibold text-white block mb-2.5">{t('multiplierTitle')}</span>
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
                <span className="text-[11px] text-slate-400 block">{t('multiplierNote')}</span>
              </div>
            </div>

            {/* Quick Actions inside Drawer for Mobile */}
            <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2.5 md:hidden">
              <span className="text-xs text-slate-400 font-semibold">{t('quickActions')}</span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvanced(false)
                    setTimeout(() => window.print(), 150)
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-950/70 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('pdf')}</span>
                </button>
                <button
                  type="button"
                  onClick={copySummary}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-950/70 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? t('copied') : t('copy')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvanced(false)
                    setShowResetModal(true)
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t('reset')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-5 space-y-5 sm:space-y-6 pb-28 md:pb-12">
        
        {/* PWA Install Banner (Native App Prompt) */}
        {showPwaBanner && deferredPrompt && (
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/80 border border-emerald-500/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-lg no-print animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{t('pwaBannerTitle')}</h4>
                <p className="text-[11px] text-slate-300 truncate">{t('pwaBannerDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleInstallPwa}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow transition flex items-center gap-1.5 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('pwaInstallBtn')}</span>
              </button>
              <button
                type="button"
                onClick={handleDismissPwa}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition"
                title={t('pwaDismiss')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Printable Header */}
        <div className="hidden print:block mb-6 border-b pb-3">
          <h1 className="text-xl font-bold text-slate-900">{t('printHeaderTitle')}</h1>
          <p className="text-xs text-slate-600">
            {t('printHeaderSubtitle', {
              name: activeOffering.name,
              ptkp: ptkpStatus,
              date: new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US')
            })}
          </p>
        </div>

        {/* 1. Clean Hero Summary Metric Card */}
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden print-clean">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t('heroTitle')}
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
                <span className="text-xs sm:text-sm text-slate-400 font-medium">{t('perMonth')}</span>
              </div>

              <p className="text-xs text-slate-400">
                {t('heroAnnualNote', { multiplier: annualMultiplier })}{' '}
                <strong className={deltaAnnualNet >= 0 ? 'text-slate-200' : 'text-rose-300'}>
                  {deltaAnnualNet >= 0 ? '+' : ''}{renderIDR(deltaAnnualNet)}{t('perYear')}
                </strong>
              </p>
            </div>

            {/* Compact Comparative Flow */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3.5 sm:p-4 rounded-xl border border-slate-800/80 shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wide">{t('currentSalary')}</span>
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

        {/* 2. Top Unified Control Bar: PTKP & Modals & Offering Switcher */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-3 sm:p-4 rounded-2xl shadow-sm space-y-3 sm:space-y-3.5 no-print w-full max-w-full overflow-hidden">
          
          {/* Row 1: Penawaran Switcher & Quick Tool Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
            {/* Penawaran Selector (Flex Wrap - No Horizontal Scroll) */}
            <div className="flex items-center gap-2 flex-wrap py-0.5">
              <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1.5 mr-1">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                {t('offeringsLabel')}
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
                      title={t('deleteOffering')}
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
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('addOffering')}</span>
              </button>
            </div>

            {/* Quick Action Modal Buttons (Desktop Only - on mobile these are in bottom dock) */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowNegotiateModal(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border border-sky-500/30 transition flex items-center gap-1.5 shadow-sm"
                title={t('negotiationToolDesc')}
              >
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>{t('negotiationTool')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSpecialSlipsModal(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition flex items-center gap-1.5 shadow-sm"
                title={t('specialSlipsDesc')}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('specialSlips')}</span>
              </button>
            </div>
          </div>

          {/* Row 2: Single Global PTKP Selector (1 Tempat di Atas) */}
          <div className="pt-2.5 sm:pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {t('ptkpLabel')}
              </span>
              <select
                value={ptkpStatus}
                onChange={(e) => setPtkpStatus(e.target.value)}
                className="px-2.5 sm:px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500/70 cursor-pointer max-w-full"
              >
                {PTKP_LIST.map((p) => (
                  <option key={p.code} value={p.code}>
                    {getPTKPLabel(p.code, lang)}
                  </option>
                ))}
              </select>
              <span className="text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t('ptkpEffectiveRate', { cat: existingCalc.terCategory, rate: existingCalc.terPercentage })}
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              {t('ptkpSyncNote')}
            </div>
          </div>
        </div>

        {/* 3. 2-Column Clean Comparison Form (Existing vs Offering) */}
        <div id="section-form" className="space-y-3.5 scroll-mt-20">
          
          {/* Mobile Segmented Tab Filter (Existing / Offering / Both) */}
          <div className="flex md:hidden bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs shadow-inner no-print gap-1">
            <button
              type="button"
              onClick={() => setMobileSection('existing')}
              className={`flex-1 py-2 text-center rounded-lg font-semibold transition active:scale-95 ${
                mobileSection === 'existing'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('mobileFilterExisting')}
            </button>
            <button
              type="button"
              onClick={() => setMobileSection('offering')}
              className={`flex-1 py-2 text-center rounded-lg font-semibold transition active:scale-95 ${
                mobileSection === 'offering'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('mobileFilterOffering')}
            </button>
            <button
              type="button"
              onClick={() => setMobileSection('both')}
              className={`flex-1 py-2 text-center rounded-lg font-semibold transition active:scale-95 ${
                mobileSection === 'both'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('mobileFilterBoth')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 no-print">
            {/* Kolom 1: Existing */}
            <div className={`bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between ${
              mobileSection === 'offering' ? 'hidden md:flex' : 'flex'
            }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
                    <Building2 className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{t('existingCardTitle')}</h2>
                    <p className="text-[11px] text-slate-400">{t('existingCardSubtitle')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearExisting}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition"
                    title={t('clearCardTitle')}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <select
                    value={existingTaxMethod}
                    onChange={(e) => setExistingTaxMethod(e.target.value)}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-950/80 text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
                    title={t('taxSchemeTitle')}
                  >
                    <option value="gross">{t('taxMethodGross')}</option>
                    <option value="gross_up">{t('taxMethodGrossUp')}</option>
                    <option value="nett">{t('taxMethodNett')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3.5">
                <CurrencyInput
                  label={t('basicSalaryLabel')}
                  badge={t('basicSalaryBadge')}
                  value={existingBasic}
                  onChange={setExistingBasic}
                  placeholder="0"
                  isPrivacy={privacyMode}
                />

                <CurrencyInput
                  label={t('fixedAllowanceLabel')}
                  badge={t('fixedAllowanceBadge')}
                  value={existingFixed}
                  onChange={setExistingFixed}
                  placeholder="0"
                  isPrivacy={privacyMode}
                />

                <CurrencyInput
                  label={t('bonusLabel')}
                  badge={t('bonusBadge')}
                  subtitle={t('bonusSubtitle')}
                  value={existingAnnualBonus}
                  onChange={setExistingAnnualBonus}
                  placeholder="0"
                  isPrivacy={privacyMode}
                />
              </div>
            </div>

            {/* Sub-Metric Summary (Clean & Complete) */}
            <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{t('monthlyGrossSub')}</span>
                <span className="text-slate-200 font-medium">{renderIDR(existingCalc.monthly.cashGross)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('deductionsSub')}</span>
                <span className="text-rose-400 font-medium">-{renderIDR(existingCalc.monthly.totalDeductions)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold">
                <span className="text-white text-xs">{t('monthlyNetSub')}</span>
                <span className="text-white text-base font-extrabold">{renderIDR(existingCalc.monthly.netSalary)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>{t('annualNetSub')}</span>
                <span className="text-slate-300">{renderIDR(existingCalc.annual.netSalary)}</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Offering */}
          <div className={`bg-slate-900/70 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between relative ${
            mobileSection === 'existing' ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{activeOffering.name}</h2>
                    <p className="text-[11px] text-emerald-400">{t('offeringCardSubtitle')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearActiveOffering}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition"
                    title={t('clearCardTitle')}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <select
                    value={activeOffering.taxMethod}
                    onChange={(e) => updateActiveOffering({ taxMethod: e.target.value })}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-950/80 text-slate-300 border border-slate-800 focus:outline-none cursor-pointer"
                    title={t('taxSchemeTitle')}
                  >
                    <option value="gross">{t('taxMethodGross')}</option>
                    <option value="gross_up">{t('taxMethodGrossUp')}</option>
                    <option value="nett">{t('taxMethodNett')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3.5">
                <CurrencyInput
                  label={t('offeringBasicLabel')}
                  badge={t('basicSalaryBadge')}
                  value={activeOffering.basic}
                  onChange={(val) => updateActiveOffering({ basic: val })}
                  placeholder="0"
                  highlight={true}
                  isPrivacy={privacyMode}
                />

                <CurrencyInput
                  label={t('fixedAllowanceLabel')}
                  badge={t('fixedAllowanceBadge')}
                  value={activeOffering.fixed}
                  onChange={(val) => updateActiveOffering({ fixed: val })}
                  placeholder="0"
                  isPrivacy={privacyMode}
                />

                <CurrencyInput
                  label={t('bonusLabel')}
                  badge={t('bonusBadge')}
                  subtitle={t('bonusSubtitle')}
                  value={activeOffering.annualBonus}
                  onChange={(val) => updateActiveOffering({ annualBonus: val })}
                  placeholder="0"
                  isPrivacy={privacyMode}
                />
              </div>
            </div>

            {/* Sub-Metric Summary (Clean & Complete) */}
            <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{t('monthlyGrossSub')}</span>
                <span className="text-slate-200 font-medium">{renderIDR(offeringCalc.monthly.cashGross)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('deductionsSub')}</span>
                <span className="text-rose-400 font-medium">-{renderIDR(offeringCalc.monthly.totalDeductions)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold">
                <span className="text-white text-xs">{t('monthlyNetSub')}</span>
                <div className="text-right">
                  <span className="text-emerald-400 text-base font-extrabold">{renderIDR(offeringCalc.monthly.netSalary)}</span>
                  <span className="text-xs font-semibold text-emerald-400 ml-1.5">
                    ({deltaMonthlyNet >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>{t('annualNetSub')}</span>
                <span className="text-emerald-300/90 font-medium">{renderIDR(offeringCalc.annual.netSalary)}</span>
              </div>
            </div>
          </div>

          </div>
        </div>

        {/* 4. Rincian Detail Komparasi (High-End Financial Breakdown) */}
        <div id="section-breakdown" className="space-y-6 print-clean scroll-mt-20">
          
          {/* Top Control Bar for Comparison */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm no-print">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  {t('breakdownTitle')}
                </h3>
                <p className="text-xs text-slate-400">
                  {t('breakdownSubtitle')}
                </p>
              </div>
            </div>
            
            {/* Period Selector Tabs */}
            <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto gap-1">
              <button
                type="button"
                onClick={() => setTablePeriod('monthly')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  tablePeriod === 'monthly' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{t('periodMonthly')}</span>
              </button>
              <button
                type="button"
                onClick={() => setTablePeriod('annual')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  tablePeriod === 'annual' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{t('periodAnnual')}</span>
              </button>
              <button
                type="button"
                onClick={() => setTablePeriod('both')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  tablePeriod === 'both' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{t('periodAll')}</span>
              </button>
            </div>
          </div>

          {/* CARD 1: ARUS KAS BULANAN (MONTHLY ROUTINE) */}
          {(tablePeriod === 'both' || tablePeriod === 'monthly') && (
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
              {/* Card Subheader */}
              <div className="px-5 py-4 bg-slate-950/50 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      {t('card1Title')}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {t('card1Subtitle')}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs self-start sm:self-auto">
                  <span className="text-slate-400 text-[11px]">{t('deltaNetThp')}</span>
                  <span className="font-extrabold text-emerald-400 font-mono">
                    {deltaMonthlyNet >= 0 ? '+' : ''}{renderIDR(deltaMonthlyNet)}{t('perMonth')}
                  </span>
                  <span className="font-bold text-emerald-400 text-[11px]">
                    ({deltaMonthlyNetPct >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Mobile Table Scroll Hint */}
              <div className="sm:hidden px-4 py-2 bg-slate-950/80 border-b border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                  <span>{t('mobileTableScrollHint')}</span>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 sm:px-6 font-semibold w-5/12">{t('thComponent')}</th>
                      <th className="py-3 px-4 font-semibold text-right w-7/32">
                        {t('thCurrent')} <span className="text-[10px] font-normal text-slate-500">({existingTaxMethod.toUpperCase()})</span>
                      </th>
                      <th className="py-3 px-4 font-semibold text-right text-emerald-400 w-7/32">
                        {activeOffering.name} <span className="text-[10px] font-normal text-emerald-500/80">({activeOffering.taxMethod.toUpperCase()})</span>
                      </th>
                      <th className="py-3 px-4 sm:px-6 font-semibold text-right w-1/4">{t('thDelta')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {/* Header Group: Pendapatan Bruto Bulanan */}
                    <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                      <td colSpan={4} className="py-2.5 px-4 sm:px-6 uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {t('groupGrossMonthly')}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6 text-slate-300">
                        <div className="font-medium text-white">{t('basicSalaryLabel')}</div>
                        <div className="text-[10px] text-slate-400">{t('basicSalaryDesc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">{renderIDR(existingCalc.basic)}</td>
                      <td className="py-3 px-4 text-right text-slate-100 font-mono tabular-nums font-medium">{renderIDR(offeringCalc.basic)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.basic - existingCalc.basic)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6 text-slate-300">
                        <div className="font-medium text-white">{t('fixedAllowanceLabel')}</div>
                        <div className="text-[10px] text-slate-400">{t('fixedAllowanceDesc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">{renderIDR(existingCalc.fixed)}</td>
                      <td className="py-3 px-4 text-right text-slate-100 font-mono tabular-nums font-medium">{renderIDR(offeringCalc.fixed)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.fixed - existingCalc.fixed)}
                      </td>
                    </tr>
                    <tr className="bg-slate-950/40 border-y border-slate-800 font-bold text-slate-100">
                      <td className="py-2.5 px-4 sm:px-6 text-white font-semibold">{t('subtotalGrossMonthly')}</td>
                      <td className="py-2.5 px-4 text-right text-slate-200 font-mono tabular-nums">{renderIDR(existingCalc.monthly.cashGross)}</td>
                      <td className="py-2.5 px-4 text-right text-slate-100 font-mono tabular-nums">{renderIDR(offeringCalc.monthly.cashGross)}</td>
                      <td className="py-2.5 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(deltaMonthlyGross)}
                      </td>
                    </tr>

                    {/* Header Group: Potongan Karyawan Bulanan */}
                    <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                      <td colSpan={4} className="py-2.5 px-4 sm:px-6 uppercase tracking-wider text-rose-400/90 font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        {t('groupDeductionsMonthly')}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <div className="font-medium text-rose-200 flex items-center gap-2">
                          <span>{t('pph21TerLabel')}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-medium">
                            {existingCalc.terCategory} {existingCalc.terPercentage}% vs {offeringCalc.terCategory} {offeringCalc.terPercentage}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{t('pph21TerDesc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(existingCalc.monthly.pph21)}</td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(offeringCalc.monthly.pph21)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.monthly.pph21 - existingCalc.monthly.pph21, true)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <div className="font-medium text-rose-200">{t('bpjsKesLabelShort')}</div>
                        <div className="text-[10px] text-slate-400">{t('bpjsKesDesc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(existingCalc.monthly.bpjs.kesEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(offeringCalc.monthly.bpjs.kesEmployee)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.monthly.bpjs.kesEmployee - existingCalc.monthly.bpjs.kesEmployee, true)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <div className="font-medium text-rose-200">{t('bpjsTkLabelShort')}</div>
                        <div className="text-[10px] text-slate-400">{t('bpjsTkDesc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(existingCalc.monthly.bpjs.jhtEmployee + existingCalc.monthly.bpjs.jpEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(offeringCalc.monthly.bpjs.jhtEmployee + offeringCalc.monthly.bpjs.jpEmployee)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(
                          (offeringCalc.monthly.bpjs.jhtEmployee + offeringCalc.monthly.bpjs.jpEmployee) -
                          (existingCalc.monthly.bpjs.jhtEmployee + existingCalc.monthly.bpjs.jpEmployee),
                          true
                        )}
                      </td>
                    </tr>
                    <tr className="bg-rose-950/20 border-y border-rose-900/30 font-semibold text-rose-300">
                      <td className="py-2.5 px-4 sm:px-6">{t('subtotalDeductionsMonthly')}</td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums">-{renderIDR(existingCalc.monthly.totalDeductions)}</td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums">-{renderIDR(offeringCalc.monthly.totalDeductions)}</td>
                      <td className="py-2.5 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.monthly.totalDeductions - existingCalc.monthly.totalDeductions, true)}
                      </td>
                    </tr>
                  </tbody>
                  {/* Hero Summary Footer for Monthly */}
                  <tfoot>
                    <tr className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-t-2 border-emerald-500/40 text-white">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-xs sm:text-sm font-extrabold tracking-wide text-emerald-300 uppercase block">
                              {t('heroNetMonthlyTitle')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">{t('heroNetMonthlySubtitle')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-200 font-mono tabular-nums text-xs sm:text-sm font-bold">
                        {renderIDR(existingCalc.monthly.netSalary)}
                      </td>
                      <td className="py-4 px-4 text-right text-emerald-400 font-mono tabular-nums text-sm sm:text-base font-extrabold">
                        {renderIDR(offeringCalc.monthly.netSalary)}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm font-mono tabular-nums ${
                            deltaMonthlyNet >= 0
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {deltaMonthlyNet >= 0 ? '+' : ''}{renderIDR(deltaMonthlyNet)}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-400 mt-1">
                            ({deltaMonthlyNetPct >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* CARD 2: PROYEKSI AKUMULASI TAHUNAN (ANNUALIZED PACKAGE) */}
          {(tablePeriod === 'both' || tablePeriod === 'annual') && (
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
              {/* Card Subheader */}
              <div className="px-5 py-4 bg-slate-950/50 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      {t('card2Title', { multiplier: annualMultiplier })}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {t('card2Subtitle')}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs self-start sm:self-auto">
                  <span className="text-slate-400 text-[11px]">{t('deltaNetAnnual')}</span>
                  <span className="font-extrabold text-sky-400 font-mono">
                    {deltaAnnualNet >= 0 ? '+' : ''}{renderIDR(deltaAnnualNet)}{t('perYear')}
                  </span>
                  <span className="font-bold text-sky-400 text-[11px]">
                    ({deltaAnnualNetPct >= 0 ? '+' : ''}{deltaAnnualNetPct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Mobile Table Scroll Hint */}
              <div className="sm:hidden px-4 py-2 bg-slate-950/80 border-b border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 animate-pulse shrink-0" />
                  <span>{t('mobileTableScrollHint')}</span>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 sm:px-6 font-semibold w-5/12">{t('thComponentAnnual')}</th>
                      <th className="py-3 px-4 font-semibold text-right w-7/32">
                        {t('thCurrent')} <span className="text-[10px] font-normal text-slate-500">({existingTaxMethod.toUpperCase()})</span>
                      </th>
                      <th className="py-3 px-4 font-semibold text-right text-sky-400 w-7/32">
                        {activeOffering.name} <span className="text-[10px] font-normal text-sky-500/80">({activeOffering.taxMethod.toUpperCase()})</span>
                      </th>
                      <th className="py-3 px-4 sm:px-6 font-semibold text-right w-1/4">{t('thDelta')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {/* Header Group: Penerimaan Bruto Kas Setahun */}
                    <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                      <td colSpan={4} className="py-2.5 px-4 sm:px-6 uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        {t('groupGrossAnnual')}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6 text-slate-300">
                        <div className="font-medium text-white">{t('annualRoutineSalary', { multiplier: annualMultiplier })}</div>
                        <div className="text-[10px] text-slate-400">{t('annualRoutineSalaryDesc', { thrMonths: annualMultiplier - 12 })}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">{renderIDR(existingCalc.monthly.cashGross * annualMultiplier)}</td>
                      <td className="py-3 px-4 text-right text-slate-100 font-mono tabular-nums font-medium">{renderIDR(offeringCalc.monthly.cashGross * annualMultiplier)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge((offeringCalc.monthly.cashGross - existingCalc.monthly.cashGross) * annualMultiplier)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6 text-slate-300">
                        <div className="font-medium text-white">{t('bonusLabel')}</div>
                        <div className="text-[10px] text-slate-400">{t('annualBonusDesc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">{renderIDR(existingCalc.annual.bonus)}</td>
                      <td className="py-3 px-4 text-right text-slate-100 font-mono tabular-nums font-medium">{renderIDR(offeringCalc.annual.bonus)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.annual.bonus - existingCalc.annual.bonus)}
                      </td>
                    </tr>
                    <tr className="bg-slate-950/40 border-y border-slate-800 font-bold text-slate-100">
                      <td className="py-2.5 px-4 sm:px-6 text-white font-semibold">{t('subtotalGrossAnnual')}</td>
                      <td className="py-2.5 px-4 text-right text-slate-200 font-mono tabular-nums">{renderIDR(existingCalc.annual.cashGross)}</td>
                      <td className="py-2.5 px-4 text-right text-slate-100 font-mono tabular-nums">{renderIDR(offeringCalc.annual.cashGross)}</td>
                      <td className="py-2.5 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(deltaAnnualGross)}
                      </td>
                    </tr>

                    {/* Header Group: Beban Pajak & Iuran Setahun */}
                    <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                      <td colSpan={4} className="py-2.5 px-4 sm:px-6 uppercase tracking-wider text-rose-400/90 font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        {t('groupDeductionsAnnual')}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <div className="font-medium text-rose-200">{t('annualPph21Label')}</div>
                        <div className="text-[10px] text-slate-400">{t('annualPph21Desc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(existingCalc.annual.pph21)}</td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(offeringCalc.annual.pph21)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.annual.pph21 - existingCalc.annual.pph21, true)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <div className="font-medium text-rose-200">{t('annualBpjsEmployeeLabel')}</div>
                        <div className="text-[10px] text-slate-400">{t('annualBpjsEmployeeDesc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(existingCalc.annual.bpjs.totalEmployee)}</td>
                      <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">-{renderIDR(offeringCalc.annual.bpjs.totalEmployee)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.annual.bpjs.totalEmployee - existingCalc.annual.bpjs.totalEmployee, true)}
                      </td>
                    </tr>
                    <tr className="bg-rose-950/20 border-y border-rose-900/30 font-semibold text-rose-300">
                      <td className="py-2.5 px-4 sm:px-6">{t('subtotalDeductionsAnnual')}</td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums">-{renderIDR(existingCalc.annual.totalDeductions)}</td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums">-{renderIDR(offeringCalc.annual.totalDeductions)}</td>
                      <td className="py-2.5 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.annual.totalDeductions - existingCalc.annual.totalDeductions, true)}
                      </td>
                    </tr>

                    {/* Header Group: Kontribusi BPJS Ditanggung Perusahaan */}
                    <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                      <td colSpan={4} className="py-2.5 px-4 sm:px-6 uppercase tracking-wider text-sky-400/90 font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        {t('groupEmployerBenefit')}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6 text-slate-300">
                        <div className="font-medium text-slate-200">{t('employerBpjsLabel')}</div>
                        <div className="text-[10px] text-slate-400">{t('employerBpjsDesc')}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">+{renderIDR(existingCalc.annual.bpjs.totalEmployer)}</td>
                      <td className="py-3 px-4 text-right text-sky-300 font-mono tabular-nums font-medium">+{renderIDR(offeringCalc.annual.bpjs.totalEmployer)}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        {renderDeltaBadge(offeringCalc.annual.bpjs.totalEmployer - existingCalc.annual.bpjs.totalEmployer)}
                      </td>
                    </tr>
                  </tbody>
                  {/* Hero Summary Footer for Annual */}
                  <tfoot>
                    <tr className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-sky-950/60 border-t-2 border-sky-500/40 text-white">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                          <div>
                            <span className="text-xs sm:text-sm font-extrabold tracking-wide text-sky-300 uppercase block">
                              {t('heroNetAnnualTitle')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">{t('heroNetAnnualSubtitle')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-200 font-mono tabular-nums text-xs sm:text-sm font-bold">
                        {renderIDR(existingCalc.annual.netSalary)}
                      </td>
                      <td className="py-4 px-4 text-right text-sky-400 font-mono tabular-nums text-sm sm:text-base font-extrabold">
                        {renderIDR(offeringCalc.annual.netSalary)}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm font-mono tabular-nums ${
                            deltaAnnualNet >= 0
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {deltaAnnualNet >= 0 ? '+' : ''}{renderIDR(deltaAnnualNet)}
                          </span>
                          <span className="text-[11px] font-bold text-sky-400 mt-1">
                            ({deltaAnnualNetPct >= 0 ? '+' : ''}{deltaAnnualNetPct.toFixed(1)}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* ======================================================== */}
      {/* POP-UP MODAL 1: ALAT NEGOSIASI (SLIDER & REVERSE NET)    */}
      {/* ======================================================== */}
      {showNegotiateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-150 no-print">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl space-y-5 sm:space-y-6 relative max-h-[90vh] overflow-y-auto pb-safe animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200">
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto -mt-1 mb-2 sm:hidden shrink-0" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
                  <Sliders className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{t('negotiateModalTitle')}</h3>
                  <p className="text-xs text-slate-400">{t('negotiateModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNegotiateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 gap-1.5">
              <button
                type="button"
                onClick={() => setNegotiationMode('percentage')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  negotiationMode === 'percentage'
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('modePercentage')}
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
                {t('modeReverse')}
              </button>
            </div>

            {/* View 1: Percentage */}
            {negotiationMode === 'percentage' ? (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-2.5">{t('presetLabel')}</label>
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
                    <span className="text-slate-400">{t('sliderLabel')}</span>
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
                  label={t('reverseInputLabel')}
                  badge={t('reverseBadge')}
                  subtitle={t('reverseSubtitle')}
                  value={targetNetInput}
                  onChange={setTargetNetInput}
                  placeholder="Contoh: 18000000"
                  highlight={true}
                  isPrivacy={privacyMode}
                />

                <div className="bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <span className="text-slate-400 block font-medium">{t('requiredGrossLabel')}</span>
                  <strong className="text-emerald-400 text-2xl font-extrabold block">{renderIDR(requiredGrossFromTargetNet)}</strong>
                  <span className="text-[11px] text-slate-400 block">
                    {t('requiredGrossNote', { ptkp: ptkpStatus })}
                  </span>
                </div>
              </div>
            )}

            {/* Target Summary Result */}
            <div className="bg-slate-950/50 p-4 sm:p-5 rounded-xl border border-slate-800/80 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('targetGrossMonthly')}</span>
                <span className="font-semibold text-white">{renderIDR(targetCalc.monthly.cashGross)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('targetNetMonthly')}</span>
                <span className="font-bold text-emerald-400 text-sm">{renderIDR(targetCalc.monthly.netSalary)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-slate-400">
                <span>{t('targetNetAnnual')}</span>
                <span className="font-semibold text-slate-200">{renderIDR(targetCalc.annual.netSalary)}</span>
              </div>
            </div>

            {/* Apply & Cancel Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowNegotiateModal(false)}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {t('cancelBtn')}
              </button>
              <button
                type="button"
                onClick={applyTargetToOffering}
                className="flex-[2] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15"
              >
                <span>{t('applyTargetToOffering', { name: activeOffering.name })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POP-UP MODAL 2: SLIP KHUSUS (THR & DESEMBER TRUE-UP)     */}
      {/* ======================================================== */}
      {showSpecialSlipsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-150 no-print">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-5 sm:space-y-6 relative sm:my-8 max-h-[90vh] overflow-y-auto pb-safe animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200">
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto -mt-1 mb-2 sm:hidden shrink-0" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                  <Calendar className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{t('specialSlipsModalTitle')}</h3>
                  <p className="text-xs text-slate-400">{t('specialSlipsModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSpecialSlipsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Switcher */}
            <div className="flex items-center justify-between bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-medium text-slate-300">{t('targetSimulationLabel')}</span>
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedSimulatorTarget('existing')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSimulatorTarget === 'existing'
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('thCurrent')}
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
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
                <Gift className="w-4 h-4 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t('thrSectionTitle')}</h4>
                  <p className="text-[11px] text-slate-400">{t('thrSectionSubtitle')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-2.5">
                  <CurrencyInput
                    label={t('disbursedLabel')}
                    badge={t('disbursedBadge')}
                    value={customDisbursedAmount}
                    onChange={setCustomDisbursedAmount}
                    placeholder="0"
                    isPrivacy={privacyMode}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomDisbursedAmount(selectedSimulatorTarget === 'offering' ? activeOffering.basic : existingBasic)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] border border-slate-800 transition"
                    >
                      {t('disbursedPreset1x')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomDisbursedAmount((selectedSimulatorTarget === 'offering' ? activeOffering.basic : existingBasic) * 2)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] border border-slate-800 transition"
                    >
                      {t('disbursedPreset2x')}
                    </button>
                  </div>
                </div>

                {/* Slip Biasa */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-800 text-slate-400">
                    <span className="font-medium">{t('slipRegularTitle')}</span>
                    <span className="font-semibold text-slate-300">TER {bonusSimulation.regularTerPct}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{t('slipRegularGross')}</span>
                    <span className="text-slate-200">{renderIDR(bonusSimulation.regularMonthlyGross)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>{t('slipRegularPph21')}</span>
                    <span>-{renderIDR(bonusSimulation.regularPph21)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-800 font-bold text-white">
                    <span>{t('slipRegularNet')}</span>
                    <span className="text-slate-200">{renderIDR(bonusSimulation.regularMonthlyNet)}</span>
                  </div>
                </div>

                {/* Slip Bulan Cair THR */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-emerald-500/40 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-800 text-emerald-400">
                    <span className="font-bold">{t('slipBonusTitle')}</span>
                    <span className="font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">TER {bonusSimulation.disbursedTerPct}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{t('slipBonusGross')}</span>
                    <span className="text-white font-medium">{renderIDR(bonusSimulation.disbursedCashGross)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>{t('slipBonusPph21')}</span>
                    <span>-{renderIDR(bonusSimulation.disbursedPph21)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-800 font-bold text-white">
                    <span>{t('slipBonusNet')}</span>
                    <span className="text-emerald-400 font-extrabold text-sm">{renderIDR(bonusSimulation.disbursedNetSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: True-Up PPh 21 Masa Desember */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
                <Scale className="w-4 h-4 text-sky-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t('decTrueUpTitle')}</h4>
                  <p className="text-[11px] text-slate-400">{t('decTrueUpSubtitle')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                  <span className="text-slate-400 block font-semibold">{t('decCol1Title')}</span>
                  <div className="flex justify-between text-slate-400">
                    <span>{t('decCol1Routine')}</span>
                    <span className="text-slate-200">{renderIDR(decemberTrueUp.regularMonthlyTerTax)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-800 text-slate-300 font-semibold">
                    <span>{t('decCol1Total')}</span>
                    <span>{renderIDR(decemberTrueUp.totalPaidJanNov)}</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                  <span className="text-slate-400 block font-semibold">{t('decCol2Title')}</span>
                  <div className="flex justify-between text-slate-400">
                    <span>{t('decCol2Annual')}</span>
                    <span className="text-slate-200">{renderIDR(decemberTrueUp.totalAnnualTax)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-800 text-slate-300 font-semibold">
                    <span>{t('decCol2Remaining')}</span>
                    <span>{renderIDR(decemberTrueUp.decemberPph21)}</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                  <span className="text-slate-400 block font-semibold">{t('decCol3Title')}</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('decCol3Tax')}</span>
                    <span className="font-semibold text-rose-400">-{renderIDR(decemberTrueUp.decemberPph21)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-800 font-bold">
                    <span className="text-white">{t('decCol3Net')}</span>
                    <span className="text-emerald-400 font-extrabold text-sm">{renderIDR(decemberTrueUp.decemberNetSalary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSpecialSlipsModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                {t('closeBtn')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POP-UP MODAL 3: RESET / CLEAR ALL                        */}
      {/* ======================================================== */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-150 no-print">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-5 relative max-h-[85vh] overflow-y-auto pb-safe animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200">
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto -mt-1 mb-2 sm:hidden shrink-0" />
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <RotateCcw className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{t('resetModalTitle')}</h3>
                  <p className="text-xs text-slate-400">{t('resetModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t('resetModalDesc')}
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleClearAllToZero}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-2 transition"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>{t('clearAllToZeroBtn')}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDemo}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>{t('resetToDemoBtn')}</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                {t('cancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-850 py-4 text-center text-xs text-slate-500 no-print pb-safe">
        <p>{t('footerText')}</p>
      </footer>

      {/* ======================================================== */}
      {/* MOBILE APP: FLOATING QUICK KPI PILL (WHEN SCROLLED)      */}
      {/* ======================================================== */}
      {showStickyKpi && (
        <div className="fixed top-14 inset-x-0 z-30 px-3 md:hidden no-print animate-in fade-in slide-in-from-top-2 duration-150 pointer-events-none">
          <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-800/90 rounded-2xl p-2 px-3.5 shadow-xl shadow-black/40 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] text-slate-400 shrink-0">{t('mobileQuickKpiTitle')}</span>
              <span className={`text-xs font-extrabold font-mono truncate ${deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {deltaMonthlyNet >= 0 ? '+' : ''}{renderIDR(deltaMonthlyNet)}/bln
              </span>
              <span className="text-[10px] font-bold text-emerald-400 shrink-0">
                ({deltaMonthlyNetPct >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowNegotiateModal(true)}
              className="px-2.5 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition shrink-0 ml-2"
            >
              <Sliders className="w-3 h-3" />
              <span>{t('mobileTabNegotiate')}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MOBILE APP: NATIVE BOTTOM NAVIGATION DOCK (MD:HIDDEN)    */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-800/80 pb-safe md:hidden no-print shadow-2xl shadow-black">
        <div className="flex items-center justify-around px-2 py-1.5">
          {/* Tab 1: Form Inputs */}
          <button
            type="button"
            onClick={() => {
              setActiveMobileNav('form');
              document.getElementById('section-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition active:scale-95 ${
              activeMobileNav === 'form' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">{t('mobileTabForm')}</span>
          </button>

          {/* Tab 2: Breakdown */}
          <button
            type="button"
            onClick={() => {
              setActiveMobileNav('breakdown');
              document.getElementById('section-breakdown')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition active:scale-95 ${
              activeMobileNav === 'breakdown' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">{t('mobileTabBreakdown')}</span>
          </button>

          {/* Tab 3: Negosiasi (Prominent Center Button) */}
          <button
            type="button"
            onClick={() => setShowNegotiateModal(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-sky-400 hover:text-sky-300 transition active:scale-95"
          >
            <div className="p-1 rounded-lg bg-sky-500/15 border border-sky-500/30 mb-0.5">
              <Sliders className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-[10px] leading-tight font-semibold">{t('mobileTabNegotiate')}</span>
          </button>

          {/* Tab 4: Slips */}
          <button
            type="button"
            onClick={() => setShowSpecialSlipsModal(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-amber-400 hover:text-amber-300 transition active:scale-95"
          >
            <Calendar className="w-5 h-5 mb-0.5 text-amber-400" />
            <span className="text-[10px] leading-tight font-medium">{t('mobileTabSlips')}</span>
          </button>

          {/* Tab 5: Menu / Drawer */}
          <button
            type="button"
            onClick={() => setShowAdvanced(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition active:scale-95"
          >
            <Settings2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight font-medium">{t('mobileTabMenu')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

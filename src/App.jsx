import React, { useState, useMemo, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Briefcase,
  ArrowRight,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Eye,
  EyeOff,
  Target,
  Printer,
  Sliders,
  Layers,
  FileSpreadsheet,
  Landmark,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react'
import {
  PTKP_LIST,
  calculateSalary,
  calculateBonusMonthSimulation,
  findRequiredGrossForTargetNet,
  calculateDecemberTrueUp,
  formatIDR,
} from './utils/taxCalculator'
import { translations } from './translations'
import CurrencyInput from './components/CurrencyInput'
import ComparisonAuditMatrix from './components/ComparisonAuditMatrix'
import SalaryModals from './components/SalaryModals'

const STORAGE_KEY = 'salary_calc_state_v5'

const DEFAULT_OFFERINGS = [
  { id: 1, name: 'Penawaran A', basic: 13000000, fixed: 1000000, bonus: 13000000, taxMethod: 'gross' },
]

export default function App() {
  const [savedState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // Language ('id' | 'en')
  const [lang, setLang] = useState(savedState?.lang ?? 'id')

  // Theme ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    if (savedState?.theme === 'dark' || savedState?.theme === 'light') {
      return savedState.theme
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const t = (key, params = {}) => {
    let str = translations[lang]?.[key] || translations.id[key] || key
    Object.keys(params).forEach((k) => {
      str = str.replaceAll(`{${k}}`, params[k])
    })
    return str
  }

  // Existing Salary State
  const [existingBasic, setExistingBasic] = useState(savedState?.existingBasic ?? 10000000)
  const [existingFixed, setExistingFixed] = useState(savedState?.existingFixed ?? 500000)
  const [existingBonus, setExistingBonus] = useState(savedState?.existingBonus ?? 5000000)
  const [existingTaxMethod, setExistingTaxMethod] = useState(savedState?.existingTaxMethod ?? 'gross')

  // Multi-Offerings State
  const [offerings, setOfferings] = useState(savedState?.offerings ?? DEFAULT_OFFERINGS)
  const [activeOfferingId, setActiveOfferingId] = useState(savedState?.activeOfferingId ?? 1)

  // Global Statutory Parameters
  const [sharedPtkp, setSharedPtkp] = useState(savedState?.sharedPtkp ?? 'TK/0')
  const [enableBpjsKes, setEnableBpjsKes] = useState(savedState?.enableBpjsKes ?? true)
  const [enableBpjsTk, setEnableBpjsTk] = useState(savedState?.enableBpjsTk ?? true)
  const [includeCompanyPremiInTax, setIncludeCompanyPremiInTax] = useState(
    savedState?.includeCompanyPremiInTax ?? true
  )
  const [annualMultiplier, setAnnualMultiplier] = useState(savedState?.annualMultiplier ?? 13)

  // UI & Modal States
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [tablePeriod, setTablePeriod] = useState('both') // 'both' | 'monthly' | 'annual'
  const [mobileInputView, setMobileInputView] = useState('both') // 'existing' | 'offering' | 'both'
  const [isPrivate, setIsPrivate] = useState(savedState?.isPrivate ?? false)
  const [copiedSummary, setCopiedSummary] = useState(false)

  // Modals
  const [showNegotiateModal, setShowNegotiateModal] = useState(false)
  const [negotiateMode, setNegotiateMode] = useState('percentage') // 'percentage' | 'reverse'
  const [targetIncrementPct, setTargetIncrementPct] = useState(25)
  const [targetDesiredNet, setTargetDesiredNet] = useState(15000000)

  const [showSpecialSlipsModal, setShowSpecialSlipsModal] = useState(false)
  const [specialSlipTarget, setSpecialSlipTarget] = useState('offering') // 'existing' | 'offering'
  const [thrDisbursedAmount, setThrDisbursedAmount] = useState(13000000)

  const [showResetModal, setShowResetModal] = useState(false)

  // Persist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lang,
          theme,
          existingBasic,
          existingFixed,
          existingBonus,
          existingTaxMethod,
          offerings,
          activeOfferingId,
          sharedPtkp,
          enableBpjsKes,
          enableBpjsTk,
          includeCompanyPremiInTax,
          annualMultiplier,
          isPrivate,
        })
      )
    } catch {
      // Ignore storage quota errors
    }
  }, [
    lang,
    theme,
    existingBasic,
    existingFixed,
    existingBonus,
    existingTaxMethod,
    offerings,
    activeOfferingId,
    sharedPtkp,
    enableBpjsKes,
    enableBpjsTk,
    includeCompanyPremiInTax,
    annualMultiplier,
    isPrivate,
  ])

  const activeOffering = useMemo(() => {
    return offerings.find((o) => o.id === activeOfferingId) || offerings[0]
  }, [offerings, activeOfferingId])

  const updateActiveOffering = (field, value) => {
    setOfferings((prev) =>
      prev.map((o) => (o.id === activeOffering.id ? { ...o, [field]: value } : o))
    )
  }

  const addOfferingTab = () => {
    if (offerings.length >= 4) return
    const nextLetter = String.fromCharCode(65 + offerings.length)
    const newId = Date.now()
    const newOffer = {
      id: newId,
      name: `${lang === 'id' ? 'Penawaran' : 'Offer'} ${nextLetter}`,
      basic: activeOffering.basic,
      fixed: activeOffering.fixed,
      bonus: activeOffering.bonus,
      taxMethod: activeOffering.taxMethod,
    }
    setOfferings((prev) => [...prev, newOffer])
    setActiveOfferingId(newId)
  }

  const removeOfferingTab = (id, e) => {
    e.stopPropagation()
    if (offerings.length <= 1) return
    const remaining = offerings.filter((o) => o.id !== id)
    setOfferings(remaining)
    if (activeOfferingId === id) {
      setActiveOfferingId(remaining[0].id)
    }
  }

  // Primary Calculations
  const existingCalc = useMemo(
    () =>
      calculateSalary({
        basicSalary: existingBasic,
        fixedAllowance: existingFixed,
        annualBonus: existingBonus,
        ptkpCode: sharedPtkp,
        taxMethod: existingTaxMethod,
        includeBpjsCompanyInTax: includeCompanyPremiInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
        annualMonths: annualMultiplier,
      }),
    [
      existingBasic,
      existingFixed,
      existingBonus,
      sharedPtkp,
      existingTaxMethod,
      includeCompanyPremiInTax,
      enableBpjsKes,
      enableBpjsTk,
      annualMultiplier,
    ]
  )

  const offeringCalc = useMemo(
    () =>
      calculateSalary({
        basicSalary: activeOffering.basic,
        fixedAllowance: activeOffering.fixed,
        annualBonus: activeOffering.bonus,
        ptkpCode: sharedPtkp,
        taxMethod: activeOffering.taxMethod,
        includeBpjsCompanyInTax: includeCompanyPremiInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
        annualMonths: annualMultiplier,
      }),
    [
      activeOffering,
      sharedPtkp,
      includeCompanyPremiInTax,
      enableBpjsKes,
      enableBpjsTk,
      annualMultiplier,
    ]
  )

  // Deltas
  const deltaMonthlyNet = offeringCalc.monthly.netSalary - existingCalc.monthly.netSalary
  const deltaMonthlyGross = offeringCalc.monthly.cashGross - existingCalc.monthly.cashGross
  const deltaMonthlyNetPct =
    existingCalc.monthly.netSalary > 0
      ? (deltaMonthlyNet / existingCalc.monthly.netSalary) * 100
      : 0

  const deltaAnnualNet = offeringCalc.annual.netSalary - existingCalc.annual.netSalary
  const deltaAnnualGross = offeringCalc.annual.cashGross - existingCalc.annual.cashGross
  const deltaAnnualNetPct =
    existingCalc.annual.netSalary > 0
      ? (deltaAnnualNet / existingCalc.annual.netSalary) * 100
      : 0

  // Gross-to-Net Retention Waterfall Percentages
  const offeringRetentionPct =
    offeringCalc.monthly.cashGross > 0
      ? Math.min(
          100,
          Math.max(0, (offeringCalc.monthly.netSalary / offeringCalc.monthly.cashGross) * 100)
        )
      : 100

  // Reverse & Target Negotiation Calculations
  const reverseGrossBasic = useMemo(
    () =>
      findRequiredGrossForTargetNet({
        targetNet: targetDesiredNet,
        fixedAllowance: activeOffering.fixed,
        ptkpCode: sharedPtkp,
        taxMethod: activeOffering.taxMethod,
        includeBpjsCompanyInTax: includeCompanyPremiInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
      }),
    [
      targetDesiredNet,
      activeOffering.fixed,
      activeOffering.taxMethod,
      sharedPtkp,
      includeCompanyPremiInTax,
      enableBpjsKes,
      enableBpjsTk,
    ]
  )

  const targetGrossBasic =
    negotiateMode === 'percentage'
      ? Math.round(existingBasic * (1 + targetIncrementPct / 100))
      : reverseGrossBasic

  const targetSimulationCalc = useMemo(
    () =>
      calculateSalary({
        basicSalary: targetGrossBasic,
        fixedAllowance: activeOffering.fixed,
        annualBonus: activeOffering.bonus,
        ptkpCode: sharedPtkp,
        taxMethod: activeOffering.taxMethod,
        includeBpjsCompanyInTax: includeCompanyPremiInTax,
        enableBpjsKesehatan: enableBpjsKes,
        enableBpjsKetenagakerjaan: enableBpjsTk,
        annualMonths: annualMultiplier,
      }),
    [
      targetGrossBasic,
      activeOffering.fixed,
      activeOffering.bonus,
      activeOffering.taxMethod,
      sharedPtkp,
      includeCompanyPremiInTax,
      enableBpjsKes,
      enableBpjsTk,
      annualMultiplier,
    ]
  )

  const applyTargetGrossToOffering = () => {
    updateActiveOffering('basic', targetGrossBasic)
    setShowNegotiateModal(false)
  }

  // Sync default THR/Bonus simulator amount when main card figures change
  useEffect(() => {
    const isExisting = specialSlipTarget === 'existing'
    const baseBasic = isExisting ? existingBasic : activeOffering.basic
    const baseBonus = isExisting ? existingBonus : activeOffering.bonus
    setThrDisbursedAmount(baseBasic > 0 ? baseBasic : baseBonus)
  }, [
    specialSlipTarget,
    existingBasic,
    existingBonus,
    activeOffering.id,
    activeOffering.basic,
    activeOffering.bonus,
  ])

  // Special Payslips (THR & December Pasal 17 True-up)
  const bonusMonthSim = useMemo(() => {
    const isExisting = specialSlipTarget === 'existing'
    return calculateBonusMonthSimulation({
      basicSalary: isExisting ? existingBasic : activeOffering.basic,
      fixedAllowance: isExisting ? existingFixed : activeOffering.fixed,
      disbursedAmount: thrDisbursedAmount,
      ptkpCode: sharedPtkp,
      taxMethod: isExisting ? existingTaxMethod : activeOffering.taxMethod,
      includeBpjsCompanyInTax: includeCompanyPremiInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
    })
  }, [
    specialSlipTarget,
    existingBasic,
    existingFixed,
    existingTaxMethod,
    activeOffering,
    thrDisbursedAmount,
    sharedPtkp,
    includeCompanyPremiInTax,
    enableBpjsKes,
    enableBpjsTk,
  ])

  const decemberTrueUpSim = useMemo(() => {
    const isExisting = specialSlipTarget === 'existing'
    return calculateDecemberTrueUp({
      basicSalary: isExisting ? existingBasic : activeOffering.basic,
      fixedAllowance: isExisting ? existingFixed : activeOffering.fixed,
      annualBonus: isExisting ? existingBonus : activeOffering.bonus,
      disbursedAmount: thrDisbursedAmount,
      ptkpCode: sharedPtkp,
      taxMethod: isExisting ? existingTaxMethod : activeOffering.taxMethod,
      includeBpjsCompanyInTax: includeCompanyPremiInTax,
      enableBpjsKesehatan: enableBpjsKes,
      enableBpjsKetenagakerjaan: enableBpjsTk,
      annualMonths: annualMultiplier,
    })
  }, [
    specialSlipTarget,
    existingBasic,
    existingFixed,
    existingBonus,
    existingTaxMethod,
    activeOffering,
    thrDisbursedAmount,
    sharedPtkp,
    includeCompanyPremiInTax,
    enableBpjsKes,
    enableBpjsTk,
    annualMultiplier,
  ])

  // Reset Handlers
  const clearAllNumbersToZero = () => {
    setExistingBasic(0)
    setExistingFixed(0)
    setExistingBonus(0)
    setOfferings((prev) => prev.map((o) => ({ ...o, basic: 0, fixed: 0, bonus: 0 })))
    setShowResetModal(false)
  }

  const resetToDemoDefaults = () => {
    setExistingBasic(10000000)
    setExistingFixed(500000)
    setExistingBonus(5000000)
    setExistingTaxMethod('gross')
    setOfferings(DEFAULT_OFFERINGS)
    setActiveOfferingId(1)
    setSharedPtkp('TK/0')
    setEnableBpjsKes(true)
    setEnableBpjsTk(true)
    setIncludeCompanyPremiInTax(true)
    setAnnualMultiplier(13)
    setShowResetModal(false)
  }

  const handleCopySummary = () => {
    const signMonthly = deltaMonthlyNet >= 0 ? '+' : ''
    const signAnnual = deltaAnnualNet >= 0 ? '+' : ''
    const summaryText = [
      t('copySummaryTitle', { name: activeOffering.name }),
      t('copySummaryTaxScheme', {
        existingTax: existingTaxMethod.toUpperCase(),
        name: activeOffering.name,
        offeringTax: activeOffering.taxMethod.toUpperCase(),
      }),
      '',
      t('copySummaryMonthlyHeader'),
      t('copySummaryExistingMonthly', {
        gross: formatIDR(existingCalc.monthly.cashGross),
        net: formatIDR(existingCalc.monthly.netSalary),
      }),
      t('copySummaryOfferingMonthly', {
        name: activeOffering.name,
        gross: formatIDR(offeringCalc.monthly.cashGross),
        net: formatIDR(offeringCalc.monthly.netSalary),
      }),
      t('copySummaryDeltaMonthly', {
        sign: signMonthly,
        delta: formatIDR(deltaMonthlyNet),
        pct: `${signMonthly}${deltaMonthlyNetPct.toFixed(1)}`,
      }),
      '',
      t('copySummaryAnnualHeader', { multiplier: annualMultiplier }),
      t('copySummaryExistingAnnual', { net: formatIDR(existingCalc.annual.netSalary) }),
      t('copySummaryOfferingAnnual', {
        name: activeOffering.name,
        net: formatIDR(offeringCalc.annual.netSalary),
      }),
      t('copySummaryDeltaAnnual', {
        sign: signAnnual,
        delta: formatIDR(deltaAnnualNet),
      }),
      '',
      t('copySummaryFooter'),
    ].join('\n')

    navigator.clipboard.writeText(summaryText)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2000)
  }

  // Formatting Helpers
  const renderIDR = (amount) => (
    <span className={isPrivate ? 'privacy-blur' : ''}>{formatIDR(amount)}</span>
  )

  const renderDeltaBadge = (val, invertColor = false) => {
    if (val === 0) {
      return <span className="font-mono text-[11px] text-[var(--text-muted)]">Rp 0</span>
    }
    const isPositiveVal = val > 0
    const isGood = invertColor ? !isPositiveVal : isPositiveVal
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-sm font-mono text-[11px] font-bold tabular-nums border ${
          isGood
            ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] border-[var(--accent-primary)]/35'
            : 'bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger)] border-[var(--semantic-danger)]/35'
        }`}
      >
        {isPositiveVal ? '+' : ''}
        {renderIDR(val)}
      </span>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] pb-24 lg:pb-12 transition-colors duration-200">
      {/* =====================================================================
          1. TOP STATUTORY REGULATION TICKER (LOMBARD LEDGER TAPE)
      ===================================================================== */}
      <div className="bg-[#0D1F18] text-[#A7B8B0] border-b border-[#9A6B13]/40 text-[11px] font-mono tracking-wider py-1.5 px-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4ADE80]" />
            <span className="text-[#E5B85B] font-bold">STATUTORY LEDGER:</span>
            <span>PP 58/2023 &amp; PMK 168/2023 (TER PPh 21)</span>
            <span className="hidden md:inline text-white/25">•</span>
            <span className="hidden md:inline">PASAL 17 UU HPP</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-[#A7B8B0]">
            <span>BPJS KES CAP: Rp 12.000.000</span>
            <span className="text-white/25">|</span>
            <span>JP CAP: Rp 10.042.300</span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. STICKY EDITORIAL MASTHEAD
      ===================================================================== */}
      <header className="bg-[var(--bg-elevated)]/95 backdrop-blur-md border-b-2 border-[var(--border-strong)] sticky top-0 z-30 no-print transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Brand & Folio Stamp */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="bg-[#0D1F18] p-2.5 rounded-sm border border-[#9A6B13] text-[#E5B85B] shrink-0 shadow-[0_2px_0_0_var(--shadow-ledger)]">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="folio-stamp text-[var(--accent-secondary)]">
                    FOLIO N° 01 // EXECUTIVE COMPENSATION DOSSIER
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-display font-bold text-[var(--text-primary)] tracking-tight truncate">
                  {t('appTitle')}
                </h1>
              </div>
            </div>

            {/* Masthead Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language Switcher */}
              <div
                className="flex items-center bg-[var(--bg-secondary)] p-0.5 rounded-sm border border-[var(--border-hairline)]"
                title={t('langToggleTitle')}
              >
                <button
                  type="button"
                  onClick={() => setLang('id')}
                  className={`px-2 py-1 rounded-sm text-[11px] font-mono font-bold transition-all ${
                    lang === 'id'
                      ? 'bg-[var(--accent-primary-solid)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 rounded-sm text-[11px] font-mono font-bold transition-all ${
                    lang === 'en'
                      ? 'bg-[var(--accent-primary-solid)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Dark / Light Mode Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === 'dark' ? t('themeTitleToLight') : t('themeTitleToDark')}
                className={`inline-flex items-center px-2.5 py-1.5 text-xs font-mono font-bold rounded-sm border transition-all ${
                  theme === 'dark'
                    ? 'bg-[var(--accent-secondary-soft)] border-[var(--accent-secondary)] text-[var(--accent-secondary)]'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 sm:mr-1.5" />
                ) : (
                  <Moon className="w-4 h-4 sm:mr-1.5" />
                )}
                <span className="hidden md:inline">
                  {theme === 'dark' ? t('themeLight') : t('themeDark')}
                </span>
              </button>

              {/* Privacy Blur Toggle */}
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                title={isPrivate ? t('privacyTitleOn') : t('privacyTitleOff')}
                className={`inline-flex items-center px-2.5 py-1.5 text-xs font-mono font-bold rounded-sm border transition-all ${
                  isPrivate
                    ? 'bg-[var(--accent-primary-soft)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {isPrivate ? (
                  <EyeOff className="w-4 h-4 sm:mr-1.5" />
                ) : (
                  <Eye className="w-4 h-4 sm:mr-1.5" />
                )}
                <span className="hidden md:inline">
                  {isPrivate ? t('privacyActive') : t('privacyInactive')}
                </span>
              </button>

              {/* PDF Print */}
              <button
                type="button"
                onClick={() => window.print()}
                title={t('pdfTitle')}
                className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-mono font-bold text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded-sm hover:bg-[var(--bg-secondary)] transition-all"
              >
                <Printer className="w-4 h-4 lg:mr-1.5" />
                <span className="hidden lg:inline">{t('pdf')}</span>
              </button>

              {/* Copy Summary */}
              <button
                type="button"
                onClick={handleCopySummary}
                title={t('copyTitle')}
                className={`inline-flex items-center px-2.5 py-1.5 text-xs font-mono font-bold rounded-sm border transition-all ${
                  copiedSummary
                    ? 'bg-[var(--accent-primary-soft)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 sm:mr-1 text-[var(--accent-primary)]" />
                    <span className="hidden sm:inline">{t('copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">{t('copy')}</span>
                  </>
                )}
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                title={t('resetTitle')}
                className="inline-flex items-center px-2 py-1.5 text-xs font-mono font-bold text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded-sm hover:bg-[var(--bg-secondary)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Statutory Options Drawer Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                title={t('optionsTitle')}
                className={`inline-flex items-center px-2.5 py-1.5 text-xs font-mono font-bold rounded-sm border transition-all ${
                  showAdvanced
                    ? 'bg-[var(--accent-primary-solid)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Sliders className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">{t('options')}</span>
                {showAdvanced ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-1" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Statutory Parameters Drawer */}
          {showAdvanced && (
            <div className="mt-3 pt-3 border-t border-dashed border-[var(--border-hairline)] grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-primary)] p-4 rounded-sm animate-fadeIn">
              {/* BPJS Components */}
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--accent-primary)]">
                  {t('bpjsComponentTitle')}
                </div>
                <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBpjsKes}
                    onChange={(e) => setEnableBpjsKes(e.target.checked)}
                    className="rounded-sm accent-[#0B5D3F]"
                  />
                  <span>{t('bpjsKesLabel')}</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBpjsTk}
                    onChange={(e) => setEnableBpjsTk(e.target.checked)}
                    className="rounded-sm accent-[#0B5D3F]"
                  />
                  <span>{t('bpjsTkLabel')}</span>
                </label>
              </div>

              {/* Tax Base Config */}
              <div className="space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--accent-primary)]">
                  {t('taxBaseTitle')}
                </div>
                <label className="flex items-start gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCompanyPremiInTax}
                    onChange={(e) => setIncludeCompanyPremiInTax(e.target.checked)}
                    className="mt-0.5 rounded-sm accent-[#0B5D3F]"
                  />
                  <span>{t('taxBaseLabel')}</span>
                </label>
                <p className="text-[11px] text-[var(--text-muted)]">{t('taxBaseNote')}</p>
              </div>

              {/* Annual Multiplier */}
              <div className="space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--accent-secondary)]">
                  {t('multiplierTitle')}
                </div>
                <div className="flex gap-1.5">
                  {[12, 13, 14, 15].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setAnnualMultiplier(m)}
                      className={`px-3 py-1 rounded-sm font-mono text-xs font-bold border transition-all ${
                        annualMultiplier === m
                          ? 'bg-[var(--accent-primary-solid)] text-white border-[var(--accent-primary)]'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">{t('multiplierNote')}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================================
          MAIN BROADSHEET WORKSPACE
      ===================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* ===================================================================
            3. CENTRAL BANK VAULT HERO (EXECUTIVE COMPENSATION VERDICT)
        =================================================================== */}
        <section className="rounded-sm overflow-hidden border-2 border-[var(--border-strong)] shadow-[0_6px_0_0_var(--shadow-ledger)] bg-[#0D1F18] text-[#F5EFE4]">
          {/* Vault Classification Strip */}
          <div className="bg-[#081510] px-5 sm:px-7 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-[0.15em] font-bold bg-[#9A6B13]/25 text-[#E5B85B] border border-[#9A6B13]/50">
                EXECUTIVE VERDICT // {activeOffering.name.toUpperCase()}
              </span>
              <span className="text-[11px] font-mono text-[#A7B8B0]">
                PTKP {sharedPtkp} • TER {offeringCalc.terCategory} ({offeringCalc.terPercentage}%)
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#A7B8B0]">
              CTC / EMPLOYER COST:{' '}
              <strong className="text-[#E5B85B] tabular-nums">
                {renderIDR(offeringCalc.monthly.totalEmployerCost)}
              </strong>
              {t('perMonth')}
            </div>
          </div>

          {/* Asymmetric 12-Col Vault Grid */}
          <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* LEFT 7 COLS: Monumental Delta & Gross-to-Net Retention Waterfall */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#A7B8B0] mb-1">
                  {t('heroTitle')}
                </div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2
                    className={`text-3xl sm:text-5xl font-mono font-bold tracking-tight tabular-nums ${
                      deltaMonthlyNet >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
                    }`}
                  >
                    {deltaMonthlyNet >= 0 ? '+' : ''}
                    {renderIDR(deltaMonthlyNet)}
                    <span className="text-base sm:text-lg font-normal text-[#A7B8B0] ml-1">
                      {t('perMonth')}
                    </span>
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-mono font-bold border tabular-nums ${
                      deltaMonthlyNet >= 0
                        ? 'bg-[#0B5D3F]/40 text-[#4ADE80] border-[#4ADE80]/40'
                        : 'bg-[#B42318]/40 text-[#F87171] border-[#F87171]/40'
                    }`}
                  >
                    {deltaMonthlyNet >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 mr-1" />
                    )}
                    {deltaMonthlyNet >= 0 ? '+' : ''}
                    {deltaMonthlyNetPct.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Live Gross-to-Net Retention Waterfall Bar */}
              <div className="bg-black/25 p-3.5 rounded-sm border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#A7B8B0] uppercase tracking-wider">
                    RASIO RETENSI GAJI BERSIH ({activeOffering.name.toUpperCase()})
                  </span>
                  <span className="text-[#E5B85B] font-bold tabular-nums">
                    {offeringRetentionPct.toFixed(1)}% THP •{' '}
                    {(100 - offeringRetentionPct).toFixed(1)}% Pajak &amp; BPJS
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-sm overflow-hidden flex">
                  <div
                    style={{ width: `${offeringRetentionPct}%` }}
                    className="bg-[#4ADE80] h-full transition-all duration-300"
                  />
                  <div
                    style={{ width: `${Math.max(0, 100 - offeringRetentionPct)}%` }}
                    className="bg-[#E5B85B] h-full transition-all duration-300"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#A7B8B0] pt-0.5">
                  <span>
                    {t('heroAnnualNote', { multiplier: annualMultiplier })}{' '}
                    <strong
                      className={`tabular-nums ${
                        deltaAnnualNet >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
                      }`}
                    >
                      {deltaAnnualNet >= 0 ? '+' : ''}
                      {renderIDR(deltaAnnualNet)}
                      {t('perYear')}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLS: Side-by-Side Perforated Voucher Stubs */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Current Baseline Voucher */}
              <div className="bg-white/5 border border-white/15 rounded-sm p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#A7B8B0] mb-1">
                    {t('currentSalary')} (THP)
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-bold text-white tabular-nums">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] font-mono text-[#A7B8B0] flex justify-between">
                  <span>Bruto:</span>
                  <span className="text-white tabular-nums">
                    {renderIDR(existingCalc.monthly.cashGross)}
                  </span>
                </div>
              </div>

              {/* Active Offering Voucher */}
              <div className="bg-[#0B5D3F]/35 border border-[#4ADE80]/40 rounded-sm p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#E5B85B] font-bold">
                      {activeOffering.name} (THP)
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4ADE80]" />
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-bold text-[#4ADE80] tabular-nums">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/15 text-[11px] font-mono text-[#A7B8B0] flex justify-between">
                  <span>Bruto:</span>
                  <span className="text-[#E5B85B] font-bold tabular-nums">
                    {renderIDR(offeringCalc.monthly.cashGross)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. UNIFIED DOSSIER CONTROL BAR (OFFER TABS, MODALS, PTKP SELECTOR)
        =================================================================== */}
        <section className="bg-[var(--bg-elevated)] rounded-sm border border-[var(--border-strong)] p-4 shadow-[0_3px_0_0_var(--shadow-ledger)] space-y-4 no-print">
          {/* Top Row: Offer Scenarios & Quick Advisory Tools */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-3.5">
            {/* Multi-Offer Tabs */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-[11px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mr-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                {t('offeringsLabel')}
              </span>

              {offerings.map((offer) => {
                const isActive = offer.id === activeOffering.id
                return (
                  <div
                    key={offer.id}
                    onClick={() => setActiveOfferingId(offer.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--accent-primary-solid)] border-[var(--accent-primary)] text-white shadow-sm'
                        : 'bg-[var(--bg-primary)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <span>{offer.name}</span>
                    {offerings.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => removeOfferingTab(offer.id, e)}
                        title={t('deleteOffering')}
                        className="p-0.5 rounded-sm hover:bg-white/20"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )
              })}

              {offerings.length < 4 && (
                <button
                  type="button"
                  onClick={addOfferingTab}
                  title={t('addOffering')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-dashed border-[var(--accent-secondary)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-soft)] text-xs font-mono font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addOffering')}</span>
                </button>
              )}
            </div>

            {/* Right: Negotiation & Special Slips Modal Triggers */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowNegotiateModal(true)}
                title={t('negotiationToolDesc')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider font-bold bg-[var(--accent-primary-solid)] text-white hover:bg-[var(--accent-primary-hover)] border border-[var(--accent-primary)]/40 shadow-[0_2px_0_0_var(--shadow-ledger)] transition-all"
              >
                <Target className="w-3.5 h-3.5" />
                <span>{t('negotiationTool')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSpecialSlipTarget('offering')
                  setThrDisbursedAmount(activeOffering.basic)
                  setShowSpecialSlipsModal(true)
                }}
                title={t('specialSlipsDesc')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider font-bold bg-[var(--accent-secondary-soft)] text-[var(--accent-secondary)] hover:opacity-90 border border-[var(--accent-secondary)]/40 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{t('specialSlips')}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Global PTKP Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              <div>
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--text-primary)]">
                  {t('ptkpLabel')}
                </span>
                <span className="hidden sm:inline text-xs font-mono text-[var(--accent-primary)] font-bold ml-2">
                  [
                  {t('ptkpEffectiveRate', {
                    cat: offeringCalc.terCategory,
                    rate: offeringCalc.terPercentage,
                  })}
                  ]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {PTKP_LIST.map((p) => {
                const active = sharedPtkp === p.code
                return (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => setSharedPtkp(p.code)}
                    title={p.label}
                    className={`py-1.5 px-2.5 rounded-sm border text-center transition-all ${
                      active
                        ? 'bg-[var(--accent-primary-solid)] border-[var(--accent-primary)] text-white font-bold shadow-sm'
                        : 'bg-[var(--bg-primary)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="text-xs font-mono">{p.code}</div>
                    <div
                      className={`text-[9px] font-mono ${
                        active ? 'text-[#E5B85B]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      TER {p.category}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mobile Segmented Card Filter */}
        <div className="flex lg:hidden bg-[var(--bg-secondary)] p-1 rounded-sm border border-[var(--border-hairline)] no-print">
          {[
            { id: 'both', label: t('mobileFilterBoth') },
            { id: 'existing', label: t('mobileFilterExisting') },
            { id: 'offering', label: activeOffering.name },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileInputView(tab.id)}
              className={`flex-1 py-1.5 text-xs font-mono uppercase font-bold rounded-sm transition-all ${
                mobileInputView === tab.id
                  ? 'bg-[var(--accent-primary-solid)] text-white'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===================================================================
            5. SIDE-BY-SIDE TACTILE PAYSLIP VOUCHER CARDS
        =================================================================== */}
        <section id="section-inputs" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* =================================================================
              SCHEDULE I: EXISTING SALARY VOUCHER
          ================================================================= */}
          <div
            className={`bg-[var(--bg-elevated)] rounded-sm border border-[var(--border-strong)] shadow-[0_3px_0_0_var(--shadow-ledger)] overflow-hidden flex flex-col justify-between ${
              mobileInputView === 'offering' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="bg-[var(--bg-secondary)] px-5 py-4 border-b border-[var(--border-strong)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[var(--text-secondary)]" />
                  <div>
                    <div className="folio-stamp text-[var(--text-muted)]">
                      SCHEDULE I // BASELINE VOUCHER
                    </div>
                    <h2 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">
                      {t('existingCardTitle')}
                    </h2>
                  </div>
                </div>

                {/* Tax Scheme Selector + Clear Button */}
                <div className="flex items-center gap-1.5 no-print">
                  <div className="flex bg-[var(--bg-primary)] p-0.5 rounded-sm border border-[var(--border-hairline)]">
                    {[
                      { id: 'gross', label: 'Gross' },
                      { id: 'gross_up', label: 'Gross-Up' },
                      { id: 'nett', label: 'Nett' },
                    ].map((scheme) => (
                      <button
                        key={scheme.id}
                        type="button"
                        onClick={() => setExistingTaxMethod(scheme.id)}
                        className={`px-2 py-1 rounded-sm font-mono text-[10px] font-bold uppercase transition-all ${
                          existingTaxMethod === scheme.id
                            ? 'bg-[var(--accent-primary-solid)] text-white'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {scheme.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setExistingBasic(0)
                      setExistingFixed(0)
                      setExistingBonus(0)
                    }}
                    title={t('clearCardTitle')}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--semantic-danger)] rounded-sm border border-transparent hover:border-[var(--border-hairline)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inputs */}
              <div className="p-5 space-y-4">
                <CurrencyInput
                  label={t('basicSalaryLabel')}
                  badge={t('basicSalaryBadge')}
                  value={existingBasic}
                  onChange={setExistingBasic}
                  isPrivate={isPrivate}
                />
                <CurrencyInput
                  label={t('fixedAllowanceLabel')}
                  badge={t('fixedAllowanceBadge')}
                  value={existingFixed}
                  onChange={setExistingFixed}
                  isPrivate={isPrivate}
                />
                <CurrencyInput
                  label={t('bonusLabel')}
                  badge={t('bonusBadge')}
                  subtitle={t('bonusSubtitle')}
                  value={existingBonus}
                  onChange={setExistingBonus}
                  isPrivate={isPrivate}
                />
              </div>
            </div>

            {/* Perforated Tear-Off Net Pay Stub */}
            <div>
              <div className="payslip-perforation" />
              <div className="bg-[var(--bg-secondary)]/85 px-5 py-4 space-y-2">
                <div className="flex justify-between text-xs font-mono text-[var(--text-secondary)]">
                  <span>{t('monthlyGrossSub')}</span>
                  <span className="font-bold text-[var(--text-primary)] tabular-nums">
                    {renderIDR(existingCalc.monthly.cashGross)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-mono text-[var(--semantic-danger)]">
                  <span>
                    {t('deductionsSub')} (TER {existingCalc.terPercentage}%)
                  </span>
                  <span className="font-bold tabular-nums">
                    -{renderIDR(existingCalc.monthly.totalDeductions)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-t border-[var(--border-strong)] pt-2.5">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--text-primary)]">
                    {t('monthlyNetSub')}
                  </span>
                  <span className="font-mono text-xl font-bold text-[var(--text-primary)] tabular-nums">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)] pt-0.5">
                  <span>{t('annualNetSub')}</span>
                  <span className="font-bold text-[var(--text-secondary)] tabular-nums">
                    {renderIDR(existingCalc.annual.netSalary)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              SCHEDULE II: PROPOSED OFFERING VOUCHER
          ================================================================= */}
          <div
            className={`bg-[var(--bg-elevated)] rounded-sm border-2 border-[var(--accent-primary)] shadow-[0_3px_0_0_var(--accent-primary-solid)] overflow-hidden flex flex-col justify-between ${
              mobileInputView === 'existing' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="bg-[var(--accent-primary-soft)] px-5 py-4 border-b border-[var(--accent-primary)]/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Briefcase className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <div className="min-w-0">
                    <div className="folio-stamp text-[var(--accent-primary)]">
                      SCHEDULE II // OFFERING VOUCHER
                    </div>
                    <input
                      type="text"
                      value={activeOffering.name}
                      onChange={(e) => updateActiveOffering('name', e.target.value)}
                      className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] bg-transparent border-b border-transparent hover:border-[var(--accent-primary)] focus:border-[var(--accent-primary)] focus:outline-none truncate w-full"
                    />
                  </div>
                </div>

                {/* Tax Scheme Selector + Clear Button */}
                <div className="flex items-center gap-1.5 no-print shrink-0">
                  <div className="flex bg-[var(--bg-primary)] p-0.5 rounded-sm border border-[var(--border-hairline)]">
                    {[
                      { id: 'gross', label: 'Gross' },
                      { id: 'gross_up', label: 'Gross-Up' },
                      { id: 'nett', label: 'Nett' },
                    ].map((scheme) => (
                      <button
                        key={scheme.id}
                        type="button"
                        onClick={() => updateActiveOffering('taxMethod', scheme.id)}
                        className={`px-2 py-1 rounded-sm font-mono text-[10px] font-bold uppercase transition-all ${
                          activeOffering.taxMethod === scheme.id
                            ? 'bg-[var(--accent-primary-solid)] text-white'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {scheme.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateActiveOffering('basic', 0)
                      updateActiveOffering('fixed', 0)
                      updateActiveOffering('bonus', 0)
                    }}
                    title={t('clearCardTitle')}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--semantic-danger)] rounded-sm border border-transparent hover:border-[var(--border-hairline)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inputs */}
              <div className="p-5 space-y-4">
                <CurrencyInput
                  label={t('offeringBasicLabel')}
                  badge={t('basicSalaryBadge')}
                  value={activeOffering.basic}
                  onChange={(v) => updateActiveOffering('basic', v)}
                  highlight
                  isPrivate={isPrivate}
                />
                <CurrencyInput
                  label={t('fixedAllowanceLabel')}
                  badge={t('fixedAllowanceBadge')}
                  value={activeOffering.fixed}
                  onChange={(v) => updateActiveOffering('fixed', v)}
                  isPrivate={isPrivate}
                />
                <CurrencyInput
                  label={t('bonusLabel')}
                  badge={t('bonusBadge')}
                  subtitle={t('bonusSubtitle')}
                  value={activeOffering.bonus}
                  onChange={(v) => updateActiveOffering('bonus', v)}
                  isPrivate={isPrivate}
                />
              </div>
            </div>

            {/* Perforated Tear-Off Net Pay Stub */}
            <div>
              <div className="payslip-perforation" />
              <div className="bg-[var(--accent-primary-soft)] px-5 py-4 space-y-2">
                <div className="flex justify-between text-xs font-mono text-[var(--text-secondary)]">
                  <span>{t('monthlyGrossSub')}</span>
                  <span className="font-bold text-[var(--text-primary)] tabular-nums">
                    {renderIDR(offeringCalc.monthly.cashGross)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-mono text-[var(--semantic-danger)]">
                  <span>
                    {t('deductionsSub')} (TER {offeringCalc.terPercentage}%)
                  </span>
                  <span className="font-bold tabular-nums">
                    -{renderIDR(offeringCalc.monthly.totalDeductions)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-t border-[var(--accent-primary)]/40 pt-2.5">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--accent-primary)]">
                    {t('monthlyNetSub')}
                  </span>
                  <span className="font-mono text-xl font-bold text-[var(--accent-primary)] tabular-nums">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[var(--text-secondary)] pt-0.5">
                  <span>{t('annualNetSub')}</span>
                  <span className="font-bold text-[var(--accent-secondary)] tabular-nums">
                    {renderIDR(offeringCalc.annual.netSalary)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            6. DETAILED PAYSLIP & ANNUAL BREAKDOWN AUDIT MATRIX
        =================================================================== */}
        <ComparisonAuditMatrix
          t={t}
          tablePeriod={tablePeriod}
          setTablePeriod={setTablePeriod}
          existingCalc={existingCalc}
          offeringCalc={offeringCalc}
          activeOffering={activeOffering}
          existingTaxMethod={existingTaxMethod}
          annualMultiplier={annualMultiplier}
          deltaMonthlyGross={deltaMonthlyGross}
          deltaMonthlyNet={deltaMonthlyNet}
          deltaMonthlyNetPct={deltaMonthlyNetPct}
          deltaAnnualGross={deltaAnnualGross}
          deltaAnnualNet={deltaAnnualNet}
          deltaAnnualNetPct={deltaAnnualNetPct}
          renderIDR={renderIDR}
          renderDeltaBadge={renderDeltaBadge}
        />
      </main>

      {/* =====================================================================
           EDITORIAL FOOTER
      ===================================================================== */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[var(--border-hairline)] text-center text-xs font-mono text-[var(--text-muted)] w-full">
        {t('footerText')}
      </footer>

      {/* =====================================================================
          MODALS (NEGOTIATION, THR/DECEMBER SLIPS, RESET)
      ===================================================================== */}
      <SalaryModals
        t={t}
        renderIDR={renderIDR}
        isPrivate={isPrivate}
        sharedPtkp={sharedPtkp}
        activeOffering={activeOffering}
        showNegotiateModal={showNegotiateModal}
        setShowNegotiateModal={setShowNegotiateModal}
        negotiateMode={negotiateMode}
        setNegotiateMode={setNegotiateMode}
        targetIncrementPct={targetIncrementPct}
        setTargetIncrementPct={setTargetIncrementPct}
        targetDesiredNet={targetDesiredNet}
        setTargetDesiredNet={setTargetDesiredNet}
        reverseGrossBasic={reverseGrossBasic}
        targetGrossBasic={targetGrossBasic}
        targetSimulationCalc={targetSimulationCalc}
        applyTargetGrossToOffering={applyTargetGrossToOffering}
        showSpecialSlipsModal={showSpecialSlipsModal}
        setShowSpecialSlipsModal={setShowSpecialSlipsModal}
        specialSlipTarget={specialSlipTarget}
        setSpecialSlipTarget={setSpecialSlipTarget}
        thrDisbursedAmount={thrDisbursedAmount}
        setThrDisbursedAmount={setThrDisbursedAmount}
        existingBasic={existingBasic}
        existingFixed={existingFixed}
        existingBonus={existingBonus}
        annualMultiplier={annualMultiplier}
        bonusMonthSim={bonusMonthSim}
        decemberTrueUpSim={decemberTrueUpSim}
        showResetModal={showResetModal}
        setShowResetModal={setShowResetModal}
        resetToDemoDefaults={resetToDemoDefaults}
        clearAllNumbersToZero={clearAllNumbersToZero}
      />

      {/* =====================================================================
          MOBILE BOTTOM NAVIGATION DOCK
      ===================================================================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1F18] border-t-2 border-[#9A6B13] px-3 py-2 flex items-center justify-around text-[#F5EFE4] no-print">
        <button
          type="button"
          onClick={() => setShowNegotiateModal(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-[#E5B85B]"
        >
          <Target className="w-4 h-4" />
          <span>{t('mobileTabNegotiate')}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowSpecialSlipsModal(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-[#A7B8B0] hover:text-white"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{t('mobileTabSlips')}</span>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-[#A7B8B0] hover:text-white"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#E5B85B]" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          <span>{theme === 'dark' ? t('themeLight') : t('themeDark')}</span>
        </button>
        <button
          type="button"
          onClick={handleCopySummary}
          className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-[#A7B8B0] hover:text-white"
        >
          {copiedSummary ? (
            <Check className="w-4 h-4 text-[#4ADE80]" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copiedSummary ? t('copied') : t('copy')}</span>
        </button>
        <button
          type="button"
          onClick={() => setIsPrivate(!isPrivate)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-[#A7B8B0] hover:text-white"
        >
          {isPrivate ? (
            <EyeOff className="w-4 h-4 text-[#4ADE80]" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          <span>{isPrivate ? t('privacyActive') : t('privacyInactive')}</span>
        </button>
      </nav>
    </div>
  )
}

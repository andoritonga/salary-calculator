import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Building2,
  Briefcase,
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
  ShieldCheck,
  Sun,
  Moon,
  Info,
  AlertCircle,
} from 'lucide-react'
import {
  PTKP_LIST,
  MAX_SAFE_CURRENCY,
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
const LEGACY_STORAGE_KEYS = [
  'salary_calc_state_v1',
  'salary_calc_state_v2',
  'salary_calc_state_v3',
  'salary_calc_state_v4',
]
const VALID_TAX_METHODS = new Set(['gross', 'gross_up', 'nett'])
const VALID_LANGS = new Set(['id', 'en'])
const VALID_THEMES = new Set(['light', 'dark'])
const VALID_MULTIPLIERS = new Set([12, 13, 14, 15])
const VALID_PTKP_CODES = new Set(PTKP_LIST.map((p) => p.code))
const MAX_OFFERING_NAME_LEN = 40

const DEFAULT_OFFERINGS = [
  { id: 1, name: 'Penawaran A', basic: 13000000, fixed: 1000000, bonus: 13000000, taxMethod: 'gross' },
]

function getDefaultTheme() {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function sanitizeCurrency(val, fallback) {
  if (typeof val !== 'number' || !Number.isFinite(val) || val < 0) return fallback
  return Math.min(MAX_SAFE_CURRENCY, Math.trunc(val))
}

function sanitizeSavedState(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const lang = VALID_LANGS.has(raw.lang) ? raw.lang : 'id'
  const theme = VALID_THEMES.has(raw.theme) ? raw.theme : getDefaultTheme()
  const existingBasic = sanitizeCurrency(raw.existingBasic, 10000000)
  const existingFixed = sanitizeCurrency(raw.existingFixed, 500000)
  const existingBonus = sanitizeCurrency(raw.existingBonus, 5000000)
  const existingTaxMethod = VALID_TAX_METHODS.has(raw.existingTaxMethod)
    ? raw.existingTaxMethod
    : 'gross'

  let offerings = DEFAULT_OFFERINGS
  if (Array.isArray(raw.offerings) && raw.offerings.length > 0) {
    const cleaned = raw.offerings
      .slice(0, 4)
      .filter((o) => o && typeof o === 'object' && !Array.isArray(o))
      .map((o, idx) => ({
        id:
          typeof o.id === 'number' && Number.isSafeInteger(o.id) && o.id > 0
            ? o.id
            : idx + 1,
        name:
          typeof o.name === 'string' && o.name.trim().length > 0
            ? o.name.slice(0, MAX_OFFERING_NAME_LEN)
            : `${lang === 'id' ? 'Penawaran' : 'Offer'} ${String.fromCharCode(65 + idx)}`,
        basic: sanitizeCurrency(o.basic, 13000000),
        fixed: sanitizeCurrency(o.fixed, 1000000),
        bonus: sanitizeCurrency(o.bonus, 13000000),
        taxMethod: VALID_TAX_METHODS.has(o.taxMethod) ? o.taxMethod : 'gross',
      }))
    if (cleaned.length > 0) {
      offerings = cleaned
    }
  }

  const activeOfferingId = offerings.some((o) => o.id === raw.activeOfferingId)
    ? raw.activeOfferingId
    : offerings[0].id

  const sharedPtkp = VALID_PTKP_CODES.has(raw.sharedPtkp) ? raw.sharedPtkp : 'TK/0'
  const enableBpjsKes = typeof raw.enableBpjsKes === 'boolean' ? raw.enableBpjsKes : true
  const enableBpjsTk = typeof raw.enableBpjsTk === 'boolean' ? raw.enableBpjsTk : true
  const includeCompanyPremiInTax =
    typeof raw.includeCompanyPremiInTax === 'boolean' ? raw.includeCompanyPremiInTax : true
  const annualMultiplier = VALID_MULTIPLIERS.has(raw.annualMultiplier)
    ? raw.annualMultiplier
    : 13
  const isPrivate = typeof raw.isPrivate === 'boolean' ? raw.isPrivate : false
  const isDemoData = typeof raw.isDemoData === 'boolean' ? raw.isDemoData : false

  return {
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
    isDemoData,
  }
}

export default function App() {
  const existingBasicInputRef = useRef(null)

  const [savedState] = useState(() => {
    try {
      LEGACY_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k))
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? sanitizeSavedState(JSON.parse(raw)) : null
    } catch {
      return null
    }
  })

  // Language ('id' | 'en') & Theme ('light' | 'dark')
  const [lang, setLang] = useState(savedState?.lang ?? 'id')
  const [theme, setTheme] = useState(savedState?.theme ?? getDefaultTheme())
  const [isDemoData, setIsDemoData] = useState(savedState ? savedState.isDemoData : true)

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
  const [copyStatus, setCopyStatus] = useState('idle') // 'idle' | 'copied' | 'error'

  // Modals
  const [showNegotiateModal, setShowNegotiateModal] = useState(false)
  const [negotiateMode, setNegotiateMode] = useState('percentage') // 'percentage' | 'reverse'
  const [targetIncrementPct, setTargetIncrementPct] = useState(25)
  const [targetDesiredNet, setTargetDesiredNet] = useState(15000000)

  const [showSpecialSlipsModal, setShowSpecialSlipsModal] = useState(false)
  const [specialSlipTarget, setSpecialSlipTarget] = useState('offering') // 'existing' | 'offering'
  const [thrDisbursedAmount, setThrDisbursedAmount] = useState(13000000)

  const [showResetModal, setShowResetModal] = useState(false)

  // Sync theme attribute, document title, and theme-color meta tag
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = lang
    document.title = t('appTitle')
    const metaTheme = document.getElementById('meta-theme-color')
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#090d16' : '#f1f5f9')
    }
  }, [theme, lang])

  // Persist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lang,
          theme,
          isDemoData,
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
    isDemoData,
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
    return offerings.find((o) => o.id === activeOfferingId) || offerings[0] || DEFAULT_OFFERINGS[0]
  }, [offerings, activeOfferingId])

  const updateActiveOffering = (field, value) => {
    setIsDemoData(false)
    setOfferings((prev) =>
      prev.map((o) => (o.id === activeOffering.id ? { ...o, [field]: value } : o))
    )
  }

  const addOfferingTab = () => {
    if (offerings.length >= 4) return
    setIsDemoData(false)
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

  const removeOfferingTab = (id) => {
    if (offerings.length <= 1) return
    setIsDemoData(false)
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

  // Deltas & Empty Check
  const isAllEmpty =
    existingCalc.monthly.cashGross === 0 &&
    offeringCalc.monthly.cashGross === 0 &&
    existingCalc.annual.bonus === 0 &&
    offeringCalc.annual.bonus === 0

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

  // Gross-to-Net Retention Ratio (0 when no offered monthly gross)
  const offeringRetentionPct =
    offeringCalc.monthly.cashGross > 0
      ? Math.min(
          100,
          Math.max(0, (offeringCalc.monthly.netSalary / offeringCalc.monthly.cashGross) * 100)
        )
      : 0

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
    setIsDemoData(false)
    setExistingBasic(0)
    setExistingFixed(0)
    setExistingBonus(0)
    setOfferings((prev) => prev.map((o) => ({ ...o, basic: 0, fixed: 0, bonus: 0 })))
    setShowResetModal(false)
  }

  const resetToDemoDefaults = () => {
    setIsDemoData(true)
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

  const handleCopySummary = async () => {
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

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }
      await navigator.clipboard.writeText(summaryText)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      setCopyStatus('error')
    }
  }

  // Formatting Helpers
  const renderIDR = (amount) => (
    <span className={isPrivate ? 'privacy-blur' : ''}>{formatIDR(amount)}</span>
  )

  const renderDeltaBadge = (val, invertColor = false) => {
    if (val === 0) {
      return <span className="text-xs font-medium text-[var(--text-muted)] tabular-nums">Rp 0</span>
    }
    const isPositiveVal = val > 0
    const isGood = invertColor ? !isPositiveVal : isPositiveVal
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold tabular-nums border ${
          isGood
            ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] border-[var(--accent-border)]'
            : 'bg-[var(--danger-surface)] text-[var(--danger-text)] border-[var(--danger-border)]'
        }`}
      >
        {isPositiveVal ? '+' : ''}
        {renderIDR(val)}
      </span>
    )
  }

  return (
    <div className="min-h-screen flex flex-col text-[var(--text-primary)] pb-28 lg:pb-12">
      {/* =====================================================================
          1. STICKY HEADER BAR (Single backdrop-filter surface)
      ===================================================================== */}
      <header className="header-bar sticky top-0 z-30 no-print pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Brand Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-[var(--bg-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--accent-text)] shrink-0">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] tracking-tight truncate">
                  {t('appTitle')}
                </h1>
                <p className="text-xs text-[var(--text-muted)] truncate hidden sm:block">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>

            {/* Action Controls (all >= 44px touch targets) */}
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
              {/* Language Switcher */}
              <div
                role="group"
                aria-label={t('langToggleAria')}
                className="inline-flex items-center bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl p-0.5"
                title={t('langToggleTitle')}
              >
                <button
                  type="button"
                  aria-pressed={lang === 'id'}
                  onClick={() => setLang('id')}
                  className={`min-h-[44px] min-w-[44px] px-2.5 rounded-lg text-xs font-bold transition-colors ${
                    lang === 'id'
                      ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  ID
                </button>
                <button
                  type="button"
                  aria-pressed={lang === 'en'}
                  onClick={() => setLang('en')}
                  className={`min-h-[44px] min-w-[44px] px-2.5 rounded-lg text-xs font-bold transition-colors ${
                    lang === 'en'
                      ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Theme Toggle (Light / Dark) */}
              <button
                type="button"
                aria-pressed={theme === 'dark'}
                aria-label={theme === 'dark' ? t('themeToggleAriaToLight') : t('themeToggleAriaToDark')}
                title={theme === 'dark' ? t('themeToggleAriaToLight') : t('themeToggleAriaToDark')}
                onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-xs font-semibold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 xl:mr-1.5" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4 xl:mr-1.5" aria-hidden="true" />
                )}
                <span className="hidden xl:inline">
                  {theme === 'dark' ? t('themeLight') : t('themeDark')}
                </span>
              </button>

              {/* Privacy Blur Toggle */}
              <button
                type="button"
                aria-pressed={isPrivate}
                aria-label={isPrivate ? t('privacyTitleOn') : t('privacyTitleOff')}
                title={isPrivate ? t('privacyTitleOn') : t('privacyTitleOff')}
                onClick={() => setIsPrivate(!isPrivate)}
                className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-xs font-semibold rounded-xl border transition-colors ${
                  isPrivate
                    ? 'bg-[var(--accent-surface)] border-[var(--accent-border)] text-[var(--accent-text)] font-bold'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                {isPrivate ? (
                  <EyeOff className="w-4 h-4 md:mr-1.5" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4 md:mr-1.5" aria-hidden="true" />
                )}
                <span className="hidden md:inline">
                  {isPrivate ? t('privacyActive') : t('privacyInactive')}
                </span>
              </button>

              {/* PDF Print */}
              <button
                type="button"
                onClick={() => window.print()}
                aria-label={t('pdfTitle')}
                title={t('pdfTitle')}
                className="hidden sm:inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] rounded-xl transition-colors"
              >
                <Printer className="w-4 h-4 lg:mr-1.5" aria-hidden="true" />
                <span className="hidden lg:inline">{t('pdf')}</span>
              </button>

              {/* Copy Summary */}
              <button
                type="button"
                onClick={handleCopySummary}
                aria-label={copyStatus === 'copied' ? t('copied') : t('copyTitle')}
                title={t('copyTitle')}
                className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-xs font-semibold rounded-xl border transition-colors ${
                  copyStatus === 'copied'
                    ? 'bg-[var(--accent-surface)] border-[var(--accent-border)] text-[var(--accent-text)] font-bold'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                {copyStatus === 'copied' ? (
                  <>
                    <Check className="w-4 h-4 sm:mr-1.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{t('copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 sm:mr-1.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{t('copy')}</span>
                  </>
                )}
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                aria-label={t('resetTitle')}
                title={t('resetTitle')}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-2.5 text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Statutory Options Drawer Toggle */}
              <button
                type="button"
                aria-expanded={showAdvanced}
                aria-controls="statutory-options-drawer"
                aria-label={t('optionsTitle')}
                title={t('optionsTitle')}
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-xs font-semibold rounded-xl border transition-colors ${
                  showAdvanced
                    ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] border-[var(--neutral-active-bg)] font-bold'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                <Sliders className="w-4 h-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t('options')}</span>
                {showAdvanced ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Statutory Parameters Drawer */}
          {showAdvanced && (
            <div
              id="statutory-options-drawer"
              className="mt-3 pt-3 border-t border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-subtle)] p-4 rounded-xl"
            >
              {/* BPJS Components */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {t('bpjsComponentTitle')}
                </div>
                <label className="flex items-center gap-2.5 min-h-[44px] text-xs text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={enableBpjsKes}
                    onChange={(e) => setEnableBpjsKes(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--accent-solid)] shrink-0"
                  />
                  <span>{t('bpjsKesLabel')}</span>
                </label>
                <label className="flex items-center gap-2.5 min-h-[44px] text-xs text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={enableBpjsTk}
                    onChange={(e) => setEnableBpjsTk(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--accent-solid)] shrink-0"
                  />
                  <span>{t('bpjsTkLabel')}</span>
                </label>
              </div>

              {/* Tax Base Config */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {t('taxBaseTitle')}
                </div>
                <label className="flex items-center gap-2.5 min-h-[44px] text-xs text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={includeCompanyPremiInTax}
                    onChange={(e) => setIncludeCompanyPremiInTax(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--accent-solid)] shrink-0"
                  />
                  <span>{t('taxBaseLabel')}</span>
                </label>
                <p className="text-xs text-[var(--text-muted)]">{t('taxBaseNote')}</p>
              </div>

              {/* Annual Multiplier */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {t('multiplierTitle')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[12, 13, 14, 15].map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={annualMultiplier === m}
                      onClick={() => setAnnualMultiplier(m)}
                      className={`min-h-[44px] min-w-[48px] px-3 py-2 rounded-xl text-xs font-bold border transition-colors tabular-nums ${
                        annualMultiplier === m
                          ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] border-[var(--neutral-active-bg)]'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[var(--text-muted)]">{t('multiplierNote')}</p>
              </div>
            </div>
          )}

          {/* Clipboard Error Banner */}
          {copyStatus === 'error' && (
            <div
              role="alert"
              className="mt-3 p-3 rounded-xl bg-[var(--danger-surface)] border border-[var(--danger-border)] text-[var(--danger-text)] flex items-center justify-between gap-3 text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('copyErrorMsg')}</span>
              </div>
              <button
                type="button"
                aria-label={t('closeBtn')}
                onClick={() => setCopyStatus('idle')}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-[var(--bg-surface)] transition-colors shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE
      ===================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 flex-1 w-full">
        {/* ===================================================================
            2. EXECUTIVE VERDICT LEDGER TICKET (with Demo Banner & Empty State)
        =================================================================== */}
        <section
          aria-labelledby="verdict-heading"
          className="ledger-sheet ledger-verdict rounded-2xl overflow-hidden"
        >
          {isDemoData && !isAllEmpty && (
            <div className="px-5 py-2.5 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 no-print">
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <Info className="w-4 h-4 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
                <span>{t('demoBannerText')}</span>
              </div>
              <button
                type="button"
                onClick={clearAllNumbersToZero}
                className="min-h-[44px] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] text-xs font-bold text-[var(--text-primary)] transition-colors shrink-0"
              >
                {t('demoClearAction')}
              </button>
            </div>
          )}

          {isAllEmpty ? (
            <div className="p-6 sm:p-8 text-center max-w-xl mx-auto space-y-4">
              <h2
                id="verdict-heading"
                className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]"
              >
                {t('emptyStateTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {t('emptyStateDesc')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => existingBasicInputRef.current?.focus()}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--accent-solid)] hover:bg-[var(--accent-solid-hover)] text-[var(--accent-on-solid)] text-xs font-bold transition-colors"
                >
                  {t('emptyActionFill')}
                </button>
                <button
                  type="button"
                  onClick={resetToDemoDefaults}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] text-xs font-bold text-[var(--text-primary)] transition-colors"
                >
                  {t('emptyActionDemo')}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* LEFT 7 COLS: Monthly THP Difference & Retention Bar */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
                    <h2
                      id="verdict-heading"
                      className="text-xs font-bold text-[var(--text-secondary)]"
                    >
                      {t('heroTitle')}
                    </h2>
                    <span className="text-xs font-semibold text-[var(--text-muted)] tabular-nums">
                      PTKP {sharedPtkp} • TER {offeringCalc.terCategory} ({offeringCalc.terPercentage}%)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <p
                      className={`text-2xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
                        deltaMonthlyNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
                      }`}
                    >
                      {deltaMonthlyNet >= 0 ? '+' : ''}
                      {renderIDR(deltaMonthlyNet)}
                      <span className="text-sm sm:text-base font-medium text-[var(--text-muted)] ml-1.5">
                        {t('perMonth')}
                      </span>
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border tabular-nums ${
                        deltaMonthlyNet >= 0
                          ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] border-[var(--accent-border)]'
                          : 'bg-[var(--danger-surface)] text-[var(--danger-text)] border-[var(--danger-border)]'
                      }`}
                    >
                      {deltaMonthlyNet >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                      )}
                      {deltaMonthlyNet >= 0 ? '+' : ''}
                      {deltaMonthlyNetPct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Retention Bar & Annual Summary */}
                <div className="bg-[var(--bg-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-2">
                  {offeringCalc.monthly.cashGross > 0 ? (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[var(--text-secondary)] font-medium">
                          {t('retentionLabel', { name: activeOffering.name })}
                        </span>
                        <span className="font-semibold tabular-nums">
                          <span className="text-[var(--accent-text)]">
                            {offeringRetentionPct.toFixed(1)}% {t('thpShort')}
                          </span>
                          {' • '}
                          <span className="text-[var(--text-muted)]">
                            {(100 - offeringRetentionPct).toFixed(1)}% {t('taxAndBpjs')}
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--bg-muted)] rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${offeringRetentionPct}%` }}
                          className="bg-[var(--accent-solid)] h-full transition-all duration-150"
                        />
                        <div
                          style={{ width: `${Math.max(0, 100 - offeringRetentionPct)}%` }}
                          className="bg-[var(--danger-solid)] h-full transition-all duration-150"
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">{t('retentionZeroNote')}</p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)] pt-1 border-t border-dashed border-[var(--border-subtle)]">
                    <span>
                      {t('heroAnnualNote', { multiplier: annualMultiplier })}{' '}
                      <strong
                        className={`tabular-nums ${
                          deltaAnnualNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
                        }`}
                      >
                        {deltaAnnualNet >= 0 ? '+' : ''}
                        {renderIDR(deltaAnnualNet)}
                        {t('perYear')}
                      </strong>
                    </span>
                    <span className="text-[11px] font-medium text-[var(--text-muted)]">
                      {t('regStamp')}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: Current vs Active Offering Summary */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-medium text-[var(--text-muted)] mb-1">
                      {t('currentSalary')} (THP)
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tabular-nums">
                      {renderIDR(existingCalc.monthly.netSalary)}
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-dashed border-[var(--border-subtle)] text-xs text-[var(--text-muted)] flex justify-between">
                    <span>{t('grossShort')}</span>
                    <span className="text-[var(--text-primary)] font-semibold tabular-nums">
                      {renderIDR(existingCalc.monthly.cashGross)}
                    </span>
                  </div>
                </div>

                <div className="bg-[var(--accent-surface)] border border-[var(--accent-border)] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[var(--accent-text)] mb-1 truncate">
                      {activeOffering.name} (THP)
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold text-[var(--accent-text)] tabular-nums">
                      {renderIDR(offeringCalc.monthly.netSalary)}
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-dashed border-[var(--accent-border)] text-xs text-[var(--text-secondary)] flex justify-between">
                    <span>{t('grossShort')}</span>
                    <span className="text-[var(--text-primary)] font-semibold tabular-nums">
                      {renderIDR(offeringCalc.monthly.cashGross)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================================
            3. UNIFIED CONTROL BAR (OFFER SCENARIO TABS & PTKP)
        =================================================================== */}
        <section
          aria-labelledby="controls-heading"
          className="ledger-sheet rounded-2xl p-4 space-y-4 no-print"
        >
          <h2 id="controls-heading" className="sr-only">
            {t('controlsSectionHeading')}
          </h2>

          {/* Top Row: Native Offer Scenario Buttons & Special Modals */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3.5">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)] mr-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                {t('offeringsLabel')}
              </span>

              {offerings.map((offer) => {
                const isActive = offer.id === activeOffering.id
                return (
                  <div
                    key={offer.id}
                    className={`inline-flex items-stretch rounded-xl border overflow-hidden ${
                      isActive
                        ? 'bg-[var(--neutral-active-bg)] border-[var(--neutral-active-bg)] text-[var(--neutral-active-text)]'
                        : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveOfferingId(offer.id)}
                      className="min-h-[44px] px-3.5 py-2 text-xs font-bold transition-colors text-left"
                    >
                      {offer.name}
                    </button>
                    {offerings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOfferingTab(offer.id)}
                        aria-label={t('deleteOfferingNamed', { name: offer.name })}
                        title={t('deleteOfferingNamed', { name: offer.name })}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center border-l border-current/20 hover:opacity-80 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )
              })}

              {offerings.length < 4 && (
                <button
                  type="button"
                  onClick={addOfferingTab}
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl border border-dashed border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] text-xs font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
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
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent-surface)] text-[var(--accent-text)] border border-[var(--accent-border)] hover:opacity-90 transition-opacity"
              >
                <Target className="w-4 h-4" aria-hidden="true" />
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
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                <span>{t('specialSlips')}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Global PTKP Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
              <div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {t('ptkpLabel')}
                </span>
                <span className="hidden sm:inline text-xs text-[var(--text-muted)] font-medium ml-2">
                  •{' '}
                  {t('ptkpEffectiveRate', {
                    cat: offeringCalc.terCategory,
                    rate: offeringCalc.terPercentage,
                  })}
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
                    aria-pressed={active}
                    onClick={() => setSharedPtkp(p.code)}
                    title={p.label}
                    className={`min-h-[44px] py-1.5 px-2 rounded-xl border text-center transition-colors ${
                      active
                        ? 'bg-[var(--neutral-active-bg)] border-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] font-bold'
                        : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.code}</div>
                    <div
                      className={`text-[11px] font-medium ${
                        active ? 'text-[var(--neutral-active-text)]' : 'text-[var(--text-muted)]'
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
        <div
          role="group"
          aria-label={t('mobileFilterAriaLabel')}
          className="flex lg:hidden bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)] no-print"
        >
          {[
            { id: 'both', label: t('mobileFilterBoth') },
            { id: 'existing', label: t('mobileFilterExisting') },
            { id: 'offering', label: activeOffering.name },
          ].map((tab) => {
            const active = mobileInputView === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setMobileInputView(tab.id)}
                className={`flex-1 min-h-[44px] px-2 py-2 text-xs font-semibold rounded-lg transition-colors truncate ${
                  active
                    ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] font-bold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ===================================================================
            4. SIDE-BY-SIDE SALARY INPUT WORKSHEETS
        =================================================================== */}
        <section id="section-inputs" className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* CARD 1: EXISTING SALARY */}
          <div
            className={`ledger-sheet rounded-2xl overflow-hidden flex flex-col justify-between ${
              mobileInputView === 'offering' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div>
              <div className="bg-[var(--bg-subtle)] px-5 py-3.5 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shrink-0">
                    <Building2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h2 className="font-bold text-base text-[var(--text-primary)] truncate">
                    {t('existingCardTitle')}
                  </h2>
                </div>

                {/* Tax Scheme Selector + Clear Button */}
                <div className="flex items-center gap-1.5 no-print">
                  <div
                    role="group"
                    aria-label={t('taxSchemeAriaExisting')}
                    className="flex bg-[var(--bg-surface)] p-0.5 rounded-xl border border-[var(--border-subtle)]"
                  >
                    {[
                      { id: 'gross', label: 'Gross' },
                      { id: 'gross_up', label: 'Gross-Up' },
                      { id: 'nett', label: 'Nett' },
                    ].map((scheme) => {
                      const active = existingTaxMethod === scheme.id
                      return (
                        <button
                          key={scheme.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            setIsDemoData(false)
                            setExistingTaxMethod(scheme.id)
                          }}
                          className={`min-h-[44px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                            active
                              ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] font-bold'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {scheme.label}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoData(false)
                      setExistingBasic(0)
                      setExistingFixed(0)
                      setExistingBonus(0)
                    }}
                    aria-label={t('clearCardTitle')}
                    title={t('clearCardTitle')}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger-text)] rounded-xl hover:bg-[var(--danger-surface)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label
                    htmlFor="input-existing-basic"
                    className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
                  >
                    {t('basicSalaryLabel')}
                  </label>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)] select-none"
                    >
                      Rp
                    </span>
                    <input
                      ref={existingBasicInputRef}
                      id="input-existing-basic"
                      type="text"
                      inputMode="numeric"
                      value={existingBasic ? existingBasic.toLocaleString('id-ID') : ''}
                      onChange={(e) => {
                        setIsDemoData(false)
                        const digits = e.target.value.replace(/\D/g, '')
                        const num = digits ? parseInt(digits, 10) : 0
                        setExistingBasic(Math.min(MAX_SAFE_CURRENCY, num))
                      }}
                      placeholder={t('currencyPlaceholder')}
                      className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-xl text-sm font-semibold tabular-nums text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:font-normal transition-colors ${
                        isPrivate ? 'blur-[5px] select-none hover:blur-none focus:blur-none' : ''
                      }`}
                    />
                  </div>
                </div>
                <CurrencyInput
                  label={t('fixedAllowanceLabel')}
                  value={existingFixed}
                  onChange={(v) => {
                    setIsDemoData(false)
                    setExistingFixed(v)
                  }}
                  placeholder={t('currencyPlaceholder')}
                  isPrivate={isPrivate}
                />
                <CurrencyInput
                  label={t('bonusLabel')}
                  subtitle={t('bonusSubtitle')}
                  value={existingBonus}
                  onChange={(v) => {
                    setIsDemoData(false)
                    setExistingBonus(v)
                  }}
                  placeholder={t('currencyPlaceholder')}
                  isPrivate={isPrivate}
                />
              </div>
            </div>

            <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-subtle)] px-5 py-4 space-y-2">
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>{t('monthlyGrossSub')}</span>
                <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                  {renderIDR(existingCalc.monthly.cashGross)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[var(--danger-text)]">
                <span>
                  {t('deductionsSub')} (TER {existingCalc.terPercentage}%)
                </span>
                <span className="font-semibold tabular-nums">
                  -{renderIDR(existingCalc.monthly.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between items-baseline ledger-total-row pt-2.5">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {t('monthlyNetSub')}
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] tabular-nums">
                  {renderIDR(existingCalc.monthly.netSalary)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[var(--text-muted)] pt-0.5">
                <span>{t('annualNetSub')}</span>
                <span className="font-semibold text-[var(--text-secondary)] tabular-nums">
                  {renderIDR(existingCalc.annual.netSalary)}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: PROPOSED OFFERING */}
          <div
            className={`ledger-sheet-offer rounded-2xl overflow-hidden flex flex-col justify-between ${
              mobileInputView === 'existing' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div>
              <div className="bg-[var(--accent-surface)] px-5 py-3.5 border-b border-[var(--accent-border)] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--accent-border)] text-[var(--accent-text)] shrink-0">
                    <Briefcase className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h2 className="font-bold text-base text-[var(--text-primary)] truncate">
                    {activeOffering.name}
                  </h2>
                </div>

                {/* Tax Scheme Selector + Clear Button */}
                <div className="flex items-center gap-1.5 no-print shrink-0">
                  <div
                    role="group"
                    aria-label={t('taxSchemeAriaOffering', { name: activeOffering.name })}
                    className="flex bg-[var(--bg-surface)] p-0.5 rounded-xl border border-[var(--border-subtle)]"
                  >
                    {[
                      { id: 'gross', label: 'Gross' },
                      { id: 'gross_up', label: 'Gross-Up' },
                      { id: 'nett', label: 'Nett' },
                    ].map((scheme) => {
                      const active = activeOffering.taxMethod === scheme.id
                      return (
                        <button
                          key={scheme.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => updateActiveOffering('taxMethod', scheme.id)}
                          className={`min-h-[44px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                            active
                              ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] font-bold'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {scheme.label}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateActiveOffering('basic', 0)
                      updateActiveOffering('fixed', 0)
                      updateActiveOffering('bonus', 0)
                    }}
                    aria-label={t('clearCardTitle')}
                    title={t('clearCardTitle')}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger-text)] rounded-xl hover:bg-[var(--danger-surface)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label
                    htmlFor="offering-name-input"
                    className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
                  >
                    {t('offeringNameLabel')}
                  </label>
                  <input
                    id="offering-name-input"
                    type="text"
                    maxLength={MAX_OFFERING_NAME_LEN}
                    value={activeOffering.name}
                    placeholder={t('offeringNamePlaceholder')}
                    onChange={(e) =>
                      updateActiveOffering('name', e.target.value.slice(0, MAX_OFFERING_NAME_LEN))
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-xl text-sm font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors"
                  />
                </div>

                <CurrencyInput
                  label={t('offeringBasicLabel')}
                  value={activeOffering.basic}
                  onChange={(v) => updateActiveOffering('basic', v)}
                  placeholder={t('currencyPlaceholder')}
                  highlight
                  isPrivate={isPrivate}
                />
                <CurrencyInput
                  label={t('fixedAllowanceLabel')}
                  value={activeOffering.fixed}
                  onChange={(v) => updateActiveOffering('fixed', v)}
                  placeholder={t('currencyPlaceholder')}
                  isPrivate={isPrivate}
                />
                <CurrencyInput
                  label={t('bonusLabel')}
                  subtitle={t('bonusSubtitle')}
                  value={activeOffering.bonus}
                  onChange={(v) => updateActiveOffering('bonus', v)}
                  placeholder={t('currencyPlaceholder')}
                  isPrivate={isPrivate}
                />
              </div>
            </div>

            <div className="bg-[var(--accent-surface)] border-t border-[var(--accent-border)] px-5 py-4 space-y-2">
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>{t('monthlyGrossSub')}</span>
                <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                  {renderIDR(offeringCalc.monthly.cashGross)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[var(--danger-text)]">
                <span>
                  {t('deductionsSub')} (TER {offeringCalc.terPercentage}%)
                </span>
                <span className="font-semibold tabular-nums">
                  -{renderIDR(offeringCalc.monthly.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between items-baseline ledger-total-row pt-2.5">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {t('monthlyNetSub')}
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[var(--accent-text)] tabular-nums">
                  {renderIDR(offeringCalc.monthly.netSalary)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)] pt-0.5">
                <span>{t('annualNetSub')}</span>
                <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                  {renderIDR(offeringCalc.annual.netSalary)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            5. DETAILED COMPARISON BREAKDOWN
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
           CLEAN FOOTER
      ===================================================================== */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 lg:py-6 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)] leading-relaxed w-full">
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
          MOBILE BOTTOM NAVIGATION DOCK (Solid ledger surface, >= 48px targets)
      ===================================================================== */}
      <nav
        aria-label={t('mobileNavAriaLabel')}
        className="lg:hidden fixed bottom-[max(0.65rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 ledger-sheet shadow-xl rounded-2xl px-2 py-1.5 grid grid-cols-4 gap-1 items-center no-print"
      >
        <button
          type="button"
          onClick={() => setShowNegotiateModal(true)}
          className="flex flex-col items-center justify-center gap-1 min-h-[48px] py-1.5 rounded-xl text-[11px] font-bold text-[var(--accent-text)] hover:bg-[var(--bg-subtle)] transition-colors min-w-0"
        >
          <Target className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate w-full text-center leading-tight">{t('mobileTabNegotiate')}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowSpecialSlipsModal(true)}
          className="flex flex-col items-center justify-center gap-1 min-h-[48px] py-1.5 rounded-xl text-[11px] font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors min-w-0"
        >
          <FileSpreadsheet className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate w-full text-center leading-tight">{t('mobileTabSlips')}</span>
        </button>
        <button
          type="button"
          onClick={handleCopySummary}
          className="flex flex-col items-center justify-center gap-1 min-h-[48px] py-1.5 rounded-xl text-[11px] font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors min-w-0"
        >
          {copyStatus === 'copied' ? (
            <Check className="w-4 h-4 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
          ) : (
            <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span className="truncate w-full text-center leading-tight">
            {copyStatus === 'copied' ? t('copied') : t('copy')}
          </span>
        </button>
        <button
          type="button"
          aria-pressed={isPrivate}
          onClick={() => setIsPrivate(!isPrivate)}
          className="flex flex-col items-center justify-center gap-1 min-h-[48px] py-1.5 rounded-xl text-[11px] font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors min-w-0"
        >
          {isPrivate ? (
            <EyeOff className="w-4 h-4 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span className="truncate w-full text-center leading-tight">
            {isPrivate ? t('privacyActive') : t('privacyInactive')}
          </span>
        </button>
      </nav>
    </div>
  )
}

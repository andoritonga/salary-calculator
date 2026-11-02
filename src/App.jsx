import React, { useState, useMemo, useEffect } from 'react'
import {
  Calculator,
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
  ShieldCheck,
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

  // Gross-to-Net Retention Ratio
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
      return <span className="text-[11px] text-slate-500">Rp 0</span>
    }
    const isPositiveVal = val > 0
    const isGood = invertColor ? !isPositiveVal : isPositiveVal
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold tabular-nums border ${
          isGood
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        }`}
      >
        {isPositiveVal ? '+' : ''}
        {renderIDR(val)}
      </span>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 pb-24 lg:pb-12">
      {/* =====================================================================
          1. CLEAN STICKY HEADER
      ===================================================================== */}
      <header className="bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 no-print pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Brand Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-emerald-500/15 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    {t('appTitle')}
                  </h1>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                    {t('appBadge')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language Switcher */}
              <div
                className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800"
                title={t('langToggleTitle')}
              >
                <button
                  type="button"
                  onClick={() => setLang('id')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    lang === 'id'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    lang === 'en'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Privacy Blur Toggle */}
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                title={isPrivate ? t('privacyTitleOn') : t('privacyTitleOff')}
                className={`inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  isPrivate
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
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
                className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all"
              >
                <Printer className="w-4 h-4 lg:mr-1.5" />
                <span className="hidden lg:inline">{t('pdf')}</span>
              </button>

              {/* Copy Summary */}
              <button
                type="button"
                onClick={handleCopySummary}
                title={t('copyTitle')}
                className={`inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  copiedSummary
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 sm:mr-1 text-emerald-400" />
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
                className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Statutory Options Drawer Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                title={t('optionsTitle')}
                className={`inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  showAdvanced
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
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
            <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 p-4 rounded-xl animate-fadeIn">
              {/* BPJS Components */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                  {t('bpjsComponentTitle')}
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBpjsKes}
                    onChange={(e) => setEnableBpjsKes(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>{t('bpjsKesLabel')}</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBpjsTk}
                    onChange={(e) => setEnableBpjsTk(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>{t('bpjsTkLabel')}</span>
                </label>
              </div>

              {/* Tax Base Config */}
              <div className="space-y-1.5">
                <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                  {t('taxBaseTitle')}
                </div>
                <label className="flex items-start gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCompanyPremiInTax}
                    onChange={(e) => setIncludeCompanyPremiInTax(e.target.checked)}
                    className="mt-0.5 rounded accent-emerald-500"
                  />
                  <span>{t('taxBaseLabel')}</span>
                </label>
                <p className="text-[11px] text-slate-400">{t('taxBaseNote')}</p>
              </div>

              {/* Annual Multiplier */}
              <div className="space-y-1.5">
                <div className="text-[11px] uppercase tracking-wider font-bold text-sky-400">
                  {t('multiplierTitle')}
                </div>
                <div className="flex gap-1.5">
                  {[12, 13, 14, 15].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setAnnualMultiplier(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        annualMultiplier === m
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">{t('multiplierNote')}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE
      ===================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 flex-1 w-full">
        {/* ===================================================================
            2. CLEAN HERO SUMMARY CARD
        =================================================================== */}
        <section className="rounded-2xl overflow-hidden border border-slate-800/80 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-900/70 shadow-xl">
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* LEFT 7 COLS: Monthly THP Difference & Retention Bar */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-slate-400">
                    {t('heroTitle')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/70">
                    PTKP {sharedPtkp} • TER {offeringCalc.terCategory} ({offeringCalc.terPercentage}%)
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <h2
                    className={`text-2xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
                      deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {deltaMonthlyNet >= 0 ? '+' : ''}
                    {renderIDR(deltaMonthlyNet)}
                    <span className="text-sm sm:text-base font-normal text-slate-400 ml-1">
                      {t('perMonth')}
                    </span>
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border tabular-nums ${
                      deltaMonthlyNet >= 0
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
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

              {/* Clean Retention Bar & Annual Summary */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">
                    Rasio Gaji Bersih ({activeOffering.name})
                  </span>
                  <span className="text-slate-300 font-semibold tabular-nums">
                    <span className="text-emerald-400">{offeringRetentionPct.toFixed(1)}% THP</span>
                    {' • '}
                    <span className="text-slate-400">
                      {(100 - offeringRetentionPct).toFixed(1)}% Pajak &amp; BPJS
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${offeringRetentionPct}%` }}
                    className="bg-emerald-500 h-full transition-all duration-300"
                  />
                  <div
                    style={{ width: `${Math.max(0, 100 - offeringRetentionPct)}%` }}
                    className="bg-rose-500/60 h-full transition-all duration-300"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-0.5">
                  <span>
                    {t('heroAnnualNote', { multiplier: annualMultiplier })}{' '}
                    <strong
                      className={`tabular-nums ${
                        deltaAnnualNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
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

            {/* RIGHT 5 COLS: Side-by-Side Current vs Offering THP Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Current Baseline */}
              <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-medium text-slate-400 mb-1">
                    {t('currentSalary')} (THP)
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
                  <span>Bruto:</span>
                  <span className="text-slate-200 font-medium tabular-nums">
                    {renderIDR(existingCalc.monthly.cashGross)}
                  </span>
                </div>
              </div>

              {/* Active Offering */}
              <div className="bg-emerald-500/[0.08] border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-emerald-300">
                      {activeOffering.name} (THP)
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-500/20 text-xs text-slate-300 flex justify-between">
                  <span>Bruto:</span>
                  <span className="text-emerald-200 font-semibold tabular-nums">
                    {renderIDR(offeringCalc.monthly.cashGross)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. UNIFIED CONTROL BAR (OFFER TABS, QUICK TOOLS, PTKP SELECTOR)
        =================================================================== */}
        <section className="bg-slate-900/75 rounded-2xl border border-slate-800/80 p-4 space-y-4 no-print">
          {/* Top Row: Multi-Offer Tabs & Modal Triggers */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
            {/* Multi-Offer Tabs */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                {t('offeringsLabel')}
              </span>

              {offerings.map((offer) => {
                const isActive = offer.id === activeOffering.id
                return (
                  <div
                    key={offer.id}
                    onClick={() => setActiveOfferingId(offer.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{offer.name}</span>
                    {offerings.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => removeOfferingTab(offer.id, e)}
                        title={t('deleteOffering')}
                        className="p-0.5 rounded hover:bg-black/20"
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
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-dashed border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 text-xs font-semibold transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border border-sky-500/30 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{t('specialSlips')}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Global PTKP Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-200">
                  {t('ptkpLabel')}
                </span>
                <span className="hidden sm:inline text-xs text-emerald-400 font-medium ml-2">
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
                    onClick={() => setSharedPtkp(p.code)}
                    title={p.label}
                    className={`py-1.5 px-2.5 rounded-xl border text-center transition-all ${
                      active
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.code}</div>
                    <div
                      className={`text-[9px] font-medium ${
                        active ? 'text-slate-900' : 'text-slate-500'
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
        <div className="flex lg:hidden bg-slate-900/90 p-1 rounded-xl border border-slate-800 no-print">
          {[
            { id: 'both', label: t('mobileFilterBoth') },
            { id: 'existing', label: t('mobileFilterExisting') },
            { id: 'offering', label: activeOffering.name },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileInputView(tab.id)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mobileInputView === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===================================================================
            4. SIDE-BY-SIDE SALARY INPUT CARDS
        =================================================================== */}
        <section id="section-inputs" className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* =================================================================
              CARD 1: EXISTING SALARY
          ================================================================= */}
          <div
            className={`bg-slate-900/75 rounded-2xl border border-slate-800/80 shadow-lg overflow-hidden flex flex-col justify-between ${
              mobileInputView === 'offering' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="bg-slate-900/90 px-5 py-4 border-b border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-base text-white">
                    {t('existingCardTitle')}
                  </h2>
                </div>

                {/* Tax Scheme Selector + Clear Button */}
                <div className="flex items-center gap-1.5 no-print">
                  <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                    {[
                      { id: 'gross', label: 'Gross' },
                      { id: 'gross_up', label: 'Gross-Up' },
                      { id: 'nett', label: 'Nett' },
                    ].map((scheme) => (
                      <button
                        key={scheme.id}
                        type="button"
                        onClick={() => setExistingTaxMethod(scheme.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          existingTaxMethod === scheme.id
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-400 hover:text-slate-200'
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
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800/60 transition-colors"
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

            {/* Clean Card Footer */}
            <div className="bg-slate-950/70 border-t border-slate-800/80 px-5 py-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{t('monthlyGrossSub')}</span>
                <span className="font-semibold text-slate-200 tabular-nums">
                  {renderIDR(existingCalc.monthly.cashGross)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-rose-400">
                <span>
                  {t('deductionsSub')} (TER {existingCalc.terPercentage}%)
                </span>
                <span className="font-semibold tabular-nums">
                  -{renderIDR(existingCalc.monthly.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-t border-slate-800 pt-2.5">
                <span className="text-xs font-bold text-slate-200">
                  {t('monthlyNetSub')}
                </span>
                <span className="text-lg sm:text-xl font-bold text-white tabular-nums">
                  {renderIDR(existingCalc.monthly.netSalary)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>{t('annualNetSub')}</span>
                <span className="font-semibold text-slate-300 tabular-nums">
                  {renderIDR(existingCalc.annual.netSalary)}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================================
              CARD 2: PROPOSED OFFERING
          ================================================================= */}
          <div
            className={`bg-slate-900/75 rounded-2xl border border-emerald-500/35 shadow-lg overflow-hidden flex flex-col justify-between ${
              mobileInputView === 'existing' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="bg-emerald-500/[0.08] px-5 py-4 border-b border-emerald-500/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={activeOffering.name}
                    onChange={(e) => updateActiveOffering('name', e.target.value)}
                    className="font-bold text-base text-white bg-transparent border-b border-transparent hover:border-emerald-500/50 focus:border-emerald-400 focus:outline-none truncate w-full"
                  />
                </div>

                {/* Tax Scheme Selector + Clear Button */}
                <div className="flex items-center gap-1.5 no-print shrink-0">
                  <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                    {[
                      { id: 'gross', label: 'Gross' },
                      { id: 'gross_up', label: 'Gross-Up' },
                      { id: 'nett', label: 'Nett' },
                    ].map((scheme) => (
                      <button
                        key={scheme.id}
                        type="button"
                        onClick={() => updateActiveOffering('taxMethod', scheme.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          activeOffering.taxMethod === scheme.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
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
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800/60 transition-colors"
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

            {/* Clean Card Footer */}
            <div className="bg-emerald-500/[0.06] border-t border-emerald-500/20 px-5 py-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{t('monthlyGrossSub')}</span>
                <span className="font-semibold text-white tabular-nums">
                  {renderIDR(offeringCalc.monthly.cashGross)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-rose-400">
                <span>
                  {t('deductionsSub')} (TER {offeringCalc.terPercentage}%)
                </span>
                <span className="font-semibold tabular-nums">
                  -{renderIDR(offeringCalc.monthly.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-t border-emerald-500/25 pt-2.5">
                <span className="text-xs font-bold text-emerald-300">
                  {t('monthlyNetSub')}
                </span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">
                  {renderIDR(offeringCalc.monthly.netSalary)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-300 pt-0.5">
                <span>{t('annualNetSub')}</span>
                <span className="font-semibold text-sky-400 tabular-nums">
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
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 lg:py-6 border-t border-slate-800/70 text-center text-xs text-slate-500 leading-relaxed w-full">
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] grid grid-cols-4 gap-1 items-center text-slate-300 no-print shadow-[0_-8px_20px_rgba(0,0,0,0.4)]">
        <button
          type="button"
          onClick={() => setShowNegotiateModal(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-semibold text-emerald-400 active:bg-slate-800/60 min-w-0"
        >
          <Target className="w-4 h-4 shrink-0" />
          <span className="truncate w-full text-center leading-tight">{t('mobileTabNegotiate')}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowSpecialSlipsModal(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-semibold text-sky-400 active:bg-slate-800/60 min-w-0"
        >
          <FileSpreadsheet className="w-4 h-4 shrink-0" />
          <span className="truncate w-full text-center leading-tight">{t('mobileTabSlips')}</span>
        </button>
        <button
          type="button"
          onClick={handleCopySummary}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-semibold text-slate-300 hover:text-white active:bg-slate-800/60 min-w-0"
        >
          {copiedSummary ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Copy className="w-4 h-4 shrink-0" />
          )}
          <span className="truncate w-full text-center leading-tight">
            {copiedSummary ? t('copied') : t('copy')}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setIsPrivate(!isPrivate)}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-semibold text-slate-300 hover:text-white active:bg-slate-800/60 min-w-0"
        >
          {isPrivate ? (
            <EyeOff className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Eye className="w-4 h-4 shrink-0" />
          )}
          <span className="truncate w-full text-center leading-tight">
            {isPrivate ? t('privacyActive') : t('privacyInactive')}
          </span>
        </button>
      </nav>
    </div>
  )
}

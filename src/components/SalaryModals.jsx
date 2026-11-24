import React, { useEffect, useId, useRef } from 'react'
import {
  Target,
  X,
  RefreshCw,
  Check,
  FileSpreadsheet,
  RotateCcw,
  Trash2,
  HelpCircle,
} from 'lucide-react'
import CurrencyInput from './CurrencyInput'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal wrapper with Escape handling, focus trapping, and focus restoration.
 */
function AccessibleDialog({ open, onClose, titleId, maxWidthClass = 'max-w-xl', children }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement
    const container = dialogRef.current
    if (container) {
      const focusables = container.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusables.length > 0) {
        focusables[0].focus()
      } else {
        container.focus()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR))
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault()
            last.focus()
          }
        } else if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[var(--backdrop-scrim)] no-print"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`ledger-modal rounded-t-3xl sm:rounded-2xl w-full ${maxWidthClass} overflow-hidden max-h-[92vh] flex flex-col focus:outline-none`}
      >
        {children}
      </div>
    </div>
  )
}

export default function SalaryModals({
  t,
  renderIDR,
  isPrivate,
  sharedPtkp,
  activeOffering,
  // Negotiate Modal props
  showNegotiateModal,
  setShowNegotiateModal,
  negotiateMode,
  setNegotiateMode,
  targetIncrementPct,
  setTargetIncrementPct,
  targetDesiredNet,
  setTargetDesiredNet,
  reverseGrossBasic,
  targetSimulationCalc,
  applyTargetGrossToOffering,
  // Special Slips Modal props
  showSpecialSlipsModal,
  setShowSpecialSlipsModal,
  specialSlipTarget,
  setSpecialSlipTarget,
  thrDisbursedAmount,
  setThrDisbursedAmount,
  existingBasic,
  existingFixed = 0,
  existingBonus = 0,
  annualMultiplier = 13,
  bonusMonthSim,
  decemberTrueUpSim,
  // Reset Modal props
  showResetModal,
  setShowResetModal,
  resetToDemoDefaults,
  clearAllNumbersToZero,
}) {
  const negotiateTitleId = useId()
  const specialSlipsTitleId = useId()
  const resetTitleId = useId()

  return (
    <>
      {/* =====================================================================
          MODAL 1: NEGOTIATION & REVERSE NET-TO-GROSS CALCULATOR
      ===================================================================== */}
      <AccessibleDialog
        open={showNegotiateModal}
        onClose={() => setShowNegotiateModal(false)}
        titleId={negotiateTitleId}
        maxWidthClass="max-w-xl"
      >
        {/* Solid High-Contrast Header */}
        <div className="bg-[var(--bg-subtle)] px-5 sm:px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-[var(--accent-surface)] text-[var(--accent-text)] border border-[var(--accent-border)] rounded-xl shrink-0">
              <Target className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id={negotiateTitleId} className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                {t('negotiateModalTitle')}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">{t('negotiateModalSubtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowNegotiateModal(false)}
            aria-label={t('closeBtn')}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div role="tablist" className="bg-[var(--bg-subtle)] px-5 sm:px-6 pt-3 border-b border-[var(--border-subtle)] flex gap-2 shrink-0">
          <button
            type="button"
            role="tab"
            aria-selected={negotiateMode === 'percentage'}
            onClick={() => setNegotiateMode('percentage')}
            className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition-colors flex items-center gap-1.5 ${
              negotiateMode === 'percentage'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] font-bold -mb-px pb-2.5'
                : 'bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            <Target className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t('modePercentage')}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={negotiateMode === 'reverse'}
            onClick={() => setNegotiateMode('reverse')}
            className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition-colors flex items-center gap-1.5 ${
              negotiateMode === 'reverse'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] font-bold -mb-px pb-2.5'
                : 'bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t('modeReverse')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {negotiateMode === 'percentage' ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  {t('presetLabel')}
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[15, 20, 25, 30, 50].map((pct) => {
                    const active = targetIncrementPct === pct
                    return (
                      <button
                        key={pct}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setTargetIncrementPct(pct)}
                        className={`min-h-[44px] py-2 rounded-xl text-xs font-bold border transition-colors tabular-nums ${
                          active
                            ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] border-[var(--neutral-active-bg)]'
                            : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        +{pct}%
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="negotiate-range-slider"
                    className="text-xs font-semibold text-[var(--text-secondary)]"
                  >
                    {t('sliderLabel')}
                  </label>
                  <span className="text-sm font-bold text-[var(--accent-text)] bg-[var(--accent-surface)] px-2.5 py-0.5 rounded-lg border border-[var(--accent-border)] tabular-nums">
                    +{targetIncrementPct}%
                  </span>
                </div>
                <input
                  id="negotiate-range-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={targetIncrementPct}
                  onChange={(e) => setTargetIncrementPct(Number(e.target.value))}
                  className="w-full min-h-[44px] accent-[var(--accent-solid)]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <CurrencyInput
                  label={t('reverseInputLabel')}
                  subtitle={t('reverseSubtitle')}
                  value={targetDesiredNet}
                  onChange={setTargetDesiredNet}
                  placeholder={t('currencyPlaceholder')}
                  isPrivate={isPrivate}
                />
              </div>

              <div className="bg-[var(--accent-surface)] border border-[var(--accent-border)] p-4 rounded-xl">
                <div className="text-xs font-semibold text-[var(--accent-text)]">
                  {t('requiredGrossLabel')}
                </div>
                <div className="text-2xl font-extrabold text-[var(--text-primary)] mt-1 tabular-nums">
                  {renderIDR(reverseGrossBasic)}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {t('requiredGrossNote', { ptkp: sharedPtkp })}
                </div>
              </div>
            </div>
          )}

          {/* Simulation Summary Card */}
          <div className="bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-muted)]">{t('targetGrossMonthly')}</span>
              <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                {renderIDR(targetSimulationCalc.monthly.cashGross)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-dashed border-[var(--border-subtle)] pt-2">
              <span className="text-[var(--text-secondary)] font-semibold">{t('targetNetMonthly')}</span>
              <span className="font-extrabold text-base text-[var(--accent-text)] tabular-nums">
                {renderIDR(targetSimulationCalc.monthly.netSalary)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-[var(--border-subtle)] pt-2">
              <span className="text-[var(--text-muted)]">{t('targetNetAnnual')}</span>
              <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                {renderIDR(targetSimulationCalc.annual.netSalary)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={applyTargetGrossToOffering}
            className="w-full min-h-[44px] py-3 px-4 bg-[var(--accent-solid)] hover:bg-[var(--accent-solid-hover)] text-[var(--accent-on-solid)] text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>{t('applyTargetToOffering', { name: activeOffering.name })}</span>
          </button>
        </div>
      </AccessibleDialog>

      {/* =====================================================================
          MODAL 2: THR & DECEMBER PASAL 17 TRUE-UP PAYSLIP SIMULATOR
      ===================================================================== */}
      <AccessibleDialog
        open={showSpecialSlipsModal}
        onClose={() => setShowSpecialSlipsModal(false)}
        titleId={specialSlipsTitleId}
        maxWidthClass="max-w-3xl"
      >
        <div className="bg-[var(--bg-subtle)] px-5 sm:px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl shrink-0">
              <FileSpreadsheet className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id={specialSlipsTitleId} className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                {t('specialSlipsModalTitle')}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">{t('specialSlipsModalSubtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSpecialSlipsModal(false)}
            aria-label={t('closeBtn')}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Target Selector */}
          <div className="bg-[var(--bg-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {t('targetSimulationLabel')}
            </span>
            <div className="flex bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)] gap-1">
              <button
                type="button"
                aria-pressed={specialSlipTarget === 'existing'}
                onClick={() => {
                  setSpecialSlipTarget('existing')
                  setThrDisbursedAmount(existingBasic)
                }}
                className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  specialSlipTarget === 'existing'
                    ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] font-bold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {t('currentSalary')}
              </button>
              <button
                type="button"
                aria-pressed={specialSlipTarget === 'offering'}
                onClick={() => {
                  setSpecialSlipTarget('offering')
                  setThrDisbursedAmount(activeOffering.basic)
                }}
                className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  specialSlipTarget === 'offering'
                    ? 'bg-[var(--neutral-active-bg)] text-[var(--neutral-active-text)] font-bold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {activeOffering.name}
              </button>
            </div>
          </div>

          {/* Part 1: THR / Bonus Disbursed Month Simulator */}
          <div className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-surface)]">
            <div className="bg-[var(--bg-subtle)] px-4 py-3.5 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  1. {t('thrSectionTitle')}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{t('thrSectionSubtitle')}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setThrDisbursedAmount(
                      specialSlipTarget === 'existing' ? existingBasic : activeOffering.basic
                    )
                  }
                  className="min-h-[44px] px-3 py-1.5 text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg hover:border-[var(--border-strong)] text-[var(--text-primary)] transition-colors"
                >
                  {t('disbursedPreset1x')}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setThrDisbursedAmount(
                      (specialSlipTarget === 'existing' ? existingBasic : activeOffering.basic) * 2
                    )
                  }
                  className="min-h-[44px] px-3 py-1.5 text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg hover:border-[var(--border-strong)] text-[var(--text-primary)] transition-colors"
                >
                  {t('disbursedPreset2x')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const isExisting = specialSlipTarget === 'existing'
                    const b = isExisting ? existingBasic : activeOffering.basic
                    const f = isExisting ? existingFixed : activeOffering.fixed
                    const bon = isExisting ? existingBonus : activeOffering.bonus
                    const thrM = Math.max(0, annualMultiplier - 12)
                    setThrDisbursedAmount((b + f) * thrM + bon)
                  }}
                  className="min-h-[44px] px-3 py-1.5 text-xs font-semibold bg-[var(--accent-surface)] border border-[var(--accent-border)] rounded-lg text-[var(--accent-text)] transition-colors"
                >
                  {t('disbursedPresetPackage')}
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <CurrencyInput
                label={t('disbursedLabel')}
                value={thrDisbursedAmount}
                onChange={setThrDisbursedAmount}
                placeholder={t('currencyPlaceholder')}
                isPrivate={isPrivate}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Regular Month Slip */}
                <div className="bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] space-y-2 text-xs">
                  <div className="font-semibold text-[var(--text-secondary)] border-b border-dashed border-[var(--border-subtle)] pb-1.5">
                    {t('slipRegularTitle')}
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>{t('slipRegularGross')}</span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {renderIDR(bonusMonthSim.regularMonthlyGross)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--danger-text)]">
                    <span>
                      {t('slipRegularPph21')} ({bonusMonthSim.regularTerPct}%)
                    </span>
                    <span className="font-semibold tabular-nums">
                      -{renderIDR(bonusMonthSim.regularPph21)}
                    </span>
                  </div>
                  <div className="flex justify-between ledger-total-row pt-2 font-bold text-sm">
                    <span className="text-[var(--text-primary)]">{t('slipRegularNet')}</span>
                    <span className="text-[var(--text-primary)] tabular-nums">
                      {renderIDR(bonusMonthSim.regularMonthlyNet)}
                    </span>
                  </div>
                </div>

                {/* THR / Bonus Month Slip */}
                <div className="bg-[var(--accent-surface)] p-4 rounded-xl border border-[var(--accent-border)] space-y-2 text-xs">
                  <div className="font-semibold text-[var(--accent-text)] border-b border-dashed border-[var(--accent-border)] pb-1.5">
                    {t('slipBonusTitle')}
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>{t('slipBonusGross')}</span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {renderIDR(bonusMonthSim.disbursedCashGross)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--danger-text)]">
                    <span>
                      {t('slipBonusPph21')} ({bonusMonthSim.disbursedTerPct}%)
                    </span>
                    <span className="font-semibold tabular-nums">
                      -{renderIDR(bonusMonthSim.disbursedPph21)}
                    </span>
                  </div>
                  <div className="flex justify-between ledger-total-row pt-2 font-bold text-sm">
                    <span className="text-[var(--text-primary)]">{t('slipBonusNet')}</span>
                    <span className="text-[var(--accent-text)] tabular-nums">
                      {renderIDR(bonusMonthSim.disbursedNetSalary)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Part 2: December Pasal 17 True-Up Reconciliation */}
          <div className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-surface)]">
            <div className="bg-[var(--bg-subtle)] px-4 py-3.5 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  2. {t('decTrueUpTitle')}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{t('decTrueUpSubtitle')}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                  decemberTrueUpSim.rawDecemberPph21 < 0
                    ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] border-[var(--accent-border)]'
                    : decemberTrueUpSim.status === 'underpaid'
                    ? 'bg-[var(--danger-surface)] text-[var(--danger-text)] border-[var(--danger-border)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)]'
                }`}
              >
                {decemberTrueUpSim.rawDecemberPph21 < 0
                  ? t('decStatusOverpaid')
                  : decemberTrueUpSim.status === 'underpaid'
                  ? t('decStatusUnderpaid')
                  : t('decStatusBalanced')}
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[var(--bg-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-1.5">
                <div className="font-bold text-xs text-[var(--text-secondary)]">
                  {t('decCol1Title')}
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>{t('decCol1Routine')}</span>
                  <span className="tabular-nums text-[var(--text-primary)]">
                    {renderIDR(decemberTrueUpSim.routineJanNovTax)}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>{t('decCol1BonusSpike')}</span>
                  <span className="tabular-nums text-[var(--text-primary)]">
                    +{renderIDR(decemberTrueUpSim.bonusTerTax)}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-dashed border-[var(--border-subtle)] pt-1.5">
                  <span className="text-[var(--text-primary)]">{t('decCol1Total')}</span>
                  <span className="text-[var(--danger-text)] tabular-nums">
                    {renderIDR(decemberTrueUpSim.totalPaidJanNov)}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--bg-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-1.5">
                <div className="font-bold text-xs text-[var(--text-secondary)]">
                  {t('decCol2Title')}
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>{t('decCol2Gross')}</span>
                  <span className="tabular-nums text-[var(--text-primary)]">
                    {renderIDR(decemberTrueUpSim.annualCashGross)}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>{t('decCol2Annual')}</span>
                  <span className="tabular-nums text-[var(--text-primary)]">
                    {renderIDR(decemberTrueUpSim.totalAnnualTax)}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-dashed border-[var(--border-subtle)] pt-1.5">
                  <span className="text-[var(--text-primary)]">
                    {decemberTrueUpSim.rawDecemberPph21 < 0
                      ? t('decCol2Overpaid')
                      : t('decCol2Remaining')}
                  </span>
                  <span
                    className={`tabular-nums ${
                      decemberTrueUpSim.rawDecemberPph21 < 0
                        ? 'text-[var(--accent-text)]'
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {decemberTrueUpSim.rawDecemberPph21 < 0
                      ? `+${renderIDR(decemberTrueUpSim.overpaidTax)}`
                      : renderIDR(decemberTrueUpSim.decemberPph21)}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--accent-surface)] p-3.5 rounded-xl border border-[var(--accent-border)] space-y-1.5">
                <div className="font-bold text-xs text-[var(--accent-text)]">
                  {t('decCol3Title')}
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>{t('slipRegularGross')}</span>
                  <span className="text-[var(--text-primary)] tabular-nums">
                    {renderIDR(decemberTrueUpSim.monthlyCashGross)}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>
                    {decemberTrueUpSim.rawDecemberPph21 < 0
                      ? t('decCol3Refund')
                      : t('decCol3Tax')}
                  </span>
                  <span
                    className={`tabular-nums font-medium ${
                      decemberTrueUpSim.rawDecemberPph21 < 0
                        ? 'text-[var(--accent-text)]'
                        : 'text-[var(--danger-text)]'
                    }`}
                  >
                    {decemberTrueUpSim.rawDecemberPph21 < 0 ? '+' : '-'}
                    {renderIDR(
                      decemberTrueUpSim.rawDecemberPph21 < 0
                        ? decemberTrueUpSim.overpaidTax
                        : decemberTrueUpSim.decemberPph21
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold ledger-total-row pt-1.5">
                  <span className="text-[var(--text-primary)]">{t('decCol3Net')}</span>
                  <span className="text-[var(--accent-text)] tabular-nums">
                    {renderIDR(decemberTrueUpSim.decemberNetSalary)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccessibleDialog>

      {/* =====================================================================
          MODAL 3: RESET & CLEAR DATA
      ===================================================================== */}
      <AccessibleDialog
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        titleId={resetTitleId}
        maxWidthClass="max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl shrink-0">
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 id={resetTitleId} className="text-base font-bold text-[var(--text-primary)]">
                  {t('resetModalTitle')}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">{t('resetModalSubtitle')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              aria-label={t('closeBtn')}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-xl transition-colors shrink-0"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
            {t('resetModalDesc')}
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={clearAllNumbersToZero}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-[var(--danger-border)] bg-[var(--danger-surface)] hover:bg-[var(--danger-solid)] text-[var(--danger-text)] hover:text-[var(--danger-on-solid)] text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>{t('clearAllToZeroBtn')}</span>
            </button>

            <button
              type="button"
              onClick={resetToDemoDefaults}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>{t('resetToDemoBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="w-full min-h-[44px] py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {t('cancelBtn')}
            </button>
          </div>
        </div>
      </AccessibleDialog>
    </>
  )
}

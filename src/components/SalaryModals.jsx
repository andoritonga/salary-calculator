import React from 'react'
import {
  Target,
  X,
  RefreshCw,
  Sparkles,
  FileSpreadsheet,
  RotateCcw,
  Trash2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react'
import CurrencyInput from './CurrencyInput'

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
  targetGrossBasic,
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
  bonusMonthSim,
  decemberTrueUpSim,
  // Reset Modal props
  showResetModal,
  setShowResetModal,
  resetToDemoDefaults,
  clearAllNumbersToZero,
}) {
  return (
    <>
      {/* =====================================================================
          MODAL 1: NEGOTIATION & REVERSE NET-TO-GROSS WORKBENCH
      ===================================================================== */}
      {showNegotiateModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0D1F18]/75 backdrop-blur-sm animate-fadeIn no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNegotiateModal(false)
          }}
        >
          <div className="bg-[var(--bg-elevated)] rounded-t-md sm:rounded-sm border-2 border-[var(--border-strong)] shadow-[0_24px_60px_-15px_rgba(13,31,24,0.55)] w-full max-w-xl overflow-hidden animate-slideUp max-h-[92vh] flex flex-col">
            {/* Modal Vault Header */}
            <div className="bg-[#0D1F18] px-5 py-4 text-[#F5EFE4] flex items-center justify-between shrink-0 border-b-2 border-[#9A6B13]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#9A6B13]/20 rounded-sm border border-[#9A6B13]/50 text-[#E5B85B]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#E5B85B]">
                    FOLIO SCHEDULE III // COMPENSATION ADVISORY
                  </div>
                  <h3 className="text-lg font-display font-bold tracking-tight text-[#F5EFE4]">
                    {t('negotiateModalTitle')}
                  </h3>
                  <p className="text-[11px] text-[#A7B8B0]">{t('negotiateModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNegotiateModal(false)}
                className="p-1.5 text-[#A7B8B0] hover:text-white rounded-sm hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-[var(--bg-secondary)] px-5 pt-2.5 border-b border-[var(--border-hairline)] flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setNegotiateMode('percentage')}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold rounded-t-sm border-t border-x transition-all flex items-center gap-1.5 ${
                  negotiateMode === 'percentage'
                    ? 'bg-[var(--bg-elevated)] text-[#0B5D3F] border-[var(--border-hairline)] -mb-px pb-2.5'
                    : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>{t('modePercentage')}</span>
              </button>
              <button
                type="button"
                onClick={() => setNegotiateMode('reverse')}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold rounded-t-sm border-t border-x transition-all flex items-center gap-1.5 ${
                  negotiateMode === 'reverse'
                    ? 'bg-[var(--bg-elevated)] text-[#9A6B13] border-[var(--border-hairline)] -mb-px pb-2.5'
                    : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('modeReverse')}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
              {negotiateMode === 'percentage' ? (
                <div className="space-y-4">
                  {/* Quick Percentage Presets */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--text-secondary)] mb-2">
                      {t('presetLabel')}
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[15, 20, 25, 30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setTargetIncrementPct(pct)}
                          className={`py-2 rounded-sm font-mono text-xs font-bold border transition-all ${
                            targetIncrementPct === pct
                              ? 'bg-[#0B5D3F] text-white border-[#0D1F18] shadow-sm'
                              : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          +{pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="bg-[var(--bg-primary)] p-4 rounded-sm border border-[var(--border-hairline)]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--text-secondary)]">
                        {t('sliderLabel')}
                      </span>
                      <span className="font-mono text-lg font-bold text-[#0B5D3F] bg-[#0B5D3F]/10 px-2.5 py-0.5 rounded-sm border border-[#0B5D3F]/30 tabular-nums">
                        +{targetIncrementPct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={targetIncrementPct}
                      onChange={(e) => setTargetIncrementPct(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)] p-4 rounded-sm border border-[var(--border-hairline)]">
                    <CurrencyInput
                      label={t('reverseInputLabel')}
                      badge={t('reverseBadge')}
                      subtitle={t('reverseSubtitle')}
                      value={targetDesiredNet}
                      onChange={setTargetDesiredNet}
                      isPrivate={isPrivate}
                    />
                  </div>

                  <div className="bg-[#9A6B13]/10 border border-[#9A6B13]/40 p-4 rounded-sm">
                    <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#9A6B13]">
                      {t('requiredGrossLabel')}
                    </div>
                    <div className="font-mono text-2xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">
                      {renderIDR(reverseGrossBasic)}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                      {t('requiredGrossNote', { ptkp: sharedPtkp })}
                    </div>
                  </div>
                </div>
              )}

              {/* Simulation Summary Vault Voucher */}
              <div className="bg-[#0D1F18] text-[#F5EFE4] p-4 rounded-sm border border-[#9A6B13] space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#A7B8B0]">{t('targetGrossMonthly')}</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {renderIDR(targetSimulationCalc.monthly.cashGross)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-2">
                  <span className="font-mono text-[#A7B8B0]">{t('targetNetMonthly')}</span>
                  <span className="font-mono font-bold text-base text-[#4ADE80] tabular-nums">
                    {renderIDR(targetSimulationCalc.monthly.netSalary)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-2">
                  <span className="font-mono text-[#A7B8B0]">{t('targetNetAnnual')}</span>
                  <span className="font-mono font-bold text-[#EAB308] tabular-nums">
                    {renderIDR(targetSimulationCalc.annual.netSalary)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={applyTargetGrossToOffering}
                className="w-full py-3 px-4 bg-[#0B5D3F] hover:bg-[#094830] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-sm shadow-[0_2px_0_0_#111714] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('applyTargetToOffering', { name: activeOffering.name })}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: THR & DECEMBER PASAL 17 TRUE-UP PAYSLIP SIMULATOR
      ===================================================================== */}
      {showSpecialSlipsModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0D1F18]/75 backdrop-blur-sm animate-fadeIn no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSpecialSlipsModal(false)
          }}
        >
          <div className="bg-[var(--bg-elevated)] rounded-t-md sm:rounded-sm border-2 border-[var(--border-strong)] shadow-[0_24px_60px_-15px_rgba(13,31,24,0.55)] w-full max-w-3xl overflow-hidden animate-slideUp max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#0D1F18] px-5 py-4 text-[#F5EFE4] flex items-center justify-between shrink-0 border-b-2 border-[#0B5D3F]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0B5D3F]/30 rounded-sm border border-[#4ADE80]/30 text-[#4ADE80]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4ADE80]">
                    FOLIO SCHEDULE IV // IRREGULAR &amp; YEAR-END TAX AUDIT
                  </div>
                  <h3 className="text-lg font-display font-bold tracking-tight text-[#F5EFE4]">
                    {t('specialSlipsModalTitle')}
                  </h3>
                  <p className="text-[11px] text-[#A7B8B0]">{t('specialSlipsModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSpecialSlipsModal(false)}
                className="p-1.5 text-[#A7B8B0] hover:text-white rounded-sm hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
              {/* Target Dossier Selector */}
              <div className="bg-[var(--bg-primary)] p-3.5 rounded-sm border border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--text-primary)]">
                  {t('targetSimulationLabel')}
                </span>
                <div className="flex bg-[var(--bg-secondary)] p-1 rounded-sm border border-[var(--border-hairline)] gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSpecialSlipTarget('existing')
                      setThrDisbursedAmount(existingBasic)
                    }}
                    className={`px-3 py-1 rounded-sm font-mono text-xs font-bold transition-all ${
                      specialSlipTarget === 'existing'
                        ? 'bg-[#0D1F18] text-[#F5EFE4]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {t('currentSalary')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpecialSlipTarget('offering')
                      setThrDisbursedAmount(activeOffering.basic)
                    }}
                    className={`px-3 py-1 rounded-sm font-mono text-xs font-bold transition-all ${
                      specialSlipTarget === 'offering'
                        ? 'bg-[#0B5D3F] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {activeOffering.name}
                  </button>
                </div>
              </div>

              {/* Part 1: THR / Bonus Disbursed Month Simulator */}
              <div className="border border-[var(--border-strong)] rounded-sm overflow-hidden bg-[var(--bg-elevated)]">
                <div className="bg-[var(--bg-secondary)] px-4 py-3 border-b border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                      1. {t('thrSectionTitle')}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">{t('thrSectionSubtitle')}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setThrDisbursedAmount(
                          specialSlipTarget === 'existing' ? existingBasic : activeOffering.basic
                        )
                      }
                      className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded-sm hover:border-[#0B5D3F]"
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
                      className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded-sm hover:border-[#0B5D3F]"
                    >
                      {t('disbursedPreset2x')}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <CurrencyInput
                    label={t('disbursedLabel')}
                    badge={t('disbursedBadge')}
                    value={thrDisbursedAmount}
                    onChange={setThrDisbursedAmount}
                    isPrivate={isPrivate}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Regular Month Slip */}
                    <div className="bg-[var(--bg-primary)] p-4 rounded-sm border border-[var(--border-hairline)] space-y-2 text-xs">
                      <div className="font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-hairline)] pb-1.5">
                        {t('slipRegularTitle')}
                      </div>
                      <div className="flex justify-between">
                        <span>{t('slipRegularGross')}</span>
                        <span className="font-mono font-bold tabular-nums">
                          {renderIDR(bonusMonthSim.regularMonthlyGross)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#B42318]">
                        <span>
                          {t('slipRegularPph21')} ({bonusMonthSim.regularTerPct}%)
                        </span>
                        <span className="font-mono font-bold tabular-nums">
                          -{renderIDR(bonusMonthSim.regularPph21)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-[var(--border-hairline)] pt-2 font-bold text-sm">
                        <span>{t('slipRegularNet')}</span>
                        <span className="font-mono text-[var(--text-primary)] tabular-nums">
                          {renderIDR(bonusMonthSim.regularMonthlyNet)}
                        </span>
                      </div>
                    </div>

                    {/* THR / Bonus Month Slip */}
                    <div className="bg-[#0D1F18] text-[#F5EFE4] p-4 rounded-sm border border-[#9A6B13] space-y-2 text-xs">
                      <div className="font-mono font-bold uppercase tracking-wider text-[#E5B85B] border-b border-white/10 pb-1.5">
                        {t('slipBonusTitle')}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A7B8B0]">{t('slipBonusGross')}</span>
                        <span className="font-mono font-bold text-white tabular-nums">
                          {renderIDR(bonusMonthSim.disbursedCashGross)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#F87171]">
                        <span>
                          {t('slipBonusPph21')} ({bonusMonthSim.disbursedTerPct}%)
                        </span>
                        <span className="font-mono font-bold tabular-nums">
                          -{renderIDR(bonusMonthSim.disbursedPph21)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-white/15 pt-2 font-bold text-sm">
                        <span className="text-[#E5B85B]">{t('slipBonusNet')}</span>
                        <span className="font-mono text-[#4ADE80] tabular-nums">
                          {renderIDR(bonusMonthSim.disbursedNetSalary)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: December Pasal 17 True-Up Reconciliation */}
              <div className="border border-[var(--border-strong)] rounded-sm overflow-hidden bg-[var(--bg-elevated)]">
                <div className="bg-[var(--bg-secondary)] px-4 py-3 border-b border-[var(--border-hairline)]">
                  <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                    2. {t('decTrueUpTitle')}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">{t('decTrueUpSubtitle')}</p>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[var(--bg-primary)] p-3.5 rounded-sm border border-[var(--border-hairline)] space-y-1.5">
                    <div className="font-mono font-bold text-[11px] uppercase text-[var(--text-secondary)]">
                      {t('decCol1Title')}
                    </div>
                    <div className="flex justify-between">
                      <span>{t('decCol1Routine')}</span>
                      <span className="font-mono tabular-nums">
                        {renderIDR(decemberTrueUpSim.regularMonthlyTerTax)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-[var(--border-hairline)] pt-1.5">
                      <span>{t('decCol1Total')}</span>
                      <span className="font-mono text-[#B42318] tabular-nums">
                        {renderIDR(decemberTrueUpSim.totalPaidJanNov)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-primary)] p-3.5 rounded-sm border border-[var(--border-hairline)] space-y-1.5">
                    <div className="font-mono font-bold text-[11px] uppercase text-[var(--text-secondary)]">
                      {t('decCol2Title')}
                    </div>
                    <div className="flex justify-between">
                      <span>{t('decCol2Annual')}</span>
                      <span className="font-mono tabular-nums">
                        {renderIDR(decemberTrueUpSim.totalAnnualTax)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-[var(--border-hairline)] pt-1.5">
                      <span>{t('decCol2Remaining')}</span>
                      <span className="font-mono text-[#9A6B13] tabular-nums">
                        {renderIDR(decemberTrueUpSim.decemberPph21)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#0D1F18] text-[#F5EFE4] p-3.5 rounded-sm border border-[#0B5D3F] space-y-1.5">
                    <div className="font-mono font-bold text-[11px] uppercase text-[#4ADE80]">
                      {t('decCol3Title')}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A7B8B0]">{t('decCol3Tax')}</span>
                      <span className="font-mono text-[#F87171] tabular-nums">
                        -{renderIDR(decemberTrueUpSim.decemberPph21)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-white/15 pt-1.5">
                      <span className="text-[#E5B85B]">{t('decCol3Net')}</span>
                      <span className="font-mono text-[#4ADE80] tabular-nums">
                        {renderIDR(decemberTrueUpSim.decemberNetSalary)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: RESET & CLEAR DATA
      ===================================================================== */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1F18]/75 backdrop-blur-sm animate-fadeIn no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResetModal(false)
          }}
        >
          <div className="bg-[var(--bg-elevated)] rounded-sm border-2 border-[var(--border-strong)] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#9A6B13]/15 text-[#9A6B13] border border-[#9A6B13]/30 rounded-sm">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">
                    {t('resetModalTitle')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">{t('resetModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
              {t('resetModalDesc')}
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={clearAllNumbersToZero}
                className="w-full py-2.5 px-4 rounded-sm border border-[#B42318]/40 bg-[#B42318]/10 hover:bg-[#B42318] text-[#B42318] hover:text-white font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('clearAllToZeroBtn')}</span>
              </button>

              <button
                type="button"
                onClick={resetToDemoDefaults}
                className="w-full py-2.5 px-4 rounded-sm border border-[var(--border-strong)] bg-[var(--bg-primary)] hover:bg-[#0D1F18] text-[var(--text-primary)] hover:text-[#F5EFE4] font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('resetToDemoBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-full py-2 text-xs font-mono uppercase tracking-wider font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {t('cancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

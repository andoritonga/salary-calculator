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
  return (
    <>
      {/* =====================================================================
          MODAL 1: NEGOTIATION & REVERSE NET-TO-GROSS CALCULATOR
      ===================================================================== */}
      {showNegotiateModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNegotiateModal(false)
          }}
        >
          <div className="bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-slate-800 shadow-2xl w-full max-w-xl overflow-hidden animate-slideUp max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    {t('negotiateModalTitle')}
                  </h3>
                  <p className="text-xs text-emerald-100">{t('negotiateModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNegotiateModal(false)}
                className="p-1.5 text-emerald-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-slate-950/60 px-6 pt-3 border-b border-slate-800 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setNegotiateMode('percentage')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 ${
                  negotiateMode === 'percentage'
                    ? 'bg-slate-900 text-emerald-400 border-slate-800 -mb-px pb-2.5'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>{t('modePercentage')}</span>
              </button>
              <button
                type="button"
                onClick={() => setNegotiateMode('reverse')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 ${
                  negotiateMode === 'reverse'
                    ? 'bg-slate-900 text-sky-400 border-slate-800 -mb-px pb-2.5'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('modeReverse')}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {negotiateMode === 'percentage' ? (
                <div className="space-y-4">
                  {/* Quick Percentage Presets */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {t('presetLabel')}
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[15, 20, 25, 30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setTargetIncrementPct(pct)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            targetIncrementPct === pct
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                              : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          +{pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-400">
                        {t('sliderLabel')}
                      </span>
                      <span className="text-base font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/25 tabular-nums">
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
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <CurrencyInput
                      label={t('reverseInputLabel')}
                      badge={t('reverseBadge')}
                      subtitle={t('reverseSubtitle')}
                      value={targetDesiredNet}
                      onChange={setTargetDesiredNet}
                      isPrivate={isPrivate}
                    />
                  </div>

                  <div className="bg-sky-500/10 border border-sky-500/25 p-4 rounded-xl">
                    <div className="text-xs font-semibold text-sky-400">
                      {t('requiredGrossLabel')}
                    </div>
                    <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                      {renderIDR(reverseGrossBasic)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {t('requiredGrossNote', { ptkp: sharedPtkp })}
                    </div>
                  </div>
                </div>
              )}

              {/* Simulation Summary Card */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{t('targetGrossMonthly')}</span>
                  <span className="font-semibold text-slate-200 tabular-nums">
                    {renderIDR(targetSimulationCalc.monthly.cashGross)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-300 font-medium">{t('targetNetMonthly')}</span>
                  <span className="font-bold text-base text-emerald-400 tabular-nums">
                    {renderIDR(targetSimulationCalc.monthly.netSalary)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">{t('targetNetAnnual')}</span>
                  <span className="font-semibold text-sky-400 tabular-nums">
                    {renderIDR(targetSimulationCalc.annual.netSalary)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={applyTargetGrossToOffering}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/15 transition-all flex items-center justify-center gap-2"
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSpecialSlipsModal(false)
          }}
        >
          <div className="bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden animate-slideUp max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    {t('specialSlipsModalTitle')}
                  </h3>
                  <p className="text-xs text-sky-100">{t('specialSlipsModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSpecialSlipsModal(false)}
                className="p-1.5 text-sky-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
              {/* Target Selector */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-300">
                  {t('targetSimulationLabel')}
                </span>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSpecialSlipTarget('existing')
                      setThrDisbursedAmount(existingBasic)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      specialSlipTarget === 'existing'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      specialSlipTarget === 'offering'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {activeOffering.name}
                  </button>
                </div>
              </div>

              {/* Part 1: THR / Bonus Disbursed Month Simulator */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                <div className="bg-slate-900/90 px-4 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      1. {t('thrSectionTitle')}
                    </h4>
                    <p className="text-xs text-slate-400">{t('thrSectionSubtitle')}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setThrDisbursedAmount(
                          specialSlipTarget === 'existing' ? existingBasic : activeOffering.basic
                        )
                      }
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800/80 border border-slate-700 rounded-lg hover:border-emerald-500/50 text-slate-200 transition-colors"
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
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800/80 border border-slate-700 rounded-lg hover:border-emerald-500/50 text-slate-200 transition-colors"
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
                      className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 rounded-lg hover:border-emerald-400 text-emerald-300 transition-colors"
                    >
                      {t('disbursedPresetPackage')}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Regular Month Slip */}
                    <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="font-semibold text-slate-400 border-b border-slate-800 pb-1.5">
                        {t('slipRegularTitle')}
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>{t('slipRegularGross')}</span>
                        <span className="font-semibold text-white tabular-nums">
                          {renderIDR(bonusMonthSim.regularMonthlyGross)}
                        </span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>
                          {t('slipRegularPph21')} ({bonusMonthSim.regularTerPct}%)
                        </span>
                        <span className="font-semibold tabular-nums">
                          -{renderIDR(bonusMonthSim.regularPph21)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                        <span className="text-slate-200">{t('slipRegularNet')}</span>
                        <span className="text-white tabular-nums">
                          {renderIDR(bonusMonthSim.regularMonthlyNet)}
                        </span>
                      </div>
                    </div>

                    {/* THR / Bonus Month Slip */}
                    <div className="bg-emerald-500/[0.08] p-4 rounded-xl border border-emerald-500/25 space-y-2 text-xs">
                      <div className="font-semibold text-emerald-300 border-b border-emerald-500/20 pb-1.5">
                        {t('slipBonusTitle')}
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>{t('slipBonusGross')}</span>
                        <span className="font-semibold text-white tabular-nums">
                          {renderIDR(bonusMonthSim.disbursedCashGross)}
                        </span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>
                          {t('slipBonusPph21')} ({bonusMonthSim.disbursedTerPct}%)
                        </span>
                        <span className="font-semibold tabular-nums">
                          -{renderIDR(bonusMonthSim.disbursedPph21)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-emerald-500/20 pt-2 font-bold text-sm">
                        <span className="text-emerald-200">{t('slipBonusNet')}</span>
                        <span className="text-emerald-400 tabular-nums">
                          {renderIDR(bonusMonthSim.disbursedNetSalary)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: December Pasal 17 True-Up Reconciliation */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                <div className="bg-slate-900/90 px-4 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      2. {t('decTrueUpTitle')}
                    </h4>
                    <p className="text-xs text-slate-400">{t('decTrueUpSubtitle')}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                      decemberTrueUpSim.rawDecemberPph21 < 0
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : decemberTrueUpSim.status === 'underpaid'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
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
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                      {t('decCol1Title')}
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('decCol1Routine')}</span>
                      <span className="tabular-nums text-white">
                        {renderIDR(decemberTrueUpSim.routineJanNovTax)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sky-400">
                      <span>{t('decCol1BonusSpike')}</span>
                      <span className="tabular-nums">
                        +{renderIDR(decemberTrueUpSim.bonusTerTax)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-slate-800 pt-1.5">
                      <span className="text-slate-200">{t('decCol1Total')}</span>
                      <span className="text-rose-400 tabular-nums">
                        {renderIDR(decemberTrueUpSim.totalPaidJanNov)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                      {t('decCol2Title')}
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('decCol2Gross')}</span>
                      <span className="tabular-nums text-white">
                        {renderIDR(decemberTrueUpSim.annualCashGross)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('decCol2Annual')}</span>
                      <span className="tabular-nums text-white">
                        {renderIDR(decemberTrueUpSim.totalAnnualTax)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-slate-800 pt-1.5">
                      <span className="text-slate-200">
                        {decemberTrueUpSim.rawDecemberPph21 < 0
                          ? t('decCol2Overpaid')
                          : t('decCol2Remaining')}
                      </span>
                      <span
                        className={`tabular-nums ${
                          decemberTrueUpSim.rawDecemberPph21 < 0
                            ? 'text-emerald-400'
                            : 'text-sky-400'
                        }`}
                      >
                        {decemberTrueUpSim.rawDecemberPph21 < 0
                          ? `+${renderIDR(decemberTrueUpSim.overpaidTax)}`
                          : renderIDR(decemberTrueUpSim.decemberPph21)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-500/[0.08] p-3.5 rounded-xl border border-emerald-500/25 space-y-1.5">
                    <div className="font-semibold text-[11px] uppercase tracking-wider text-emerald-300">
                      {t('decCol3Title')}
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('slipRegularGross')}</span>
                      <span className="text-white tabular-nums">
                        {renderIDR(decemberTrueUpSim.monthlyCashGross)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>
                        {decemberTrueUpSim.rawDecemberPph21 < 0
                          ? t('decCol3Refund')
                          : t('decCol3Tax')}
                      </span>
                      <span
                        className={`tabular-nums font-medium ${
                          decemberTrueUpSim.rawDecemberPph21 < 0 ? 'text-emerald-400' : 'text-rose-400'
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
                    <div className="flex justify-between font-bold border-t border-emerald-500/20 pt-1.5">
                      <span className="text-emerald-200">{t('decCol3Net')}</span>
                      <span className="text-emerald-400 tabular-nums">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResetModal(false)
          }}
        >
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-slideUp p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-xl">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {t('resetModalTitle')}
                  </h3>
                  <p className="text-xs text-slate-400">{t('resetModalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              {t('resetModalDesc')}
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={clearAllNumbersToZero}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('clearAllToZeroBtn')}</span>
              </button>

              <button
                type="button"
                onClick={resetToDemoDefaults}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('resetToDemoBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
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

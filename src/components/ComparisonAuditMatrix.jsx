import React from 'react'
import {
  CheckCircle2,
  Calendar,
} from 'lucide-react'

function MobileCleanAuditRow({
  title,
  badge,
  description,
  currentLabel,
  offeringLabel,
  currentValue,
  offeringValue,
  deltaBadge,
  valuePrefix = '',
  isDeduction = false,
  accentColor = 'emerald',
}) {
  const offeringCardStyle = isDeduction
    ? 'bg-rose-500/[0.06] border-rose-500/20'
    : accentColor === 'sky'
      ? 'bg-sky-500/[0.07] border-sky-500/25'
      : 'bg-emerald-500/[0.07] border-emerald-500/25'

  const offeringLabelStyle = isDeduction
    ? 'text-rose-400'
    : accentColor === 'sky'
      ? 'text-sky-400'
      : 'text-emerald-400'

  const currentValStyle = isDeduction ? 'text-rose-300/90' : 'text-slate-200'
  const offeringValStyle = isDeduction
    ? 'text-rose-300'
    : accentColor === 'sky'
      ? 'text-sky-300'
      : 'text-emerald-300'

  return (
    <div className="p-3.5 sm:p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className={`font-semibold text-xs ${isDeduction ? 'text-rose-100' : 'text-slate-100'}`}>
              {title}
            </span>
            {badge}
          </div>
          {description && (
            <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>
          )}
        </div>
        <div className="shrink-0 pt-0.5">{deltaBadge}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2">
          <div className="text-[10px] font-medium text-slate-400 truncate">
            {currentLabel}
          </div>
          <div className={`text-xs font-semibold font-mono tabular-nums mt-0.5 ${currentValStyle}`}>
            {valuePrefix}
            {currentValue}
          </div>
        </div>

        <div className={`border rounded-xl px-3 py-2 ${offeringCardStyle}`}>
          <div className={`text-[10px] font-semibold truncate ${offeringLabelStyle}`}>
            {offeringLabel}
          </div>
          <div className={`text-xs font-bold font-mono tabular-nums mt-0.5 ${offeringValStyle}`}>
            {valuePrefix}
            {offeringValue}
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileCleanSubtotalRow({
  title,
  currentLabel,
  offeringLabel,
  currentValue,
  offeringValue,
  deltaBadge,
  valuePrefix = '',
  isDeduction = false,
  accentColor = 'emerald',
}) {
  const containerStyle = isDeduction
    ? 'bg-rose-950/20 border-y border-rose-900/30 text-rose-200'
    : 'bg-slate-950/50 border-y border-slate-800/80 text-slate-100'

  const offeringTextStyle = isDeduction
    ? 'text-rose-400'
    : accentColor === 'sky'
      ? 'text-sky-400'
      : 'text-emerald-400'

  return (
    <div className={`p-3.5 sm:p-4 space-y-2 ${containerStyle}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold">{title}</span>
        <div className="shrink-0">{deltaBadge}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-3 py-2">
          <div className="text-[10px] text-slate-400 truncate">{currentLabel}</div>
          <div className="text-xs font-bold font-mono tabular-nums mt-0.5">
            {valuePrefix}
            {currentValue}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl px-3 py-2">
          <div className={`text-[10px] font-semibold truncate ${offeringTextStyle}`}>
            {offeringLabel}
          </div>
          <div className={`text-xs font-extrabold font-mono tabular-nums mt-0.5 ${offeringTextStyle}`}>
            {valuePrefix}
            {offeringValue}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComparisonAuditMatrix({
  t,
  tablePeriod,
  setTablePeriod,
  existingCalc,
  offeringCalc,
  activeOffering,
  existingTaxMethod,
  annualMultiplier,
  deltaMonthlyGross,
  deltaMonthlyNet,
  deltaMonthlyNetPct,
  deltaAnnualGross,
  deltaAnnualNet,
  deltaAnnualNetPct,
  renderIDR,
  renderDeltaBadge,
}) {
  const currentHeaderLabel = `${t('thCurrent')} (${existingTaxMethod.toUpperCase()})`
  const offeringHeaderLabel = `${activeOffering.name} (${activeOffering.taxMethod.toUpperCase()})`

  return (
    <section id="section-breakdown" className="space-y-5 print-clean scroll-mt-20">
      {/* Clean Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {t('breakdownTitle')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('breakdownSubtitle')}
          </p>
        </div>

        {/* Period Switcher Pill */}
        <div className="grid grid-cols-3 sm:flex bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 text-xs w-full sm:w-auto gap-1 shrink-0">
          {[
            { id: 'monthly', label: t('periodMonthly') },
            { id: 'annual', label: t('periodAnnual') },
            { id: 'both', label: t('periodAll') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTablePeriod(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-center ${
                tablePeriod === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CARD 1: ARUS KAS BULANAN (MONTHLY ROUTINE) */}
      {(tablePeriod === 'both' || tablePeriod === 'monthly') && (
        <div className="bg-slate-900/75 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
          {/* Card Subheader */}
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-950/50 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {t('card1Title')}
                </h4>
                <p className="text-[11px] text-slate-400">{t('card1Subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs w-full sm:w-auto">
              <span className="text-slate-400 text-[11px]">{t('deltaNetThp')}</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold font-mono tabular-nums ${
                    deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {deltaMonthlyNet >= 0 ? '+' : ''}
                  {renderIDR(deltaMonthlyNet)}
                  {t('perMonth')}
                </span>
                <span
                  className={`font-bold text-[11px] ${
                    deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  ({deltaMonthlyNetPct >= 0 ? '+' : ''}
                  {deltaMonthlyNetPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE / PWA STACKED COMPARISON CARDS (< md) */}
          <div className="md:hidden divide-y divide-slate-800/60">
            {/* Group 1 Header */}
            <div className="py-2 px-3.5 bg-slate-950/40 text-[11px] uppercase tracking-wider text-emerald-400/90 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{t('groupGrossMonthly')}</span>
            </div>

            <MobileCleanAuditRow
              title={t('basicSalaryLabel')}
              description={t('basicSalaryDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.basic)}
              offeringValue={renderIDR(offeringCalc.basic)}
              deltaBadge={renderDeltaBadge(offeringCalc.basic - existingCalc.basic)}
            />

            <MobileCleanAuditRow
              title={t('fixedAllowanceLabel')}
              description={t('fixedAllowanceDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.fixed)}
              offeringValue={renderIDR(offeringCalc.fixed)}
              deltaBadge={renderDeltaBadge(offeringCalc.fixed - existingCalc.fixed)}
            />

            <MobileCleanSubtotalRow
              title={t('subtotalGrossMonthly')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.monthly.cashGross)}
              offeringValue={renderIDR(offeringCalc.monthly.cashGross)}
              deltaBadge={renderDeltaBadge(deltaMonthlyGross)}
            />

            {/* Group 2 Header */}
            <div className="py-2 px-3.5 bg-slate-950/40 text-[11px] uppercase tracking-wider text-rose-400/90 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{t('groupDeductionsMonthly')}</span>
            </div>

            <MobileCleanAuditRow
              title={t('pph21TerLabel')}
              badge={
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-medium">
                  {existingCalc.terCategory} {existingCalc.terPercentage}% ➔{' '}
                  {offeringCalc.terCategory} {offeringCalc.terPercentage}%
                </span>
              }
              description={t('pph21TerDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.monthly.pph21)}
              offeringValue={renderIDR(offeringCalc.monthly.pph21)}
              valuePrefix="-"
              isDeduction
              deltaBadge={renderDeltaBadge(
                offeringCalc.monthly.pph21 - existingCalc.monthly.pph21,
                true
              )}
            />

            <MobileCleanAuditRow
              title={t('bpjsKesLabelShort')}
              description={t('bpjsKesDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.monthly.bpjs.kesEmployee)}
              offeringValue={renderIDR(offeringCalc.monthly.bpjs.kesEmployee)}
              valuePrefix="-"
              isDeduction
              deltaBadge={renderDeltaBadge(
                offeringCalc.monthly.bpjs.kesEmployee -
                  existingCalc.monthly.bpjs.kesEmployee,
                true
              )}
            />

            <MobileCleanAuditRow
              title={t('bpjsTkLabelShort')}
              description={t('bpjsTkDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(
                existingCalc.monthly.bpjs.jhtEmployee +
                  existingCalc.monthly.bpjs.jpEmployee
              )}
              offeringValue={renderIDR(
                offeringCalc.monthly.bpjs.jhtEmployee +
                  offeringCalc.monthly.bpjs.jpEmployee
              )}
              valuePrefix="-"
              isDeduction
              deltaBadge={renderDeltaBadge(
                offeringCalc.monthly.bpjs.jhtEmployee +
                  offeringCalc.monthly.bpjs.jpEmployee -
                  (existingCalc.monthly.bpjs.jhtEmployee +
                    existingCalc.monthly.bpjs.jpEmployee),
                true
              )}
            />

            <MobileCleanSubtotalRow
              title={t('subtotalDeductionsMonthly')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.monthly.totalDeductions)}
              offeringValue={renderIDR(offeringCalc.monthly.totalDeductions)}
              valuePrefix="-"
              isDeduction
              deltaBadge={renderDeltaBadge(
                offeringCalc.monthly.totalDeductions -
                  existingCalc.monthly.totalDeductions,
                true
              )}
            />

            {/* Mobile Hero Summary Footer (Monthly THP) */}
            <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 p-4 border-t border-emerald-500/30 space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold tracking-wide text-emerald-300 uppercase block">
                    {t('heroNetMonthlyTitle')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {t('heroNetMonthlySubtitle')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentHeaderLabel}
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-200 tabular-nums mt-0.5">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5">
                  <div className="text-[10px] font-semibold text-emerald-400 truncate">
                    {offeringHeaderLabel}
                  </div>
                  <div className="font-mono text-sm font-extrabold text-emerald-400 tabular-nums mt-0.5">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-medium text-slate-400">
                  {t('thDelta')}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono tabular-nums ${
                      deltaMonthlyNet >= 0
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {deltaMonthlyNet >= 0 ? '+' : ''}
                    {renderIDR(deltaMonthlyNet)}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      deltaMonthlyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    ({deltaMonthlyNetPct >= 0 ? '+' : ''}
                    {deltaMonthlyNetPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP 4-COLUMN TABLE (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 text-xs">
                  <th className="py-3 px-6 font-semibold w-5/12">{t('thComponent')}</th>
                  <th className="py-3 px-4 font-semibold text-right w-7/32">
                    {t('thCurrent')}{' '}
                    <span className="text-[10px] text-slate-500">
                      ({existingTaxMethod.toUpperCase()})
                    </span>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-emerald-400 w-7/32">
                    {activeOffering.name}{' '}
                    <span className="text-[10px] text-emerald-500/70">
                      ({activeOffering.taxMethod.toUpperCase()})
                    </span>
                  </th>
                  <th className="py-3 px-6 font-semibold text-right w-1/4">
                    {t('thDelta')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                  <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider text-emerald-400/90 font-semibold">
                    {t('groupGrossMonthly')}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-slate-200">{t('basicSalaryLabel')}</div>
                    <div className="text-[10px] text-slate-400">{t('basicSalaryDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">
                    {renderIDR(existingCalc.basic)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-100 font-mono tabular-nums font-medium">
                    {renderIDR(offeringCalc.basic)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(offeringCalc.basic - existingCalc.basic)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-slate-200">{t('fixedAllowanceLabel')}</div>
                    <div className="text-[10px] text-slate-400">{t('fixedAllowanceDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">
                    {renderIDR(existingCalc.fixed)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-100 font-mono tabular-nums font-medium">
                    {renderIDR(offeringCalc.fixed)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(offeringCalc.fixed - existingCalc.fixed)}
                  </td>
                </tr>
                <tr className="bg-slate-950/60 border-y border-slate-800 font-semibold">
                  <td className="py-2.5 px-6 text-slate-200">{t('subtotalGrossMonthly')}</td>
                  <td className="py-2.5 px-4 text-right text-slate-200 font-mono tabular-nums">
                    {renderIDR(existingCalc.monthly.cashGross)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-emerald-300 font-mono tabular-nums">
                    {renderIDR(offeringCalc.monthly.cashGross)}
                  </td>
                  <td className="py-2.5 px-6 text-right">
                    {renderDeltaBadge(deltaMonthlyGross)}
                  </td>
                </tr>

                <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                  <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider text-rose-400/90 font-semibold">
                    {t('groupDeductionsMonthly')}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-rose-200 flex items-center gap-2">
                      <span>{t('pph21TerLabel')}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-medium">
                        {existingCalc.terCategory} {existingCalc.terPercentage}% vs{' '}
                        {offeringCalc.terCategory} {offeringCalc.terPercentage}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">{t('pph21TerDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -{renderIDR(existingCalc.monthly.pph21)}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -{renderIDR(offeringCalc.monthly.pph21)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.monthly.pph21 - existingCalc.monthly.pph21,
                      true
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-rose-200">{t('bpjsKesLabelShort')}</div>
                    <div className="text-[10px] text-slate-400">{t('bpjsKesDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -{renderIDR(existingCalc.monthly.bpjs.kesEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -{renderIDR(offeringCalc.monthly.bpjs.kesEmployee)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.monthly.bpjs.kesEmployee -
                        existingCalc.monthly.bpjs.kesEmployee,
                      true
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-rose-200">{t('bpjsTkLabelShort')}</div>
                    <div className="text-[10px] text-slate-400">{t('bpjsTkDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -
                    {renderIDR(
                      existingCalc.monthly.bpjs.jhtEmployee +
                        existingCalc.monthly.bpjs.jpEmployee
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -
                    {renderIDR(
                      offeringCalc.monthly.bpjs.jhtEmployee +
                        offeringCalc.monthly.bpjs.jpEmployee
                    )}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.monthly.bpjs.jhtEmployee +
                        offeringCalc.monthly.bpjs.jpEmployee -
                        (existingCalc.monthly.bpjs.jhtEmployee +
                          existingCalc.monthly.bpjs.jpEmployee),
                      true
                    )}
                  </td>
                </tr>
                <tr className="bg-rose-950/20 border-y border-rose-900/30 font-semibold text-rose-300">
                  <td className="py-2.5 px-6">{t('subtotalDeductionsMonthly')}</td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                    -{renderIDR(existingCalc.monthly.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                    -{renderIDR(offeringCalc.monthly.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.monthly.totalDeductions -
                        existingCalc.monthly.totalDeductions,
                      true
                    )}
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-t-2 border-emerald-500/40 text-white">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-xs sm:text-sm font-extrabold tracking-wide text-emerald-300 uppercase block">
                          {t('heroNetMonthlyTitle')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {t('heroNetMonthlySubtitle')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-200 font-mono tabular-nums text-xs sm:text-sm font-bold">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </td>
                  <td className="py-4 px-4 text-right text-emerald-400 font-mono tabular-nums text-sm sm:text-base font-extrabold">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm font-mono tabular-nums ${
                          deltaMonthlyNet >= 0
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {deltaMonthlyNet >= 0 ? '+' : ''}
                        {renderIDR(deltaMonthlyNet)}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 mt-1">
                        ({deltaMonthlyNetPct >= 0 ? '+' : ''}
                        {deltaMonthlyNetPct.toFixed(1)}%)
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
        <div className="bg-slate-900/75 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
          {/* Card Subheader */}
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-950/50 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {t('card2Title', { multiplier: annualMultiplier })}
                </h4>
                <p className="text-[11px] text-slate-400">{t('card2Subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs w-full sm:w-auto">
              <span className="text-slate-400 text-[11px]">{t('deltaNetAnnual')}</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold font-mono tabular-nums ${
                    deltaAnnualNet >= 0 ? 'text-sky-400' : 'text-rose-400'
                  }`}
                >
                  {deltaAnnualNet >= 0 ? '+' : ''}
                  {renderIDR(deltaAnnualNet)}
                  {t('perYear')}
                </span>
                <span
                  className={`font-bold text-[11px] ${
                    deltaAnnualNet >= 0 ? 'text-sky-400' : 'text-rose-400'
                  }`}
                >
                  ({deltaAnnualNetPct >= 0 ? '+' : ''}
                  {deltaAnnualNetPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE / PWA STACKED COMPARISON CARDS (< md) */}
          <div className="md:hidden divide-y divide-slate-800/60">
            {/* Group 1 Header */}
            <div className="py-2 px-3.5 bg-slate-950/40 text-[11px] uppercase tracking-wider text-sky-400/90 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>{t('groupGrossAnnual')}</span>
            </div>

            <MobileCleanAuditRow
              title={t('annualRoutineSalary', { multiplier: annualMultiplier })}
              description={t('annualRoutineSalaryDesc', {
                thrMonths: annualMultiplier - 12,
              })}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(
                existingCalc.monthly.cashGross * annualMultiplier
              )}
              offeringValue={renderIDR(
                offeringCalc.monthly.cashGross * annualMultiplier
              )}
              accentColor="sky"
              deltaBadge={renderDeltaBadge(
                (offeringCalc.monthly.cashGross -
                  existingCalc.monthly.cashGross) *
                  annualMultiplier
              )}
            />

            <MobileCleanAuditRow
              title={t('bonusLabel')}
              description={t('annualBonusDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.bonus)}
              offeringValue={renderIDR(offeringCalc.annual.bonus)}
              accentColor="sky"
              deltaBadge={renderDeltaBadge(
                offeringCalc.annual.bonus - existingCalc.annual.bonus
              )}
            />

            <MobileCleanSubtotalRow
              title={t('subtotalGrossAnnual')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.cashGross)}
              offeringValue={renderIDR(offeringCalc.annual.cashGross)}
              accentColor="sky"
              deltaBadge={renderDeltaBadge(deltaAnnualGross)}
            />

            {/* Group 2 Header */}
            <div className="py-2 px-3.5 bg-slate-950/40 text-[11px] uppercase tracking-wider text-rose-400/90 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{t('groupDeductionsAnnual')}</span>
            </div>

            <MobileCleanAuditRow
              title={t('annualPph21Label')}
              description={t('annualPph21Desc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.pph21)}
              offeringValue={renderIDR(offeringCalc.annual.pph21)}
              valuePrefix="-"
              isDeduction
              deltaBadge={renderDeltaBadge(
                offeringCalc.annual.pph21 - existingCalc.annual.pph21,
                true
              )}
            />

            <MobileCleanAuditRow
              title={t('annualBpjsEmployeeLabel')}
              description={t('annualBpjsEmployeeDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.bpjs.totalEmployee)}
              offeringValue={renderIDR(offeringCalc.annual.bpjs.totalEmployee)}
              valuePrefix="-"
              isDeduction
              deltaBadge={renderDeltaBadge(
                offeringCalc.annual.bpjs.totalEmployee -
                  existingCalc.annual.bpjs.totalEmployee,
                true
              )}
            />

            <MobileCleanSubtotalRow
              title={t('subtotalDeductionsAnnual')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.totalDeductions)}
              offeringValue={renderIDR(offeringCalc.annual.totalDeductions)}
              valuePrefix="-"
              isDeduction
              deltaBadge={renderDeltaBadge(
                offeringCalc.annual.totalDeductions -
                  existingCalc.annual.totalDeductions,
                true
              )}
            />

            {/* Group 3 Header */}
            <div className="py-2 px-3.5 bg-slate-950/40 text-[11px] uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{t('groupEmployerBenefit')}</span>
            </div>

            <MobileCleanAuditRow
              title={t('employerBpjsLabel')}
              description={t('employerBpjsDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.bpjs.totalEmployer)}
              offeringValue={renderIDR(offeringCalc.annual.bpjs.totalEmployer)}
              valuePrefix="+"
              accentColor="sky"
              deltaBadge={renderDeltaBadge(
                offeringCalc.annual.bpjs.totalEmployer -
                  existingCalc.annual.bpjs.totalEmployer
              )}
            />

            {/* Mobile Hero Summary Footer (Annual THP) */}
            <div className="bg-gradient-to-br from-sky-950/50 via-slate-900 to-slate-950 p-4 border-t border-sky-500/30 space-y-3">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold tracking-wide text-sky-300 uppercase block">
                    {t('heroNetAnnualTitle')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {t('heroNetAnnualSubtitle')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentHeaderLabel}
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-200 tabular-nums mt-0.5">
                    {renderIDR(existingCalc.annual.netSalary)}
                  </div>
                </div>

                <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-2.5">
                  <div className="text-[10px] font-semibold text-sky-400 truncate">
                    {offeringHeaderLabel}
                  </div>
                  <div className="font-mono text-sm font-extrabold text-sky-400 tabular-nums mt-0.5">
                    {renderIDR(offeringCalc.annual.netSalary)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-medium text-slate-400">
                  {t('thDelta')}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono tabular-nums ${
                      deltaAnnualNet >= 0
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {deltaAnnualNet >= 0 ? '+' : ''}
                    {renderIDR(deltaAnnualNet)}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      deltaAnnualNet >= 0 ? 'text-sky-400' : 'text-rose-400'
                    }`}
                  >
                    ({deltaAnnualNetPct >= 0 ? '+' : ''}
                    {deltaAnnualNetPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP 4-COLUMN TABLE (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 text-xs">
                  <th className="py-3 px-6 font-semibold w-5/12">
                    {t('thComponentAnnual')}
                  </th>
                  <th className="py-3 px-4 font-semibold text-right w-7/32">
                    {t('thCurrent')}{' '}
                    <span className="text-[10px] text-slate-500">
                      ({existingTaxMethod.toUpperCase()})
                    </span>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-sky-400 w-7/32">
                    {activeOffering.name}{' '}
                    <span className="text-[10px] text-sky-500/70">
                      ({activeOffering.taxMethod.toUpperCase()})
                    </span>
                  </th>
                  <th className="py-3 px-6 font-semibold text-right w-1/4">
                    {t('thDelta')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                  <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider text-sky-400/90 font-semibold">
                    {t('groupGrossAnnual')}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-slate-200">
                      {t('annualRoutineSalary', { multiplier: annualMultiplier })}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t('annualRoutineSalaryDesc', {
                        thrMonths: annualMultiplier - 12,
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">
                    {renderIDR(existingCalc.monthly.cashGross * annualMultiplier)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-100 font-mono tabular-nums font-medium">
                    {renderIDR(offeringCalc.monthly.cashGross * annualMultiplier)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      (offeringCalc.monthly.cashGross -
                        existingCalc.monthly.cashGross) *
                        annualMultiplier
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-slate-200">{t('bonusLabel')}</div>
                    <div className="text-[10px] text-slate-400">{t('annualBonusDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">
                    {renderIDR(existingCalc.annual.bonus)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-100 font-mono tabular-nums font-medium">
                    {renderIDR(offeringCalc.annual.bonus)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.annual.bonus - existingCalc.annual.bonus
                    )}
                  </td>
                </tr>
                <tr className="bg-slate-950/60 border-y border-slate-800 font-semibold">
                  <td className="py-2.5 px-6 text-slate-200">{t('subtotalGrossAnnual')}</td>
                  <td className="py-2.5 px-4 text-right text-slate-200 font-mono tabular-nums">
                    {renderIDR(existingCalc.annual.cashGross)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-sky-300 font-mono tabular-nums">
                    {renderIDR(offeringCalc.annual.cashGross)}
                  </td>
                  <td className="py-2.5 px-6 text-right">
                    {renderDeltaBadge(deltaAnnualGross)}
                  </td>
                </tr>

                <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                  <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider text-rose-400/90 font-semibold">
                    {t('groupDeductionsAnnual')}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-rose-200">{t('annualPph21Label')}</div>
                    <div className="text-[10px] text-slate-400">{t('annualPph21Desc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -{renderIDR(existingCalc.annual.pph21)}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -{renderIDR(offeringCalc.annual.pph21)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.annual.pph21 - existingCalc.annual.pph21,
                      true
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-rose-200">{t('annualBpjsEmployeeLabel')}</div>
                    <div className="text-[10px] text-slate-400">{t('annualBpjsEmployeeDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -{renderIDR(existingCalc.annual.bpjs.totalEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400/90 font-mono tabular-nums">
                    -{renderIDR(offeringCalc.annual.bpjs.totalEmployee)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.annual.bpjs.totalEmployee -
                        existingCalc.annual.bpjs.totalEmployee,
                      true
                    )}
                  </td>
                </tr>
                <tr className="bg-rose-950/20 border-y border-rose-900/30 font-semibold text-rose-300">
                  <td className="py-2.5 px-6">{t('subtotalDeductionsAnnual')}</td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                    -{renderIDR(existingCalc.annual.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                    -{renderIDR(offeringCalc.annual.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.annual.totalDeductions -
                        existingCalc.annual.totalDeductions,
                      true
                    )}
                  </td>
                </tr>

                <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400">
                  <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider text-amber-400/90 font-semibold">
                    {t('groupEmployerBenefit')}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-slate-200">{t('employerBpjsLabel')}</div>
                    <div className="text-[10px] text-slate-400">{t('employerBpjsDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono tabular-nums">
                    +{renderIDR(existingCalc.annual.bpjs.totalEmployer)}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-300 font-mono tabular-nums font-medium">
                    +{renderIDR(offeringCalc.annual.bpjs.totalEmployer)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.annual.bpjs.totalEmployer -
                        existingCalc.annual.bpjs.totalEmployer
                    )}
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-sky-950/60 border-t-2 border-sky-500/40 text-white">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-xs sm:text-sm font-extrabold tracking-wide text-sky-300 uppercase block">
                          {t('heroNetAnnualTitle')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {t('heroNetAnnualSubtitle')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-200 font-mono tabular-nums text-xs sm:text-sm font-bold">
                    {renderIDR(existingCalc.annual.netSalary)}
                  </td>
                  <td className="py-4 px-4 text-right text-sky-400 font-mono tabular-nums text-sm sm:text-base font-extrabold">
                    {renderIDR(offeringCalc.annual.netSalary)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm font-mono tabular-nums ${
                          deltaAnnualNet >= 0
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {deltaAnnualNet >= 0 ? '+' : ''}
                        {renderIDR(deltaAnnualNet)}
                      </span>
                      <span className="text-[11px] font-bold text-sky-400 mt-1">
                        ({deltaAnnualNetPct >= 0 ? '+' : ''}
                        {deltaAnnualNetPct.toFixed(1)}%)
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

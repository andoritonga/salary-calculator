import React from 'react'
import { CheckCircle2, Calendar } from 'lucide-react'

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
}) {
  const offeringCardStyle = isDeduction
    ? 'bg-[var(--danger-surface)] border-[var(--danger-border)]'
    : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)]'

  const offeringLabelStyle = isDeduction
    ? 'text-[var(--danger-text)]'
    : 'text-[var(--accent-text)]'

  const currentValStyle = isDeduction
    ? 'text-[var(--danger-text)]'
    : 'text-[var(--text-primary)]'
  const offeringValStyle = isDeduction
    ? 'text-[var(--danger-text)]'
    : 'text-[var(--text-primary)]'

  return (
    <div className="p-3.5 sm:p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center flex-wrap gap-1.5">
            <span
              className={`font-semibold text-xs ${
                isDeduction ? 'text-[var(--danger-text)]' : 'text-[var(--text-primary)]'
              }`}
            >
              {title}
            </span>
            {badge}
          </div>
          {description && (
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{description}</p>
          )}
        </div>
        <div className="shrink-0 pt-0.5">{deltaBadge}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2">
          <div className="text-[11px] font-medium text-[var(--text-muted)] truncate">
            {currentLabel}
          </div>
          <div className={`text-xs font-semibold tabular-nums mt-0.5 ${currentValStyle}`}>
            {valuePrefix}
            {currentValue}
          </div>
        </div>

        <div className={`border rounded-xl px-3 py-2 ${offeringCardStyle}`}>
          <div className={`text-[11px] font-semibold truncate ${offeringLabelStyle}`}>
            {offeringLabel}
          </div>
          <div className={`text-xs font-bold tabular-nums mt-0.5 ${offeringValStyle}`}>
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
}) {
  const containerStyle = isDeduction
    ? 'bg-[var(--danger-surface)] border-y border-dashed border-[var(--danger-border)] text-[var(--danger-text)]'
    : 'bg-[var(--bg-subtle)] border-y border-dashed border-[var(--border-subtle)] text-[var(--text-primary)]'

  const offeringTextStyle = isDeduction
    ? 'text-[var(--danger-text)]'
    : 'text-[var(--text-primary)]'

  return (
    <div className={`p-3.5 sm:p-4 space-y-2 ${containerStyle}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold">{title}</span>
        <div className="shrink-0">{deltaBadge}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2">
          <div className="text-[11px] text-[var(--text-muted)] truncate">{currentLabel}</div>
          <div className="text-xs font-bold tabular-nums mt-0.5 text-[var(--text-primary)]">
            {valuePrefix}
            {currentValue}
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2">
          <div className={`text-[11px] font-semibold truncate ${offeringTextStyle}`}>
            {offeringLabel}
          </div>
          <div className={`text-xs font-extrabold tabular-nums mt-0.5 ${offeringTextStyle}`}>
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
    <section
      id="section-breakdown"
      aria-labelledby="breakdown-heading"
      className="space-y-5 print-clean scroll-mt-20"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h2 id="breakdown-heading" className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
            {t('breakdownTitle')}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {t('breakdownSubtitle')}
          </p>
        </div>

        {/* Period Switcher */}
        <div
          role="group"
          aria-label={t('periodSwitcherAria')}
          className="grid grid-cols-3 sm:flex bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs w-full sm:w-auto gap-1 shrink-0"
        >
          {[
            { id: 'monthly', label: t('periodMonthly') },
            { id: 'annual', label: t('periodAnnual') },
            { id: 'both', label: t('periodAll') },
          ].map((tab) => {
            const active = tablePeriod === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTablePeriod(tab.id)}
                className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-center ${
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
      </div>

      {/* CARD 1: ARUS KAS BULANAN (MONTHLY ROUTINE) */}
      {(tablePeriod === 'both' || tablePeriod === 'monthly') && (
        <div className="ledger-sheet rounded-2xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                {t('card1Title')}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">{t('card1Subtitle')}</p>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs w-full sm:w-auto">
              <span className="text-[var(--text-muted)] text-[11px]">{t('deltaNetThp')}</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold tabular-nums ${
                    deltaMonthlyNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
                  }`}
                >
                  {deltaMonthlyNet >= 0 ? '+' : ''}
                  {renderIDR(deltaMonthlyNet)}
                  {t('perMonth')}
                </span>
                <span
                  className={`font-bold text-[11px] tabular-nums ${
                    deltaMonthlyNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
                  }`}
                >
                  ({deltaMonthlyNetPct >= 0 ? '+' : ''}
                  {deltaMonthlyNetPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE STACKED COMPARISON (< md) */}
          <div className="md:hidden divide-y divide-[var(--border-subtle)]">
            <div className="py-2 px-3.5 bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-secondary)] border-b border-dashed border-[var(--border-subtle)]">
              {t('groupGrossMonthly')}
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

            <div className="py-2 px-3.5 bg-[var(--bg-subtle)] text-xs font-bold text-[var(--danger-text)] border-b border-dashed border-[var(--border-subtle)]">
              {t('groupDeductionsMonthly')}
            </div>

            <MobileCleanAuditRow
              title={t('pph21TerLabel')}
              badge={
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--danger-surface)] text-[var(--danger-text)] border border-[var(--danger-border)] tabular-nums font-medium">
                  {existingCalc.terCategory} {existingCalc.terPercentage}% {'->'}{' '}
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

            {/* Mobile Summary Footer (Monthly THP) */}
            <div className="bg-[var(--bg-subtle)] p-4 ledger-total-row space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-text)] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="text-xs font-extrabold text-[var(--accent-text)] block">
                    {t('heroNetMonthlyTitle')}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {t('heroNetMonthlySubtitle')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2.5">
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {currentHeaderLabel}
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </div>
                </div>

                <div className="bg-[var(--accent-surface)] border border-[var(--accent-border)] rounded-xl p-2.5">
                  <div className="text-[11px] font-semibold text-[var(--accent-text)] truncate">
                    {offeringHeaderLabel}
                  </div>
                  <div className="text-sm font-extrabold text-[var(--accent-text)] tabular-nums mt-0.5">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  {t('thDelta')}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border tabular-nums ${
                      deltaMonthlyNet >= 0
                        ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] border-[var(--accent-border)]'
                        : 'bg-[var(--danger-surface)] text-[var(--danger-text)] border-[var(--danger-border)]'
                    }`}
                  >
                    {deltaMonthlyNet >= 0 ? '+' : ''}
                    {renderIDR(deltaMonthlyNet)}
                  </span>
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      deltaMonthlyNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
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
                <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs">
                  <th className="py-3 px-6 font-semibold w-5/12">{t('thComponent')}</th>
                  <th className="py-3 px-4 font-semibold text-right w-7/32">
                    {t('thCurrent')}{' '}
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">
                      ({existingTaxMethod.toUpperCase()})
                    </span>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-[var(--accent-text)] w-7/32">
                    {activeOffering.name}{' '}
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">
                      ({activeOffering.taxMethod.toUpperCase()})
                    </span>
                  </th>
                  <th className="py-3 px-6 font-semibold text-right w-1/4">
                    {t('thDelta')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-secondary)]">
                  <td colSpan={4} className="py-2.5 px-6">
                    {t('groupGrossMonthly')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">{t('basicSalaryLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('basicSalaryDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] tabular-nums">
                    {renderIDR(existingCalc.basic)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] tabular-nums font-medium">
                    {renderIDR(offeringCalc.basic)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(offeringCalc.basic - existingCalc.basic)}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">{t('fixedAllowanceLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('fixedAllowanceDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] tabular-nums">
                    {renderIDR(existingCalc.fixed)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] tabular-nums font-medium">
                    {renderIDR(offeringCalc.fixed)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(offeringCalc.fixed - existingCalc.fixed)}
                  </td>
                </tr>
                <tr className="bg-[var(--bg-subtle)] border-y border-dashed border-[var(--border-subtle)] font-semibold">
                  <td className="py-2.5 px-6 text-[var(--text-primary)]">{t('subtotalGrossMonthly')}</td>
                  <td className="py-2.5 px-4 text-right text-[var(--text-primary)] tabular-nums">
                    {renderIDR(existingCalc.monthly.cashGross)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[var(--text-primary)] tabular-nums font-bold">
                    {renderIDR(offeringCalc.monthly.cashGross)}
                  </td>
                  <td className="py-2.5 px-6 text-right">
                    {renderDeltaBadge(deltaMonthlyGross)}
                  </td>
                </tr>

                <tr className="bg-[var(--bg-subtle)] text-xs font-bold text-[var(--danger-text)]">
                  <td colSpan={4} className="py-2.5 px-6">
                    {t('groupDeductionsMonthly')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)] flex items-center flex-wrap gap-2">
                      <span>{t('pph21TerLabel')}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--danger-surface)] text-[var(--danger-text)] border border-[var(--danger-border)] tabular-nums font-medium">
                        {existingCalc.terCategory} {existingCalc.terPercentage}% vs{' '}
                        {offeringCalc.terCategory} {offeringCalc.terPercentage}%
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('pph21TerDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
                    -{renderIDR(existingCalc.monthly.pph21)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
                    -{renderIDR(offeringCalc.monthly.pph21)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.monthly.pph21 - existingCalc.monthly.pph21,
                      true
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">{t('bpjsKesLabelShort')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('bpjsKesDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
                    -{renderIDR(existingCalc.monthly.bpjs.kesEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
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
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">{t('bpjsTkLabelShort')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('bpjsTkDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
                    -
                    {renderIDR(
                      existingCalc.monthly.bpjs.jhtEmployee +
                        existingCalc.monthly.bpjs.jpEmployee
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
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
                <tr className="bg-[var(--danger-surface)] border-y border-dashed border-[var(--danger-border)] font-semibold text-[var(--danger-text)]">
                  <td className="py-2.5 px-6">{t('subtotalDeductionsMonthly')}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">
                    -{renderIDR(existingCalc.monthly.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums">
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
                <tr className="bg-[var(--bg-subtle)] ledger-total-row text-[var(--text-primary)]">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
                      <div>
                        <span className="text-xs sm:text-sm font-extrabold text-[var(--accent-text)] block">
                          {t('heroNetMonthlyTitle')}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] font-normal">
                          {t('heroNetMonthlySubtitle')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-[var(--text-primary)] tabular-nums text-xs sm:text-sm font-bold">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </td>
                  <td className="py-4 px-4 text-right text-[var(--accent-text)] tabular-nums text-sm sm:text-base font-extrabold">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border tabular-nums ${
                          deltaMonthlyNet >= 0
                            ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] border-[var(--accent-border)]'
                            : 'bg-[var(--danger-surface)] text-[var(--danger-text)] border-[var(--danger-border)]'
                        }`}
                      >
                        {deltaMonthlyNet >= 0 ? '+' : ''}
                        {renderIDR(deltaMonthlyNet)}
                      </span>
                      <span
                        className={`text-[11px] font-bold mt-1 tabular-nums ${
                          deltaMonthlyNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
                        }`}
                      >
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

      {/* CARD 2: PROYEKSI AKUMULASI TAHUNAN */}
      {(tablePeriod === 'both' || tablePeriod === 'annual') && (
        <div className="ledger-sheet rounded-2xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                {t('card2Title', { multiplier: annualMultiplier })}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">{t('card2Subtitle')}</p>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs w-full sm:w-auto">
              <span className="text-[var(--text-muted)] text-[11px]">{t('deltaNetAnnual')}</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold tabular-nums ${
                    deltaAnnualNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
                  }`}
                >
                  {deltaAnnualNet >= 0 ? '+' : ''}
                  {renderIDR(deltaAnnualNet)}
                  {t('perYear')}
                </span>
                <span
                  className={`font-bold text-[11px] tabular-nums ${
                    deltaAnnualNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
                  }`}
                >
                  ({deltaAnnualNetPct >= 0 ? '+' : ''}
                  {deltaAnnualNetPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE STACKED COMPARISON (< md) */}
          <div className="md:hidden divide-y divide-[var(--border-subtle)]">
            <div className="py-2 px-3.5 bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-secondary)] border-b border-dashed border-[var(--border-subtle)]">
              {t('groupGrossAnnual')}
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
              deltaBadge={renderDeltaBadge(deltaAnnualGross)}
            />

            <div className="py-2 px-3.5 bg-[var(--bg-subtle)] text-xs font-bold text-[var(--danger-text)] border-b border-dashed border-[var(--border-subtle)]">
              {t('groupDeductionsAnnual')}
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

            <div className="py-2 px-3.5 bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-secondary)] border-b border-dashed border-[var(--border-subtle)]">
              {t('groupEmployerBenefit')}
            </div>

            <MobileCleanAuditRow
              title={t('employerBpjsLabel')}
              description={t('employerBpjsDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.bpjs.totalEmployer)}
              offeringValue={renderIDR(offeringCalc.annual.bpjs.totalEmployer)}
              valuePrefix="+"
              deltaBadge={renderDeltaBadge(
                offeringCalc.annual.bpjs.totalEmployer -
                  existingCalc.annual.bpjs.totalEmployer
              )}
            />

            {/* Mobile Summary Footer (Annual THP) */}
            <div className="bg-[var(--bg-subtle)] p-4 ledger-total-row space-y-3">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-5 h-5 text-[var(--accent-text)] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="text-xs font-extrabold text-[var(--accent-text)] block">
                    {t('heroNetAnnualTitle')}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {t('heroNetAnnualSubtitle')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2.5">
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {currentHeaderLabel}
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                    {renderIDR(existingCalc.annual.netSalary)}
                  </div>
                </div>

                <div className="bg-[var(--accent-surface)] border border-[var(--accent-border)] rounded-xl p-2.5">
                  <div className="text-[11px] font-semibold text-[var(--accent-text)] truncate">
                    {offeringHeaderLabel}
                  </div>
                  <div className="text-sm font-extrabold text-[var(--accent-text)] tabular-nums mt-0.5">
                    {renderIDR(offeringCalc.annual.netSalary)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  {t('thDelta')}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border tabular-nums ${
                      deltaAnnualNet >= 0
                        ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] border-[var(--accent-border)]'
                        : 'bg-[var(--danger-surface)] text-[var(--danger-text)] border-[var(--danger-border)]'
                    }`}
                  >
                    {deltaAnnualNet >= 0 ? '+' : ''}
                    {renderIDR(deltaAnnualNet)}
                  </span>
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      deltaAnnualNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
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
                <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs">
                  <th className="py-3 px-6 font-semibold w-5/12">
                    {t('thComponentAnnual')}
                  </th>
                  <th className="py-3 px-4 font-semibold text-right w-7/32">
                    {t('thCurrent')}{' '}
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">
                      ({existingTaxMethod.toUpperCase()})
                    </span>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-[var(--accent-text)] w-7/32">
                    {activeOffering.name}{' '}
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">
                      ({activeOffering.taxMethod.toUpperCase()})
                    </span>
                  </th>
                  <th className="py-3 px-6 font-semibold text-right w-1/4">
                    {t('thDelta')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-secondary)]">
                  <td colSpan={4} className="py-2.5 px-6">
                    {t('groupGrossAnnual')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">
                      {t('annualRoutineSalary', { multiplier: annualMultiplier })}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('annualRoutineSalaryDesc', {
                        thrMonths: annualMultiplier - 12,
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] tabular-nums">
                    {renderIDR(existingCalc.monthly.cashGross * annualMultiplier)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] tabular-nums font-medium">
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
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">{t('bonusLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('annualBonusDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] tabular-nums">
                    {renderIDR(existingCalc.annual.bonus)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] tabular-nums font-medium">
                    {renderIDR(offeringCalc.annual.bonus)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.annual.bonus - existingCalc.annual.bonus
                    )}
                  </td>
                </tr>
                <tr className="bg-[var(--bg-subtle)] border-y border-dashed border-[var(--border-subtle)] font-semibold">
                  <td className="py-2.5 px-6 text-[var(--text-primary)]">{t('subtotalGrossAnnual')}</td>
                  <td className="py-2.5 px-4 text-right text-[var(--text-primary)] tabular-nums">
                    {renderIDR(existingCalc.annual.cashGross)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[var(--text-primary)] tabular-nums font-bold">
                    {renderIDR(offeringCalc.annual.cashGross)}
                  </td>
                  <td className="py-2.5 px-6 text-right">
                    {renderDeltaBadge(deltaAnnualGross)}
                  </td>
                </tr>

                <tr className="bg-[var(--bg-subtle)] text-xs font-bold text-[var(--danger-text)]">
                  <td colSpan={4} className="py-2.5 px-6">
                    {t('groupDeductionsAnnual')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">{t('annualPph21Label')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('annualPph21Desc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
                    -{renderIDR(existingCalc.annual.pph21)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
                    -{renderIDR(offeringCalc.annual.pph21)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderDeltaBadge(
                      offeringCalc.annual.pph21 - existingCalc.annual.pph21,
                      true
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">{t('annualBpjsEmployeeLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('annualBpjsEmployeeDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
                    -{renderIDR(existingCalc.annual.bpjs.totalEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--danger-text)] tabular-nums">
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
                <tr className="bg-[var(--danger-surface)] border-y border-dashed border-[var(--danger-border)] font-semibold text-[var(--danger-text)]">
                  <td className="py-2.5 px-6">{t('subtotalDeductionsAnnual')}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">
                    -{renderIDR(existingCalc.annual.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums">
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

                <tr className="bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-secondary)]">
                  <td colSpan={4} className="py-2.5 px-6">
                    {t('groupEmployerBenefit')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="font-medium text-[var(--text-primary)]">{t('employerBpjsLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('employerBpjsDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] tabular-nums">
                    +{renderIDR(existingCalc.annual.bpjs.totalEmployer)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] tabular-nums font-medium">
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
                <tr className="bg-[var(--bg-subtle)] ledger-total-row text-[var(--text-primary)]">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
                      <div>
                        <span className="text-xs sm:text-sm font-extrabold text-[var(--accent-text)] block">
                          {t('heroNetAnnualTitle')}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] font-normal">
                          {t('heroNetAnnualSubtitle')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-[var(--text-primary)] tabular-nums text-xs sm:text-sm font-bold">
                    {renderIDR(existingCalc.annual.netSalary)}
                  </td>
                  <td className="py-4 px-4 text-right text-[var(--accent-text)] tabular-nums text-sm sm:text-base font-extrabold">
                    {renderIDR(offeringCalc.annual.netSalary)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border tabular-nums ${
                          deltaAnnualNet >= 0
                            ? 'bg-[var(--accent-surface)] text-[var(--accent-text)] border-[var(--accent-border)]'
                            : 'bg-[var(--danger-surface)] text-[var(--danger-text)] border-[var(--danger-border)]'
                        }`}
                      >
                        {deltaAnnualNet >= 0 ? '+' : ''}
                        {renderIDR(deltaAnnualNet)}
                      </span>
                      <span
                        className={`text-[11px] font-bold mt-1 tabular-nums ${
                          deltaAnnualNet >= 0 ? 'text-[var(--accent-text)]' : 'text-[var(--danger-text)]'
                        }`}
                      >
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

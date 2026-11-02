import React from 'react'
import {
  CheckCircle2,
  Calendar,
} from 'lucide-react'

function MobileAuditRow({
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
  accentVariant = 'primary',
}) {
  const offeringBoxClass = isDeduction
    ? 'bg-[var(--semantic-danger-soft)]/50 border-[var(--semantic-danger)]/30'
    : accentVariant === 'secondary'
      ? 'bg-[var(--accent-secondary-soft)]/60 border-[var(--accent-secondary)]/30'
      : 'bg-[var(--accent-primary-soft)]/60 border-[var(--accent-primary)]/30'

  const offeringLabelClass = isDeduction
    ? 'text-[var(--semantic-danger)]'
    : accentVariant === 'secondary'
      ? 'text-[var(--accent-secondary)]'
      : 'text-[var(--accent-primary)]'

  const valueColorClass = isDeduction
    ? 'text-[var(--semantic-danger)]'
    : 'text-[var(--text-primary)]'

  const offeringValueColorClass = isDeduction
    ? 'text-[var(--semantic-danger)]'
    : accentVariant === 'secondary'
      ? 'text-[var(--accent-secondary)]'
      : 'text-[var(--text-primary)]'

  return (
    <div className="p-3.5 sm:p-4 bg-[var(--bg-elevated)] space-y-2.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 space-y-1">
          <div className="font-bold text-xs text-[var(--text-primary)] leading-snug">
            {title}
          </div>
          {badge && <div>{badge}</div>}
          {description && (
            <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {description}
            </div>
          )}
        </div>
        <div className="shrink-0 pt-0.5">{deltaBadge}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="bg-[var(--bg-primary)]/80 border border-[var(--border-hairline)] rounded-sm px-2.5 py-2">
          <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] truncate">
            {currentLabel}
          </div>
          <div className={`font-mono text-xs font-semibold tabular-nums mt-0.5 ${valueColorClass}`}>
            {valuePrefix}
            {currentValue}
          </div>
        </div>

        <div className={`border rounded-sm px-2.5 py-2 ${offeringBoxClass}`}>
          <div className={`font-mono text-[9px] uppercase tracking-wider font-bold truncate ${offeringLabelClass}`}>
            {offeringLabel}
          </div>
          <div className={`font-mono text-xs font-bold tabular-nums mt-0.5 ${offeringValueColorClass}`}>
            {valuePrefix}
            {offeringValue}
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileSubtotalRow({
  title,
  currentLabel,
  offeringLabel,
  currentValue,
  offeringValue,
  deltaBadge,
  valuePrefix = '',
  isDeduction = false,
  accentVariant = 'primary',
}) {
  const containerClass = isDeduction
    ? 'bg-[var(--semantic-danger-soft)] border-y border-[var(--semantic-danger)]/30 text-[var(--semantic-danger)]'
    : 'bg-[var(--bg-primary)] border-y border-[var(--border-strong)] text-[var(--text-primary)]'

  const offeringTextClass = isDeduction
    ? 'text-[var(--semantic-danger)]'
    : accentVariant === 'secondary'
      ? 'text-[var(--accent-secondary)]'
      : 'text-[var(--accent-primary)]'

  return (
    <div className={`p-3.5 sm:p-4 space-y-2 ${containerClass}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono uppercase text-[11px] tracking-wider font-bold">
          {title}
        </span>
        <div className="shrink-0">{deltaBadge}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <div className="bg-[var(--bg-elevated)]/80 border border-[var(--border-hairline)] rounded-sm px-2.5 py-1.5">
          <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] truncate">
            {currentLabel}
          </div>
          <div className="font-mono text-xs font-bold tabular-nums mt-0.5">
            {valuePrefix}
            {currentValue}
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)]/40 rounded-sm px-2.5 py-1.5">
          <div className={`font-mono text-[9px] uppercase tracking-wider font-bold truncate ${offeringTextClass}`}>
            {offeringLabel}
          </div>
          <div className={`font-mono text-xs font-extrabold tabular-nums mt-0.5 ${offeringTextClass}`}>
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
  const currentHeaderLabel = `${t('thCurrent')} [${existingTaxMethod.toUpperCase()}]`
  const offeringHeaderLabel = `${activeOffering.name} [${activeOffering.taxMethod.toUpperCase()}]`

  return (
    <section id="section-breakdown" className="space-y-6 print-clean scroll-mt-24">
      {/* Editorial Section Masthead */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-sm p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-[0_2px_0_0_var(--shadow-ledger)] no-print">
        <div className="space-y-1">
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <span className="folio-stamp text-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] border border-[var(--accent-secondary)]/30 px-2 py-0.5 rounded-sm">
              FOLIO 03 // AUDIT MATRIX
            </span>
            <span className="folio-stamp text-[var(--text-muted)]">
              PP 58/2023 &amp; PASAL 17 UU HPP
            </span>
          </div>
          <h3 className="font-display text-lg sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {t('breakdownTitle')}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {t('breakdownSubtitle')}
          </p>
        </div>

        {/* Period Selector Index Tabs */}
        <div className="grid grid-cols-3 sm:flex bg-[var(--bg-secondary)] p-1 rounded-sm border border-[var(--border-hairline)] text-xs w-full sm:w-auto gap-1 shrink-0">
          {[
            { id: 'monthly', label: t('periodMonthly') },
            { id: 'annual', label: t('periodAnnual') },
            { id: 'both', label: t('periodAll') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTablePeriod(tab.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-sm font-mono text-[11px] font-bold uppercase tracking-wider transition-all text-center ${
                tablePeriod === tab.id
                  ? 'bg-[var(--accent-primary-solid)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SCHEDULE 01: ARUS KAS BULANAN (MONTHLY ROUTINE) */}
      {(tablePeriod === 'both' || tablePeriod === 'monthly') && (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-sm overflow-hidden shadow-[0_3px_0_0_var(--shadow-ledger)]">
          {/* Ledger Subheader */}
          <div className="px-4 sm:px-6 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-strong)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[var(--accent-primary-solid)] text-white rounded-sm shrink-0">
                  SCHEDULE 01
                </span>
                <h4 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  {t('card1Title')}
                </h4>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {t('card1Subtitle')}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 sm:py-1.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-xs w-full sm:w-auto shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {t('deltaNetThp')}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-mono font-bold tabular-nums ${
                    deltaMonthlyNet >= 0
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--semantic-danger)]'
                  }`}
                >
                  {deltaMonthlyNet >= 0 ? '+' : ''}
                  {renderIDR(deltaMonthlyNet)}
                  {t('perMonth')}
                </span>
                <span
                  className={`font-mono font-bold text-[11px] ${
                    deltaMonthlyNet >= 0
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--semantic-danger)]'
                  }`}
                >
                  ({deltaMonthlyNetPct >= 0 ? '+' : ''}
                  {deltaMonthlyNetPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE / PWA STACKED VOUCHER CARDS (< md) */}
          <div className="md:hidden divide-y divide-[var(--border-hairline)]">
            {/* Group I Header */}
            <div className="py-2 px-3.5 bg-[var(--bg-secondary)]/65 font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] font-bold">
              I. {t('groupGrossMonthly')}
            </div>

            <MobileAuditRow
              title={t('basicSalaryLabel')}
              description={t('basicSalaryDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.basic)}
              offeringValue={renderIDR(offeringCalc.basic)}
              deltaBadge={renderDeltaBadge(offeringCalc.basic - existingCalc.basic)}
            />

            <MobileAuditRow
              title={t('fixedAllowanceLabel')}
              description={t('fixedAllowanceDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.fixed)}
              offeringValue={renderIDR(offeringCalc.fixed)}
              deltaBadge={renderDeltaBadge(offeringCalc.fixed - existingCalc.fixed)}
            />

            <MobileSubtotalRow
              title={t('subtotalGrossMonthly')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.monthly.cashGross)}
              offeringValue={renderIDR(offeringCalc.monthly.cashGross)}
              deltaBadge={renderDeltaBadge(deltaMonthlyGross)}
            />

            {/* Group II Header */}
            <div className="py-2 px-3.5 bg-[var(--semantic-danger-soft)] font-mono text-[10px] uppercase tracking-widest text-[var(--semantic-danger)] font-bold">
              II. {t('groupDeductionsMonthly')}
            </div>

            <MobileAuditRow
              title={t('pph21TerLabel')}
              badge={
                <span className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger)] border border-[var(--semantic-danger)]/30 font-bold">
                  TER {existingCalc.terCategory} ({existingCalc.terPercentage}%) ➔{' '}
                  {offeringCalc.terCategory} ({offeringCalc.terPercentage}%)
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

            <MobileAuditRow
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

            <MobileAuditRow
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

            <MobileSubtotalRow
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
            <div className="bg-[#0D1F18] text-[#F5EFE4] p-4 border-t-2 border-[var(--border-strong)] space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-xs font-bold tracking-wider text-[#F5EFE4] uppercase block">
                    {t('heroNetMonthlyTitle')}
                  </span>
                  <span className="text-[11px] text-[#A7B8B0] font-normal">
                    {t('heroNetMonthlySubtitle')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/5 border border-white/10 rounded-sm p-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[#A7B8B0] truncate">
                    {currentHeaderLabel}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#D7E2DC] tabular-nums mt-1">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </div>
                </div>

                <div className="bg-[#4ADE80]/10 border border-[#4ADE80]/35 rounded-sm p-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#E5B85B] truncate">
                    {offeringHeaderLabel}
                  </div>
                  <div className="font-mono text-sm font-extrabold text-[#4ADE80] tabular-nums mt-1">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#A7B8B0]">
                  {t('thDelta')}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-bold border font-mono tabular-nums ${
                      deltaMonthlyNet >= 0
                        ? 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/40'
                        : 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/40'
                    }`}
                  >
                    {deltaMonthlyNet >= 0 ? '+' : ''}
                    {renderIDR(deltaMonthlyNet)}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#EAB308]">
                    ({deltaMonthlyNetPct >= 0 ? '+' : ''}
                    {deltaMonthlyNetPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP 4-COLUMN TABLE (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b-2 border-[var(--border-strong)] text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-widest">
                  <th className="py-3 px-4 sm:px-6 font-bold w-5/12">{t('thComponent')}</th>
                  <th className="py-3 px-4 font-bold text-right w-7/32 border-l border-[var(--border-hairline)]">
                    {t('thCurrent')}{' '}
                    <span className="text-[9px] text-[var(--text-muted)]">
                      [{existingTaxMethod.toUpperCase()}]
                    </span>
                  </th>
                  <th className="py-3 px-4 font-bold text-right text-[var(--accent-primary)] w-7/32 border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]">
                    {activeOffering.name}{' '}
                    <span className="text-[9px] opacity-80">
                      [{activeOffering.taxMethod.toUpperCase()}]
                    </span>
                  </th>
                  <th className="py-3 px-4 sm:px-6 font-bold text-right w-1/4 border-l border-[var(--border-hairline)]">
                    {t('thDelta')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {/* Group I: Pendapatan Bruto Bulanan */}
                <tr className="bg-[var(--bg-secondary)]/65">
                  <td
                    colSpan={4}
                    className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] font-bold"
                  >
                    I. {t('groupGrossMonthly')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('basicSalaryLabel')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('basicSalaryDesc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    {renderIDR(existingCalc.basic)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]/50">
                    {renderIDR(offeringCalc.basic)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(offeringCalc.basic - existingCalc.basic)}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('fixedAllowanceLabel')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('fixedAllowanceDesc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    {renderIDR(existingCalc.fixed)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]/50">
                    {renderIDR(offeringCalc.fixed)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(offeringCalc.fixed - existingCalc.fixed)}
                  </td>
                </tr>
                <tr className="bg-[var(--bg-primary)] border-y border-[var(--border-strong)] font-bold">
                  <td className="py-2.5 px-4 sm:px-6 text-[var(--text-primary)] font-mono uppercase text-[11px] tracking-wider">
                    {t('subtotalGrossMonthly')}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[var(--text-primary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    {renderIDR(existingCalc.monthly.cashGross)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[var(--accent-primary)] font-mono tabular-nums border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]">
                    {renderIDR(offeringCalc.monthly.cashGross)}
                  </td>
                  <td className="py-2.5 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(deltaMonthlyGross)}
                  </td>
                </tr>

                {/* Group II: Potongan Karyawan Bulanan */}
                <tr className="bg-[var(--semantic-danger-soft)]">
                  <td
                    colSpan={4}
                    className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--semantic-danger)] font-bold"
                  >
                    II. {t('groupDeductionsMonthly')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
                      <span>{t('pph21TerLabel')}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger)] border border-[var(--semantic-danger)]/30 font-bold">
                        TER {existingCalc.terCategory} ({existingCalc.terPercentage}%) ➔{' '}
                        {offeringCalc.terCategory} ({offeringCalc.terPercentage}%)
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('pph21TerDesc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.monthly.pph21)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]/40">
                    -{renderIDR(offeringCalc.monthly.pph21)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.monthly.pph21 - existingCalc.monthly.pph21,
                      true
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('bpjsKesLabelShort')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('bpjsKesDesc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.monthly.bpjs.kesEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]/40">
                    -{renderIDR(offeringCalc.monthly.bpjs.kesEmployee)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.monthly.bpjs.kesEmployee -
                        existingCalc.monthly.bpjs.kesEmployee,
                      true
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('bpjsTkLabelShort')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('bpjsTkDesc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -
                    {renderIDR(
                      existingCalc.monthly.bpjs.jhtEmployee +
                        existingCalc.monthly.bpjs.jpEmployee
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]/40">
                    -
                    {renderIDR(
                      offeringCalc.monthly.bpjs.jhtEmployee +
                        offeringCalc.monthly.bpjs.jpEmployee
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.monthly.bpjs.jhtEmployee +
                        offeringCalc.monthly.bpjs.jpEmployee -
                        (existingCalc.monthly.bpjs.jhtEmployee +
                          existingCalc.monthly.bpjs.jpEmployee),
                      true
                    )}
                  </td>
                </tr>
                <tr className="bg-[var(--semantic-danger-soft)] border-y border-[var(--semantic-danger)]/30 font-bold text-[var(--semantic-danger)]">
                  <td className="py-2.5 px-4 sm:px-6 font-mono uppercase text-[11px] tracking-wider">
                    {t('subtotalDeductionsMonthly')}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.monthly.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(offeringCalc.monthly.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.monthly.totalDeductions -
                        existingCalc.monthly.totalDeductions,
                      true
                    )}
                  </td>
                </tr>
              </tbody>

              {/* Double-Ruled Accounting Total Footer */}
              <tfoot>
                <tr className="bg-[#0D1F18] text-[#F5EFE4] border-t-2 border-[var(--border-strong)]">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0" />
                      <div>
                        <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#F5EFE4] uppercase block">
                          {t('heroNetMonthlyTitle')}
                        </span>
                        <span className="text-[11px] text-[#A7B8B0] font-normal">
                          {t('heroNetMonthlySubtitle')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-[#D7E2DC] font-mono tabular-nums text-xs sm:text-sm font-bold border-l border-white/10">
                    {renderIDR(existingCalc.monthly.netSalary)}
                  </td>
                  <td className="py-4 px-4 text-right text-[#4ADE80] font-mono tabular-nums text-sm sm:text-base font-extrabold border-l border-white/10 bg-white/[0.03]">
                    {renderIDR(offeringCalc.monthly.netSalary)}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right border-l border-white/10">
                    <div className="inline-flex flex-col items-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold border font-mono tabular-nums ${
                          deltaMonthlyNet >= 0
                            ? 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/40'
                            : 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/40'
                        }`}
                      >
                        {deltaMonthlyNet >= 0 ? '+' : ''}
                        {renderIDR(deltaMonthlyNet)}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#EAB308] mt-1">
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

      {/* SCHEDULE 02: PROYEKSI AKUMULASI TAHUNAN (ANNUALIZED PACKAGE) */}
      {(tablePeriod === 'both' || tablePeriod === 'annual') && (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-sm overflow-hidden shadow-[0_3px_0_0_var(--shadow-ledger)]">
          {/* Ledger Subheader */}
          <div className="px-4 sm:px-6 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-strong)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#9A6B13] text-white rounded-sm shrink-0">
                  SCHEDULE 02
                </span>
                <h4 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  {t('card2Title', { multiplier: annualMultiplier })}
                </h4>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {t('card2Subtitle')}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 sm:py-1.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-xs w-full sm:w-auto shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {t('deltaNetAnnual')}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-mono font-bold tabular-nums ${
                    deltaAnnualNet >= 0
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--semantic-danger)]'
                  }`}
                >
                  {deltaAnnualNet >= 0 ? '+' : ''}
                  {renderIDR(deltaAnnualNet)}
                  {t('perYear')}
                </span>
                <span
                  className={`font-mono font-bold text-[11px] ${
                    deltaAnnualNet >= 0
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--semantic-danger)]'
                  }`}
                >
                  ({deltaAnnualNetPct >= 0 ? '+' : ''}
                  {deltaAnnualNetPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE / PWA STACKED VOUCHER CARDS (< md) */}
          <div className="md:hidden divide-y divide-[var(--border-hairline)]">
            {/* Group I Header */}
            <div className="py-2 px-3.5 bg-[var(--bg-secondary)]/65 font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] font-bold">
              I. {t('groupGrossAnnual')}
            </div>

            <MobileAuditRow
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
              accentVariant="secondary"
              deltaBadge={renderDeltaBadge(
                (offeringCalc.monthly.cashGross -
                  existingCalc.monthly.cashGross) *
                  annualMultiplier
              )}
            />

            <MobileAuditRow
              title={t('bonusLabel')}
              description={t('annualBonusDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.bonus)}
              offeringValue={renderIDR(offeringCalc.annual.bonus)}
              accentVariant="secondary"
              deltaBadge={renderDeltaBadge(
                offeringCalc.annual.bonus - existingCalc.annual.bonus
              )}
            />

            <MobileSubtotalRow
              title={t('subtotalGrossAnnual')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.cashGross)}
              offeringValue={renderIDR(offeringCalc.annual.cashGross)}
              accentVariant="secondary"
              deltaBadge={renderDeltaBadge(deltaAnnualGross)}
            />

            {/* Group II Header */}
            <div className="py-2 px-3.5 bg-[var(--semantic-danger-soft)] font-mono text-[10px] uppercase tracking-widest text-[var(--semantic-danger)] font-bold">
              II. {t('groupDeductionsAnnual')}
            </div>

            <MobileAuditRow
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

            <MobileAuditRow
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

            <MobileSubtotalRow
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

            {/* Group III Header */}
            <div className="py-2 px-3.5 bg-[var(--accent-secondary-soft)] font-mono text-[10px] uppercase tracking-widest text-[var(--accent-secondary)] font-bold">
              III. {t('groupEmployerBenefit')}
            </div>

            <MobileAuditRow
              title={t('employerBpjsLabel')}
              description={t('employerBpjsDesc')}
              currentLabel={currentHeaderLabel}
              offeringLabel={offeringHeaderLabel}
              currentValue={renderIDR(existingCalc.annual.bpjs.totalEmployer)}
              offeringValue={renderIDR(offeringCalc.annual.bpjs.totalEmployer)}
              valuePrefix="+"
              accentVariant="secondary"
              deltaBadge={renderDeltaBadge(
                offeringCalc.annual.bpjs.totalEmployer -
                  existingCalc.annual.bpjs.totalEmployer
              )}
            />

            {/* Mobile Hero Summary Footer (Annual THP) */}
            <div className="bg-[#0D1F18] text-[#F5EFE4] p-4 border-t-2 border-[var(--border-strong)] space-y-3">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-5 h-5 text-[#EAB308] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-xs font-bold tracking-wider text-[#F5EFE4] uppercase block">
                    {t('heroNetAnnualTitle')}
                  </span>
                  <span className="text-[11px] text-[#A7B8B0] font-normal">
                    {t('heroNetAnnualSubtitle')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/5 border border-white/10 rounded-sm p-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[#A7B8B0] truncate">
                    {currentHeaderLabel}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#D7E2DC] tabular-nums mt-1">
                    {renderIDR(existingCalc.annual.netSalary)}
                  </div>
                </div>

                <div className="bg-[#EAB308]/10 border border-[#EAB308]/35 rounded-sm p-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#E5B85B] truncate">
                    {offeringHeaderLabel}
                  </div>
                  <div className="font-mono text-sm font-extrabold text-[#EAB308] tabular-nums mt-1">
                    {renderIDR(offeringCalc.annual.netSalary)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#A7B8B0]">
                  {t('thDelta')}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-bold border font-mono tabular-nums ${
                      deltaAnnualNet >= 0
                        ? 'bg-[#EAB308]/15 text-[#EAB308] border-[#EAB308]/40'
                        : 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/40'
                    }`}
                  >
                    {deltaAnnualNet >= 0 ? '+' : ''}
                    {renderIDR(deltaAnnualNet)}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#4ADE80]">
                    ({deltaAnnualNetPct >= 0 ? '+' : ''}
                    {deltaAnnualNetPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP 4-COLUMN TABLE (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b-2 border-[var(--border-strong)] text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-widest">
                  <th className="py-3 px-4 sm:px-6 font-bold w-5/12">
                    {t('thComponentAnnual')}
                  </th>
                  <th className="py-3 px-4 font-bold text-right w-7/32 border-l border-[var(--border-hairline)]">
                    {t('thCurrent')}{' '}
                    <span className="text-[9px] text-[var(--text-muted)]">
                      [{existingTaxMethod.toUpperCase()}]
                    </span>
                  </th>
                  <th className="py-3 px-4 font-bold text-right text-[var(--accent-secondary)] w-7/32 border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]">
                    {activeOffering.name}{' '}
                    <span className="text-[9px] opacity-80">
                      [{activeOffering.taxMethod.toUpperCase()}]
                    </span>
                  </th>
                  <th className="py-3 px-4 sm:px-6 font-bold text-right w-1/4 border-l border-[var(--border-hairline)]">
                    {t('thDelta')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {/* Group I: Penerimaan Bruto Kas Setahun */}
                <tr className="bg-[var(--bg-secondary)]/65">
                  <td
                    colSpan={4}
                    className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] font-bold"
                  >
                    I. {t('groupGrossAnnual')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('annualRoutineSalary', { multiplier: annualMultiplier })}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('annualRoutineSalaryDesc', {
                        thrMonths: annualMultiplier - 12,
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    {renderIDR(existingCalc.monthly.cashGross * annualMultiplier)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/50">
                    {renderIDR(offeringCalc.monthly.cashGross * annualMultiplier)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      (offeringCalc.monthly.cashGross -
                        existingCalc.monthly.cashGross) *
                        annualMultiplier
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('bonusLabel')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('annualBonusDesc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    {renderIDR(existingCalc.annual.bonus)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/50">
                    {renderIDR(offeringCalc.annual.bonus)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.annual.bonus - existingCalc.annual.bonus
                    )}
                  </td>
                </tr>
                <tr className="bg-[var(--bg-primary)] border-y border-[var(--border-strong)] font-bold">
                  <td className="py-2.5 px-4 sm:px-6 text-[var(--text-primary)] font-mono uppercase text-[11px] tracking-wider">
                    {t('subtotalGrossAnnual')}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[var(--text-primary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    {renderIDR(existingCalc.annual.cashGross)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[var(--accent-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]">
                    {renderIDR(offeringCalc.annual.cashGross)}
                  </td>
                  <td className="py-2.5 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(deltaAnnualGross)}
                  </td>
                </tr>

                {/* Group II: Beban Pajak & Iuran Setahun */}
                <tr className="bg-[var(--semantic-danger-soft)]">
                  <td
                    colSpan={4}
                    className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--semantic-danger)] font-bold"
                  >
                    II. {t('groupDeductionsAnnual')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('annualPph21Label')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('annualPph21Desc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.annual.pph21)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/40">
                    -{renderIDR(offeringCalc.annual.pph21)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.annual.pph21 - existingCalc.annual.pph21,
                      true
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('annualBpjsEmployeeLabel')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('annualBpjsEmployeeDesc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.annual.bpjs.totalEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/40">
                    -{renderIDR(offeringCalc.annual.bpjs.totalEmployee)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.annual.bpjs.totalEmployee -
                        existingCalc.annual.bpjs.totalEmployee,
                      true
                    )}
                  </td>
                </tr>
                <tr className="bg-[var(--semantic-danger-soft)] border-y border-[var(--semantic-danger)]/30 font-bold text-[var(--semantic-danger)]">
                  <td className="py-2.5 px-4 sm:px-6 font-mono uppercase text-[11px] tracking-wider">
                    {t('subtotalDeductionsAnnual')}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.annual.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(offeringCalc.annual.totalDeductions)}
                  </td>
                  <td className="py-2.5 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.annual.totalDeductions -
                        existingCalc.annual.totalDeductions,
                      true
                    )}
                  </td>
                </tr>

                {/* Group III: Kontribusi BPJS Ditanggung Perusahaan */}
                <tr className="bg-[var(--accent-secondary-soft)]">
                  <td
                    colSpan={4}
                    className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--accent-secondary)] font-bold"
                  >
                    III. {t('groupEmployerBenefit')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('employerBpjsLabel')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('employerBpjsDesc')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    +{renderIDR(existingCalc.annual.bpjs.totalEmployer)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--accent-secondary)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/50">
                    +{renderIDR(offeringCalc.annual.bpjs.totalEmployer)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      offeringCalc.annual.bpjs.totalEmployer -
                        existingCalc.annual.bpjs.totalEmployer
                    )}
                  </td>
                </tr>
              </tbody>

              {/* Double-Ruled Accounting Total Footer */}
              <tfoot>
                <tr className="bg-[#0D1F18] text-[#F5EFE4] border-t-2 border-[var(--border-strong)]">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-[#EAB308] shrink-0" />
                      <div>
                        <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#F5EFE4] uppercase block">
                          {t('heroNetAnnualTitle')}
                        </span>
                        <span className="text-[11px] text-[#A7B8B0] font-normal">
                          {t('heroNetAnnualSubtitle')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-[#D7E2DC] font-mono tabular-nums text-xs sm:text-sm font-bold border-l border-white/10">
                    {renderIDR(existingCalc.annual.netSalary)}
                  </td>
                  <td className="py-4 px-4 text-right text-[#EAB308] font-mono tabular-nums text-sm sm:text-base font-extrabold border-l border-white/10 bg-white/[0.03]">
                    {renderIDR(offeringCalc.annual.netSalary)}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right border-l border-white/10">
                    <div className="inline-flex flex-col items-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold border font-mono tabular-nums ${
                          deltaAnnualNet >= 0
                            ? 'bg-[#EAB308]/15 text-[#EAB308] border-[#EAB308]/40'
                            : 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/40'
                        }`}
                      >
                        {deltaAnnualNet >= 0 ? '+' : ''}
                        {renderIDR(deltaAnnualNet)}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#4ADE80] mt-1">
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

import React from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react'

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
  return (
    <section id="section-breakdown" className="space-y-6 print-clean scroll-mt-24">
      {/* Editorial Section Masthead */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-sm p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_2px_0_0_var(--shadow-ledger)] no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="folio-stamp text-[var(--accent-secondary)] bg-[var(--accent-secondary-soft)] border border-[var(--accent-secondary)]/30 px-2 py-0.5 rounded-sm">
              FOLIO 03 // AUDIT MATRIX
            </span>
            <span className="folio-stamp text-[var(--text-muted)]">
              PP 58/2023 &amp; PASAL 17 UU HPP
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            {t('breakdownTitle')}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            {t('breakdownSubtitle')}
          </p>
        </div>

        {/* Period Selector Index Tabs */}
        <div className="flex bg-[var(--bg-secondary)] p-1 rounded-sm border border-[var(--border-hairline)] text-xs self-start sm:self-auto gap-1 shrink-0">
          {[
            { id: 'monthly', label: t('periodMonthly') },
            { id: 'annual', label: t('periodAnnual') },
            { id: 'both', label: t('periodAll') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTablePeriod(tab.id)}
              className={`px-3 py-1.5 rounded-sm font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
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
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[var(--accent-primary-solid)] text-white rounded-sm">
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

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-xs self-start sm:self-auto">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {t('deltaNetThp')}
              </span>
              <span className={`font-mono font-bold tabular-nums ${
                deltaMonthlyNet >= 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--semantic-danger)]'
              }`}>
                {deltaMonthlyNet >= 0 ? '+' : ''}{renderIDR(deltaMonthlyNet)}{t('perMonth')}
              </span>
              <span className={`font-mono font-bold text-[11px] ${
                deltaMonthlyNet >= 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--semantic-danger)]'
              }`}>
                ({deltaMonthlyNetPct >= 0 ? '+' : ''}{deltaMonthlyNetPct.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Mobile Table Scroll Hint */}
          <div className="sm:hidden px-4 py-2 bg-[var(--bg-primary)] border-b border-[var(--border-hairline)] flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-mono">
            <span className="flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
              <span>{t('mobileTableScrollHint')}</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b-2 border-[var(--border-strong)] text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-widest">
                  <th className="py-3 px-4 sm:px-6 font-bold w-5/12">{t('thComponent')}</th>
                  <th className="py-3 px-4 font-bold text-right w-7/32 border-l border-[var(--border-hairline)]">
                    {t('thCurrent')} <span className="text-[9px] text-[var(--text-muted)]">[{existingTaxMethod.toUpperCase()}]</span>
                  </th>
                  <th className="py-3 px-4 font-bold text-right text-[var(--accent-primary)] w-7/32 border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]">
                    {activeOffering.name} <span className="text-[9px] opacity-80">[{activeOffering.taxMethod.toUpperCase()}]</span>
                  </th>
                  <th className="py-3 px-4 sm:px-6 font-bold text-right w-1/4 border-l border-[var(--border-hairline)]">
                    {t('thDelta')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {/* Group I: Pendapatan Bruto Bulanan */}
                <tr className="bg-[var(--bg-secondary)]/65">
                  <td colSpan={4} className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] font-bold">
                    I. {t('groupGrossMonthly')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">{t('basicSalaryLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('basicSalaryDesc')}</div>
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
                    <div className="font-bold text-[var(--text-primary)]">{t('fixedAllowanceLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('fixedAllowanceDesc')}</div>
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
                  <td colSpan={4} className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--semantic-danger)] font-bold">
                    II. {t('groupDeductionsMonthly')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
                      <span>{t('pph21TerLabel')}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger)] border border-[var(--semantic-danger)]/30 font-bold">
                        TER {existingCalc.terCategory} ({existingCalc.terPercentage}%) ➔ {offeringCalc.terCategory} ({offeringCalc.terPercentage}%)
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('pph21TerDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.monthly.pph21)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]/40">
                    -{renderIDR(offeringCalc.monthly.pph21)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(offeringCalc.monthly.pph21 - existingCalc.monthly.pph21, true)}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">{t('bpjsKesLabelShort')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('bpjsKesDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.monthly.bpjs.kesEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]/40">
                    -{renderIDR(offeringCalc.monthly.bpjs.kesEmployee)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(offeringCalc.monthly.bpjs.kesEmployee - existingCalc.monthly.bpjs.kesEmployee, true)}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">{t('bpjsTkLabelShort')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('bpjsTkDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.monthly.bpjs.jhtEmployee + existingCalc.monthly.bpjs.jpEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-primary-soft)]/40">
                    -{renderIDR(offeringCalc.monthly.bpjs.jhtEmployee + offeringCalc.monthly.bpjs.jpEmployee)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(
                      (offeringCalc.monthly.bpjs.jhtEmployee + offeringCalc.monthly.bpjs.jpEmployee) -
                      (existingCalc.monthly.bpjs.jhtEmployee + existingCalc.monthly.bpjs.jpEmployee),
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
                    {renderDeltaBadge(offeringCalc.monthly.totalDeductions - existingCalc.monthly.totalDeductions, true)}
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold border font-mono tabular-nums ${
                        deltaMonthlyNet >= 0
                          ? 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/40'
                          : 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/40'
                      }`}>
                        {deltaMonthlyNet >= 0 ? '+' : ''}{renderIDR(deltaMonthlyNet)}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#EAB308] mt-1">
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

      {/* SCHEDULE 02: PROYEKSI AKUMULASI TAHUNAN (ANNUALIZED PACKAGE) */}
      {(tablePeriod === 'both' || tablePeriod === 'annual') && (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-sm overflow-hidden shadow-[0_3px_0_0_var(--shadow-ledger)]">
          {/* Ledger Subheader */}
          <div className="px-4 sm:px-6 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-strong)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#9A6B13] text-white rounded-sm">
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

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-xs self-start sm:self-auto">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {t('deltaNetAnnual')}
              </span>
              <span className={`font-mono font-bold tabular-nums ${
                deltaAnnualNet >= 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--semantic-danger)]'
              }`}>
                {deltaAnnualNet >= 0 ? '+' : ''}{renderIDR(deltaAnnualNet)}{t('perYear')}
              </span>
              <span className={`font-mono font-bold text-[11px] ${
                deltaAnnualNet >= 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--semantic-danger)]'
              }`}>
                ({deltaAnnualNetPct >= 0 ? '+' : ''}{deltaAnnualNetPct.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Mobile Table Scroll Hint */}
          <div className="sm:hidden px-4 py-2 bg-[var(--bg-primary)] border-b border-[var(--border-hairline)] flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-mono">
            <span className="flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
              <span>{t('mobileTableScrollHint')}</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b-2 border-[var(--border-strong)] text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-widest">
                  <th className="py-3 px-4 sm:px-6 font-bold w-5/12">{t('thComponentAnnual')}</th>
                  <th className="py-3 px-4 font-bold text-right w-7/32 border-l border-[var(--border-hairline)]">
                    {t('thCurrent')} <span className="text-[9px] text-[var(--text-muted)]">[{existingTaxMethod.toUpperCase()}]</span>
                  </th>
                  <th className="py-3 px-4 font-bold text-right text-[var(--accent-secondary)] w-7/32 border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]">
                    {activeOffering.name} <span className="text-[9px] opacity-80">[{activeOffering.taxMethod.toUpperCase()}]</span>
                  </th>
                  <th className="py-3 px-4 sm:px-6 font-bold text-right w-1/4 border-l border-[var(--border-hairline)]">
                    {t('thDelta')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {/* Group I: Penerimaan Bruto Kas Setahun */}
                <tr className="bg-[var(--bg-secondary)]/65">
                  <td colSpan={4} className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] font-bold">
                    I. {t('groupGrossAnnual')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">
                      {t('annualRoutineSalary', { multiplier: annualMultiplier })}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {t('annualRoutineSalaryDesc', { thrMonths: annualMultiplier - 12 })}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    {renderIDR(existingCalc.monthly.cashGross * annualMultiplier)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/50">
                    {renderIDR(offeringCalc.monthly.cashGross * annualMultiplier)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge((offeringCalc.monthly.cashGross - existingCalc.monthly.cashGross) * annualMultiplier)}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">{t('bonusLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('annualBonusDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    {renderIDR(existingCalc.annual.bonus)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-primary)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/50">
                    {renderIDR(offeringCalc.annual.bonus)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(offeringCalc.annual.bonus - existingCalc.annual.bonus)}
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
                  <td colSpan={4} className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--semantic-danger)] font-bold">
                    II. {t('groupDeductionsAnnual')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">{t('annualPph21Label')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('annualPph21Desc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.annual.pph21)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/40">
                    -{renderIDR(offeringCalc.annual.pph21)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(offeringCalc.annual.pph21 - existingCalc.annual.pph21, true)}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">{t('annualBpjsEmployeeLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('annualBpjsEmployeeDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    -{renderIDR(existingCalc.annual.bpjs.totalEmployee)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--semantic-danger)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/40">
                    -{renderIDR(offeringCalc.annual.bpjs.totalEmployee)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(offeringCalc.annual.bpjs.totalEmployee - existingCalc.annual.bpjs.totalEmployee, true)}
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
                    {renderDeltaBadge(offeringCalc.annual.totalDeductions - existingCalc.annual.totalDeductions, true)}
                  </td>
                </tr>

                {/* Group III: Kontribusi BPJS Ditanggung Perusahaan */}
                <tr className="bg-[var(--accent-secondary-soft)]">
                  <td colSpan={4} className="py-2 px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[var(--accent-secondary)] font-bold">
                    III. {t('groupEmployerBenefit')}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-primary)]/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-bold text-[var(--text-primary)]">{t('employerBpjsLabel')}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{t('employerBpjsDesc')}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums border-l border-[var(--border-hairline)]">
                    +{renderIDR(existingCalc.annual.bpjs.totalEmployer)}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--accent-secondary)] font-mono tabular-nums font-bold border-l border-[var(--border-hairline)] bg-[var(--accent-secondary-soft)]/50">
                    +{renderIDR(offeringCalc.annual.bpjs.totalEmployer)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right border-l border-[var(--border-hairline)]">
                    {renderDeltaBadge(offeringCalc.annual.bpjs.totalEmployer - existingCalc.annual.bpjs.totalEmployer)}
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold border font-mono tabular-nums ${
                        deltaAnnualNet >= 0
                          ? 'bg-[#EAB308]/15 text-[#EAB308] border-[#EAB308]/40'
                          : 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/40'
                      }`}>
                        {deltaAnnualNet >= 0 ? '+' : ''}{renderIDR(deltaAnnualNet)}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#4ADE80] mt-1">
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
    </section>
  )
}

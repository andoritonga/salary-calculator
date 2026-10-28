import React, { useState } from 'react'
import { formatNumberWithDots, parseNumberFromDots } from '../utils/taxCalculator'

export default function CurrencyInput({
  label,
  subtitle,
  badge,
  value,
  onChange,
  placeholder = '0',
  disabled = false,
  highlight = false,
  isPrivate = false,
  isPrivacy = false,
}) {
  const [isFocused, setIsFocused] = useState(false)
  const privacyActive = Boolean(isPrivate || isPrivacy)

  const handleChange = (e) => {
    const raw = e.target.value
    const parsed = parseNumberFromDots(raw)
    onChange(parsed)
  }

  const displayVal = value ? formatNumberWithDots(value) : ''

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <label className="text-xs font-bold tracking-tight text-[var(--text-primary)]">
          {label}
        </label>
        {badge && (
          <span
            className={`font-mono text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
              highlight
                ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div
        className={`relative flex items-stretch rounded-sm border transition-all duration-150 overflow-hidden ${
          highlight
            ? isFocused
              ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20 bg-[var(--bg-elevated)] shadow-sm'
              : 'border-[var(--accent-primary)]/50 bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)]'
            : isFocused
              ? 'border-[var(--border-strong)] ring-2 ring-[var(--border-strong)]/15 bg-[var(--bg-elevated)]'
              : 'border-[var(--border-hairline)] bg-[var(--bg-primary)] hover:border-[var(--border-strong)]'
        }`}
      >
        <div
          className={`px-3 flex items-center justify-center border-r font-mono text-xs font-bold select-none shrink-0 ${
            highlight
              ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
          }`}
        >
          IDR
        </div>
        <input
          type="text"
          inputMode="numeric"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 bg-transparent font-mono text-sm sm:text-base font-bold tabular-nums tracking-tight focus:outline-none transition-all duration-150 ${
            privacyActive && !isFocused ? 'blur-[6px] select-none hover:blur-none' : ''
          } ${
            highlight
              ? 'text-[var(--accent-primary)] placeholder:text-[var(--accent-primary)]/35'
              : 'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50'
          }`}
        />
      </div>

      {subtitle && (
        <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  )
}

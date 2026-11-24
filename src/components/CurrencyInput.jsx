import React, { useId, useState } from 'react'
import { formatNumberWithDots, parseNumberFromDots } from '../utils/taxCalculator'

/**
 * Accessible currency input with linked <label>, tabular figures, and 44px minimum height.
 */
export default function CurrencyInput({
  inputId,
  label,
  subtitle,
  value,
  onChange,
  placeholder = '0',
  disabled = false,
  highlight = false,
  isPrivacy = false,
  isPrivate = false,
}) {
  const generatedId = useId()
  const resolvedId = inputId || generatedId
  const subtitleId = subtitle ? `${resolvedId}-hint` : undefined
  const [isFocused, setIsFocused] = useState(false)
  const shouldBlur = (isPrivacy || isPrivate) && !isFocused

  const handleChange = (e) => {
    const raw = e.target.value
    const parsed = parseNumberFromDots(raw)
    onChange(parsed)
  }

  const displayVal = value ? formatNumberWithDots(value) : ''

  return (
    <div>
      <label
        htmlFor={resolvedId}
        className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)] select-none"
        >
          Rp
        </span>
        <input
          id={resolvedId}
          type="text"
          inputMode="numeric"
          aria-describedby={subtitleId}
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 bg-[var(--bg-subtle)] border rounded-xl text-sm font-semibold tabular-nums transition-colors duration-150 placeholder:text-[var(--text-muted)] placeholder:font-normal ${
            shouldBlur ? 'blur-[5px] select-none hover:blur-none focus:blur-none' : ''
          } ${
            highlight
              ? 'border-[var(--accent-border)] text-[var(--accent-text)]'
              : 'border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
          }`}
        />
      </div>
      {subtitle && (
        <p id={subtitleId} className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

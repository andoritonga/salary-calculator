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
  isPrivacy = false,
}) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e) => {
    const raw = e.target.value
    const parsed = parseNumberFromDots(raw)
    onChange(parsed)
  }

  const displayVal = value ? formatNumberWithDots(value) : ''

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-slate-300">
          {label}
        </label>
        {badge && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-xs font-medium text-slate-500">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-lg text-sm font-semibold transition focus:outline-none ${
            isPrivacy && !isFocused ? 'blur-[4px] select-none hover:blur-none' : ''
          } ${
            highlight
              ? 'border-emerald-500/60 text-white focus:ring-1 focus:ring-emerald-500'
              : 'border-slate-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
          }`}
        />
      </div>
      {subtitle && (
        <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  )
}

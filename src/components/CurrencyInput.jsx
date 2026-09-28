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
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-slate-300">
          {label}
        </label>
        {badge && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
            {badge}
          </span>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-slate-500 select-none">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950/70 hover:bg-slate-950/90 focus:bg-slate-950 border rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none ${
            isPrivacy && !isFocused ? 'blur-[4.5px] select-none hover:blur-none' : ''
          } ${
            highlight
              ? 'border-emerald-500/50 text-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 shadow-sm shadow-emerald-500/5'
              : 'border-slate-800 text-slate-100 hover:border-slate-750 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20'
          }`}
        />
      </div>
      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

// ============================================================
// Drilling Calculator — InputField Component (Atomic)
// Minimalist Silicon Valley input with flexible numeric editing
// ============================================================

import { useState, useCallback } from "react";
import type { ValidationStatus } from "../../store/drilling-types";
import "./InputField.css";

interface InputFieldProps {
  label: string;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  validationStatus?: ValidationStatus;
  validationMessage?: string;
  disabled?: boolean;
  tooltip?: string;
}

export function InputField({
  label,
  value,
  unit,
  onChange,
  min,
  max,
  step = 0.01,
  validationStatus = "valid",
  validationMessage,
  disabled = false,
  tooltip,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  // Local editing buffer — only used while the field is focused
  const [localValue, setLocalValue] = useState<string>("");

  // Derive the displayed value: prop when not focused, local buffer when focused
  const displayValue = focused
    ? localValue
    : isFinite(value) && !isNaN(value) && value !== 0
      ? value.toString()
      : "";

  const handleFocus = useCallback(() => {
    setLocalValue(value === 0 ? "" : value.toString());
    setFocused(true);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalValue(raw);

      if (raw === "" || raw === "-") return;

      const num = parseFloat(raw);
      if (!isNaN(num)) {
        onChange(num);
      }
    },
    [onChange],
  );

  const handleBlur = useCallback(() => {
    setFocused(false);
    // Reset local buffer; if invalid, revert to prop value via onChange
    if (localValue === "" || isNaN(parseFloat(localValue))) {
      onChange(value);
    }
    setLocalValue("");
  }, [localValue, value, onChange]);

  const statusClass =
    validationStatus === "error"
      ? "invalid"
      : validationStatus === "warning"
        ? "warning"
        : "";

  return (
    <div
      className={`input-field ${focused ? "focused" : ""} ${statusClass}`}
      title={tooltip}
    >
      <div className="input-field__header">
        <label className="input-field__label">{label}</label>
        {unit && <span className="input-field__unit">{unit}</span>}
      </div>
      <input
        type="number"
        className={`input-field__input ${statusClass}`}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        placeholder="Ingrese..."
      />
      {validationMessage && (
        <span
          className={`input-field__msg input-field__msg--${validationStatus}`}
        >
          {validationMessage}
        </span>
      )}
    </div>
  );
}

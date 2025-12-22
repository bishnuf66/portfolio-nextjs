import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSelectClasses } from "@/utils/colorUtils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  className = "",
  value,
  defaultValue,
  onChange,
  name,
  disabled,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const currentValue = useMemo(() => {
    if (value !== undefined && value !== null) return String(value);
    if (defaultValue !== undefined && defaultValue !== null)
      return String(defaultValue);
    return options?.[0]?.value ?? "";
  }, [value, defaultValue, options]);

  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((o) => o.value === currentValue)),
    [options, currentValue]
  );

  const selectedOption = options[selectedIndex] || options[0];

  useEffect(() => {
    if (!open) return;
    setHighlightIndex(selectedIndex);
  }, [open, selectedIndex]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const emitChange = (newValue: string) => {
    if (onChange) {
      const event = {
        target: { value: newValue, name },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    setOpen((p) => !p);
  };

  const handleSelect = (idx: number) => {
    const opt = options[idx];
    if (!opt) return;
    emitChange(opt.value);
    setOpen(false);
    // restore focus to button for keyboard continuity
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setOpen(true);
      setHighlightIndex(selectedIndex);
      return;
    }

    if (open) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => Math.min(options.length - 1, (i < 0 ? selectedIndex : i) + 1));
        listRef.current?.scrollTo({
          top: Math.max(0, (highlightIndex + 1) * 36 - 144),
          behavior: "smooth",
        });
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => Math.max(0, (i < 0 ? selectedIndex : i) - 1));
        listRef.current?.scrollTo({
          top: Math.max(0, (highlightIndex - 1) * 36 - 144),
          behavior: "smooth",
        });
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (highlightIndex >= 0) handleSelect(highlightIndex);
        return;
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  // Styling
  const buttonBase =
    "w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-between gap-2";
  const colorFixes =
    "text-light-text dark:text-dark-text bg-light-primary dark:bg-dark-tertiary placeholder-light-text-muted dark:placeholder-dark-text-muted border-light-border dark:border-dark-border";
  const buttonClasses = `${getSelectClasses(`${buttonBase} ${colorFixes} ${className}`)}`;

  const listClasses =
    "absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg shadow-lg border border-light-border dark:border-dark-border bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100";

  const optionBase =
    "px-3 py-2 cursor-pointer transition-colors select-none flex items-center justify-between";

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Visually hidden native select to preserve semantics for forms if needed */}
      <select
        {...rest}
        name={name}
        value={currentValue}
        onChange={(e) => emitChange(e.target.value)}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        className={buttonClasses}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={name ? `${name}-listbox` : undefined}
        onClick={handleToggle}
        onKeyDown={onKeyDown}
        disabled={disabled}
      >
        <span className="truncate text-left">{selectedOption?.label ?? "Select..."}</span>
        {/* Chevron */}
        <svg
          className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <ul
          ref={listRef}
          id={name ? `${name}-listbox` : undefined}
          role="listbox"
          aria-activedescendant={
            highlightIndex >= 0 ? `${name}-option-${highlightIndex}` : undefined
          }
          className={listClasses}
        >
          {options.map((opt, idx) => {
            const selected = opt.value === currentValue;
            const highlighted = idx === highlightIndex;
            const classes = [
              optionBase,
              highlighted
                ? "bg-gray-100 dark:bg-neutral-800"
                : "bg-transparent",
              selected
                ? "text-blue-700 dark:text-blue-300"
                : "text-inherit",
            ].join(" ");
            return (
              <li
                id={name ? `${name}-option-${idx}` : undefined}
                key={opt.value}
                role="option"
                aria-selected={selected}
                className={classes}
                onMouseEnter={() => setHighlightIndex(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(idx)}
              >
                <span className="truncate">{opt.label}</span>
                {selected && (
                  <svg
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;

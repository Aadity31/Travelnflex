"use client";

import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

interface CustomDatePickerProps {
  value: DateValueType;
  onChange: (value: DateValueType) => void;
  placeholder?: string;
  maxDate?: Date;
  minDate?: Date | null;
  disabled?: boolean;
  required?: boolean;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "Select Date",
  maxDate = new Date(),
  minDate = null,
  disabled = false,
}: CustomDatePickerProps) {
  return (
    <Datepicker
      asSingle={true}
      useRange={false}
      value={value}
      onChange={onChange}
      maxDate={maxDate}
      minDate={minDate}
      disabled={disabled}
      displayFormat="DD/MM/YYYY"
      placeholder={placeholder}
      inputClassName="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 font-medium"
      toggleClassName="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600"
      primaryColor="orange"
      popoverDirection="down"
      configs={{
        shortcuts: {
          today: "Today",
          yesterday: "Yesterday",
          past: (period: number) => `Last ${period} days`,
        },
      }}
    />
  );
}

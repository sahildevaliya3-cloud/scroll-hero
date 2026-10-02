import React from "react";

interface StatProps {
  id: string;
  value: string;
  label: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Stat({
  id,
  value,
  label,
  style = {},
  className = "",
}: StatProps) {
  return (
    <div
      id={id}
      style={style}
      className={`text-box absolute z-[5] m-1.5 sm:m-3 md:m-4 flex flex-col items-start justify-center rounded-[10px] p-3 sm:p-5 md:p-[30px] text-xs sm:text-sm md:text-[18px] select-none max-w-[145px] sm:max-w-[210px] md:max-w-none bg-[var(--color-stat-card-bg)] border border-[var(--color-stat-card-border)] shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm ${className}`}
    >
      <span
        data-target={value}
        className="num-box text-[28px] sm:text-[40px] md:text-[58px] font-semibold leading-none mb-1 text-[var(--color-stat-value)]"
      >
        {value}
      </span>
      <span className="leading-tight text-[var(--color-stat-label)]">{label}</span>
    </div>
  );
}





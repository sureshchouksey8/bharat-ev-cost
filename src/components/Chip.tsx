// src/components/Chip.tsx
"use client";

type ChipProps = {
  label: string | number;
  active?: boolean;
  customActiveGradient?: boolean;
  onClick?: () => void;
};

export default function Chip({ label, active, customActiveGradient, onClick }: ChipProps) {
  const base = "px-4 py-2 rounded-full font-semibold transition-all";
  const normal = " bg-white/10 hover:bg-white/20 text-white";
  const activeClass = customActiveGradient ? " bg-gradient-to-br from-yellow-300 to-rose-500 text-black shadow" : " bg-white text-black shadow";
  return (
    <button onClick={onClick} className={base + (active ? " " + activeClass : normal)}>
      {label}
    </button>
  );
}

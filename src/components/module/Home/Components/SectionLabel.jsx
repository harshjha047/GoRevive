import { cn } from "../Services/utils";

export default function SectionLabel({ children, className, light = false }) {
  return (
    <div className={cn(
      "font-display text-[11px] font-bold tracking-[0.15em] uppercase mb-4 flex items-center gap-3",
      light ? "text-g300" : "text-g400",
      className
    )}>
      <span className={cn(
        "block w-8 h-[2px]",
        light ? "bg-g300" : "bg-g400"
      )}></span>
      {children}
    </div>
  );
}
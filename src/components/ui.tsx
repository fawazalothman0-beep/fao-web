import Link from "next/link";
import { cn } from "@/lib/cn";

/* ---- Layout ---- */
export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

export function Section({
  className,
  tone = "default",
  children,
  id,
}: {
  className?: string;
  tone?: "default" | "sunken" | "deep";
  children: React.ReactNode;
  id?: string;
}) {
  const toneCls =
    tone === "deep"
      ? "bg-surface-deep text-content-inverse"
      : tone === "sunken"
        ? "bg-surface-sunken"
        : "bg-surface";
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", toneCls, className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

/* ---- Button (link or button) ---- */
type ButtonVariant = "primary" | "secondary" | "ghost" | "gold" | "inverse";
type ButtonSize = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none";
const SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover shadow-sm",
  secondary: "border border-border-strong bg-surface text-content hover:border-content-subtle hover:bg-surface-sunken",
  ghost: "text-content hover:bg-surface-sunken",
  gold: "bg-gold text-white hover:bg-gold-600 shadow-sm",
  inverse: "bg-white text-navy-900 hover:bg-white/90",
};

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  target?: string;
  rel?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  target,
  rel,
  onClick,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const cls = cn(BASE, SIZES[size], VARIANTS[variant], className);
  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      return (
        <a href={href} className={cls} target={target} rel={rel} onClick={onClick} aria-label={ariaLabel}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/* ---- Badge ---- */
type BadgeTone = "navy" | "blue" | "gold" | "muted" | "success" | "outline";
const BADGE: Record<BadgeTone, string> = {
  navy: "bg-navy-900 text-white",
  blue: "bg-primary/10 text-primary-strong",
  gold: "bg-gold-soft text-gold-600",
  muted: "bg-surface-sunken text-content-muted border border-border",
  success: "bg-success-soft text-success",
  outline: "border border-border-strong text-content-muted",
};
export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        BADGE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---- Form fields ---- */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-content">
        {label}
        {required ? <span className="text-primary"> *</span> : hint ? <span className="text-content-subtle"> — {hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

const CONTROL =
  "w-full rounded-lg border border-border bg-surface px-3.5 text-base text-content placeholder:text-content-subtle transition-colors focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/30";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(CONTROL, "h-11", props.className)} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(CONTROL, "min-h-28 py-2.5", props.className)} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(CONTROL, "h-11 appearance-none bg-surface pe-9", props.className)} />;
}

/* ---- Misc ---- */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border-subtle", className)} />;
}

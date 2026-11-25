import type { ReactNode } from "react";

export type IconName =
  | "home"
  | "sparkles"
  | "user"
  | "calendar"
  | "book"
  | "file"
  | "bell"
  | "search"
  | "chevron"
  | "arrow"
  | "clock"
  | "cap"
  | "building"
  | "library"
  | "send"
  | "plus"
  | "folder"
  | "more"
  | "mail"
  | "download"
  | "check"
  | "history"
  | "close"
  | "dots"
  | "moon"
  | "video"
  | "award";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.2 3.4L17 8l-3.8 1.6L12 13l-1.2-3.4L7 8l3.8-1.6L12 3Z" />
        <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 13l.6 1.4L21 15l-1.4.6L19 17l-.6-1.4L17 15l1.4-.6L19 13Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.6-4.2 3.3-6 8-6s7.4 1.8 8 6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 10h18" />
      </>
    ),
    book: (
      <>
        <path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Z" />
        <path d="M7 16h11M8 8h6" />
      </>
    ),
    file: (
      <>
        <path d="M6 2h8l4 4v16H6z" />
        <path d="M14 2v5h5M9 12h6m-6 4h6" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    cap: (
      <>
        <path d="m2 9 10-5 10 5-10 5L2 9Z" />
        <path d="M6 11.5V16c3.4 2.7 8.6 2.7 12 0v-4.5M22 9v7" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V8l8-5 8 5v13M8 12h2m4 0h2m-8 4h2m4 0h2M2 21h20" />
      </>
    ),
    library: (
      <>
        <path d="m3 8 9-5 9 5H3ZM5 10v8m5-8v8m4-8v8m5-8v8M3 21h18" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    folder: <path d="M3 6h7l2 2h9v11H3z" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 21h16" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    dots: (
      <>
        <circle cx="8" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="16" cy="12" r="1" fill="currentColor" />
      </>
    ),
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    video: (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="m8.5 12-1 9 4.5-2 4.5 2-1-9" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export function NoraLogo() {
  return (
    <span className="brand-logo nora-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <path fill="currentColor" d="M9 11h10l15 16-9 7-7-8v12L9 51zM35 41l8-11 5 5 6-3v23H44z" />
        <path
          fill="var(--nora-mark-accent)"
          d="M9 11h10l15 16-7 5.44zM37.91 37 43 30l5 5 6-3v23z"
        />
        <path fill="#e5a629" d="m47 4 3 10 10 3-10 3-3 10-3-10-10-3 10-3z" />
        <path fill="#e5a629" d="M5 61 22 38l8 8z" />
        <path fill="currentColor" d="M22 38 45 19 30 46z" />
      </svg>
    </span>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  ariaLabel,
  ariaExpanded,
  ariaCurrent,
  ariaPressed,
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "icon";
  className?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaCurrent?: "page";
  ariaPressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-current={ariaCurrent}
      aria-pressed={ariaPressed}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-title">
      <div className="title-md">{children}</div>
      {action}
    </div>
  );
}

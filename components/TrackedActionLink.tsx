"use client";

export function TrackedActionLink({
  cardId,
  eventType,
  href,
  children,
  className,
  style,
}: {
  cardId: string;
  eventType: string;
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={() => {
        fetch("/api/track-click", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cardId,
            eventType,
          }),
        });
      }}
    >
      {children}
    </a>
  );
}
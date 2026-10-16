import type { CSSProperties } from "react";

// Sets --type-color so Tailwind classes like text-(--type-color) can use a color from the database.
export function typeColorStyle(color: string | undefined): CSSProperties {
  return {
    "--type-color": color ?? "initial",
  } as CSSProperties;
}

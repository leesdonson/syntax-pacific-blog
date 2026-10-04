import { cn } from "@/utils/cn";
import type { Author, Size } from "@/types/blog";

export interface AvatarProps {
  readonly author: Author;
  readonly size?: Size;
  readonly className?: string;
}

const SIZES: Record<Size, string> = {
  sm: "size-7 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-14 text-base",
};

/** Gradient initials chip — avoids shipping avatar images entirely. */
export function Avatar({ author, size = "md", className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={`${author.name} avatar`}
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-mono font-semibold text-slate-950 ring-1 ring-white/10",
        SIZES[size],
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${author.avatarGradient[0]}, ${author.avatarGradient[1]})`,
      }}
    >
      {author.initials}
    </span>
  );
}

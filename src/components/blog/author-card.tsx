import type { Author } from "@/types/blog";
import { Avatar } from "./avatar";
import { SocialLinks } from "@/components/common/social-links";
import type { SocialLink, SocialPlatform } from "@/types/blog";

export interface AuthorCardProps {
  readonly author: Author;
}

const LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  x: "X / Twitter",
  tiktok: "TikTok",
  facebook: "Facebook",
  website: "Personal site",
};

export function AuthorCard({ author }: AuthorCardProps) {
  const links: SocialLink[] = Object.entries(author.socials).map(
    ([platform, href]) => ({
      platform: platform as SocialPlatform,
      label: `${author.name} on ${LABELS[platform as SocialPlatform]}`,
      href: href as string,
    }),
  );

  return (
    <aside
      aria-label={`About ${author.name}`}
      className="not-prose relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 backdrop-blur-md sm:p-7"
    >
      <div
        aria-hidden
        className="absolute -left-10 -top-10 size-40 rounded-full bg-accent/12 blur-3xl"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row">
        <Avatar author={author} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-lg font-semibold text-ink">{author.name}</h2>
            <span className="font-mono text-xs text-accent">
              {author.handle}
            </span>
          </div>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
            {author.role}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {author.bio}
          </p>
          <SocialLinks links={links} className="mt-4" size="sm" />
        </div>
      </div>
    </aside>
  );
}

import { SITE_NAME } from "@/lib/site";

type BrandWordmarkProps = {
  className?: string;
};

export function BrandWordmark({ className }: BrandWordmarkProps) {
  return (
    <span className={className}>
      <span>
        {SITE_NAME.slice(0, 6)}
        <span className="relative inline-block">
          {SITE_NAME[6]}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[0.16em] w-[0.16em] -translate-x-1/2 -translate-y-1/2 bg-amber-400"
          />
        </span>
        {SITE_NAME.slice(7)}
      </span>
    </span>
  );
}

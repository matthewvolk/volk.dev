import { Icons } from "@/components/nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Package, Star } from "lucide-react";
import Link from "next/link";

export const BigRequest = async () => {
  const bigRequestDownloads = async () => {
    const response = await fetch(
      "https://api.npmjs.org/downloads/point/last-year/bigrequest",
      { next: { revalidate: 60 * 60 * 24 } }
    );
    const data = await response.json();
    return data.downloads as number;
  };

  const bigRequestStars = async () => {
    const response = await fetch(
      "https://api.github.com/repos/matthewvolk/bigrequest",
      { next: { revalidate: 60 * 60 * 24 } }
    );
    const data = await response.json();
    return data.stargazers_count as number;
  };

  return (
    <li className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-lg">bigrequest</h3>
        <div className="flex gap-6 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Star size={14} />
            <p>{await bigRequestStars()} Stars</p>
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Download size={14} />
            <p>{await bigRequestDownloads()} Downloads</p>
          </span>
        </div>
      </div>
      <p className="my-4 text-sm text-muted-foreground">
        A Node.js, Typescript-first, BigCommerce HTTP request client generated
        automatically from public BigCommerce OpenAPI specification documents.
        BigDesign is designed to make it easier to implement OAuth2 flows and
        REST operations against the BigCommerce REST Management API.
      </p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <Link
          href="https://github.com/matthewvolk/bigrequest/tree/main/packages/bigrequest"
          target="_blank"
          className="flex items-center justify-center gap-2"
        >
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "flex w-full items-center justify-center gap-2"
            )}
          >
            <Icons.gitHub className="hidden h-4 w-4 md:block" />
            <p>View on Github</p>
          </div>
        </Link>
        <Link
          href="https://www.npmjs.com/package/bigrequest"
          target="_blank"
          className="flex items-center justify-center gap-2"
        >
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "flex w-full items-center justify-center gap-2"
            )}
          >
            <Package size={16} className="hidden md:block" />
            <p>Download on NPM</p>
          </div>
        </Link>
      </div>
    </li>
  );
};
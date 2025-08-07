import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { jobsAtom } from "@/jobs/jobQueue";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { ActivityIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function SiteHeader({ className }: { className?: string }) {
  const jobs = useAtomValue(jobsAtom);
  const runningJobs = jobs.filter((j) => j.status === "running");
  const queuedJobs = jobs.filter((j) => j.status === "queued");
  const totalActive = runningJobs.length + queuedJobs.length;

  return (
    <header
      className={cn(
        "flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
        className,
      )}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link to="/app/jobs">
              {totalActive > 0 ? (
                <Badge variant="default" className="ml-1 h-5 px-1">
                  {totalActive}
                </Badge>
              ) : (
                <ActivityIcon className="size-4" />
              )}

              <span>Job Queue</span>
            </Link>
          </Button>

          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/nitro-bio/pomelo"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

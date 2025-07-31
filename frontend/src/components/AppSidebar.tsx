import { IconDashboard } from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/Nav/nav-main";
import { NavFolding } from "@/components/Nav/nav-folding";
import { NavSecondary } from "@/components/Nav/nav-secondary";
import { NavUser } from "@/components/Nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CitrusIcon, OrigamiIcon } from "lucide-react";

const data = {
  user: {
    name: "Nitro Bio",
    email: "https://nitro.bio/",
    avatar:
      "https://avatars.githubusercontent.com/u/118011593?s=400&u=320aa01a645a63f4825650f7227d73d9235b3cfe&v=4",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
  ],
  navFolding: [
    {
      title: "ESMFold",
      url: "/app/folding/esmfold",
      icon: OrigamiIcon,
    },
  ],

  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className={cn("data-[slot=sidebar-menu-button]:!p-1.5")}
            >
              <a href="#">
                <CitrusIcon className="size-6" />
                <span className="text-base leading-none font-semibold">
                  Pomelo
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavFolding items={data.navFolding} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

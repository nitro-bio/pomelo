import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar/sidebar";
import { Link } from "react-router-dom";

export function NavBrand({
  brand,
}: {
  brand: {
    name: string;
    href: string;
    avatar: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link to={brand.href}>
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage src={brand.avatar} alt={brand.name} />
              <AvatarFallback className="rounded-lg">NB</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{brand.name}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

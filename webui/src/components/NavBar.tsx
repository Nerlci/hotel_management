import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { NAME } from "shared";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "./ui/breadcrumb";
import { Link } from "react-router-dom";

export interface NavBarProps {
  title?: string;
}

export const NavBar: React.FC<NavBarProps> = ({ title }) => {
  return (
    <NavigationMenu className="mb-1 mt-1">
      <NavigationMenuList className="flex items-center">
        <NavigationMenuItem className="ml-2">
          <Link to="/">{NAME}</Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="ml-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>{title ? title : ""}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </NavigationMenuItem>
        <div className="grow"></div>
        <NavigationMenuItem className="mr-2">
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

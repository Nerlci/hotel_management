import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { NAME } from "shared";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "./ui/breadcrumb";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export interface NavBarProps {
  title?: string | JSX.Element;
}

export const NavBar: React.FC<NavBarProps> = ({ title }) => {
  return (
    <>
      <NavigationMenu className="mb-1 mt-1">
        <NavigationMenuList className="flex items-center">
          <NavigationMenuItem className="ml-2">
            <Link to="/">
              <h1 className="text-2xl">{NAME}</h1>
            </Link>
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
      <Separator />
    </>
  );
};

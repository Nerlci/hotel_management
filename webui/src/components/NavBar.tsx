import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { NAME } from "shared";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import XD from "/xd.svg";
import { useEffect } from "react";

export interface NavBarProps {
  title?: string | JSX.Element;
}

export const NavBar: React.FC<NavBarProps> = ({ title }) => {
  const { logout } = useAuth()!;
  useEffect(() => {
    document.title = `${NAME}`;
  });

  return (
    <>
      <NavigationMenu className="mb-1 mt-1">
        <NavigationMenuList className="flex items-center">
          <NavigationMenuItem className="ml-2">
            <div
              onClick={logout}
              className="ml-3 flex items-center gap-3 hover:cursor-pointer"
            >
              <img className="h-8" src={XD} />
              <h1 className="text-2xl">{NAME}</h1>
            </div>
          </NavigationMenuItem>
          <NavigationMenuItem className="ml-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator />
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

import { cva } from "class-variance-authority";
import { Text, TouchableOpacity } from "react-native";

import { cn } from "../lib/utils";
import { PropsWithChildren } from "react";

const buttonVariants = cva(
  "flex flex-row items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        ghost: "bg-slate-700",
        link: "text-primary underline-offset-4",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-2",
        lg: "h-12 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-center font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      ghost: "text-primary-foreground",
      link: "text-primary-foreground underline",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  children,
  className,
  ...props
}: PropsWithChildren<
  {
    className?: string;
  } & React.ComponentPropsWithoutRef<typeof TouchableOpacity>
>) {
  return (
    <TouchableOpacity
      className={cn("h-10 w-32 rounded-lg bg-black dark:bg-white", className)}
      {...props}
    >
      <Text className="mx-auto my-auto text-lg text-white dark:text-black">
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export { Button, buttonVariants, buttonTextVariants };

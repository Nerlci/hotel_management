import { cn } from "@/lib/utils";
import { Switch as NativeSwitch, View, useColorScheme } from "react-native";

function Switch({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof NativeSwitch>) {
  const colorScheme = useColorScheme();
  const trackColor =
    props.trackColor || colorScheme === "dark"
      ? {
          false: "#ccc",
          true: "#fff",
        }
      : {
          false: "#aaa",
          true: "#000",
        };
  const thumbColor =
    props.thumbColor || colorScheme === "dark" ? "#000" : "#fff";

  return (
    <View className={cn(className, "p-2")}>
      <NativeSwitch
        trackColor={trackColor}
        thumbColor={thumbColor}
        {...props}
      />
    </View>
  );
}

export { Switch };

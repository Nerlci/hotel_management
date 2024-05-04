import { Text, View } from "@/components/Themed";

export default function DashboardScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">控制面板</Text>
      <View className="my-6 h-[1px] w-80 bg-gray-200" />
    </View>
  );
}

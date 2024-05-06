import { Switch } from "@/components/Switch";
import { Text, View } from "@/components/Themed";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import {
  MAX_AIRCON_SPEED,
  MAX_AIRCON_TEMP,
  MIN_AIRCON_SPEED,
  MIN_AIRCON_TEMP,
} from "shared";
import { useColorScheme } from "react-native";

export default function DashboardScreen() {
  const [temp, setTemp] = useState(20);
  const [windspeed, setWindspeed] = useState(1);
  const [start, setStart] = useState(false);
  // eslint-disable-next-line
  const [cool, setCool] = useState(true);
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1">
      <View className="mx-6 my-6 flex flex-col rounded-xl border border-gray-100 p-5 dark:border-zinc-900">
        <View className="flex flex-row items-center justify-center">
          <Text className="text-4xl font-bold">空调管理</Text>
          <View className="grow" />
          <View className="flex flex-row items-center justify-center">
            <Text className="text-2xl">{start ? "关闭" : "启动"}</Text>
            <Switch value={start} onValueChange={setStart} />
          </View>
        </View>
        <View className="mt-10 flex">
          <View className="mx-auto flex w-40 flex-row items-center">
            <Text className="text-2xl">温度：</Text>
            <View className="w-32">
              <Text className="mx-auto text-5xl">{temp}&deg;C</Text>
            </View>
          </View>
          <Slider
            className="w-full"
            disabled={!start}
            minimumValue={MIN_AIRCON_TEMP}
            maximumValue={MAX_AIRCON_TEMP}
            value={temp}
            onValueChange={(v) => {
              setTemp(v);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            step={1}
            minimumTrackTintColor={colorScheme === "dark" ? "#222" : "#aaa"}
            maximumTrackTintColor={colorScheme === "dark" ? "#aaa" : "#222"}
          />
          <View>
            <View className="mx-auto flex w-40 flex-row items-center">
              <Text className="text-2xl">风速：</Text>
              <View className="w-32">
                <Text className="mx-auto text-5xl">{windspeed}</Text>
              </View>
            </View>
            <Slider
              className="w-full"
              disabled={!start}
              minimumValue={MIN_AIRCON_SPEED}
              maximumValue={MAX_AIRCON_SPEED}
              value={windspeed}
              onValueChange={(v) => {
                setWindspeed(v);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              step={1}
              minimumTrackTintColor={colorScheme === "dark" ? "#222" : "#aaa"}
              maximumTrackTintColor={colorScheme === "dark" ? "#aaa" : "#222"}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

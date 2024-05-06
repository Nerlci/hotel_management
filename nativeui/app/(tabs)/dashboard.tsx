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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import { Button } from "@/components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function DashboardScreen() {
  const [temp, setTemp] = useState(20);
  const [windspeed, setWindspeed] = useState(1);
  const [start, setStart] = useState(false);
  // eslint-disable-next-line
  const [cool, setCool] = useState(true);
  const colorScheme = useColorScheme();

  const currentTemp = 22;

  return (
    <View className="flex-1">
      <View className="mx-6 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-4xl">空调</CardTitle>
            <View className="grow" />
            <Switch value={start} onValueChange={setStart} />
          </CardHeader>
          <CardContent className="mt-5">
            <View className="mx-auto flex w-40 flex-row items-center">
              <Text className={`mr-3 text-lg ${start ? "" : "text-[#aaa]"}`}>
                温度
              </Text>
              <FontAwesome6
                name={`temperature-arrow-${temp < currentTemp ? "down" : "up"}`}
                size={30}
                color={
                  start
                    ? temp < currentTemp
                      ? "rgb(59 130 246)"
                      : "rgb(249 115 22)"
                    : "#aaa"
                }
              />
              <View className="w-32">
                <Text
                  className={`mx-auto text-5xl ${start ? "" : "text-[#aaa]"}`}
                >
                  {temp}&deg;C
                </Text>
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
                <Text className={`mr-3 text-lg ${start ? "" : "text-[#aaa]"}`}>
                  风速
                </Text>
                <MaterialIcons
                  name="air"
                  size={40}
                  color={
                    start
                      ? colorScheme === "dark"
                        ? "white"
                        : "black"
                      : "#aaa"
                  }
                />
                <View className="w-32">
                  <Text
                    className={`mx-auto text-5xl ${start ? "" : "text-[#aaa]"}`}
                  >
                    {windspeed}
                  </Text>
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
          </CardContent>
          <CardFooter>
            <View className="flex flex-row">
              <View className="grow" />
              <Button
                className={`w-full ${start ? "" : "bg-[#aaa]"}`}
                disabled={!start}
                onPress={() => {
                  console.log("确定");
                }}
              >
                确定
              </Button>
              <View className="grow" />
            </View>
          </CardFooter>
        </Card>
      </View>
    </View>
  );
}

import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "@/components/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  return (
    <View className="flex-1">
      <View className="mx-6 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="mt-1 text-4xl">填写日期</CardTitle>
          </CardHeader>
          <CardContent className="mt-5">
            <View className="ml-0 mr-auto mt-auto flex flex-row items-center justify-center gap-2">
              <View className="flex flex-row items-center justify-center">
                <Text className="text-xl">从</Text>
                <View className="w-24">
                  <RNDateTimePicker
                    mode="date"
                    value={new Date()}
                    timeZoneName={"Asia/Shanghai"}
                    locale="zh-CN"
                  />
                </View>
              </View>
              <View className="flex flex-row items-center justify-center">
                <Text className="text-xl">到</Text>
                <View className="w-24">
                  <RNDateTimePicker
                    mode="date"
                    value={new Date()}
                    timeZoneName={"Asia/Shanghai"}
                    locale="zh-CN"
                  />
                </View>
              </View>
            </View>
          </CardContent>
          <CardFooter>
            <View className="flex flex-row">
              <View className="grow" />
              <Button
                className="w-full"
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

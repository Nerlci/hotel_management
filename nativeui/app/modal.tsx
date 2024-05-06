import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { Text, View } from "@/components/Themed";
import { Input } from "@/components/Input";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useSession } from "@/components/Auth";
import { Link, router } from "expo-router";

export default function ModalScreen() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const session = useSession();
  const isPresented = router.canGoBack();

  if (!session.session) {
    return (
      <View className="flex-1 items-center">
        <Text className="mt-24 text-xl font-bold">登录</Text>
        <View className="my-6 h-[1px] w-80 bg-gray-200" />
        <View className="flex flex-col">
          <Input
            className="my-3 w-64"
            inputClasses="border-black dark:border-white"
            labelClasses="text-gray-900 dark:text-gray-100"
            value={userName}
            onChange={(e) => {
              e.nativeEvent.text && setUserName(e.nativeEvent.text);
            }}
            placeholder="用户名"
          />
          <Input
            className="my-3 w-64"
            inputClasses="border-black dark:border-white"
            labelClasses="text-gray-900 dark:text-gray-100"
            value={password}
            onChange={(e) => {
              e.nativeEvent.text && setPassword(e.nativeEvent.text);
            }}
            placeholder="密码"
            secureTextEntry={true}
          />
          <View className="flex flex-row">
            <Text className="my-auto text-blue-400">请在网页端注册</Text>
            <View className="grow" />
            <Button
              onPress={() => {
                console.log(`login with ${userName} and ${password}`);
                session.signIn(userName);
                router.replace("/(tabs)/");
              }}
            >
              登录
            </Button>
          </View>
        </View>
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    );
  } else {
    return (
      <View className="flex-1 items-center">
        <Text className="mt-24 text-xl font-bold">
          欢迎回来，{session.session}
        </Text>
        <View className="my-6 h-[1px] w-80 bg-gray-200" />
        <View className="flex flex-row items-center justify-center gap-5">
          {isPresented && (
            <Link href="../" asChild>
              <Text className="text-lg text-blue-500">返回</Text>
            </Link>
          )}
          <Button
            onPress={() => {
              session.signOut();
            }}
          >
            登出
          </Button>
        </View>
        {/*<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />*/}
      </View>
    );
  }
}

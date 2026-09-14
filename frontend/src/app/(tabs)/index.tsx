import { Text, View } from "react-native";
import "@/global.css";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        <SafeAreaView>
            <View className="flex justify-center items-center bg-blue-700 h-full">
                <Text className="font-normal text-xl">Hello World</Text>
            </View>
        </SafeAreaView>
    );
}

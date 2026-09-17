import { Tabs } from "expo-router";
import { colors } from "@/presentation/theme/tokens";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                sceneStyle: { backgroundColor: colors.background },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarLabel: "Home Screen",
                    headerShown: false,
                    tabBarStyle: { display: "none" },
                }}
            />
        </Tabs>
    );
}

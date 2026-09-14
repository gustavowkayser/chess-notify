import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
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

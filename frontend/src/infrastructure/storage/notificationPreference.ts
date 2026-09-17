import { getItemAsync, setItemAsync } from "expo-secure-store";

const KEY = "roundNotificationsEnabled";

/** Round notifications are on unless the user turned them off. */
export async function getRoundNotificationsEnabled(): Promise<boolean> {
    return (await getItemAsync(KEY)) !== "false";
}

export async function setRoundNotificationsEnabled(
    enabled: boolean,
): Promise<void> {
    await setItemAsync(KEY, String(enabled));
}

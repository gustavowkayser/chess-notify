import * as Notifications from "expo-notifications";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { registerPushNotifications } from "@/utils/registerPushNotifications";

interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined,
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider",
        );
    }

    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] =
        useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const notificationListener = useRef<Notifications.EventSubscription>(null);
    const responseListener = useRef<Notifications.EventSubscription>(null);
    const pushTokenListener = useRef<Notifications.EventSubscription>(null);

    useEffect(() => {
        registerPushNotifications().then(
            (token) => setExpoPushToken(token),
            (error) => setError(error),
        );

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log(
                    "Notification Received while the app is running: ",
                    notification,
                );
                setNotification(notification);
            });

        pushTokenListener.current = Notifications.addPushTokenListener((pushToken) => {
            setExpoPushToken(pushToken.data);
        });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(
                        "Notification Response: ",
                        JSON.stringify(response, null, 2),
                        JSON.stringify(
                            response.notification.request.content.data,
                            null,
                            2,
                        ),
                    );
                },
            );

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }

            if (responseListener.current) {
                responseListener.current.remove();
            }

            if (pushTokenListener.current) {
                pushTokenListener.current.remove();
            }
        };
    }, []);

    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, error }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

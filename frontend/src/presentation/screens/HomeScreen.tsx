import { BlurTargetView } from "expo-blur";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    BackHandler,
    FlatList,
    Keyboard,
    Pressable,
    RefreshControl,
    StyleSheet,
    type TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Subscription } from "@/domain/entities/Subscription";
import type { Tournament } from "@/domain/entities/Tournament";
import { HomeHeader } from "@/presentation/components/home/HomeHeader";
import { SearchBar } from "@/presentation/components/search/SearchBar";
import { SearchDrawer } from "@/presentation/components/search/SearchDrawer";
import { SearchResults } from "@/presentation/components/search/SearchResults";
import { TournamentCard } from "@/presentation/components/subscriptions/TournamentCard";
import { TournamentCardSkeleton } from "@/presentation/components/subscriptions/TournamentCardSkeleton";
import { AppText } from "@/presentation/components/ui/AppText";
import { StateMessage } from "@/presentation/components/ui/StateMessage";
import { useNotification } from "@/presentation/context/NotificationContext";
import { formatError } from "@/presentation/formatters/error";
import { useDevice } from "@/presentation/hooks/useDevice";
import { useSubscriptions } from "@/presentation/hooks/useSubscriptions";
import { useTournamentSearch } from "@/presentation/hooks/useTournamentSearch";
import { colors } from "@/presentation/theme/tokens";

export default function HomeScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const blurTarget = useRef<View>(null);
    const inputRef = useRef<TextInput>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [isSearching, setSearching] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
        string | null
    >(null);

    const { expoPushToken, error: notificationError } = useNotification();
    const {
        createDevice,
        error: deviceError,
        notificationsEnabled,
        isUpdatingNotifications,
        toggleNotifications,
    } = useDevice();
    const {
        subscriptions,
        status,
        error,
        isRefreshing,
        refresh,
        retry,
        pullToRefresh,
        subscribe,
        unsubscribe,
    } = useSubscriptions();
    const search = useTournamentSearch({ subscriptions, subscribe });

    const registrationError =
        status === "loading"
            ? (notificationError?.message ?? deviceError)
            : null;

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if (expoPushToken) {
            createDevice(expoPushToken).then(refresh);
        }
    }, [expoPushToken]);

    useEffect(() => {
        if (!isSearching && !isLanguageOpen) {
            return;
        }

        const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (isLanguageOpen) {
                    setIsLanguageOpen(false);
                    return true;
                }
                if (isSearching) {
                    closeSearch();
                    return true;
                }
                return false;
            },
        );

        return () => subscription.remove();
    }, [isSearching, isLanguageOpen]);

    const closeSearch = () => {
        inputRef.current?.blur();
        Keyboard.dismiss();
        search.clear();
        setSearching(false);
    };

    const subscribeToLink = async () => {
        if (await search.subscribeToLink()) {
            closeSearch();
        }
    };

    const subscribeTo = async (url: string) => {
        if (await search.subscribeTo(url)) {
            closeSearch();
        }
    };

    const changeNotifications = (enabled: boolean) => {
        if (!expoPushToken) {
            return;
        }

        toggleNotifications(expoPushToken, enabled).catch((error) =>
            Alert.alert(t("alerts.updateFailed"), formatError(error)),
        );
    };

    const openUrl = (url: string) => {
        WebBrowser.openBrowserAsync(url, {
            toolbarColor: colors.background,
            controlsColor: colors.accent,
        });
    };

    const openTournament = (tournament: Tournament) => {
        if (tournament.url) {
            openUrl(tournament.url);
        }
    };

    const toggleCardOptions = (subscription: Subscription) => {
        setExpandedSubscriptionId((current) =>
            current === subscription.id ? null : subscription.id,
        );
    };

    const confirmUnsubscribe = (subscription: Subscription) => {
        Alert.alert(
            t("subscriptions.unsubscribeTitle"),
            t("subscriptions.unsubscribeMessage", {
                name: subscription.tournament.name,
            }),
            [
                { text: t("common.cancel"), style: "cancel" },
                {
                    text: t("common.unsubscribe"),
                    style: "destructive",
                    onPress: () =>
                        unsubscribe(subscription.id).catch((error) =>
                            Alert.alert(
                                t("subscriptions.unsubscribeFailed"),
                                formatError(error),
                            ),
                        ),
                },
            ],
            { userInterfaceStyle: "dark" },
        );
    };

    const renderListState = () => {
        if (registrationError) {
            return (
                <StateMessage
                    icon="bellOff"
                    title={t("errors.deviceRegistrationFailed")}
                    description={registrationError}
                />
            );
        }

        if (status === "loading") {
            return (
                <View className="gap-3">
                    <TournamentCardSkeleton />
                    <TournamentCardSkeleton />
                    <TournamentCardSkeleton />
                </View>
            );
        }

        if (status === "error") {
            return (
                <StateMessage
                    icon="warning"
                    title={t("errors.loadTournamentsFailed")}
                    description={error ?? t("common.tryAgainDesc")}
                    action={{ label: t("common.tryAgain"), onPress: retry }}
                />
            );
        }

        return (
            <StateMessage
                icon="knight"
                title={t("subscriptions.emptyTitle")}
                description=""
                action={{
                    label: t("subscriptions.addTournament"),
                    icon: "add",
                    onPress: () => inputRef.current?.focus(),
                }}
            />
        );
    };

    return (
        <View className="flex-1 bg-background">
            <BlurTargetView ref={blurTarget} style={{ flex: 1 }}>
                {isLanguageOpen && (
                    <Pressable
                        accessibilityLabel="Close language menu"
                        style={styles.languageBackdrop}
                        onPress={() => setIsLanguageOpen(false)}
                    />
                )}

                <View
                    onLayout={(event) =>
                        setHeaderHeight(event.nativeEvent.layout.height)
                    }
                    className="gap-4 px-5 pb-3 mt-4"
                    style={{ paddingTop: insets.top + 8, zIndex: 10 }}
                >
                    <HomeHeader
                        notificationsEnabled={notificationsEnabled}
                        isNotificationsAvailable={expoPushToken !== null}
                        isUpdatingNotifications={isUpdatingNotifications}
                        onToggleNotifications={changeNotifications}
                        isLanguageOpen={isLanguageOpen}
                        onToggleLanguage={() =>
                            setIsLanguageOpen((current) => !current)
                        }
                        onCloseLanguage={() => setIsLanguageOpen(false)}
                    />
                    <SearchBar
                        inputRef={inputRef}
                        value={search.query}
                        isActive={isSearching}
                        onChangeText={search.changeQuery}
                        onFocus={() => {
                            setIsLanguageOpen(false);
                            setSearching(true);
                        }}
                        onCancel={closeSearch}
                        onSubmit={subscribeToLink}
                    />
                </View>

                <FlatList
                    data={status === "ready" ? subscriptions : []}
                    keyExtractor={({ id }) => id}
                    extraData={expandedSubscriptionId}
                    onScrollBeginDrag={() => setIsLanguageOpen(false)}
                    renderItem={({ item }) => (
                        <TournamentCard
                            subscription={item}
                            isExpanded={item.id === expandedSubscriptionId}
                            onPress={openTournament}
                            onToggleOptions={toggleCardOptions}
                            onUnsubscribe={confirmUnsubscribe}
                        />
                    )}
                    ListHeaderComponent={
                        subscriptions.length > 0 ? (
                            <View className="flex-row items-center justify-between px-1 mt-5">
                                <AppText variant="label">
                                    {t("subscriptions.title")}
                                </AppText>
                                <AppText variant="caption">
                                    {t("subscriptions.hint")}
                                </AppText>
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View className="pt-8">{renderListState()}</View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={pullToRefresh}
                            tintColor={colors.accent}
                            colors={[colors.accent]}
                            progressBackgroundColor={colors.surfaceRaised}
                        />
                    }
                    contentContainerStyle={{
                        gap: 12,
                        paddingHorizontal: 20,
                        paddingBottom: insets.bottom + 32,
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />
            </BlurTargetView>

            {isSearching && (
                <SearchDrawer
                    top={headerHeight}
                    blurTarget={blurTarget}
                    onDismiss={closeSearch}
                >
                    <SearchResults
                        query={search.query}
                        results={search.results}
                        status={search.status}
                        searchError={search.searchError}
                        submittingUrl={search.submittingUrl}
                        subscribeError={search.subscribeError}
                        onSubscribe={subscribeTo}
                        onRetry={search.retry}
                        onOpenUrl={openUrl}
                    />
                </SearchDrawer>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    languageBackdrop: {
        ...StyleSheet.absoluteFill,
        zIndex: 5,
    },
});

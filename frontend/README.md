# Chess Notify - Mobile Frontend

The mobile application for **Chess Notify** is built with [React Native](https://reactnative.dev) and [Expo](https://expo.dev). It allows chess players, arbiters, and coaches to track tournaments hosted on [chess-results.com](https://chess-results.com), follow round pairings, and receive instant push notifications whenever a new round is published.

---

## Features

- 🔍 **Live Search & URL Pasting**: Search for tournaments directly by name or paste any `chess-results.com` tournament URL.
- ♟️ **Tournament Tracking**: View subscribed tournaments with real-time round status badges (`Upcoming`, `Ongoing`, `Final Round`) and visual round progress bars.
- 🔔 **Push Notifications**: Receive background push notifications when pairings for the next round are published. Easily toggle notifications on or off globally with server synchronization.
- 🌐 **Multi-Language Support (i18n)**: Fully localized in **English (`en`)**, **Portuguese (`pt`)**, and **Spanish (`es`)**, with device language auto-detection and an instant in-app language switcher.
- 🎨 **Glassmorphism Dark Theme**: Modern dark design system powered by Tailwind CSS / NativeWind and Expo Blur.
- 🛡️ **Zero-Login Authentication**: Generates and securely stores device credentials via `expo-secure-store`. No username or password required.
- 📱 **In-App Pairing Browser**: Tap any tournament card to open the pairings directly in an integrated in-app browser (`expo-web-browser`).

---

## Architecture

The frontend follows **Clean Architecture (Hexagonal Architecture)** principles to keep UI components, application logic, and infrastructure/API concerns cleanly decoupled:

```
frontend/src/
├── app/                           # Expo Router file-based routing
│   ├── _layout.tsx                # Root layout, fonts & notification provider
│   └── (tabs)/
│       ├── _layout.tsx            # Tab navigation layout
│       └── index.tsx              # Main entry screen
├── application/                   # Application layer (Use Cases)
│   ├── ports/                     # Input & output interfaces
│   └── useCases/
│       ├── CreateDeviceUseCase.ts
│       ├── ListSubscriptionsUseCase.ts
│       ├── SearchTournamentsUseCase.ts
│       ├── SubscribeToTournamentUseCase.ts
│       └── UnsubscribeUseCase.ts
├── domain/                        # Domain entities, value objects & business rules
│   ├── entities/
│   │   ├── Subscription.ts        # Subscription entity
│   │   └── Tournament.ts          # Tournament entity & status calculation
│   ├── errors/
│   │   └── DomainError.ts         # Domain error types
│   ├── repositories/
│   │   └── SubscriptionRepository.ts # Repository contract
│   └── valueObjects/
│       └── TournamentLink.ts      # URL parser, validator & normalizer
├── infrastructure/                # External services & concrete implementations
│   ├── http/
│   │   └── apiError.ts            # HTTP error mapping
│   ├── i18n/                      # Localization engine
│   │   ├── i18n.ts                # i18next initialization
│   │   └── locales/               # Translations: en.json, es.json, pt.json
│   ├── repositories/
│   │   └── HttpSubscriptionRepository.ts # Concrete API repository
│   ├── services/
│   │   ├── api.ts                 # Axios client with SecureStore auth interceptor
│   │   └── deviceService.ts       # Device upsert API client
│   └── storage/
│       ├── languagePreference.ts  # AsyncStorage language persistence
│       └── notificationPreference.ts # Notification state storage
├── main/
│   └── container.ts               # Composition root (Dependency Injection container)
├── presentation/                  # UI Components, Screens, Hooks & Design Tokens
│   ├── components/
│   │   ├── home/                  # HomeHeader, NotificationToggle, NotificationButton
│   │   ├── language/              # LanguageDropdown, LanguageExpandableButton
│   │   ├── search/                # SearchBar, SearchDrawer, SearchResults
│   │   ├── subscriptions/         # TournamentCard, RoundProgress, StatusChip, Skeleton
│   │   └── ui/                    # AppText, GlassButton, GlassSurface, Icon, Toggle
│   ├── context/
│   │   └── NotificationContext.tsx # Expo Push Token & permissions state
│   ├── formatters/                # Error & tournament text formatters
│   ├── hooks/                     # Custom React hooks
│   │   ├── useDevice.ts           # Device registration & notification toggle hook
│   │   ├── useLanguage.ts         # Language switcher hook
│   │   ├── useSubscriptions.ts    # Subscriptions query, mutate & pull-to-refresh
│   │   └── useTournamentSearch.ts # Live search debouncing & link submission
│   ├── screens/
│   │   └── HomeScreen.tsx         # Main dashboard screen
│   └── theme/
│       └── tokens.ts              # Theme color palette & tokens
└── utils/
    └── registerPushNotifications.ts # Expo push token request & Android channel setup
```

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React Native (0.86)** | Core mobile framework |
| **Expo SDK (v57)** | Universal native runtime and tooling |
| **Expo Router** | File-based routing navigation |
| **NativeWind v5 / Tailwind CSS v4** | Utility-first styling system |
| **React Native Reanimated (v4)** | Fluid UI transitions and micro-interactions |
| **Expo Blur & Glass Effect** | Glassmorphism surfaces and backdrops |
| **Expo Notifications** | Native push notifications & notification channels |
| **Expo Secure Store** | Keychain / Keystore encrypted token persistence |
| **Axios** | HTTP client with automatic bearer token authorization interceptors |
| **i18next & react-i18next** | Internationalization supporting English, Portuguese, Spanish |
| **Biome** | Modern linter and code formatter |

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org) (v20+) or [Bun](https://bun.sh)
- iOS Simulator (macOS with Xcode) or Android Emulator (Android Studio), or a physical device with the **Expo Go** app installed.
- Backend service running (see [`backend/README.md`](../backend/README.md)).

### 2. Install Dependencies

Using `bun`:
```bash
bun install
```

Or using `npm`:
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:8080
```

> [!NOTE]
> If testing on an **Android Emulator**, use `http://10.0.2.2:8080`.  
> If testing on a **physical device**, use your computer's LAN IP (e.g., `http://192.168.1.50:8080`).

---

## Running the App

### Start the Expo Dev Server

```bash
bun run start
# or: npx expo start
```

Once running, press:
- `a` to open on an Android Emulator
- `i` to open on an iOS Simulator
- Scan the QR code with **Expo Go** on your physical mobile device

### Native Development Builds

To run full native builds with native modules:

```bash
# Android
bun run android

# iOS
bun run ios
```

---

## Push Notifications Setup

Push notifications require an Expo Application Services (EAS) project.

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Push notification credentials for Android use Firebase Cloud Messaging (`google-services.json` included in the project root).
4. Physical devices are required to receive push notifications. When prompted upon opening the app, grant notification permissions.

---

## Code Quality & Linting

Run Biome linter:

```bash
bun run lint
```

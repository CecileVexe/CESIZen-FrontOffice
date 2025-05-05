import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { Slot, SplashScreen } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { ConnectedUserProvider } from "../utils/ConnectedUserContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { customTheme } from "../utils/theme/theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

function RootLayoutNav() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConnectedUserProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: customTheme.colors.primary }}
            edges={["top"]}
          >
            <StatusBar />
            <Slot />
          </SafeAreaView>
        </ConnectedUserProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

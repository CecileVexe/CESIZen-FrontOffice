import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Stack } from "expo-router/stack";
import { Icon } from "react-native-paper";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      {/* <Stack.Screen
        name="[id]"
        options={{
          title: "Details",
        }}
      /> */}
    </Stack>
  );
}

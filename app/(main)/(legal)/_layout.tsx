import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { useConntedUser } from "../../../utils/ConnectedUserContext";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="cgu"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="rpg"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

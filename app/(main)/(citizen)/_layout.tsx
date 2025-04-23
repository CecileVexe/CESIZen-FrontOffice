import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { useConntedUser } from "../../../utils/ConnectedUserContext";

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConntedUser();

  if (!userChoseToUnconnect && !isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="unConnectedUserPage"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="updateRessource"
        options={{ title: "Modifier une ressource" }}
      />
      <Stack.Screen name="accountSettings" options={{ title: "Paramètres" }} />
    </Stack>
  );
}

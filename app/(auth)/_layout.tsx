import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useConnectedUser } from "../../utils/ConnectedUserContext";
import WebDemoBanner from "../../components/WebDemoBanner";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConnectedUser();

  if (userChoseToUnconnect || isSignedIn) {
    return <Redirect href={"/(0-home)"} />;
  }

  // Pas de header sur ces écrans : le bandeau web est placé en haut
  return (
    <>
      <WebDemoBanner />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}

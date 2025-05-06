import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useConnectedUser } from "../../utils/ConnectedUserContext";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConnectedUser();

  if (userChoseToUnconnect || isSignedIn) {
    return <Redirect href={"/(home)"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

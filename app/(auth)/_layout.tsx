import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useConntedUser } from "../../utils/ConnectedUserContext";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConntedUser();

  if (userChoseToUnconnect || isSignedIn) {
    // eslint-disable-next-line prettier/prettier
    return <Redirect href={"/"} />
  }

  return <Stack />;
}

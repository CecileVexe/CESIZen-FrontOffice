import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { CustomHeader } from "../../../components/customHeader";

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConntedUser();

  if (!userChoseToUnconnect && !isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

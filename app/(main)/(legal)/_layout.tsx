import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { useConnectedUser } from "../../../utils/ConnectedUserContext";
import { CustomHeader } from "../../../components/customHeader";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
      }}
    >
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

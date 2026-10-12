import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { useConnectedUser } from "../../../utils/ConnectedUserContext";
import { CustomHeader } from "../../../components/customHeader";
import WebDemoBanner from "../../../components/WebDemoBanner";

export default function Layout() {
  // CGU et RGPD n'ont pas de header : le bandeau web est placé en haut
  return (
    <>
      <WebDemoBanner />
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
          name="rgpd"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}

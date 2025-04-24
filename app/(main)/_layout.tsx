import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { useConntedUser } from "../../utils/ConnectedUserContext";

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConntedUser();

  if (!userChoseToUnconnect && !isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: () => <Icon size={20} source="home" />,
          headerShown: false,
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="(ressource)"
        options={{
          href: null,
          title: "",
          headerShown: false,
          tabBarIcon: () => <Icon size={20} source="plus-box" />,
        }}
      />
      <Tabs.Screen
        name="(onGoingRessource)"
        options={{
          title: "Activité",
          headerShown: false,
          tabBarIcon: () => <Icon size={20} source="camera-timer" />,
          popToTopOnBlur: true,
        }}
      />

      <Tabs.Screen
        name="(creation)"
        options={{
          title: "Créer",
          headerShown: false,
          tabBarIcon: () => <Icon size={20} source="plus" />,
          popToTopOnBlur: true,
        }}
      />

      <Tabs.Screen
        name="(citizen)"
        options={{
          title: "Compte",
          headerShown: false,
          tabBarIcon: () => <Icon size={20} source="account" />,
          popToTopOnBlur: true,
        }}
      />
    </Tabs>
  );
}

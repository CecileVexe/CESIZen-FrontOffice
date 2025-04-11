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
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: () => <Icon size={20} source="home" />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(ressource)"
        options={{
          href: null, //Pour masquer la route sur les tabs en bas
          title: "Test",
          headerShown: false,
          tabBarIcon: () => <Icon size={20} source="plus-box" />,
        }}
      />
      {/* <Tabs.Screen
        name="account"
        options={{
          title: "Profil",
          tabBarIcon: () => <Icon size={20} source="account" />,
        }}
      /> */}
    </Tabs>
  );
}

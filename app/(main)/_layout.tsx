import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { useConnectedUser } from "../../utils/ConnectedUserContext";
import { View } from "react-native";

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConnectedUser();

  if (!userChoseToUnconnect && !isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#52B788",
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#ffffff" : "transparent", // violet clair si actif
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
              }}
            >
              <Icon
                size={20}
                source="home"
                color={focused ? "#52B788" : "white"}
              />
            </View>
          ),
          headerShown: false,
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="(articles)"
        options={{
          title: "Infos",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#ffffff" : "transparent", // violet clair si actif
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
              }}
            >
              <Icon
                size={20}
                source="book"
                color={focused ? "#52B788" : "white"}
              />
            </View>
          ),
          popToTopOnBlur: true,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();

            navigation.navigate("(articles)", {
              screen: "index",
            });
          },
        })}
      />
      <Tabs.Screen
        name="(emotion)"
        options={{
          title: "Emotion",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#ffffff" : "transparent", // violet clair si actif
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
              }}
            >
              <Icon
                size={20}
                source="head-plus"
                color={focused ? "#52B788" : "white"}
              />
            </View>
          ),
          popToTopOnBlur: true,
        }}
      />

      <Tabs.Screen
        name="(journal)"
        options={{
          title: "Journal",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#ffffff" : "transparent", // violet clair si actif
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
              }}
            >
              <Icon
                size={20}
                source="chart-arc"
                color={focused ? "#52B788" : "white"}
              />
            </View>
          ),
          popToTopOnBlur: true,
        }}
      />

      <Tabs.Screen
        name="(user)"
        options={{
          title: "Compte",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#ffffff" : "transparent", // violet clair si actif
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
              }}
            >
              <Icon
                size={20}
                source="account-circle"
                color={focused ? "#52B788" : "white"}
              />
            </View>
          ),
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="(legal)"
        options={{
          href: null,
          headerShown: false,
          popToTopOnBlur: true,
        }}
      />
    </Tabs>
  );
}

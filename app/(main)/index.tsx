import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
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
          title: "HomePage",
          tabBarIcon: () => <Icon size={20} source="home" />,
          headerShown: false,
        }}
      />
      {/* <Tabs.Screen
        name="(add)"
        options={{
          title: "Ajouter",
          headerShown: false,
          tabBarIcon: () => <Icon size={20} source="plus-box" />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Profil",
          tabBarIcon: () => <Icon size={20} source="account" />,
        }}
      /> */}
    </Tabs>
  );
}

// export default function Page() {
//   const { user } = useUser();

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <SignedIn>
//         <Slot />
//         {/* <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
//         <SignOutButton /> */}
//       </SignedIn>
//       <SignedOut>
//         <Link href="/(auth)/sign-in">
//           <Text>Sign in</Text>
//         </Link>
//         <Link href="/(auth)/sign-up">
//           <Text>Sign up</Text>
//         </Link>
//       </SignedOut>
//     </SafeAreaView>
//   );
// }

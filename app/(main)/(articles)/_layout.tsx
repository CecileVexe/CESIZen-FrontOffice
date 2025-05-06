import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { getHeaderTitle } from "@react-navigation/elements";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";
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
      <Stack.Screen
        name="index"
        // options={{
        //   headerShown: false,
        // }}
      />
      <Stack.Screen
        name="[id]"
        // options={{
        //   header: ({ navigation, route, options, back }) => {
        //     return (
        //       <View style={styles.header}>
        //         {back && (
        //           <TouchableOpacity
        //             onPress={navigation.goBack}
        //             style={styles.backButton}
        //           >
        //             <Icon source="arrow-left" size={24} />
        //           </TouchableOpacity>
        //         )}
        //       </View>
        //     );
        //   },
        // }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 16,
  },
});

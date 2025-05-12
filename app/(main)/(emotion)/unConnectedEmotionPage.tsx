import { StyleSheet, View } from "react-native";
import { Divider, PaperProvider, Text } from "react-native-paper";
import { SignInButton } from "../../../components/SignInButton";
import { customTheme } from "../../../utils/theme/theme";
import { SignOutButton } from "../../../components/SignOutButton";

const UnConnectedJournalPage = () => {
  return (
    <PaperProvider theme={customTheme}>
      <View
        style={{
          ...styles.container,
          backgroundColor: customTheme.colors.background,
        }}
      >
        <Text variant="titleLarge" style={styles.title}>
          Veuillez vous connecter pour créer un journal
        </Text>
        <SignInButton />
        <Divider />
        <Text variant="titleLarge" style={styles.title}>
          En cas de problème de session (dev only) :
        </Text>
        <SignOutButton />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  title: {
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default UnConnectedJournalPage;

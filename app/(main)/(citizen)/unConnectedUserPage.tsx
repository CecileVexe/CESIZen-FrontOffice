import { View } from "react-native";
import { Text } from "react-native-paper";
import { SignInButton } from "../../../components/SignInButton";

const unConnectedUserPage = () => {
  return (
    <View>
      <Text>
        Veuillez vous connecter pour accéder à la page de votre compte
      </Text>
      <SignInButton />
    </View>
  );
};

export default unConnectedUserPage;

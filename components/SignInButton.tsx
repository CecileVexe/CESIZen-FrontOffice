import { Text, TouchableOpacity } from "react-native";
import { useConntedUser } from "../utils/ConnectedUserContext";
import { useRouter } from "expo-router";

export const SignInButton = () => {
  const { handleNonConnectedUser } = useConntedUser();
  const router = useRouter();

  const handleSignIn = async () => {
    handleNonConnectedUser(false);
    router.navigate("/sign-in");
  };

  return (
    <TouchableOpacity onPress={handleSignIn}>
      <Text>Me connecter</Text>
    </TouchableOpacity>
  );
};

import { useLocalSearchParams } from "expo-router";
import { Button, Chip, Text } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";

import { Image, View } from "react-native";
import { Ressource } from "../../../utils/types/Ressources.types";
import { getRessource } from "../../../services/ressources.services";

const RessourceDetails = () => {
  const { id } = useLocalSearchParams<Record<string, string>>();

  const [ressource, setRessource] = useState<Ressource | undefined>(undefined);

  const getDatas = useCallback(async () => {
    const response = await getRessource(id);
    if (response) {
      setRessource(response.data);
    }
  }, [id]);

  useEffect(() => {
    getDatas();
  }, [getDatas]);

  return (
    ressource && (
      <View>
        {/* EN ATTENTE DU BACK <Image
        source={require('@expo/snack-static/react-native-logo.png')}
      /> */}
        <Text variant="titleLarge">{ressource.title}</Text>
        {/* WAIT API <Text variant="labelLarge">{ressource.categorie}</Text> */}

        <Text variant="labelMedium">{ressource.deadLine}</Text>
        <Text variant="labelMedium">
          Nombre de participant {ressource.nbParticipant} /
          {ressource.maxParticipant}
        </Text>
        <Button
          mode="contained"
          onPress={() => console.log("Pressed")}
          disabled={
            ressource.nbParticipant === ressource.maxParticipant ||
            !ressource.isValidate ||
            ressource.status !== "En cours"
          }
        >
          S'inscrire
        </Button>
        <Chip icon="information">{ressource.status}</Chip>
        <Text variant="bodyLarge">{ressource.description}</Text>
      </View>
    )
  );
};

export default RessourceDetails;

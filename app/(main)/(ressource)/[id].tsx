import { useLocalSearchParams } from "expo-router";
import { Button, Chip, PaperProvider, Text } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";

import { Image, View } from "react-native";
import { Ressource } from "../../../utils/types/Ressources.types";
import { getRessource } from "../../../services/ressources.service";
import CommentCard from "../../../components/CommentCard";
import { parseStringDate } from "../../../utils/functions/datesFunction";
import { SignedIn, useAuth } from "@clerk/clerk-expo";
import CommentForm from "../../../components/CommentForm";
import { useForm } from "react-hook-form";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { leaveAComment } from "../../../services/comment.service";
import SubscribeToRessource from "../../../components/SubscribeToRessource";

const RessourceDetails = () => {
  const { isSignedIn } = useAuth();
  const { connectedUser } = useConntedUser();

  const [commentFormVisible, setCommentFormVisible] = useState(false);
  const [subscribeVisible, setSubscribeVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const showCommentFormDialog = () => setCommentFormVisible(true);

  const hideCommentFormDialog = () => {
    reset();
    setCommentFormVisible(false);
  };

  const showSubscribeDialog = () => setSubscribeVisible(true);

  const hideSubscribeDialog = () => {
    reset();
    setSubscribeVisible(false);
  };

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

  const onSubmit = async (data: { title: string; description: string }) => {
    if (connectedUser) {
      const comment = {
        ...data,
        citizenId: connectedUser?.id,
        ressourceId: id,
      };
      try {
        await leaveAComment(comment);
        reset();
        setCommentFormVisible(false);
        getDatas();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <PaperProvider>
      {ressource && (
        <View>
          {/* EN ATTENTE DU BACK <Image
        source={require('@expo/snack-static/react-native-logo.png')}
      /> */}
          <Text variant="titleLarge">{ressource.title}</Text>
          {/* WAIT API <Text variant="labelLarge">{ressource.categorie}</Text> */}

          <Text variant="labelMedium">{`Date limite : ${parseStringDate(ressource.deadLine)}`}</Text>
          <Text variant="labelMedium">
            Nombre de participant {ressource.nbParticipant} /
            {ressource.maxParticipant}
          </Text>

          <Button
            mode="contained"
            onPress={showSubscribeDialog}
            disabled={
              ressource.nbParticipant === ressource.maxParticipant ||
              !ressource.isValidate ||
              ressource.status === "En cours" ||
              !SignedIn
            }
          >
            {!isSignedIn ? "Créez un compte pour vous inscrire" : "S'inscrire"}
          </Button>

          {ressource.status === ("En cours" || "Terminé") && (
            <Chip icon="information">{ressource.status}</Chip>
          )}
          <Text variant="bodyLarge">{ressource.description}</Text>

          {isSignedIn && (
            <Button mode="contained" onPress={showCommentFormDialog}>
              Laisser un commentaire
            </Button>
          )}

          <CommentForm
            visible={commentFormVisible}
            hideDialog={hideCommentFormDialog}
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
          />

          <SubscribeToRessource
            visible={subscribeVisible}
            hideDialog={hideSubscribeDialog}
            ressource={ressource}
          />

          {ressource.comment.map((comment) => (
            <CommentCard comment={comment} />
          ))}
        </View>
      )}
    </PaperProvider>
  );
};

export default RessourceDetails;

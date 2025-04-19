import { useCallback, useEffect, useState } from "react";
import {
  CompleteProgression,
  getProgressionFromUser,
} from "../../../services/progression.service";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { ProgressBar, Text, useTheme } from "react-native-paper";
import { SignInButton } from "../../../components/SignInButton";
import { View } from "react-native";
import { getRessource } from "../../../services/ressources.service";
import { parseStringDate } from "../../../utils/functions/datesFunction";
import StepCheckerList from "../../../components/StepCheker";
import { Step, StepWithProgression } from "../../../utils/types/Step.types";
import { mergeStepsWithProgressions } from "../../../utils/functions/mergeStepWithProgression";
import { Ressource } from "../../../utils/types/Ressources.types";
import { Progression } from "../../../utils/types/Progression.types";
import { completedStep } from "../../../utils/functions/completedSteps";

interface StepWithRessourceId extends Step {
  ressourceId: string;
}

interface UserRessource extends Omit<Ressource, "step"> {
  step: StepWithRessourceId[];
}

const OnGoingRessource = () => {
  const [userProgression, setUserProgression] = useState<
    Progression[] | undefined
  >(undefined);
  const [userRessource, setUserRessource] = useState<UserRessource | undefined>(
    undefined,
  );
  const [userRessourceStep, setUserRessourceStep] = useState<
    StepWithProgression[] | undefined
  >(undefined);

  const { connectedUser } = useConntedUser();
  const theme = useTheme();

  const getProgressionDatas = useCallback(async () => {
    if (connectedUser) {
      const progressionResponse = await getProgressionFromUser(
        connectedUser.id,
      );
      if (progressionResponse) {
        const ressourceResponse = await getRessource(
          progressionResponse.data[0].ressourceId,
        );
        if (ressourceResponse) {
          const formatedRessourceResponse = {
            ...ressourceResponse.data,
            step: ressourceResponse.data.step.map((s) => ({
              ...s,
              ressourceId: ressourceResponse?.data.id,
            })),
          };

          setUserProgression(progressionResponse.data);
          setUserRessource(formatedRessourceResponse);
        }
      }
    }
  }, [connectedUser]);

  useEffect(() => {
    getProgressionDatas();
  }, [getProgressionDatas]);

  useEffect(() => {
    if (userRessource?.step && userProgression) {
      const merged = mergeStepsWithProgressions(
        userRessource.step,
        userProgression,
      );
      setUserRessourceStep(merged);
    }
  }, [userProgression, userRessource?.step]);

  const handleCheckStepChange = async (
    progressionId: string,
    isCompleted: boolean,
  ) => {
    const date = isCompleted ? new Date() : null;
    try {
      await CompleteProgression(progressionId, {
        completed: isCompleted,
        dateCompleted: date,
      });
      getProgressionDatas();
    } catch (e) {
      console.error(e);
    }
  };

  const getProgress = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return completed / total;
  };

  return connectedUser !== undefined ? (
    userRessource !== undefined ? (
      <View>
        <Text variant="titleLarge">{userRessource.title}</Text>
        {/* WAIT API <Text variant="labelLarge">{userRessource.categorie}</Text> */}
        <Text variant="labelMedium">{`Date limite : ${parseStringDate(userRessource.deadLine)}`}</Text>
        <Text variant="labelMedium">
          Nombre de participant {userRessource.nbParticipant} /
          {userRessource.maxParticipant}
        </Text>
        <Text variant="bodyLarge">{userRessource.description}</Text>
        {userRessourceStep && (
          <View>
            <View>
              <Text>{`Progression : ${completedStep(userRessourceStep)}/${userRessourceStep.length}`}</Text>
              <ProgressBar
                progress={getProgress(
                  completedStep(userRessourceStep),
                  userRessourceStep.length,
                )}
                color={theme.colors.primary}
              />
            </View>
            <StepCheckerList
              steps={userRessourceStep}
              onCheckStepChange={handleCheckStepChange}
            />
          </View>
        )}
      </View>
    ) : (
      <Text>Retrouvez votre activité en cours ici ! </Text>
    )
  ) : (
    <View>
      <Text>Connectez vous pour participer à une activité</Text>
      <SignInButton />
    </View>
  );
};

export default OnGoingRessource;

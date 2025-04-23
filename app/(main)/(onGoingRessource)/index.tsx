import { useCallback, useEffect, useState } from "react";
import {
  CompleteProgression,
  getProgressionFromUser,
} from "../../../services/progression.service";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { ProgressBar, Text, useTheme, FAB, Chip } from "react-native-paper";
import { SignInButton } from "../../../components/SignInButton";
import { FlatList, StyleSheet, View } from "react-native";
import { getRessource } from "../../../services/ressources.service";
import { parseStringDate } from "../../../utils/functions/datesFunction";
import StepCheckerList from "../../../components/StepCheker";
import { Step, StepWithProgression } from "../../../utils/types/Step.types";
import { mergeStepsWithProgressions } from "../../../utils/functions/mergeStepWithProgression";
import { Ressource } from "../../../utils/types/Ressources.types";
import { Progression } from "../../../utils/types/Progression.types";
import { completedStep } from "../../../utils/functions/completedSteps";
import { useRouter } from "expo-router";

interface StepWithRessourceId extends Step {
  ressourceId: string;
}

interface UserRessource extends Omit<Ressource, "step"> {
  step: StepWithRessourceId[];
}

const OnGoingRessource = () => {
  const [userProgression, setUserProgression] = useState<Progression[]>();
  const [userRessource, setUserRessource] = useState<UserRessource>();
  const [userRessourceStep, setUserRessourceStep] = useState<StepWithProgression[]>();

  const { connectedUser } = useConntedUser();
  const theme = useTheme();
  const router = useRouter();

  const getProgressionDatas = useCallback(async () => {
    if (connectedUser) {
      const progressionResponse = await getProgressionFromUser(connectedUser.id);
      if (progressionResponse) {
        const ressourceResponse = await getRessource(progressionResponse.data[0].ressourceId);
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
      const merged = mergeStepsWithProgressions(userRessource.step, userProgression);
      merged.sort((a, b) => a.order - b.order);
      setUserRessourceStep(merged);
    }
  }, [userProgression, userRessource?.step]);

  const handleCheckStepChange = async (progressionId: string, isCompleted: boolean) => {
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
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          {userRessource.title}
        </Text>

        <View style={styles.badgesContainer}>
          <Chip icon="calendar" style={styles.badge}>
            Date limite : {parseStringDate(userRessource.deadLine)}
          </Chip>
          <Chip icon="account-group" style={styles.badge}>
            {userRessource.nbParticipant} / {userRessource.maxParticipant} participants
          </Chip>
        </View>

        <Text style={styles.description}>{userRessource.description}</Text>

        {userRessourceStep && (
          <View style={styles.progressionContainer}>
            <Text style={styles.progressionText}>
              Progression : {completedStep(userRessourceStep)} / {userRessourceStep.length}
            </Text>
            <ProgressBar
              progress={getProgress(
                completedStep(userRessourceStep),
                userRessourceStep.length
              )}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <FlatList
              data={userRessourceStep}
              keyExtractor={(item) => `${item.id}_card`}
              renderItem={({ item }) => (
                <StepCheckerList
                  step={item}
                  onCheckStepChange={handleCheckStepChange}
                />
              )}
              contentContainerStyle={styles.listContent}
              style={styles.list}
            />
          </View>
        )}

        <FAB
          style={styles.fab}
          icon="message"
          customSize={70}
          onPress={() =>
            router.push(`/chatScreen?ressourceId=${userRessource.id}`)
          }
        />
      </View>
    ) : (
      <Text>Retrouvez votre activité en cours ici !</Text>
    )
  ) : (
    <View style={styles.signInContainer}>
      <Text style={styles.signInText}>Connectez-vous pour participer à une activité</Text>
      <SignInButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#e3f2fd",
  },
  description: {
    marginBottom: 16,
    fontSize: 16,
    color: "#555",
  },
  progressionContainer: {
    flex: 1,
  },
  progressionText: {
    marginBottom: 8,
    fontWeight: "500",
  },
  progressBar: {
    height: 8,
    borderRadius: 10,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
    paddingTop: 10,
  },
  fab: {
    position: "absolute",
    bottom: 10,
    right: 16,
    margin: 10,
  },
  signInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  signInText: {
    marginBottom: 16,
    fontSize: 16,
  },
});

export default OnGoingRessource;

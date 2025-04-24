import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { CitizenType } from "./types/citizen.types";
import { useUser } from "@clerk/clerk-expo";
import { getCitizen } from "../services/citizen.service"; // Service pour récupérer l'utilisateur

interface UserContextType {
  connectedUser: CitizenType | undefined;
  userChoseToUnconnect: boolean;
  handleNonConnectedUser: (_: boolean) => void;
  refreshConnectedUser: () => void;
  loading: boolean;
  retryCount: number;
}

const ConnectedUserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface UserProviderProps {
  children: ReactNode;
}

export const ConnectedUserProvider = ({ children }: UserProviderProps) => {
  const [connectedUser, setConnectedUser] = useState<CitizenType | undefined>(
    undefined,
  );
  const [userChoseToUnconnect, setUserChoseToUnconnect] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const { user } = useUser(); // Utilisation de Clerk pour obtenir l'ID de l'utilisateur

  // Fonction pour récupérer l'utilisateur avec une logique de temporisation
  const getUser = useCallback(async () => {
    setLoading(true);
    if (user) {
      try {
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        await delay(3000);
        const bddUser = await getCitizen(user.id);
        if (bddUser?.data) {
          setConnectedUser(bddUser.data);
          setUserChoseToUnconnect(false);
          setRetryCount(0);
        } else {
          console.error("Utilisateur non trouvé dans la base de données.");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error,
        );

        if (retryCount < 5) {
          console.log(`Réessai #${retryCount + 1}`);
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            getUser();
          }, 3000);
        } else {
          setConnectedUser(undefined);
        }
      }
    }
    setLoading(false);
  }, [user, retryCount]);

  // Lorsque l'utilisateur se connecte ou se déconnecte, appeler getUser pour actualiser les informations
  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user, getUser]);

  const handleNonConnectedUser = (boolean: boolean) => {
    setUserChoseToUnconnect(boolean);
    setConnectedUser(undefined);
  };

  return (
    <ConnectedUserContext.Provider
      value={{
        connectedUser,
        userChoseToUnconnect,
        handleNonConnectedUser,
        refreshConnectedUser: getUser,
        loading,
        retryCount,
      }}
    >
      {children}
    </ConnectedUserContext.Provider>
  );
};

export const useConntedUser = () => {
  const context = useContext(ConnectedUserContext);
  if (!context) {
    throw new Error(
      "useConntedUser must be used within a ConnectedUserProvider",
    );
  }
  return context;
};

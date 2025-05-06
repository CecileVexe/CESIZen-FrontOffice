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
import { getUser } from "../services/user.service";

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
  const getBddUser = useCallback(async () => {
    setLoading(true);
    if (user) {
      try {
        const bddUser = await getUser(user.id);
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
            getBddUser();
          }, 3000);
        } else {
          setConnectedUser(undefined);
        }
      }
    }
    setLoading(false);
  }, [user, retryCount]);

  // Lorsque l'utilisateur se connecte ou se déconnecte, appeler getBddUser pour actualiser les informations
  useEffect(() => {
    if (user) {
      getBddUser();
    }
  }, [user, getBddUser]);

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
        refreshConnectedUser: getBddUser,
        loading,
        retryCount,
      }}
    >
      {children}
    </ConnectedUserContext.Provider>
  );
};

export const useConnectedUser = () => {
  const context = useContext(ConnectedUserContext);
  if (!context) {
    throw new Error(
      "useConnectedUser must be used within a ConnectedUserProvider",
    );
  }
  return context;
};

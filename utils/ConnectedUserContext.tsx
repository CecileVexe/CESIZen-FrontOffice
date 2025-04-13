import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CitizenType } from "./types/citizen.types";
import { useUser } from "@clerk/clerk-expo";
import { getCitizen } from "../services/citizen.service";

interface UserContextType {
  connectedUser: CitizenType | undefined;
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

  const { user } = useUser();

  const getUser = useCallback(async () => {
    let bddUser;

    if (user) {
      bddUser = await getCitizen(user.id);
    }
    setConnectedUser(bddUser.data);
  }, [user]);

  useEffect(() => {
    getUser();
  }, [getUser]);
  return (
    <ConnectedUserContext.Provider value={{ connectedUser }}>
      {children}
    </ConnectedUserContext.Provider>
  );
};

export const useConntedUser = () => {
  const context = useContext(ConnectedUserContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

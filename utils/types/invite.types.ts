export interface CreateInvite {
  senderId: string;
  ressourceId: string;
  receverEmail: string;
}

export interface Invite {
  id: string;
  accepte: boolean;
  createdAt: string;
  ressource: {
    id: string;
    title: string;
  };
  sender: {
    id: string;
    name: string;
    surname: string;
  };
  recever: {
    id: string;
    name: string;
    surname: string;
  };
}

import { UserData } from '@stacks/connect';

// Define a RegisteredUser interface
export type RegisteredUser = Pick<
  UserData,
  'profile' | 'email' | 'decentralizedID' | 'identityAddress'
> & {
  data?: { [key: string]: any };
  metadata?: {
    publicKey: string;
    signature: string;
  };
};

export function constructRegisteredUser(userData: UserData): RegisteredUser {
  return {
    profile: userData.profile,
    email: userData.email,
    decentralizedID: userData.decentralizedID,
    identityAddress: userData.identityAddress,
  };
}

export type MessageFromPeer = {
  data: { message: string };
  metadata: { signature: string; senderDid: string; receiverDid: string };
};

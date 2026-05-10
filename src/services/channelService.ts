import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Channel, FirestoreErrorInfo } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const channelService = {
  async addChannel(channel: Omit<Channel, 'id'>) {
    const path = 'channels';
    try {
      const docRef = await addDoc(collection(db, path), channel);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateChannel(id: string, channel: Partial<Channel>) {
    const path = `channels/${id}`;
    try {
      await updateDoc(doc(db, 'channels', id), channel);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteChannel(id: string) {
    const path = `channels/${id}`;
    try {
      await deleteDoc(doc(db, 'channels', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToChannels(callback: (channels: Channel[]) => void) {
    const path = 'channels';
    const q = query(collection(db, path), orderBy('order', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const channels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Channel[];
      callback(channels);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  }
};

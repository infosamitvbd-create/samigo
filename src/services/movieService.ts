import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Movie, FirestoreErrorInfo } from '../types';

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

export const movieService = {
  async addMovie(movie: Omit<Movie, 'id'>) {
    const path = 'movies';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...movie,
        createdAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateMovie(id: string, movie: Partial<Movie>) {
    const path = `movies/${id}`;
    try {
      await updateDoc(doc(db, 'movies', id), movie);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteMovie(id: string) {
    const path = `movies/${id}`;
    try {
      await deleteDoc(doc(db, 'movies', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToMovies(callback: (movies: Movie[]) => void, category?: string) {
    const path = 'movies';
    let q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    if (category) {
      q = query(q, where('category', '==', category));
    }

    return onSnapshot(q, (snapshot) => {
      const movies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Movie[];
      callback(movies);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  }
};

export enum ContentType {
  MOVIE = 'movie',
  SERIES = 'series',
  NATOK = 'natok',
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  type: ContentType;
  year?: number;
  duration?: string;
  rating?: number;
  createdAt: number;
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  category: string;
  isYouTube: boolean;
  order: number;
}

export interface Admin {
  uid: string;
  email: string;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

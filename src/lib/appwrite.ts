// src/lib/appwrite.ts
import { Client, Account, Databases, Storage } from 'appwrite';


export const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const STORAGE_ID = import.meta.env.VITE_APPWRITE_STORAGE_ID;
export const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_COLLECTION_USERS,
  ATTENDANCE: import.meta.env.VITE_APPWRITE_COLLECTION_ATTENDANCE,
  SCHEDULES: import.meta.env.VITE_APPWRITE_COLLECTION_SCHEDULES,
  CALENDAR: import.meta.env.VITE_APPWRITE_COLLECTION_CALENDAR,
};





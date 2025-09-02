// Shared types for the monorepo

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  userId: string;
}

export interface Notification {
  id: string;
  message: string;
  userId: string;
}

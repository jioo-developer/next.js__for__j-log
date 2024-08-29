import { User } from "firebase/auth";
import { ReactNode } from "react";

export interface userData {
  user?: User;
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

export interface childrenProps {
  children: ReactNode;
}

export interface styleProps {
  width?: number | string;
  height?: number | undefined;
  fontSize?: number;
}

export type changeHanlderType = {
  data: User | undefined;
  nicknameData?: string[];
  nickname: string;
};

export type userProps = {
  data: User | userData;
  password: string;
};

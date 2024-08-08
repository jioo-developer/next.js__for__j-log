import { ReactNode } from "react"

export interface childrenProps {
  children : ReactNode
}

export interface styleProps {
  width: number;
  height?: number | undefined;
  fontSize:number;
}
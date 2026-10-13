import { ViewTransition } from "react";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition name="page" share="auto" enter="auto" default="none">
      {children}
    </ViewTransition>
  );
}

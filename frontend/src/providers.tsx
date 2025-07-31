import React from "react";
import { BrowserRouter } from "react-router-dom";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  return <BrowserRouter>{children}</BrowserRouter>;
}

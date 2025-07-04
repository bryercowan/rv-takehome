"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());

  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}


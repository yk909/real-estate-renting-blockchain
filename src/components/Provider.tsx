"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import { isWallectConnected, loadAppartments } from "@/Blockchain.services";
import { useGlobalState, getGlobalState, setGlobalState } from "@/store";
import { loadavg } from "os";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const Providers = ({ children }: PropsWithChildren) => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [all_reservations] = useGlobalState("all_hasfavorites");

  const loadData = async () => {
    await isWallectConnected();
    await loadAppartments();
  };

  useEffect(() => {
    loadData();
  }, [connectedAccount]);

  // console.log(all_reservations);
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Toaster position="bottom-right" />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;

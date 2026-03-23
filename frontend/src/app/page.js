"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import WelcomeScreen from "@/components/WelcomeScreen";

import { useSession } from "@/context/SessionContext";

export default function Home() {
  const { hasFinishedLoading, finishLoading } = useSession();

  useEffect(() => {
    if (!hasFinishedLoading) {
      const timer = setTimeout(() => {
        finishLoading();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [hasFinishedLoading, finishLoading]);

  if (!hasFinishedLoading) {
    return <LoadingScreen />;
  }

  return <WelcomeScreen />;
}

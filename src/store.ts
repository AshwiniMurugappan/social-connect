import { useState, useEffect } from "react";

// This saves connected platforms to browser memory
// so it persists when you navigate between pages

const STORAGE_KEY = "twin_connected_platforms";

export function useConnectedPlatforms() {
  const [connected, setConnected] = useState<Record<string, boolean>>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(connected));
  }, [connected]);

  const markConnected = (platformId: string) => {
    setConnected(prev => ({ ...prev, [platformId]: true }));
  };

  const markDisconnected = (platformId: string) => {
    setConnected(prev => ({ ...prev, [platformId]: false }));
  };

  return { connected, markConnected, markDisconnected };
}
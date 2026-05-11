"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalPageViews: number;
  totalCalculations: number;
}

export function useSiteStats(): Stats | null {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: Stats) => setStats(data))
      .catch(() => {});
  }, []);

  return stats;
}

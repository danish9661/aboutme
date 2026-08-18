import { useEffect, useState } from "react";

export interface GitHubDirectStats {
  /** All-time contributions, comma formatted (e.g. "2,135") */
  totalContributions: string;
  /** Contributions in the current calendar year, comma formatted */
  yearContributions: string;
  currentStreak: number;
  longestStreak: number;
  loading: boolean;
  /** True when every source failed and the numbers below are a stale baseline */
  stale: boolean;
}

const CACHE_KEY = "danish_gh_contributions_v8";
const CACHE_TTL = 1000 * 60 * 30; // serve cache for 30 min before refetching

/**
 * Last-known-good values, used only on a first visit that coincides with an
 * API outage. Anything cached locally always wins over these.
 */
const BASELINE: GitHubDirectStats = {
  totalContributions: "2,135",
  yearContributions: "2,114",
  currentStreak: 16,
  longestStreak: 30,
  loading: false,
  stale: true,
};

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
}

/** YYYY-MM-DD in the visitor's local timezone — GitHub's calendar is date-keyed, not UTC-instant-keyed. */
function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function format(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Derives totals and streaks from per-day contribution counts.
 *
 * Streaks are plain consecutive runs of active days — a single day off ends a
 * streak, matching how GitHub itself counts. Future-dated days (the API pads
 * the calendar to year end) are ignored so they can't terminate a live streak.
 */
function deriveStats(data: ContributionsResponse): Omit<GitHubDirectStats, "loading" | "stale"> {
  const today = toLocalDateKey(new Date());

  const counts = new Map<string, number>();
  for (const c of data.contributions) {
    if (c.date <= today) counts.set(c.date, c.count);
  }

  const dates = Array.from(counts.keys()).sort();

  let longestStreak = 0;
  let run = 0;
  for (const date of dates) {
    if ((counts.get(date) ?? 0) > 0) {
      run++;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 0;
    }
  }

  // Walk backwards from today. Today being empty doesn't break the streak yet —
  // the day isn't over — so fall back to yesterday as the starting point.
  const cursor = new Date();
  if ((counts.get(today) ?? 0) === 0) cursor.setDate(cursor.getDate() - 1);

  let currentStreak = 0;
  while ((counts.get(toLocalDateKey(cursor)) ?? 0) > 0) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const totals = Object.values(data.total).reduce((sum, n) => sum + n, 0);
  const thisYear = data.total[`${new Date().getFullYear()}`] ?? 0;

  return {
    totalContributions: format(totals),
    yearContributions: format(thisYear),
    currentStreak,
    longestStreak,
  };
}

function readCache(): { data: GitHubDirectStats; fresh: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data?.totalContributions) return null;
    return {
      data: { ...parsed.data, loading: false, stale: false },
      fresh: Date.now() - parsed.timestamp < CACHE_TTL,
    };
  } catch {
    return null;
  }
}

/**
 * Live GitHub contribution stats, fetched in the browser on every mount.
 *
 * The site is a static export, so there is no server to proxy through and no
 * safe place for a GitHub token — GitHub's own contributions data is GraphQL
 * only and token-gated. This uses a public CORS-enabled mirror of the calendar
 * instead, and degrades through cache -> baseline rather than ever hanging on
 * a spinner.
 */
export function useGitHubDirectStats(username: string = "danish9661") {
  const [stats, setStats] = useState<GitHubDirectStats>(() => {
    const cached = readCache();
    // Render cached numbers immediately; a background refresh replaces them.
    return cached ? cached.data : { ...BASELINE, loading: true, stale: false };
  });

  useEffect(() => {
    let isMounted = true;

    const cached = readCache();
    if (cached?.fresh) return;

    async function load() {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as ContributionsResponse;
        if (!json?.contributions?.length) throw new Error("empty calendar");

        const next: GitHubDirectStats = {
          ...deriveStats(json),
          loading: false,
          stale: false,
        };

        if (!isMounted) return;
        setStats(next);
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: next })
          );
        } catch {}
      } catch {
        if (!isMounted) return;
        // Keep whatever is on screen (cache or baseline) and mark it not-fresh,
        // so the badge reads "cached" rather than claiming to be live.
        setStats((prev) => ({ ...prev, loading: false, stale: true }));
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [username]);

  return stats;
}

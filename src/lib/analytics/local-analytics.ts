const defaultAnalyticsKey = "piano-claro:analytics:v1";

export type LocalAnalyticsPayload = {
  timestamp?: string;
  [key: string]: unknown;
};

export function appendLocalAnalyticsEvent({
  name,
  payload,
  storageKey = defaultAnalyticsKey,
  maxEvents = 300,
}: {
  name: string;
  payload: LocalAnalyticsPayload;
  storageKey?: string;
  maxEvents?: number;
}) {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(storageKey);
  const events = raw ? (JSON.parse(raw) as unknown[]) : [];

  events.push({
    name,
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  });

  window.localStorage.setItem(storageKey, JSON.stringify(events.slice(-maxEvents)));
}

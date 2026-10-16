"use client";

import {
  createContext,
  useSyncExternalStore,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SITE_NAME } from "@/lib/site";

export const ageGroups = [
  "Under 18",
  "18-24",
  "25-34",
  "35-49",
  "50+",
] as const;

export type AgeGroup = (typeof ageGroups)[number];

const STORAGE_KEY = "investing-site-age-group";

type AgeGroupContextValue = {
  ageGroup: AgeGroup | null;
  openAgeGroupDialog: () => void;
};

const AgeGroupContext = createContext<AgeGroupContextValue | null>(null);

type AgeGroupSnapshot = {
  ready: boolean;
  ageGroup: AgeGroup | null;
  error: string | null;
};

const STORAGE_ERROR =
  "This browser could not read local storage. Your choice will not be sent anywhere; please allow local storage to save it on this device.";
const INITIAL_SNAPSHOT: AgeGroupSnapshot = {
  ready: false,
  ageGroup: null,
  error: null,
};
let ageGroupSnapshot = INITIAL_SNAPSHOT;
let hasInitializedStore = false;
const subscribers = new Set<() => void>();

function isAgeGroup(value: string | null): value is AgeGroup {
  return ageGroups.some((ageGroup) => ageGroup === value);
}

function getAgeGroupSnapshot() {
  return ageGroupSnapshot;
}

function getServerAgeGroupSnapshot() {
  return INITIAL_SNAPSHOT;
}

function subscribeToAgeGroupStore(subscriber: () => void) {
  subscribers.add(subscriber);

  if (!hasInitializedStore) {
    hasInitializedStore = true;

    try {
      const savedAgeGroup = window.localStorage.getItem(STORAGE_KEY);
      ageGroupSnapshot = {
        ready: true,
        ageGroup: isAgeGroup(savedAgeGroup) ? savedAgeGroup : null,
        error: null,
      };
    } catch {
      ageGroupSnapshot = {
        ready: true,
        ageGroup: null,
        error: STORAGE_ERROR,
      };
    }
  }

  return () => subscribers.delete(subscriber);
}

function updateAgeGroupSnapshot(snapshot: AgeGroupSnapshot) {
  ageGroupSnapshot = snapshot;
  subscribers.forEach((subscriber) => subscriber());
}

function saveAgeGroupToStore(ageGroup: AgeGroup) {
  updateAgeGroupSnapshot({ ready: true, ageGroup, error: null });
}

export function useAgeGroup() {
  const context = useContext(AgeGroupContext);

  if (!context) {
    throw new Error("useAgeGroup must be used within AgeGroupProvider");
  }

  return context;
}

export function AgeGroupProvider({ children }: { children: ReactNode }) {
  const ageGroupState = useSyncExternalStore(
    subscribeToAgeGroupStore,
    getAgeGroupSnapshot,
    getServerAgeGroupSnapshot,
  );
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);
  const lastChoiceRef = useRef<HTMLButtonElement>(null);
  const isDialogOpen =
    ageGroupState.ready && (!ageGroupState.ageGroup || isChangeDialogOpen);

  useEffect(() => {
    if (isDialogOpen) {
      firstChoiceRef.current?.focus();
    }
  }, [isDialogOpen]);

  const openAgeGroupDialog = useCallback(() => {
    setStorageError(null);
    setIsChangeDialogOpen(true);
  }, []);

  const saveAgeGroup = (selectedAgeGroup: AgeGroup) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, selectedAgeGroup);
      saveAgeGroupToStore(selectedAgeGroup);
      setStorageError(null);
      setIsChangeDialogOpen(false);
    } catch {
      setStorageError(
        "Your choice could not be saved in this browser. Allow local storage, then try again. No information has been sent.",
      );
    }
  };

  return (
    <AgeGroupContext.Provider
      value={{ ageGroup: ageGroupState.ageGroup, openAgeGroupDialog }}
    >
      <div
        aria-hidden={!ageGroupState.ready || isDialogOpen}
        className="flex min-h-screen flex-col"
        inert={!ageGroupState.ready || isDialogOpen}
      >
        {children}
      </div>

      {!ageGroupState.ready ? (
        <div
          aria-busy="true"
          aria-live="polite"
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950 text-white"
        >
          <p           className="text-sm font-medium tracking-wide text-teal-100">
            Getting things ready…
          </p>
        </div>
      ) : isDialogOpen ? (
        <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/80 p-4">
          <section
            aria-labelledby="age-group-title"
            aria-modal="true"
            className="my-auto w-full max-w-xl border-t-4 border-teal-300 bg-white p-6 text-slate-900 sm:p-9"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
              } else if (
                event.key === "Tab" &&
                event.shiftKey &&
                document.activeElement === firstChoiceRef.current
              ) {
                event.preventDefault();
                lastChoiceRef.current?.focus();
              } else if (
                event.key === "Tab" &&
                !event.shiftKey &&
                document.activeElement === lastChoiceRef.current
              ) {
                event.preventDefault();
                firstChoiceRef.current?.focus();
              }
            }}
            role="dialog"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800 dark:text-teal-200">
              Welcome to {SITE_NAME}
            </p>
            <h1
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
              id="age-group-title"
            >
              Which age group are you in?
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Choose one to tailor lesson examples. Your answer is saved only
              in this browser and is never sent anywhere.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {ageGroups.map((group, index) => (
                <button
                  key={group}
                  ref={(button) => {
                    if (index === 0) {
                      firstChoiceRef.current = button;
                    }
                    if (index === ageGroups.length - 1) {
                      lastChoiceRef.current = button;
                    }
                  }}
                  className="min-h-16 border border-slate-300 bg-slate-50 px-5 py-4 text-left text-lg font-semibold text-slate-900 transition-colors duration-200 hover:border-teal-700 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  onClick={() => saveAgeGroup(group)}
                  type="button"
                >
                  {group}
                </button>
              ))}
            </div>

            {(storageError || ageGroupState.error) && (
              <p
                className="mt-5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-950 dark:border-rose-300/30 dark:bg-rose-300/10 dark:text-rose-100"
                role="alert"
              >
                {storageError || ageGroupState.error}
              </p>
            )}
          </section>
        </div>
      ) : null}
    </AgeGroupContext.Provider>
  );
}

export function ChangeAgeGroupButton() {
  const { openAgeGroupDialog } = useAgeGroup();

  return (
    <button
      className="ml-2 font-medium text-teal-800 underline decoration-teal-400 underline-offset-4 transition-colors hover:text-teal-950 dark:text-teal-200 dark:hover:text-teal-100"
      onClick={openAgeGroupDialog}
      type="button"
    >
      Change age group
    </button>
  );
}

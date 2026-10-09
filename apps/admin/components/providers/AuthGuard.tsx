"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg-base)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
          <p className="text-xs text-[var(--color-text-tertiary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // if (user.role !== "SUPER_ADMIN" && user.role !== "STORE_MANAGER") {
  if (user.role !== "SUPER_ADMIN") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[var(--color-bg-base)] p-4 text-center">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-8 shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              403 Forbidden
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Access Denied. You do not have the required permissions (Admin) to view this control panel.
            </p>
          </div>

          <button
            onClick={async () => {
              await useAuthStore.getState().logout();
              router.replace("/login");
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)]"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

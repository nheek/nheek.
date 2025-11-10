"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [dbExists, setDbExists] = useState<boolean | null>(null);
  const [migrationEnabled, setMigrationEnabled] = useState(true);
  const [resetting, setResetting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await fetch("/api/db-status");
        const data = await res.json();
        setDbExists(data.exists);

        // Check if migration button should be shown
        const migrationDisabled = localStorage.getItem(
          "migrationButtonDisabled",
        );
        setMigrationEnabled(migrationDisabled !== "true");
      } catch {
        setDbExists(false);
      }
    };
    checkDb();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleRunMigration = async () => {
    setMigrating(true);
    setError("");

    try {
      // Run all migrations
      const endpoints = [
        { url: "/api/migrate/albums", name: "Albums & Songs" },
        { url: "/api/migrate/projects", name: "Projects" },
        { url: "/api/migrate/links", name: "Custom Links" },
      ];

      for (const endpoint of endpoints) {
        const res = await fetch(endpoint.url, { method: "POST" });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(`${endpoint.name} migration failed: ${data.error}`);
        }
      }

      // Recheck database status
      const dbRes = await fetch("/api/db-status");
      const dbData = await dbRes.json();
      setDbExists(dbData.exists);

      alert(
        "✅ Migration completed successfully! You can now log in with:\nUsername: admin\nPassword: change_me_123",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Migration failed");
    } finally {
      setMigrating(false);
    }
  };

  const handleResetDatabase = async () => {
    if (
      !confirm(
        "⚠️ This will DELETE the entire database and recreate it with a fresh schema. Are you sure?",
      )
    ) {
      return;
    }

    setResetting(true);
    setError("");

    try {
      const res = await fetch("/api/dev/reset-db", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }

      // Recheck database status
      const dbRes = await fetch("/api/db-status");
      const dbData = await dbRes.json();
      setDbExists(dbData.exists);

      alert(
        "✅ Database reset successfully! Fresh schema created.\n\nYou can now run migrations to populate data.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your content
          </p>
        </div>

        {dbExists === false && migrationEnabled && (
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Database Not Found
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    The SQLite database doesn&apos;t exist yet. Click the button
                    below to run the migration and set up your database.
                  </p>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleRunMigration}
                    disabled={migrating}
                    className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {migrating
                      ? "Running Migration..."
                      : "🔄 Run Migration Now"}
                  </button>
                  <Link
                    href="/admin/migrate"
                    className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                  >
                    Advanced Options
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="relative block w-full rounded-t-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {process.env.NODE_ENV === "development" && (
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Default credentials:</p>
              <p className="font-mono">admin / change_me_123</p>
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                Change the password after first login!
              </p>
            </div>

            {/* Development Tools */}
            <div className="rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-900/20">
              <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-yellow-800 dark:text-yellow-300">
                🔧 Development Tools
              </h3>
              <button
                onClick={handleResetDatabase}
                disabled={resetting}
                className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resetting ? "Resetting..." : "🗑️ Reset Database"}
              </button>
              <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
                Deletes DB and creates fresh schema
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

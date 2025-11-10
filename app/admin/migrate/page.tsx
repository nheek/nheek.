"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MigrationLog {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

export default function MigrationPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<MigrationLog[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) router.push("/admin/login");
  };

  const addLog = (message: string, type: MigrationLog["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      },
    ]);
  };

  const runMigration = async (endpoint: string, name: string) => {
    addLog(`Starting ${name}...`, "info");
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        addLog(`✅ ${name} completed successfully`, "success");
        if (data.message) addLog(data.message, "success");
        if (data.stats) {
          Object.entries(data.stats).forEach(([key, value]) => {
            addLog(`  ${key}: ${value}`, "info");
          });
        }
      } else {
        addLog(`❌ ${name} failed: ${data.error}`, "error");
      }
    } catch (error) {
      addLog(`❌ ${name} error: ${error}`, "error");
    }
  };

  const handleMigrateAll = async () => {
    setIsMigrating(true);
    setLogs([]);

    addLog("Starting full migration...", "info");
    addLog("This will import all data from JSON files to SQLite", "info");
    addLog("─────────────────────────────────────", "info");

    // Run migrations in sequence
    await runMigration("/api/migrate/albums", "Albums & Songs Migration");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await runMigration("/api/migrate/projects", "Projects Migration");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await runMigration("/api/migrate/links", "Custom Links Migration");

    addLog("─────────────────────────────────────", "info");
    addLog("🎉 All migrations completed!", "success");
    setIsMigrating(false);
  };

  const handleMigrateAlbums = async () => {
    setIsMigrating(true);
    await runMigration("/api/migrate/albums", "Albums & Songs Migration");
    setIsMigrating(false);
  };

  const handleMigrateProjects = async () => {
    setIsMigrating(true);
    await runMigration("/api/migrate/projects", "Projects Migration");
    setIsMigrating(false);
  };

  const handleMigrateLinks = async () => {
    setIsMigrating(true);
    await runMigration("/api/migrate/links", "Custom Links Migration");
    setIsMigrating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Data Migration
            </h1>
            <Link
              href="/admin"
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <h3 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            ⚠️ Warning
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            These migrations will import data from JSON files into the SQLite
            database. If data already exists, it will be updated. Make sure to
            backup your database before running migrations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Full Migration
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Import all data from JSON files: albums, songs, projects, and
              custom links.
            </p>
            <button
              onClick={handleMigrateAll}
              disabled={isMigrating}
              className={`w-full rounded-md px-4 py-3 text-white ${
                isMigrating
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {isMigrating ? "Migrating..." : "Migrate All Data"}
            </button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Individual Migrations
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Run specific migrations individually.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleMigrateAlbums}
                disabled={isMigrating}
                className={`w-full rounded-md px-4 py-2 text-white ${
                  isMigrating
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                Migrate Albums & Songs
              </button>
              <button
                onClick={handleMigrateProjects}
                disabled={isMigrating}
                className={`w-full rounded-md px-4 py-2 text-white ${
                  isMigrating
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                Migrate Projects
              </button>
              <button
                onClick={handleMigrateLinks}
                disabled={isMigrating}
                className={`w-full rounded-md px-4 py-2 text-white ${
                  isMigrating
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-purple-600 hover:bg-purple-500"
                }`}
              >
                Migrate Custom Links
              </button>
            </div>
          </div>
        </div>

        {logs.length > 0 && (
          <div className="mt-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Migration Logs
            </h2>
            <div className="max-h-96 overflow-y-auto rounded bg-gray-900 p-4 font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-1 ${
                    log.type === "error"
                      ? "text-red-400"
                      : log.type === "success"
                        ? "text-green-400"
                        : "text-gray-300"
                  }`}
                >
                  <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h3 className="mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
            💡 After Migration
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>Verify data in Albums, Songs, and Projects pages</li>
            <li>Check that custom links are properly imported</li>
            <li>Test the frontend to ensure everything displays correctly</li>
            <li>
              Once confirmed, you can safely delete the JSON files from the
              repository
            </li>
            <li>
              Remember to update .gitignore to keep data/ directory excluded
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

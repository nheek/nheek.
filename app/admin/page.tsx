"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [migrationButtonVisible, setMigrationButtonVisible] = useState(true);
  const [stats, setStats] = useState({
    albums: 0,
    songs: 0,
    projects: 0,
  });

  useEffect(() => {
    const initDashboard = async () => {
      await checkAuth();
      await fetchStats();

      // Check migration button visibility
      const isDisabled = localStorage.getItem("migrationButtonDisabled");
      setMigrationButtonVisible(isDisabled !== "true");
    };
    initDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/admin/login");
      }
    } catch {
      router.push("/admin/login");
    }
  };

  const fetchStats = async () => {
    try {
      const [albumsRes, songsRes, projectsRes] = await Promise.all([
        fetch("/api/albums"),
        fetch("/api/songs"),
        fetch("/api/projects"),
      ]);

      const albums = await albumsRes.json();
      const songs = await songsRes.json();
      const projects = await projectsRes.json();

      setStats({
        albums: albums.albums?.length || 0,
        songs: songs.songs?.length || 0,
        projects: projects.projects?.length || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleMigrationButton = () => {
    const newValue = !migrationButtonVisible;
    setMigrationButtonVisible(newValue);
    localStorage.setItem("migrationButtonDisabled", String(!newValue));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Albums
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {stats.albums}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Songs
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {stats.songs}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Projects
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {stats.projects}
            </dd>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/albums"
            className="block rounded-lg bg-indigo-600 p-6 text-white shadow transition hover:bg-indigo-500"
          >
            <h3 className="text-lg font-semibold">Manage Albums</h3>
            <p className="mt-2 text-sm">Add, edit, and delete albums</p>
          </Link>

          <Link
            href="/admin/songs"
            className="block rounded-lg bg-purple-600 p-6 text-white shadow transition hover:bg-purple-500"
          >
            <h3 className="text-lg font-semibold">Manage Songs</h3>
            <p className="mt-2 text-sm">Add lyrics and update songs</p>
          </Link>

          <Link
            href="/admin/projects"
            className="block rounded-lg bg-green-600 p-6 text-white shadow transition hover:bg-green-500"
          >
            <h3 className="text-lg font-semibold">Manage Projects</h3>
            <p className="mt-2 text-sm">Update your portfolio projects</p>
          </Link>

          <Link
            href="/admin/categories"
            className="block rounded-lg bg-orange-600 p-6 text-white shadow transition hover:bg-orange-500"
          >
            <h3 className="text-lg font-semibold">Manage Categories</h3>
            <p className="mt-2 text-sm">Organize project categories</p>
          </Link>
        </div>

        {/* Migration Tool */}
        <div className="mt-6">
          <Link
            href="/admin/migrate"
            className="block rounded-lg bg-yellow-600 p-6 text-white shadow transition hover:bg-yellow-500"
          >
            <h3 className="text-lg font-semibold">🔄 Data Migration</h3>
            <p className="mt-2 text-sm">
              Import data from JSON files to SQLite (for production deployment)
            </p>
          </Link>
        </div>

        {/* Settings Box */}
        <div className="mt-8 rounded-lg bg-purple-50 p-6 dark:bg-purple-900/20">
          <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            ⚙️ Settings
          </h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Show Migration Button on Login Page
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                {migrationButtonVisible
                  ? "The migration button is currently visible on the login page"
                  : "The migration button is hidden from the login page"}
              </p>
            </div>
            <button
              onClick={toggleMigrationButton}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                migrationButtonVisible
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-green-600 hover:bg-green-500"
              }`}
            >
              {migrationButtonVisible ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Getting Started
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• All your existing data has been imported from JSON files</li>
            <li>• Changes are saved directly to the SQLite database</li>
            <li>• Remember to change your admin password!</li>
            <li>
              • Check the DATABASE_IMPLEMENTATION.md file for full documentation
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

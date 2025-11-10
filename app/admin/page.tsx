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
    contributions: 0,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [backups, setBackups] = useState<
    Array<{
      filename: string;
      size: number;
      created: string;
    }>
  >([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState("");

  useEffect(() => {
    const initDashboard = async () => {
      await checkAuth();
      await fetchStats();
      await fetchBackups();

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
      const [albumsRes, songsRes, projectsRes, contributionsRes] =
        await Promise.all([
          fetch("/api/albums"),
          fetch("/api/songs"),
          fetch("/api/projects"),
          fetch("/api/contributions?status=all"),
        ]);

      const albums = await albumsRes.json();
      const songs = await songsRes.json();
      const projects = await projectsRes.json();
      const contributions = await contributionsRes.json();

      setStats({
        albums: albums.albums?.length || 0,
        songs: songs.songs?.length || 0,
        projects: projects.projects?.length || 0,
        contributions: contributions.contributions?.length || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const res = await fetch("/api/backup");
      if (res.ok) {
        const data = await res.json();
        setBackups(data.backups || []);
      }
    } catch (error) {
      console.error("Failed to fetch backups:", error);
    }
  };

  const handleCreateBackup = async () => {
    setBackupLoading(true);
    setBackupMessage("");

    try {
      const res = await fetch("/api/backup", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setBackupMessage(`✅ Backup created: ${data.backup.filename}`);
        await fetchBackups();
      } else {
        setBackupMessage(`❌ Failed: ${data.error}`);
      }
    } catch {
      setBackupMessage("❌ Error creating backup");
    } finally {
      setBackupLoading(false);
      setTimeout(() => setBackupMessage(""), 5000);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    setBackupLoading(true);
    setBackupMessage("");
    setShowRestoreConfirm(false);

    try {
      const res = await fetch("/api/backup/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      const data = await res.json();

      if (res.ok) {
        setBackupMessage(
          `✅ Restored from ${filename}. Auto-backup: ${data.autoBackup}`,
        );
        // Refresh stats after restore
        await fetchStats();
      } else {
        setBackupMessage(`❌ Failed: ${data.error}`);
      }
    } catch {
      setBackupMessage("❌ Error restoring backup");
    } finally {
      setBackupLoading(false);
      setTimeout(() => setBackupMessage(""), 8000);
    }
  };

  const handleDeleteBackup = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete the backup "${filename}"?`)) {
      return;
    }

    setBackupLoading(true);
    setBackupMessage("");

    try {
      const res = await fetch("/api/backup/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      const data = await res.json();

      if (res.ok) {
        setBackupMessage(`✅ Deleted: ${filename}`);
        await fetchBackups();
      } else {
        setBackupMessage(`❌ Failed: ${data.error}`);
      }
    } catch {
      setBackupMessage("❌ Error deleting backup");
    } finally {
      setBackupLoading(false);
      setTimeout(() => setBackupMessage(""), 5000);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    }
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
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Submissions
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {stats.contributions}
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

          <Link
            href="/admin/contributions"
            className="block rounded-lg bg-pink-600 p-6 text-white shadow transition hover:bg-pink-500"
          >
            <h3 className="text-lg font-semibold">Visitor Contributions</h3>
            <p className="mt-2 text-sm">
              Approve graffiti, guestbook, songs, etc.
            </p>
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

        {/* Backup & Restore Box */}
        <div className="mt-8 rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-100">
              💾 Database Backup & Restore
            </h2>
            <button
              onClick={handleCreateBackup}
              disabled={backupLoading}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                backupLoading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-500"
              }`}
            >
              {backupLoading ? "Processing..." : "Create New Backup"}
            </button>
          </div>

          {backupMessage && (
            <div
              className={`mt-4 rounded-md p-3 text-sm ${
                backupMessage.startsWith("✅")
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {backupMessage}
            </div>
          )}

          {backups.length === 0 ? (
            <p className="mt-4 text-sm text-green-700 dark:text-green-300">
              No backups available. Create your first backup above.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {backups.map((backup) => (
                <div
                  key={backup.filename}
                  className="flex items-center justify-between rounded-md border border-green-200 bg-white p-4 dark:border-green-700 dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {backup.filename}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(backup.created)} • {formatBytes(backup.size)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedBackup(backup.filename);
                        setShowRestoreConfirm(true);
                      }}
                      disabled={backupLoading}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(backup.filename)}
                      disabled={backupLoading}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Box */}
        <div className="mt-8 rounded-lg bg-purple-50 p-6 dark:bg-purple-900/20">
          <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            ⚙️ Settings
          </h2>

          {/* Change Password */}
          <div className="mt-4 flex items-center justify-between border-b border-purple-200 pb-4 dark:border-purple-700">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Change Admin Password
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                Update your admin account password for better security
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              Change Password
            </button>
          </div>

          {/* Migration Button Toggle */}
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </h3>

            <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {passwordError && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {passwordSuccess}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setPasswordSuccess("");
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              ⚠️ Restore Database
            </h3>
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to restore from{" "}
              <strong>{selectedBackup}</strong>?
            </p>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              This will replace your current database. An automatic backup of
              the current state will be created before restoring.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleRestoreBackup(selectedBackup)}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Yes, Restore
              </button>
              <button
                onClick={() => {
                  setShowRestoreConfirm(false);
                  setSelectedBackup("");
                }}
                className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

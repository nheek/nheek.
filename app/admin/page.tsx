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
    gallery: 0,
    films: 0,
    qna: 0,
    polls: 0,
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
  const [cursorImageUrl, setCursorImageUrl] = useState("");
  const [cursorLoading, setCursorLoading] = useState(false);
  const [cursorMessage, setCursorMessage] = useState("");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupIntervalHours, setBackupIntervalHours] = useState(24);
  const [maxBackupsToKeep, setMaxBackupsToKeep] = useState(10);
  const [lastAutoBackup, setLastAutoBackup] = useState<string | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState("");

  useEffect(() => {
    const initDashboard = async () => {
      await checkAuth();
      await fetchStats();
      await fetchBackups();
      await fetchCursorSettings();
      await fetchBackupSchedule();

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
      const [
        albumsRes,
        songsRes,
        projectsRes,
        contributionsRes,
        galleryRes,
        filmsRes,
        qnaRes,
        pollsRes,
      ] = await Promise.all([
        fetch("/api/albums"),
        fetch("/api/songs"),
        fetch("/api/projects"),
        fetch("/api/contributions?status=all"),
        fetch("/api/gallery"),
        fetch("/api/films"),
        fetch("/api/qna?status=pending"),
        fetch("/api/polls?includeAll=true"),
      ]);

      const albums = await albumsRes.json();
      const songs = await songsRes.json();
      const projects = await projectsRes.json();
      const contributions = await contributionsRes.json();
      const gallery = await galleryRes.json();
      const films = await filmsRes.json();
      const qna = await qnaRes.json();
      const polls = await pollsRes.json();

      setStats({
        albums: albums.albums?.length || 0,
        songs: songs.songs?.length || 0,
        projects: projects.projects?.length || 0,
        contributions: contributions.contributions?.length || 0,
        gallery: Array.isArray(gallery) ? gallery.length : 0,
        films: films.films?.length || 0,
        qna: qna.questions?.length || 0,
        polls: Array.isArray(polls)
          ? polls.filter((p: any) => p.status === "active").length
          : 0,
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

  const fetchBackupSchedule = async () => {
    try {
      const res = await fetch("/api/backup/schedule");
      if (res.ok) {
        const data = await res.json();
        setAutoBackupEnabled(data.autoBackupEnabled || false);
        setBackupIntervalHours(data.backupIntervalHours || 24);
        setMaxBackupsToKeep(data.maxBackupsToKeep || 10);
        setLastAutoBackup(data.lastAutoBackup);
      }
    } catch (error) {
      console.error("Failed to fetch backup schedule:", error);
    }
  };

  const handleUpdateBackupSchedule = async () => {
    setScheduleLoading(true);
    setScheduleMessage("");

    try {
      const res = await fetch("/api/backup/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoBackupEnabled,
          backupIntervalHours,
          maxBackupsToKeep,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setScheduleMessage("✅ Backup schedule updated successfully!");
      } else {
        setScheduleMessage(`❌ ${data.error || "Failed to update schedule"}`);
      }
    } catch {
      setScheduleMessage("❌ Error updating schedule");
    } finally {
      setScheduleLoading(false);
      setTimeout(() => setScheduleMessage(""), 5000);
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

  const handleMigrateGallery = async () => {
    if (
      !confirm(
        "This will migrate hardcoded gallery images to the database. Continue?",
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/migrate/gallery", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}`);
        // Refresh stats to show new gallery count
        await fetchStats();
      } else {
        alert(`❌ ${data.error}\n${data.message || ""}`);
      }
    } catch (error) {
      alert("❌ Error migrating gallery images");
      console.error("Gallery migration error:", error);
    }
  };

  const fetchCursorSettings = async () => {
    try {
      const res = await fetch("/api/settings/cursor");
      const data = await res.json();
      setCursorImageUrl(data.cursor_image_url || "");
    } catch (error) {
      console.error("Error fetching cursor settings:", error);
    }
  };

  const handleCursorUpdate = async () => {
    if (!cursorImageUrl.trim()) {
      setCursorMessage("Please enter an image URL");
      return;
    }

    setCursorLoading(true);
    setCursorMessage("");

    try {
      const res = await fetch("/api/settings/cursor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursor_image_url: cursorImageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setCursorMessage("✅ Cursor updated! Refresh the page to see changes.");
      } else {
        setCursorMessage(`❌ ${data.error || "Failed to update cursor"}`);
      }
    } catch (error) {
      setCursorMessage("❌ Error updating cursor");
      console.error("Cursor update error:", error);
    } finally {
      setCursorLoading(false);
    }
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
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-7">
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

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Gallery Images
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {stats.gallery}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Films & Series
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {stats.films}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-yellow-50 px-4 py-5 shadow dark:bg-yellow-900/20 sm:p-6">
            <dt className="truncate text-sm font-medium text-yellow-700 dark:text-yellow-400">
              Pending Q&A
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-900 dark:text-yellow-300">
              {stats.qna}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-purple-50 px-4 py-5 shadow dark:bg-purple-900/20 sm:p-6">
            <dt className="truncate text-sm font-medium text-purple-700 dark:text-purple-400">
              Active Polls
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-purple-900 dark:text-purple-300">
              {stats.polls}
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

          <Link
            href="/admin/gallery"
            className="block rounded-lg bg-cyan-600 p-6 text-white shadow transition hover:bg-cyan-500"
          >
            <h3 className="text-lg font-semibold">Manage Gallery</h3>
            <p className="mt-2 text-sm">
              Add, edit, and organize gallery images
            </p>
          </Link>

          <Link
            href="/admin/films"
            className="block rounded-lg bg-rose-600 p-6 text-white shadow transition hover:bg-rose-500"
          >
            <h3 className="text-lg font-semibold">Manage Films & Series</h3>
            <p className="mt-2 text-sm">
              Add, rate, and review films/series you've watched
            </p>
          </Link>

          <Link
            href="/admin/qna"
            className="block rounded-lg bg-sky-600 p-6 text-white shadow transition hover:bg-sky-500"
          >
            <h3 className="text-lg font-semibold">Manage Q&A</h3>
            <p className="mt-2 text-sm">Answer visitor questions and publish</p>
          </Link>

          <Link
            href="/admin/polls"
            className="block rounded-lg bg-purple-600 p-6 text-white shadow transition hover:bg-purple-500"
          >
            <h3 className="text-lg font-semibold">Manage Polls</h3>
            <p className="mt-2 text-sm">Create polls and track votes</p>
          </Link>
        </div>

        {/* Migration Tools */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/migrate"
            className="block rounded-lg bg-yellow-600 p-6 text-white shadow transition hover:bg-yellow-500"
          >
            <h3 className="text-lg font-semibold">🔄 Data Migration</h3>
            <p className="mt-2 text-sm">
              Import data from JSON files to SQLite (for production deployment)
            </p>
          </Link>

          <button
            onClick={handleMigrateGallery}
            className="block rounded-lg bg-purple-600 p-6 text-left text-white shadow transition hover:bg-purple-500"
          >
            <h3 className="text-lg font-semibold">🖼️ Gallery Migration</h3>
            <p className="mt-2 text-sm">
              Import existing gallery images to database (one-time setup)
            </p>
          </button>
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

          {/* Scheduled Backup Settings */}
          <div className="mt-6 border-t border-green-200 pt-6 dark:border-green-700">
            <h3 className="text-md font-semibold text-green-900 dark:text-green-100 mb-4">
              ⏰ Automated Backup Schedule
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Enable Auto Backup
                </label>
                <button
                  onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                  className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                    autoBackupEnabled
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  {autoBackupEnabled ? "✅ Enabled" : "❌ Disabled"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Backup Every (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={backupIntervalHours}
                  onChange={(e) =>
                    setBackupIntervalHours(parseInt(e.target.value) || 24)
                  }
                  className="w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-green-600 dark:bg-green-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Max Backups to Keep
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxBackupsToKeep}
                  onChange={(e) =>
                    setMaxBackupsToKeep(parseInt(e.target.value) || 10)
                  }
                  className="w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-green-600 dark:bg-green-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Apply Settings
                </label>
                <button
                  onClick={handleUpdateBackupSchedule}
                  disabled={scheduleLoading}
                  className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                    scheduleLoading
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-green-700 hover:bg-green-600"
                  }`}
                >
                  {scheduleLoading ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </div>

            {lastAutoBackup && (
              <p className="mt-3 text-xs text-green-700 dark:text-green-300">
                Last auto backup: {formatDate(lastAutoBackup)}
              </p>
            )}

            {scheduleMessage && (
              <div
                className={`mt-3 rounded-md p-3 text-sm ${
                  scheduleMessage.startsWith("✅")
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {scheduleMessage}
              </div>
            )}

            <div className="mt-4 rounded-md bg-green-100 p-3 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <strong>💡 Note:</strong> For automated backups to work, you need
              to set up a cron job that calls{" "}
              <code className="mx-1 rounded bg-green-200 px-1 dark:bg-green-800">
                POST /api/backup/auto
              </code>{" "}
              with header{" "}
              <code className="mx-1 rounded bg-green-200 px-1 dark:bg-green-800">
                x-cron-secret
              </code>
              . See documentation for setup instructions.
            </div>
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

        {/* Cache Management Box */}
        <div className="mt-8 rounded-lg bg-cyan-50 p-6 dark:bg-cyan-900/20">
          <h2 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">
            🔄 Cache Management
          </h2>
          <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-300">
            Manually refresh cached pages after updating content
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/revalidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "albums" }),
                  });
                  if (res.ok) {
                    alert("✅ Music pages cache cleared!");
                  } else {
                    alert("❌ Failed to clear cache");
                  }
                } catch {
                  alert("❌ Error clearing cache");
                }
              }}
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              Clear Music Cache
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/revalidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "projects" }),
                  });
                  if (res.ok) {
                    alert("✅ Projects cache cleared!");
                  } else {
                    alert("❌ Failed to clear cache");
                  }
                } catch {
                  alert("❌ Error clearing cache");
                }
              }}
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              Clear Projects Cache
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/revalidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "gallery" }),
                  });
                  if (res.ok) {
                    alert("✅ Gallery cache cleared!");
                  } else {
                    alert("❌ Failed to clear cache");
                  }
                } catch {
                  alert("❌ Error clearing cache");
                }
              }}
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              Clear Gallery Cache
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/revalidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "qna" }),
                  });
                  if (res.ok) {
                    alert("✅ Q&A cache cleared!");
                  } else {
                    alert("❌ Failed to clear cache");
                  }
                } catch {
                  alert("❌ Error clearing cache");
                }
              }}
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              Clear Q&A Cache
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/revalidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "polls" }),
                  });
                  if (res.ok) {
                    alert("✅ Polls cache cleared!");
                  } else {
                    alert("❌ Failed to clear cache");
                  }
                } catch {
                  alert("❌ Error clearing cache");
                }
              }}
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              Clear Polls Cache
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/revalidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "all" }),
                  });
                  if (res.ok) {
                    alert("✅ All caches cleared!");
                  } else {
                    alert("❌ Failed to clear cache");
                  }
                } catch {
                  alert("❌ Error clearing cache");
                }
              }}
              className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              Clear All Cache
            </button>
          </div>

          <div className="mt-4 rounded-md bg-cyan-100 p-3 text-xs text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
            <strong>💡 Tip:</strong> Pages are cached indefinitely for
            performance. Use these buttons after adding/editing content to
            immediately show changes on the website.
          </div>
        </div>

        {/* Settings Box */}
        <div className="mt-8 rounded-lg bg-purple-50 p-6 dark:bg-purple-900/20">
          <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            ⚙️ Settings
          </h2>

          {/* Custom Cursor */}
          <div className="mt-4 border-b border-purple-200 pb-4 dark:border-purple-700">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Custom Cursor Image
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-300 mb-3">
                Set a custom image for your cursor (your face!)
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={cursorImageUrl}
                onChange={(e) => setCursorImageUrl(e.target.value)}
                placeholder="https://example.com/your-face.jpg"
                className="flex-1 rounded-md border border-purple-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-purple-600 dark:bg-purple-800 dark:text-white"
              />
              <button
                onClick={handleCursorUpdate}
                disabled={cursorLoading}
                className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
              >
                {cursorLoading ? "Saving..." : "Update"}
              </button>
            </div>
            {cursorMessage && (
              <p className="mt-2 text-xs text-purple-600 dark:text-purple-300">
                {cursorMessage}
              </p>
            )}
          </div>

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

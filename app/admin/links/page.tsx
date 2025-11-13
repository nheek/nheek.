"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminLinksPage() {
  const [importMode, setImportMode] = useState(false);
  const [importData, setImportData] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState<{ id?: number; name: string; url: string; desc: string; color: string; display_order: string }>({ id: undefined, name: "", url: "", desc: "", color: "", display_order: "" });

  async function fetchLinks() {
    setLoading(true);
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data.links || []);
    setLoading(false);
  }

  // Initial fetch
  useEffect(() => { fetchLinks(); }, []);

  async function handleSave() {
    const method = editId ? "PUT" : "POST";
    const payload = { ...form };
    if (editId) payload.id = editId;
    await fetch("/api/links", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetch("/api/links/revalidate", { method: "POST" });
    setForm({ id: undefined, name: "", url: "", desc: "", color: "", display_order: "" });
    setEditId(null);
    setShowModal(false);
    fetchLinks();
  }
  const [showModal, setShowModal] = useState(false);

  async function handleDelete(id: number) {
    await fetch("/api/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetch("/api/links/revalidate", { method: "POST" });
    fetchLinks();
  }

  // Consistent admin page design (header, dashboard link, search, table, modal)
  const [search, setSearch] = useState("");
  const filteredLinks = links.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Links</h1>
            <Link href="/admin" className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500">Back to Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-md border px-4 py-2 dark:bg-gray-800 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              className="rounded-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-600"
              onClick={() => setImportMode(!importMode)}
            >
              {importMode ? "Cancel Import" : "Import Existing Data"}
            </button>
            <button
              className="rounded-md bg-red-700 px-4 py-2 text-white hover:bg-red-600"
              onClick={async () => {
                await fetch("/api/links/revalidate", { method: "POST" });
                alert("Links cache cleared and will revalidate on next load.");
              }}
            >
              Clear Links Cache
            </button>
            <button
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
              onClick={() => { setEditId(null); setForm({ id: undefined, name: "", url: "", desc: "", color: "", display_order: "" }); setShowModal(true); }}
            >
              Add New Link
            </button>
          </div>
        </div>

        {importMode && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg mb-8 shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Import Links JSON</h2>
            <textarea
              className="w-full h-40 p-2 rounded border dark:bg-gray-800 dark:text-white mb-4"
              value={importData}
              onChange={e => setImportData(e.target.value)}
              placeholder="Paste links JSON here..."
            />
            <button
              className="rounded-md bg-purple-700 px-4 py-2 text-white hover:bg-purple-600"
              onClick={async () => {
                try {
                  const res = await fetch("/api/links/import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: importData,
                  });
                  const result = await res.json();
                  if (result.imported) {
                    alert(`Imported ${result.imported} links!`);
                    setImportMode(false);
                    setImportData("");
                    fetchLinks();
                  } else {
                    alert(result.error || "Import failed");
                  }
                } catch (e) {
                  alert("Import failed");
                }
              }}
            >
              Import
            </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Order</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {filteredLinks.map(link => (
                <tr key={link.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{link.name}</td>
                  <td className="whitespace-nowrap px-6 py-4"><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{link.url}</a></td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">{link.desc || ""}</td>
                  <td className="whitespace-nowrap px-6 py-4"><span style={{ background: link.color || "#444", color: "#fff", padding: "2px 8px", borderRadius: "6px" }}>{link.color || ""}</span></td>
                  <td className="whitespace-nowrap px-6 py-4">{link.display_order ?? ""}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right sticky right-0 bg-white dark:bg-gray-800 z-10" style={{ minWidth: 120 }}>
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-md bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-500 shadow"
                        onClick={() => {
                          setEditId(link.id);
                          setForm({
                            id: link.id,
                            name: link.name,
                            url: link.url,
                            desc: link.desc || "",
                            color: link.color || "",
                            display_order: link.display_order?.toString() || ""
                          });
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-500 shadow"
                        onClick={() => handleDelete(link.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{editId ? "Edit Link" : "Add New Link"}</h2>
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL *</label>
                <input type="url" required value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3} className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                <input type="text" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Order</label>
                <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: e.target.value }))} className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="flex justify-end space-x-2 border-t pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditId(null); setForm({ id: undefined, name: "", url: "", desc: "", color: "", display_order: "" }); }} className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">Cancel</button>
                <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">{editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

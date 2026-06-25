"use client";

import { authorizedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await authClient.token();
      const response = await authorizedFetch("/admin/users", data?.token);
      if (response.ok) {
        setToken(data?.token || "");
        setUsers(await response.json());
      }
    })();
  }, []);

  const changeRole = async (id, role) => {
    const response = await authorizedFetch(`/admin/users/${id}/role`, token, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    if (!response.ok) return toast.error("Could not change role.");
    toast.success("Role updated.");
    setUsers((items) => items.map((user) => user._id === id ? { ...user, role } : user));
  };

  const remove = async (id) => {
    setDeleting(true);
    const response = await authorizedFetch(`/admin/users/${id}`, token, { method: "DELETE" });
    setDeleting(false);
    if (!response.ok) return toast.error("Could not delete user.");
    toast.success("User deleted.");
    setUsers((items) => items.filter((user) => user._id !== id));
    setDeleteTarget(null);
  };

  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold">Manage users</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Actions</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4 font-bold">{user.name || "Unnamed"}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select value={user.role || "user"} onChange={(e) => changeRole(user._id, e.target.value)} className="rounded-lg border px-3 py-2">
                    <option value="user">User</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4"><button onClick={() => setDeleteTarget(user)} className="rounded-lg border px-3 py-2 font-bold text-red-600">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete user?"
        message={`This will permanently delete ${deleteTarget?.email || "this user"} from VerdictHub.`}
        confirmLabel="Delete user"
        danger
        loading={deleting}
        onConfirm={() => deleteTarget && remove(deleteTarget._id)}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}

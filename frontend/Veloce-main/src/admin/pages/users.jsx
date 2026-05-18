import React, { useEffect, useState } from "react";
import { api } from "../../service/api";
import Sidebar from "../components/side";
import { Edit, Trash2, Ban, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // ------------------- Fetch Users -------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("users/");
        setUsers(res.data);
      } catch (err) {
        console.error(err.message);
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // ------------------- Delete User -------------------
  const handleDelete = async (id) => {
    try {
      await api.delete(`users/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // ------------------- Block / Unblock -------------------
  const handleBlockToggle = async (id, is_active) => {
    try {
      const updatedIsBlock = !is_active;
      await api.patch(`users/${id}/`, { is_active: updatedIsBlock });
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, is_active: updatedIsBlock } : u,
        ),
      );
      toast.success(
        `User ${updatedIsBlock ? "blocked" : "unblocked"} successfully`,
      );
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  // ------------------- Save Edit -------------------
  const handleSaveEdit = async () => {
    try {
      const res = await api.patch(`users/${editUser.id}/`, {
        username: editUser.username,
        email: editUser.email,
        role: editUser.role,
        is_active: editUser.is_active,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? res.data : u)),
      );
      toast.success("User updated successfully");
      setEditUser(null);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col p-4 pt-20 sm:p-6 md:p-8 md:ml-64">
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            User Management
          </h1>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="border-b text-gray-700 text-sm md:text-base">
              <tr>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b text-black hover:bg-gray-50 transition text-sm md:text-gray-800"
                >
                  <td className="py-3 px-2 break-words">{user.username}</td>
                  <td className="py-3 px-2 break-words">{user.email}</td>
                  <td className="py-3 px-2 capitalize">{user.role}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "Active" : "Block"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center space-x-2 sm:space-x-3">
                    {/* Edit */}
                    <button
                      onClick={() => setEditUser(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} className="inline-block" />
                    </button>

                    {/* Block / Unblock */}

                    {console.log(user.is_active)}
                    <button
                      onClick={() => handleBlockToggle(user.id, user.is_active)}
                      className={`${
                        user.role === "admin"
                          ? "text-gray-400 cursor-not-allowed"
                          : user.is_active
                          ? "text-yellow-600 hover:text-yellow-800"
                          : "text-green-600 hover:text-green-800"
                      }`}
                      disabled={user.role === "admin"}
                    >
                      {user.is_active ? (
                        <CheckCircle size={16} className="inline-block" />
                      ) : (
                        <Ban size={16} className="inline-block" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className={`${user.role === "admin"
                          ? "text-gray-400 cursor-not-allowed"
                          :"text-red-600 hover:text-red-800"}`}
                      disabled={user.role === "admin"}
                    >
                      <Trash2 size={16} className="inline-block"
                       />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center text-gray-500 py-6 text-sm md:text-base">
              No users found.
            </p>
          )}
        </div>

        {/* EDIT USER MODAL */}
        {editUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg md:text-xl text-black font-semibold mb-4 text-center md:text-left">
                Edit User
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  placeholder="Name"
                  className="w-full text-black border rounded-lg px-3 py-2"
                />
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full text-black border rounded-lg px-3 py-2"
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-black hover:bg-gray-300 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

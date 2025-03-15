import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import DeleteUserButton from "../components/DeleteUserButton";
import VerifyAdminButton from "../components/VerifyAdminButton";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users/all");
        // Adjust to use the correct data structure returned by your API:
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading users...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="w-full overflow-x-auto">
        {/* Table Header */}
        <div className="text-white bg-black flex justify-start items-center font-bold">
          <div className="h-8 w-60 flex justify-center items-center">User ID</div>
          <div className="h-8 w-60 flex justify-center items-center">Name</div>
          <div className="h-8 w-80 flex justify-center items-center">Email</div>
          <div className="h-8 w-40 flex justify-center items-center">Role</div>
          <div className="h-8 w-80 flex justify-center items-center">Actions</div>
        </div>

        {/* Table Rows */}
        {users.map((user) => (
          <div
            key={user._id}
            className="text-white bg-gray-800 flex justify-start items-center"
          >
            <div className="h-16 w-60 flex justify-center items-center">
              {user._id}
            </div>
            <div className="h-16 w-60 flex justify-center items-center">
              {user.name}
            </div>
            <div className="h-16 w-80 flex justify-center items-center">
              {user.email}
            </div>
            <div className="h-16 w-40 flex justify-center items-center">
              {user.role}
            </div>
            <div className="h-16 w-80 flex justify-center items-center">
              <div className="gap-2 min-w-[160px] grid grid-cols-3">
                <a
                  href={`/manage-users/update-user/${user._id}`}
                  className="text-center px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Edit
                </a>

                {/* Conditionally render Verify button */}
                {user.role !== "super-admin" && !user.isVerified ? (
                  <VerifyAdminButton
                    id={user._id}
                    onVerify={() =>
                      setUsers(
                        users.map((u) =>
                          u._id === user._id ? { ...u, isVerified: true } : u
                        )
                      )
                    }
                  />
                ) : (
                  <span className="bg-gray-600 text-white px-2 py-1 rounded-md text-center">
                    Verified
                  </span>
                )}

                <DeleteUserButton
                  id={user._id}
                  onDelete={() =>
                    setUsers(users.filter((u) => u._id !== user._id))
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

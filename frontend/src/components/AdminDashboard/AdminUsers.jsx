import { useState, useEffect } from "react";
import api from "../../../utils/api.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming these are the shadcn components

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByRole, setSortByRole] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1); // Keep track of the current page

  // Fetch users when the component mounts or when page changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/users?page=${page}&limit=7`);
        setUsers(res.data.data.doc); // Use res.data.data.doc to access users
        setTotalPages(res.data.totalPages); // Update totalPages
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [page]);

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Start editing a user
  const handleEditClick = (user) => {
    setEditUser(user);
  };

  // Save the edited user and return to normal view
  const handleSave = async () => {
    try {
      await api.patch(`/users/${editUser._id}`, editUser);
      setUsers(
        users.map((user) => (user._id === editUser._id ? editUser : user))
      );
      setEditUser(null); // Return to normal state after saving
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Handle page change (pagination)
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Filter users based on search and roles
  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchTermLower) ||
      user.lastName.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.mobileNumber.includes(searchTerm)
    );
  });

  // Sort users by role
  const sortedUsers =
    sortByRole === "all"
      ? filteredUsers
      : filteredUsers.filter((user) => user.roles === sortByRole);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="w-full h-14 shadow-md bg-white m-2 border rounded-lg">
        <p className="text-xl text-violet-900 font-bold mt-4 ml-4">
          User Management
        </p>
      </div>

      {/* Search and Sort */}
      <div className="p-4 bg-white shadow-md rounded-lg mb-4">
        <div className="flex justify-between space-x-4">
          <input
            type="text"
            placeholder="Search by name, email or phone number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <select
            value={sortByRole}
            onChange={(e) => setSortByRole(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="all">All Roles</option>
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableCaption>A list of users in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            sortedUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  {editUser && editUser._id === user._id ? (
                    <input
                      value={editUser.firstName}
                      onChange={(e) =>
                        setEditUser({
                          ...editUser,
                          firstName: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  ) : (
                    user.firstName
                  )}
                </TableCell>
                <TableCell>
                  {editUser && editUser._id === user._id ? (
                    <input
                      value={editUser.lastName}
                      onChange={(e) =>
                        setEditUser({
                          ...editUser,
                          lastName: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  ) : (
                    user.lastName
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.roles}</TableCell>
                <TableCell className="space-x-2">
                  {editUser && editUser._id === user._id ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-violet-900 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded ${
            page === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminUsers;

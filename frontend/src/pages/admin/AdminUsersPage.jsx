import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../services/userService';
import Loader from '../../components/common/Loader';
import { Pencil, Trash, XCircle, UserCircle, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import UserForm from '../../components/admin/UserForm';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (userId) => {
    setDeleteConfirmId(userId);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setDeleteConfirmId(null);
      // Refresh the user list
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete the user. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleUserUpdated = () => {
    // Refresh the users list after update
    fetchUsers();
  };

  // Format date in a readable form
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };  if (loading) return (
    <div className="container mx-auto p-4 pt-24">
      <div className="flex items-center mb-6">
        <Link to="/admin" className="flex items-center text-primary-400 hover:text-primary-500 mr-4">
          <ArrowLeft size={20} className="mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-200">User Management</h1>
      </div>
      <Loader />
    </div>
  );
  return (
    <div className="container mx-auto p-4 pt-24">
      <div className="flex items-center mb-6">
        <Link to="/admin" className="flex items-center text-primary-400 hover:text-primary-500 mr-4">
          <ArrowLeft size={20} className="mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-200">User Management</h1>
      </div>
      
      {error && (
        <div className="bg-red-900/30 text-red-400 p-4 rounded mb-4 flex items-center" role="alert">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-dark-700 border border-dark-600 shadow-md rounded-lg">
          <thead>
            <tr className="bg-dark-800">
              <th className="py-3 px-4 text-left text-gray-300">User</th>
              <th className="py-3 px-4 text-left text-gray-300">Email</th>
              <th className="py-3 px-4 text-center text-gray-300">Admin</th>
              <th className="py-3 px-4 text-left text-gray-300">Registered</th>
              <th className="py-3 px-4 text-center text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t border-dark-600 hover:bg-dark-600">
                  <td className="py-3 px-4 text-gray-200">
                    <div className="flex items-center">
                      <UserCircle className="h-6 w-6 text-gray-400 mr-2" />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{user.email}</td>
                  <td className="py-3 px-4 text-center">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center">
                        <ShieldCheck className="h-5 w-5 text-primary-500 mr-1" />
                        <span className="sr-only">Yes</span>
                      </span>
                    ) : (
                      <span className="sr-only">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{formatDate(user.createdAt)}</td>                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1 text-primary-500 hover:text-primary-400"
                        aria-label="Edit user"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="p-1 text-red-500 hover:text-red-400"
                        aria-label="Delete user"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Delete confirmation */}
                    {deleteConfirmId === user._id && (
                      <div className="fixed inset-0 bg-dark-900 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-dark-700 p-6 rounded-lg shadow-lg max-w-sm w-full">
                          <h3 className="text-lg font-semibold mb-3 text-gray-200">Confirm Delete</h3>
                          <p className="mb-4 text-gray-300">
                            Are you sure you want to delete user <strong className="text-primary-400">{user.name}</strong>? 
                            This action cannot be undone.
                          </p>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={handleCancelDelete}
                              className="btn-outline"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleConfirmDelete(user._id)}
                              className="btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-300"
                aria-label="Close modal"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <UserForm
              user={currentUser}
              onClose={handleCloseModal}
              onUserUpdated={handleUserUpdated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

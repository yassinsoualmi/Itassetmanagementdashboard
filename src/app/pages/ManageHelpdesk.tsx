import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Modal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { helpdeskApi } from "../../utils/api";

interface HelpdeskStaff {
  id: string;
  name: string;
  email: string;
  role: "Technician";
}

export function ManageHelpdesk() {
  const [helpdesk, setHelpdesk] = useState<HelpdeskStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] =
    useState<HelpdeskStaff | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [submitError, setSubmitError] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Technician" as "Technician",
  });

  // Load helpdesk staff from Supabase on mount
  useEffect(() => {
    loadHelpdeskStaff();
  }, []);

  const loadHelpdeskStaff = async () => {
    setLoading(true);
    const response = await helpdeskApi.getAll();
    if (response.success && response.data) {
      setHelpdesk(response.data);
    } else {
      console.error("Failed to load helpdesk staff:", response.error);
    }
    setLoading(false);
  };

  const filteredHelpdesk = helpdesk.filter((staff) => {
    const matchesSearch =
      staff.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      staff.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(
    filteredHelpdesk.length / itemsPerPage,
  );
  const paginatedHelpdesk = filteredHelpdesk.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );


  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: "", email: "", password: "", role: "Technician" });
    setSubmitError("");
    setShowModal(true);
  };

  const openEditModal = (staff: HelpdeskStaff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: "", // Leave empty - only set if changing password
      role: staff.role,
    });
    setSubmitError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (editingStaff) {
      const response = await helpdeskApi.update(editingStaff.id, formData);
      if (response.success && response.data) {
        setHelpdesk(
          helpdesk.map((s) =>
            s.id === editingStaff.id ? response.data : s,
          ),
        );
        setShowModal(false);
      } else {
        setSubmitError(response.error || "Failed to update helpdesk staff");
      }
    } else {
      const response = await helpdeskApi.create(formData);
      if (response.success && response.data) {
        setHelpdesk([...helpdesk, response.data]);
        setShowModal(false);
      } else {
        setSubmitError(response.error || "Failed to create helpdesk staff");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const response = await helpdeskApi.delete(id);
    if (response.success) {
      setHelpdesk(helpdesk.filter((s) => s.id !== id));
    } else {
      console.error("Failed to delete helpdesk staff:", response.error);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Manage Helpdesk Staff
        </h1>
        <p className="text-gray-600">
          Create and manage helpdesk user accounts with login credentials
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search helpdesk staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Helpdesk Staff
          </button>
        </div>
      </div>

      {/* Helpdesk Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedHelpdesk.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {staff.id}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {staff.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {staff.email}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(staff)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm(staff.id)
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredHelpdesk.length,
              )}{" "}
              of {filteredHelpdesk.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1),
                  )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          editingStaff
            ? "Edit Helpdesk Account"
            : "Create New Helpdesk Account"
        }
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {submitError}
              </div>
            )}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Robert Martinez"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="robert.martinez@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {editingStaff ? "(optional - leave empty to keep current)" : "*"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required={!editingStaff}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={editingStaff ? "Leave empty to keep current password" : "Minimum 6 characters"}
                    minLength={formData.password ? 6 : 0}
                  />
                </div>
                {editingStaff && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Leave blank to keep the current password. Enter a new password to reset it.
                  </p>
                )}
                {!editingStaff && (
                  <p className="text-xs text-gray-500 mt-1">
                    This password will be used by the helpdesk staff to login.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingStaff ? "Update Account" : "Create Account"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() =>
          deleteConfirm && handleDelete(deleteConfirm)
        }
        title="Delete Helpdesk Account"
        message="Are you sure you want to delete this helpdesk account? This will permanently remove their login access and cannot be undone."
        confirmText="Delete Account"
        type="danger"
      />
    </div>
  );
}
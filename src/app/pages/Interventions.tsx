import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { Modal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

interface Intervention {
  id: string;
  type: "Incident" | "Maintenance";
  equipment: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTechnician: string;
  interventionDate: string;
  createdAt?: string;
}

export function Interventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b8fa3712/interventions`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setInterventions(result.data);
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
      toast.error('Failed to load interventions');
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editingIntervention, setEditingIntervention] =
    useState<Intervention | null>(null);
  const [viewingIntervention, setViewingIntervention] =
    useState<Intervention | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "All" | "Incident" | "Maintenance"
  >("All");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Open" | "In Progress" | "Resolved" | "Closed"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    type: "Incident" as "Incident" | "Maintenance",
    equipment: "",
    description: "",
    status: "Open" as "Open" | "In Progress" | "Resolved" | "Closed",
    assignedTechnician: "",
    interventionDate: "",
  });

  const filteredInterventions = interventions.filter((intervention) => {
    const matchesSearch =
      intervention.equipment
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      intervention.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      intervention.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.assignedTechnician
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "All" || intervention.type === filterType;
    const matchesStatus =
      filterStatus === "All" || intervention.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInterventions.length / itemsPerPage);
  const paginatedInterventions = filteredInterventions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openCount = interventions.filter((i) => i.status === "Open").length;
  const inProgressCount = interventions.filter(
    (i) => i.status === "In Progress"
  ).length;
  const resolvedCount = interventions.filter(
    (i) => i.status === "Resolved"
  ).length;

  const openAddModal = () => {
    setEditingIntervention(null);
    setFormData({
      type: "Incident",
      equipment: "",
      description: "",
      status: "Open",
      assignedTechnician: "",
      interventionDate: "",
    });
    setShowModal(true);
  };

  const openEditModal = (intervention: Intervention) => {
    setEditingIntervention(intervention);
    setFormData({
      type: intervention.type,
      equipment: intervention.equipment,
      description: intervention.description,
      status: intervention.status,
      assignedTechnician: intervention.assignedTechnician,
      interventionDate: intervention.interventionDate,
    });
    setShowModal(true);
  };

  const openViewModal = (intervention: Intervention) => {
    setViewingIntervention(intervention);
    setViewModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingIntervention) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b8fa3712/interventions/${editingIntervention.id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
        const result = await response.json();
        if (result.success) {
          toast.success('Intervention updated successfully');
          await fetchInterventions();
        } else {
          toast.error('Failed to update intervention');
        }
      } else {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b8fa3712/interventions`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
        const result = await response.json();
        if (result.success) {
          toast.success('Intervention added successfully');
          await fetchInterventions();
        } else {
          toast.error('Failed to add intervention');
        }
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error saving intervention:', error);
      toast.error('Failed to save intervention');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b8fa3712/interventions/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success('Intervention deleted successfully');
        await fetchInterventions();
      } else {
        toast.error('Failed to delete intervention');
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting intervention:', error);
      toast.error('Failed to delete intervention');
      setDeleteConfirm(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-orange-100 text-orange-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Incident"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";
  };

  const getTypeIcon = (type: string) => {
    return type === "Incident" ? (
      <AlertCircle className="w-4 h-4" />
    ) : (
      <Wrench className="w-4 h-4" />
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Interventions
        </h1>
        <p className="text-gray-600">
          Manage incidents and maintenance interventions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-semibold text-gray-900">
                {interventions.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Open</p>
              <p className="text-3xl font-semibold text-red-600">
                {openCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-semibold text-orange-600">
                {inProgressCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="text-3xl font-semibold text-green-600">
                {resolvedCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search interventions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "All" | "Incident" | "Maintenance")
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Incident">Incident</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "All"
                    | "Open"
                    | "In Progress"
                    | "Resolved"
                    | "Closed"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Intervention
          </button>
        </div>
      </div>

      {/* Interventions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Equipment
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Assigned Technician
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInterventions.map((intervention) => (
                <tr
                  key={intervention.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {intervention.id}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getTypeColor(
                        intervention.type
                      )}`}
                    >
                      {getTypeIcon(intervention.type)}
                      {intervention.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {intervention.equipment}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate">
                    {intervention.description}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(
                        intervention.status
                      )}`}
                    >
                      {intervention.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {intervention.assignedTechnician}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {intervention.interventionDate}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openViewModal(intervention)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(intervention)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(intervention.id)}
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
              {Math.min(currentPage * itemsPerPage, filteredInterventions.length)}{" "}
              of {filteredInterventions.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
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
          editingIntervention ? "Edit Intervention" : "Add New Intervention"
        }
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* General Info Section */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  General Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "Incident" | "Maintenance",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Incident">Incident</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment *
                </label>
                <input
                  type="text"
                  required
                  value={formData.equipment}
                  onChange={(e) =>
                    setFormData({ ...formData, equipment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., HP LaserJet Pro"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the intervention details..."
                />
              </div>

              {/* Status Management Section */}
              <div className="md:col-span-2 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Status Management
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "Open"
                        | "In Progress"
                        | "Resolved"
                        | "Closed",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Assignment Section */}
              <div className="md:col-span-2 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Assignment
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Technician *
                </label>
                <input
                  type="text"
                  required
                  value={formData.assignedTechnician}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignedTechnician: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., John Technician"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervention Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.interventionDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      interventionDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingIntervention ? "Update Intervention" : "Add Intervention"}
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

      {/* View Modal */}
      {viewingIntervention && (
        <Modal
          isOpen={viewModal}
          onClose={() => setViewModal(false)}
          title="Intervention Details"
          maxWidth="2xl"
        >
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p className="text-base text-gray-900 mt-1">
                    {viewingIntervention.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getTypeColor(
                        viewingIntervention.type
                      )}`}
                    >
                      {getTypeIcon(viewingIntervention.type)}
                      {viewingIntervention.type}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Equipment</p>
                  <p className="text-base text-gray-900 mt-1">
                    {viewingIntervention.equipment}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(
                        viewingIntervention.status
                      )}`}
                    >
                      {viewingIntervention.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Assigned Technician
                  </p>
                  <p className="text-base text-gray-900 mt-1">
                    {viewingIntervention.assignedTechnician}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-base text-gray-900 mt-1">
                    {viewingIntervention.interventionDate}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-base text-gray-900 mt-1">
                  {viewingIntervention.description}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setViewModal(false)}
                className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Intervention"
        message="Are you sure you want to delete this intervention? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

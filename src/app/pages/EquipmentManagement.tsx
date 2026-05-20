import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Filter, Search, X, Eye } from 'lucide-react';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useNavigate } from 'react-router';
import { equipmentApi } from '../../utils/api';

interface Device {
  id: string;
  type: string;
  details: string;
}

interface Software {
  id: string;
  name: string;
  version: string;
}

interface AssignmentHistory {
  id: string;
  userName: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: string;
  assignedUser: string;
  serialNumber: string;
  purchaseDate: string;
  location: string;
  devices: Device[];
  osName: string;
  osVersion: string;
  installedSoftware: Software[];
  ram: string;
  processor: string;
  motherboard: string;
  assignmentHistory: AssignmentHistory[];
}

const deviceTypes = [
  'Mouse',
  'Keyboard',
  'Monitor',
  'Headset',
  'Webcam',
  'Docking Station',
  'USB Hub',
  'External Drive',
  'Speaker',
  'Printer',
];

export function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'Active',
    assignedUser: '',
    serialNumber: '',
    purchaseDate: '',
    location: '',
    devices: [] as Device[],
    osName: '',
    osVersion: '',
    installedSoftware: [] as Software[],
    ram: '',
    processor: '',
    motherboard: '',
    assignmentHistory: [] as AssignmentHistory[],
  });

  const [validationError, setValidationError] = useState('');

  // Load equipment from backend on mount
  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    setLoading(true);
    const response = await equipmentApi.getAll();
    if (response.success && response.data) {
      setEquipment(response.data);
    } else {
      console.error('Failed to load equipment:', response.error);
    }
    setLoading(false);
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignedUser.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const types = ['All', ...Array.from(new Set(equipment.map((e) => e.type)))];

  const openAddModal = () => {
    setEditingEquipment(null);
    setFormData({
      name: '',
      type: '',
      status: 'Active',
      assignedUser: '',
      serialNumber: '',
      purchaseDate: '',
      location: '',
      devices: [],
      osName: '',
      osVersion: '',
      installedSoftware: [],
      ram: '',
      processor: '',
      motherboard: '',
      assignmentHistory: [],
    });
    setValidationError('');
    setSubmitError('');
    setShowModal(true);
  };

  const openEditModal = (item: Equipment) => {
    setEditingEquipment(item);
    setFormData({
      name: item.name,
      type: item.type,
      status: item.status,
      assignedUser: item.assignedUser,
      serialNumber: item.serialNumber,
      purchaseDate: item.purchaseDate,
      location: item.location,
      devices: item.devices,
      osName: item.osName,
      osVersion: item.osVersion,
      installedSoftware: item.installedSoftware,
      ram: item.ram,
      processor: item.processor,
      motherboard: item.motherboard,
      assignmentHistory: item.assignmentHistory,
    });
    setValidationError('');
    setSubmitError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one device
    if (formData.devices.length === 0) {
      setValidationError('At least one device is required.');
      return;
    }

    setValidationError('');
    setSubmitError('');

    if (editingEquipment) {
      // Update existing equipment
      const response = await equipmentApi.update(editingEquipment.id, formData);
      if (response.success && response.data) {
        setEquipment(
          equipment.map((item) =>
            item.id === editingEquipment.id ? response.data : item
          )
        );
        setShowModal(false);
      } else {
        setSubmitError(response.error || 'Failed to update equipment');
      }
    } else {
      // Add new equipment
      const response = await equipmentApi.create(formData);
      if (response.success && response.data) {
        setEquipment([...equipment, response.data]);
        setShowModal(false);
      } else {
        setSubmitError(response.error || 'Failed to create equipment');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const response = await equipmentApi.delete(id);
    if (response.success) {
      setEquipment(equipment.filter((item) => item.id !== id));
    } else {
      console.error('Failed to delete equipment:', response.error);
    }
    setDeleteConfirm(null);
  };

  const addDevice = () => {
    const newDevice: Device = {
      id: `D-${Date.now()}-${formData.devices.length}`,
      type: '',
      details: '',
    };
    setFormData({
      ...formData,
      devices: [...formData.devices, newDevice],
    });
    setValidationError('');
  };

  const removeDevice = (deviceId: string) => {
    setFormData({
      ...formData,
      devices: formData.devices.filter((d) => d.id !== deviceId),
    });
  };

  const updateDevice = (deviceId: string, field: 'type' | 'details', value: string) => {
    setFormData({
      ...formData,
      devices: formData.devices.map((d) =>
        d.id === deviceId ? { ...d, [field]: value } : d
      ),
    });
  };

  const addSoftware = () => {
    const newSoftware: Software = {
      id: `S-${Date.now()}-${formData.installedSoftware.length}`,
      name: '',
      version: '',
    };
    setFormData({
      ...formData,
      installedSoftware: [...formData.installedSoftware, newSoftware],
    });
  };

  const removeSoftware = (softwareId: string) => {
    setFormData({
      ...formData,
      installedSoftware: formData.installedSoftware.filter((s) => s.id !== softwareId),
    });
  };

  const updateSoftware = (softwareId: string, field: 'name' | 'version', value: string) => {
    setFormData({
      ...formData,
      installedSoftware: formData.installedSoftware.map((s) =>
        s.id === softwareId ? { ...s, [field]: value } : s
      ),
    });
  };

  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Equipment Management</h1>
        <p className="text-gray-600">Manage and track all IT equipment</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Assigned User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Peripherals</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEquipment.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.location}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        item.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'Maintenance'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.assignedUser}</td>
                  <td className="py-3 px-4">
                    {item.devices.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.devices.map((d) => (
                          <span
                            key={d.id}
                            className="inline-flex px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700"
                          >
                            {d.type}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/equipment/${item.id}`)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredEquipment.length)} of{' '}
              {filteredEquipment.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
        title={editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Dell Latitude 5520"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option>Laptop</option>
                  <option>Desktop</option>
                  <option>Server</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Active</option>
                  <option>Maintenance</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned User *
                </label>
                <input
                  type="text"
                  required
                  value={formData.assignedUser}
                  onChange={(e) => setFormData({ ...formData, assignedUser: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., SN123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date *
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, purchaseDate: new Date().toISOString().split('T')[0] })}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Today
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Building A, Floor 2"
                />
              </div>
            </div>

            {/* Configuration Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🔹 Configuration (Hardware) - Optional</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RAM
                  </label>
                  <input
                    type="text"
                    value={formData.ram}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 16GB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processor (CPU)
                  </label>
                  <input
                    type="text"
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Intel Core i7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motherboard Model
                  </label>
                  <input
                    type="text"
                    value={formData.motherboard}
                    onChange={(e) => setFormData({ ...formData, motherboard: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ASUS ROG"
                  />
                </div>
              </div>
            </div>

            {/* Operating System Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🔹 Operating System - Optional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OS Name
                  </label>
                  <select
                    value={formData.osName}
                    onChange={(e) => setFormData({ ...formData, osName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select OS</option>
                    <option>Windows</option>
                    <option>Linux</option>
                    <option>macOS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OS Version
                  </label>
                  <input
                    type="text"
                    value={formData.osVersion}
                    onChange={(e) => setFormData({ ...formData, osVersion: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10, 11, Big Sur"
                  />
                </div>
              </div>
            </div>

            {/* Devices Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Devices / Périphériques *
                </label>
                <button
                  type="button"
                  onClick={addDevice}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Device
                </button>
              </div>

              {/* Validation Error */}
              {validationError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{validationError}</p>
                </div>
              )}

              {/* Device List */}
              <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                {formData.devices.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No devices added yet</p>
                    <p className="text-xs mt-1">Click "+ Add Device" to add at least one device</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.devices.map((device, index) => (
                      <div
                        key={device.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Device Type *
                            </label>
                            <select
                              value={device.type}
                              onChange={(e) => updateDevice(device.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select Type</option>
                              {deviceTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Details (optional)
                            </label>
                            <input
                              type="text"
                              value={device.details}
                              onChange={(e) => updateDevice(device.id, 'details', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Logitech M100"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDevice(device.id)}
                          className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove device"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Installed Software Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">🔹 Installed Software</h3>
                <button
                  type="button"
                  onClick={addSoftware}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Software
                </button>
              </div>

              {/* Software List */}
              <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                {formData.installedSoftware.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No software added yet</p>
                    <p className="text-xs mt-1">Click "+ Add Software" to add software</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.installedSoftware.map((software) => (
                      <div
                        key={software.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Software Name
                            </label>
                            <input
                              type="text"
                              value={software.name}
                              onChange={(e) => updateSoftware(software.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Microsoft Office"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Version
                            </label>
                            <input
                              type="text"
                              value={software.version}
                              onChange={(e) => updateSoftware(software.id, 'version', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., 2021"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSoftware(software.id)}
                          className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove software"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
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
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Equipment"
        message="Are you sure you want to delete this equipment? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}
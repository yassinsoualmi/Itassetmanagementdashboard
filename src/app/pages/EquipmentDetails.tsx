import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Edit2, Cpu, HardDrive, Monitor, Package, Calendar, User, FileText } from 'lucide-react';
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

export function EquipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipment();
  }, [id]);

  const loadEquipment = async () => {
    if (!id) return;

    setLoading(true);
    const response = await equipmentApi.getById(id);
    if (response.success && response.data) {
      setEquipment(response.data);
    } else {
      console.error('Failed to load equipment:', response.error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Equipment not found</p>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/equipment')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Equipment
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Equipment Details</h1>
            <p className="text-gray-600">{equipment.name} - {equipment.id}</p>
          </div>
          <button
            onClick={() => navigate('/equipment')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Equipment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            🔹 General Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Equipment ID</p>
              <p className="text-sm font-medium text-gray-900">{equipment.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-sm font-medium text-gray-900">{equipment.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Type</p>
              <p className="text-sm font-medium text-gray-900">{equipment.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  equipment.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : equipment.status === 'Maintenance'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {equipment.status}
              </span>
            </div>
          </div>
        </div>

        {/* Configuration (Hardware) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            🔹 Configuration (Hardware)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">RAM</p>
              <p className="text-sm font-medium text-gray-900">{equipment.ram}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Processor (CPU)</p>
              <p className="text-sm font-medium text-gray-900">{equipment.processor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Motherboard Model</p>
              <p className="text-sm font-medium text-gray-900">{equipment.motherboard}</p>
            </div>
          </div>
        </div>

        {/* Operating System */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-600" />
            🔹 Operating System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">OS Name</p>
              <p className="text-sm font-medium text-gray-900">{equipment.osName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">OS Version</p>
              <p className="text-sm font-medium text-gray-900">{equipment.osVersion}</p>
            </div>
          </div>
        </div>

        {/* Devices (Périphériques) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            🔹 Devices (Périphériques)
          </h2>
          {equipment.devices.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {equipment.devices.map((device) => (
                <div
                  key={device.id}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-sm font-medium text-blue-900">{device.type}</p>
                  {device.details && (
                    <p className="text-xs text-blue-700">{device.details}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No devices attached</p>
          )}
        </div>

        {/* Installed Software */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            🔹 Installed Software
          </h2>
          {equipment.installedSoftware.length > 0 ? (
            <div className="space-y-3">
              {equipment.installedSoftware.map((software) => (
                <div
                  key={software.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{software.name}</p>
                    <p className="text-xs text-gray-600">Version: {software.version}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No software installed</p>
          )}
        </div>

        {/* Assignment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            🔹 Assignment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Assigned User</p>
              <p className="text-sm font-medium text-gray-900">{equipment.assignedUser}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {equipment.status}
              </span>
            </div>
          </div>

          {/* Assignment History */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              📜 Assignment History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Start Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">End Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.assignmentHistory.map((history) => (
                    <tr key={history.id} className="border-t border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">{history.userName}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{history.startDate}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{history.endDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            history.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {history.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface Peripheral {
  id: string;
  name: string;
}

const mockPeripherals: Peripheral[] = [
  { id: 'P-001', name: 'Mouse' },
  { id: 'P-002', name: 'Keyboard' },
  { id: 'P-003', name: 'Monitor' },
  { id: 'P-004', name: 'Headset' },
  { id: 'P-005', name: 'Webcam' },
  { id: 'P-006', name: 'Docking Station' },
  { id: 'P-007', name: 'USB Hub' },
  { id: 'P-008', name: 'External Drive' },
];

export function PeripheralManagement() {
  const [peripherals, setPeripherals] = useState<Peripheral[]>(mockPeripherals);
  const [showModal, setShowModal] = useState(false);
  const [editingPeripheral, setEditingPeripheral] = useState<Peripheral | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [peripheralName, setPeripheralName] = useState('');

  const openAddModal = () => {
    setEditingPeripheral(null);
    setPeripheralName('');
    setShowModal(true);
  };

  const openEditModal = (peripheral: Peripheral) => {
    setEditingPeripheral(peripheral);
    setPeripheralName(peripheral.name);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPeripheral) {
      // Update existing peripheral
      setPeripherals(
        peripherals.map((item) =>
          item.id === editingPeripheral.id ? { ...item, name: peripheralName } : item
        )
      );
    } else {
      // Add new peripheral
      const newId = `P-${String(peripherals.length + 1).padStart(3, '0')}`;
      const newPeripheral: Peripheral = {
        id: newId,
        name: peripheralName,
      };
      setPeripherals([...peripherals, newPeripheral]);
    }

    setShowModal(false);
    setPeripheralName('');
  };

  const handleDelete = (id: string) => {
    setPeripherals(peripherals.filter((item) => item.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Manage Peripheral Types
        </h1>
        <p className="text-gray-600">
          Configure available peripheral types for equipment assignment
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Total Peripheral Types: <span className="font-semibold text-gray-900">{peripherals.length}</span>
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Peripheral Type
          </button>
        </div>
      </div>

      {/* Peripherals Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Peripheral Name
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {peripherals.map((peripheral) => (
                <tr key={peripheral.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{peripheral.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{peripheral.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(peripheral)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(peripheral.id)}
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
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPeripheral ? 'Edit Peripheral Type' : 'Add New Peripheral Type'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peripheral Name *
              </label>
              <input
                type="text"
                required
                value={peripheralName}
                onChange={(e) => setPeripheralName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Wireless Mouse"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingPeripheral ? 'Update Peripheral' : 'Add Peripheral'}
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
        title="Delete Peripheral Type"
        message="Are you sure you want to delete this peripheral type? This may affect equipment assignments."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

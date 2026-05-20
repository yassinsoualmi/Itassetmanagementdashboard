import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InventoryItem {
  id: string;
  category: string;
  totalStock: number;
  inUse: number;
  available: number;
  lowStock: boolean;
}

const inventoryData: InventoryItem[] = [
  { id: '1', category: 'Laptops', totalStock: 120, inUse: 98, available: 22, lowStock: false },
  { id: '2', category: 'Desktops', totalStock: 80, inUse: 65, available: 15, lowStock: false },
  { id: '3', category: 'Monitors', totalStock: 250, inUse: 210, available: 40, lowStock: false },
  { id: '4', category: 'Keyboards', totalStock: 180, inUse: 165, available: 15, lowStock: false },
  { id: '5', category: 'Mice', totalStock: 190, inUse: 170, available: 20, lowStock: false },
  { id: '6', category: 'Printers', totalStock: 50, inUse: 45, available: 5, lowStock: true },
  { id: '7', category: 'Servers', totalStock: 15, inUse: 12, available: 3, lowStock: true },
  { id: '8', category: 'Network Equipment', totalStock: 60, inUse: 55, available: 5, lowStock: true },
];

const chartData = inventoryData.map(item => ({
  category: item.category,
  'In Use': item.inUse,
  'Available': item.available,
}));

const recentMovements = [
  { id: 'MOV-001', item: 'Dell Latitude 5520', type: 'Check Out', user: 'John Doe', date: '2026-03-11', time: '10:30' },
  { id: 'MOV-002', item: 'HP Monitor 24"', type: 'Check In', user: 'Jane Smith', date: '2026-03-11', time: '09:15' },
  { id: 'MOV-003', item: 'Logitech Keyboard', type: 'Check Out', user: 'Mike Johnson', date: '2026-03-10', time: '14:20' },
  { id: 'MOV-004', item: 'MacBook Pro 14', type: 'Check In', user: 'Sarah Wilson', date: '2026-03-10', time: '11:45' },
];

export function Inventory() {
  const totalStock = inventoryData.reduce((sum, item) => sum + item.totalStock, 0);
  const totalInUse = inventoryData.reduce((sum, item) => sum + item.inUse, 0);
  const totalAvailable = inventoryData.reduce((sum, item) => sum + item.available, 0);
  const lowStockItems = inventoryData.filter(item => item.lowStock).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Inventory</h1>
        <p className="text-gray-600">Equipment stock overview and tracking</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Stock</p>
              <p className="text-3xl font-semibold text-gray-900">{totalStock}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Use</p>
              <p className="text-3xl font-semibold text-gray-900">{totalInUse}</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                {((totalInUse / totalStock) * 100).toFixed(0)}% utilization
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available</p>
              <p className="text-3xl font-semibold text-gray-900">{totalAvailable}</p>
              <p className="text-sm text-gray-500 mt-1">Ready for assignment</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <p className="text-3xl font-semibold text-red-600">{lowStockItems}</p>
              <p className="text-sm text-red-600 mt-1">Needs attention</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid key="grid-inventory-1" strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis key="xaxis-inventory-1" dataKey="category" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis key="yaxis-inventory-1" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip
              key="tooltip-inventory-1"
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="In Use" fill="#3b82f6" radius={[8, 8, 0, 0]} name="In Use" id="bar-in-use" />
            <Bar dataKey="Available" fill="#10b981" radius={[8, 8, 0, 0]} name="Available" id="bar-available" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Stock Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total Stock</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">In Use</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Available</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.totalStock}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.inUse}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.available}</td>
                  <td className="py-3 px-4">
                    {item.lowStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Healthy
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Item</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.map((movement) => (
                <tr key={movement.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{movement.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{movement.item}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        movement.type === 'Check Out'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {movement.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{movement.user}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{movement.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{movement.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
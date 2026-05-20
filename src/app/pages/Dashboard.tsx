import { useState, useEffect } from 'react';
import { Monitor, Package, Users, Wrench, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { equipmentApi, usersApi, interventionsApi } from '../../utils/api';

export function Dashboard() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const [equipmentRes, usersRes, interventionsRes] = await Promise.all([
      equipmentApi.getAll(),
      usersApi.getAll(),
      interventionsApi.getAll(),
    ]);

    if (equipmentRes.success && equipmentRes.data) {
      setEquipment(equipmentRes.data);
    }
    if (usersRes.success && usersRes.data) {
      setUsers(usersRes.data);
    }
    if (interventionsRes.success && interventionsRes.data) {
      setInterventions(interventionsRes.data);
    }
    setLoading(false);
  };

  // Calculate equipment statistics
  const equipmentByType = equipment.reduce((acc: any, item: any) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const equipmentData = Object.entries(equipmentByType).map(([name, value]) => ({
    name,
    value,
  }));

  const equipmentByStatus = equipment.reduce((acc: any, item: any) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = [
    { name: 'Active', value: equipmentByStatus['Active'] || 0, color: '#10b981' },
    { name: 'Maintenance', value: equipmentByStatus['Maintenance'] || 0, color: '#f59e0b' },
    { name: 'Inactive', value: equipmentByStatus['Inactive'] || 0, color: '#ef4444' },
  ];

  // Calculate inventory chart data (simplified - based on equipment type)
  const inventoryChartData = equipmentData.map(item => ({
    category: item.name,
    'Total': item.value,
  }));

  // Calculate stock details by type
  const stockDetails = Object.entries(equipmentByType).map(([type, total]) => {
    const typeEquipment = equipment.filter((e: any) => e.type === type);
    const inUse = typeEquipment.filter((e: any) => e.status === 'Active').length;
    const available = typeEquipment.filter((e: any) => e.status === 'Inactive').length;
    const lowStock = total < 5;

    return {
      id: type,
      category: type,
      totalStock: total,
      inUse,
      available,
      lowStock,
    };
  });

  // Get recent incidents (interventions)
  const recentIncidents = interventions
    .filter((i: any) => i.type === 'Incident')
    .sort((a: any, b: any) => {
      const dateA = new Date(b.createdAt || b.interventionDate).getTime();
      const dateB = new Date(a.createdAt || a.interventionDate).getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  // Stats
  const totalStock = equipment.length;
  const totalInUse = equipment.filter((e: any) => e.status === 'Active').length;
  const totalAvailable = equipment.filter((e: any) => e.status === 'Inactive').length;
  const maintenanceCount = equipment.filter((e: any) => e.status === 'Maintenance').length;
  const totalUsers = users.length;
  const totalComputers = equipment.filter((e: any) => e.type === 'Laptop' || e.type === 'Desktop').length;
  const openIncidents = interventions.filter((i: any) => i.status === 'Open' || i.status === 'In Progress').length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of equipment, inventory, and system activity</p>
      </div>

      {/* Unified Stats Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Stock */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Stock</p>
                <p className="text-3xl font-semibold text-gray-900">{totalStock}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  8% from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* In Use */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Use</p>
                <p className="text-3xl font-semibold text-gray-900">{totalInUse}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  {totalStock > 0 ? ((totalInUse / totalStock) * 100).toFixed(0) : 0}% utilization
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available</p>
                <p className="text-3xl font-semibold text-gray-900">{totalAvailable}</p>
                <p className="text-sm text-gray-500 mt-1">Ready for assignment</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Maintenance</p>
                <p className="text-3xl font-semibold text-gray-900">{maintenanceCount}</p>
                <p className="text-sm text-orange-600 mt-1">Equipment in maintenance</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Users</p>
                <p className="text-3xl font-semibold text-gray-900">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Total Computers */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Computers</p>
                <p className="text-3xl font-semibold text-gray-900">{totalComputers}</p>
                <p className="text-sm text-gray-500 mt-1">Laptops & Desktops</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          {/* Incidents */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Incidents</p>
                <p className="text-3xl font-semibold text-gray-900">{openIncidents}</p>
                <p className="text-sm text-gray-500 mt-1">Open/In Progress</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={equipmentData}>
              <CartesianGrid key="grid-eq-dist" strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis key="xaxis-eq-dist" dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis key="yaxis-eq-dist" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                key="tooltip-eq-dist"
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar key="bar-eq-dist" dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Equipment" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Status</h2>
          {statusData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  key="pie-eq-status"
                  data={statusData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '14px', fontWeight: '500' }}
                >
                  {statusData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip-eq-status" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No equipment data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Utilization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryChartData.slice(0, 5)}>
              <CartesianGrid key="grid-stock-util" strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis key="xaxis-stock-util" dataKey="category" tick={{ fill: '#6b7280', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis key="yaxis-stock-util" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                key="tooltip-stock-util"
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar key="bar-in-use" dataKey="In Use" fill="#3b82f6" radius={[8, 8, 0, 0]} name="In Use" />
              <Bar key="bar-available" dataKey="Available" fill="#10b981" radius={[8, 8, 0, 0]} name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Details Table */}
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
              {stockDetails.length > 0 ? (
                stockDetails.map((item) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                    No equipment data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Incidents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Equipment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Technician</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentIncidents.length > 0 ? (
                  recentIncidents.map((incident) => (
                    <tr key={incident.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{incident.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{incident.equipment}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{incident.description || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{incident.assignedTechnician || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          incident.status === 'Open'
                            ? 'bg-red-100 text-red-700'
                            : incident.status === 'In Progress'
                            ? 'bg-orange-100 text-orange-700'
                            : incident.status === 'Resolved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {incident.interventionDate}
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      No recent incidents
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
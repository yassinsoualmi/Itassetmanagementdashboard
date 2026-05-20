import { useState } from 'react';
import { FileText, Download, Calendar, CheckCircle } from 'lucide-react';

interface ReportTemplate {
  name: string;
  category: string;
  description: string;
  type: 'equipment' | 'maintenance' | 'incidents' | 'users';
}

const reportTemplates: ReportTemplate[] = [
  { name: 'Equipment Inventory', category: 'Inventory', description: 'Generate current equipment inventory snapshot', type: 'equipment' },
  { name: 'Maintenance Summary', category: 'Maintenance', description: 'Summary of maintenance activities', type: 'maintenance' },
  { name: 'Incident Report', category: 'Incidents', description: 'Detailed incident analysis and trends', type: 'incidents' },
  { name: 'User Activity', category: 'Users', description: 'User activity and equipment usage report', type: 'users' },
];

export function Reports() {
  const [selectedType, setSelectedType] = useState('Equipment Inventory');
  const [selectedFormat, setSelectedFormat] = useState('CSV');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateEquipmentReport = () => {
    const headers = ['ID', 'Name', 'Type', 'Status', 'Assigned User', 'Serial Number', 'Purchase Date', 'Location'];
    const sampleData = [
      ['EQ-001', 'Dell Latitude 5520', 'Laptop', 'Active', 'John Doe', 'SN123456', '2025-01-15', 'Location 1'],
      ['EQ-002', 'HP ProDesk 600', 'Desktop', 'Active', 'Jane Smith', 'SN123457', '2025-02-20', 'Location 2'],
      ['EQ-003', 'MacBook Pro 14', 'Laptop', 'Maintenance', 'Sarah Wilson', 'SN123459', '2024-11-10', 'Location 4'],
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  const generateMaintenanceReport = () => {
    const headers = ['ID', 'Equipment', 'Type', 'Date', 'Status', 'Technician', 'Description'];
    const sampleData = [
      ['M-001', 'Dell Latitude 5520', 'Preventive', '2026-03-01', 'Completed', 'Tech A', 'Regular maintenance'],
      ['M-002', 'HP ProDesk 600', 'Repair', '2026-03-05', 'In Progress', 'Tech B', 'Hardware issue'],
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  const generateIncidentReport = () => {
    const headers = ['ID', 'Title', 'Priority', 'Status', 'Department', 'Location', 'Created Date', 'Resolved Date'];
    const sampleData = [
      ['INC-001', 'Network Issue', 'High', 'Resolved', 'IT', 'Location 1', '2026-03-01', '2026-03-02'],
      ['INC-002', 'Printer Malfunction', 'Medium', 'In Progress', 'Admin', 'Location 2', '2026-03-05', ''],
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  const generateUserReport = () => {
    const headers = ['User ID', 'Name', 'Email', 'Department', 'Assigned Equipment', 'Equipment Type'];
    const sampleData = [
      ['USR-001', 'John Doe', 'john@company.com', 'IT', 'Dell Latitude 5520', 'Laptop'],
      ['USR-002', 'Jane Smith', 'jane@company.com', 'Finance', 'HP ProDesk 600', 'Desktop'],
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  const handleGenerateTemplate = (template: ReportTemplate) => {
    setGenerating(true);
    setSuccessMessage('');

    setTimeout(() => {
      let csvData = '';
      let filename = '';

      switch (template.type) {
        case 'equipment':
          csvData = generateEquipmentReport();
          filename = `Equipment_Inventory_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'maintenance':
          csvData = generateMaintenanceReport();
          filename = `Maintenance_Summary_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'incidents':
          csvData = generateIncidentReport();
          filename = `Incident_Report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'users':
          csvData = generateUserReport();
          filename = `User_Activity_${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }

      downloadCSV(csvData, filename);
      setGenerating(false);
      setSuccessMessage(`${template.name} downloaded successfully!`);

      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  const handleGenerateCustom = () => {
    setGenerating(true);
    setSuccessMessage('');

    setTimeout(() => {
      let csvData = '';
      let filename = '';

      if (selectedType === 'Equipment Inventory') {
        csvData = generateEquipmentReport();
        filename = `Equipment_Custom_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (selectedType === 'Maintenance Summary') {
        csvData = generateMaintenanceReport();
        filename = `Maintenance_Custom_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (selectedType === 'Incident Analysis') {
        csvData = generateIncidentReport();
        filename = `Incident_Custom_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (selectedType === 'User Activity') {
        csvData = generateUserReport();
        filename = `User_Custom_${new Date().toISOString().split('T')[0]}.csv`;
      }

      downloadCSV(csvData, filename);
      setGenerating(false);
      setSuccessMessage('Custom report downloaded successfully!');

      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Generate and download system reports in CSV format</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Report Templates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((template, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
                  <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 mt-1">
                    {template.category}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">{template.description}</p>
              <button
                onClick={() => handleGenerateTemplate(template)}
                disabled={generating}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {generating ? 'Generating...' : 'Download CSV'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Report Generator */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Custom Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Equipment Inventory</option>
              <option>Maintenance Summary</option>
              <option>Incident Analysis</option>
              <option>User Activity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>CSV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date From (Optional)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date To (Optional)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleGenerateCustom}
          disabled={generating}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {generating ? 'Generating...' : 'Generate Custom Report'}
        </button>
      </div>
    </div>
  );
}

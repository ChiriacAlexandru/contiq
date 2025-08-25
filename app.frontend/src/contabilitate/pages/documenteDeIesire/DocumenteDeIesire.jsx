import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  Filter,
  Download,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";

const DocumenteIesire = () => {
  const [facturi, setFacturi] = useState([
    {
      id: 1,
      numar: "FDS003/2025",
      tip: "Factură",
      client: "SC Tech Solutions SRL",
      data: "2025-08-24",
      total: 2500.0,
      tva: 475.0,
      status: "emisă",
    },
    {
      id: 2,
      numar: "FDS002/2025",
      tip: "Factură",
      client: "ABC Marketing SRL",
      data: "2025-08-20",
      total: 1850.0,
      tva: 351.5,
      status: "trimisă",
    },
    {
      id: 3,
      numar: "FDS001/2025",
      tip: "Proformă",
      client: "Digital Agency SRL",
      data: "2025-08-15",
      total: 3200.0,
      tva: 608.0,
      status: "plătită",
    },
    {
      id: 4,
      numar: "PF012/2025",
      tip: "Proformă",
      client: "Web Design Studio SRL",
      data: "2025-08-10",
      total: 1500.0,
      tva: 285.0,
      status: "anulată",
    },
    {
      id: 5,
      numar: "FDS004/2025",
      tip: "Factură",
      client: "Consulting Group SRL",
      data: "2025-08-05",
      total: 4500.0,
      tva: 855.0,
      status: "plătită",
    },
  ]);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedFacturi, setSelectedFacturi] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toate");
  const [filterTip, setFilterTip] = useState("toate");

  const getStatusColor = (status) => {
    switch (status) {
      case "emisă":
        return "bg-blue-100 text-blue-700";
      case "trimisă":
        return "bg-yellow-100 text-white";
      case "plătită":
        return "bg-green-100 text-green-700";
      case "anulată":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "emisă":
        return "bg-blue-500";
      case "trimisă":
        return "bg-yellow-500";
      case "plătită":
        return "bg-green-500";
      case "anulată":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const toggleSelectAll = () => {
    if (selectedFacturi.length === facturi.length) {
      setSelectedFacturi([]);
    } else {
      setSelectedFacturi(facturi.map((f) => f.id));
    }
  };

  const toggleSelectFactura = (id) => {
    if (selectedFacturi.includes(id)) {
      setSelectedFacturi(selectedFacturi.filter((fId) => fId !== id));
    } else {
      setSelectedFacturi([...selectedFacturi, id]);
    }
  };

  const filteredFacturi = facturi.filter((factura) => {
    const matchesSearch =
      factura.numar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "toate" || factura.status === filterStatus;
    const matchesTip =
      filterTip === "toate" || factura.tip.toLowerCase() === filterTip;
    return matchesSearch && matchesStatus && matchesTip;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Documente de Ieșire
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestionează facturile și documentele emise
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              Adaugă Factură
            </button>
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <Filter className="w-5 h-5 mr-2" />
              Căutare Avansată
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
              <RefreshCw className="w-5 h-5 mr-2" />
              Actualizare
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Caută după număr factură sau client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Tip Document
                  </label>
                  <select
                    value={filterTip}
                    onChange={(e) => setFilterTip(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="toate">Toate</option>
                    <option value="factură">Factură</option>
                    <option value="proformă">Proformă</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="toate">Toate</option>
                    <option value="emisă">Emisă</option>
                    <option value="trimisă">Trimisă</option>
                    <option value="plătită">Plătită</option>
                    <option value="anulată">Anulată</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Perioada
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setFilterStatus("toate");
                    setFilterTip("toate");
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Resetează
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Aplică Filtre
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Facturi</p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {facturi.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valoare Totală</p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {facturi
                    .reduce((sum, f) => sum + f.total, 0)
                    .toLocaleString("ro-RO")}{" "}
                  RON
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">În Așteptare</p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {
                    facturi.filter(
                      (f) => f.status === "emisă" || f.status === "trimisă"
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plătite</p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {facturi.filter((f) => f.status === "plătită").length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedFacturi.length === facturi.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Număr
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    TVA
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFacturi.map((factura) => (
                  <tr
                    key={factura.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedFacturi.includes(factura.id)}
                        onChange={() => toggleSelectFactura(factura.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {factura.numar}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                        {factura.tip}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 text-gray-900">
                        {factura.client}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(factura.data).toLocaleDateString("ro-RO")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {factura.total.toLocaleString("ro-RO")} RON
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {factura.tva.toLocaleString("ro-RO")} RON
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(
                            factura.status
                          )}`}
                        ></div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                            factura.status
                          )}`}
                        >
                          {factura.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-600 text-gray-500 mb-4 sm:mb-0">
                Afișare 1-{filteredFacturi.length} din {filteredFacturi.length}{" "}
                rezultate
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Anterior
                </button>
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Următor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFacturi.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
            <span className="text-sm text-gray-600">
              {selectedFacturi.length} selectate
            </span>
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Exportă
            </button>
            <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
              Șterge
            </button>
            <button
              onClick={() => setSelectedFacturi([])}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumenteIesire;

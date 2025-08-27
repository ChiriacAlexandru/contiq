import React, { useState, useEffect } from "react";
import {
  Truck,
  Plus,
  Search,
  RefreshCw,
  Filter,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  X,
  Building,
  Mail,
  Phone,
  MapPin,
  Hash,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Grid3X3,
  List,
  Calendar,
  Activity,
  ExternalLink,
  CreditCard,
  DollarSign
} from "lucide-react";
import { SuppliersService } from "../../../../config/api";

const GestiuneFurnizori = () => {
  // State management
  const [furnizori, setFurnizori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFurnizori, setSelectedFurnizori] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Form data
  const [formData, setFormData] = useState({
    nume: "",
    cod: "",
    cui: "",
    adresa: "",
    oras: "",
    judet: "",
    cod_postal: "",
    telefon: "",
    email: "",
    website: "",
    reprezentant_nume: "",
    reprezentant_telefon: "",
    reprezentant_email: "",
    conturi_bancare: "",
    termeni_plata: "",
    zile_plata: "",
    rating: "",
    observatii: ""
  });

  // Load data
  useEffect(() => {
    loadFurnizori();
  }, []);

  const loadFurnizori = async () => {
    try {
      setLoading(true);
      const data = await SuppliersService.getSuppliers();
      setFurnizori(data?.suppliers || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadFurnizori();
  };

  // Filter suppliers
  const filteredFurnizori = furnizori.filter(supplier =>
    supplier.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.cod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.cui && supplier.cui.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (supplier = null) => {
    if (supplier) {
      setSelectedSupplier(supplier);
      setFormData({
        nume: supplier.nume || "",
        cod: supplier.cod || "",
        cui: supplier.cui || "",
        adresa: supplier.adresa || "",
        oras: supplier.oras || "",
        judet: supplier.judet || "",
        cod_postal: supplier.cod_postal || "",
        telefon: supplier.telefon || "",
        email: supplier.email || "",
        website: supplier.website || "",
        reprezentant_nume: supplier.reprezentant_nume || "",
        reprezentant_telefon: supplier.reprezentant_telefon || "",
        reprezentant_email: supplier.reprezentant_email || "",
        conturi_bancare: supplier.conturi_bancare || "",
        termeni_plata: supplier.termeni_plata || "",
        zile_plata: supplier.zile_plata || "",
        rating: supplier.rating || "",
        observatii: supplier.observatii || ""
      });
    } else {
      setSelectedSupplier(null);
      setFormData({
        nume: "",
        cod: "",
        cui: "",
        adresa: "",
        oras: "",
        judet: "",
        cod_postal: "",
        telefon: "",
        email: "",
        website: "",
        reprezentant_nume: "",
        reprezentant_telefon: "",
        reprezentant_email: "",
        conturi_bancare: "",
        termeni_plata: "",
        zile_plata: "",
        rating: "",
        observatii: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
    setFormData({});
  };

  const handleFormChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSupplier = async () => {
    try {
      setIsModalLoading(true);
      
      if (selectedSupplier) {
        await SuppliersService.updateSupplier(selectedSupplier.id, formData);
      } else {
        await SuppliersService.createSupplier(formData);
      }
      
      await loadFurnizori();
      closeModal();
      
    } catch (error) {
      console.error('Error saving supplier:', error);
      setError(error.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  const deleteSupplier = async (supplierId) => {
    if (!window.confirm('Sigur doriți să ștergeți acest furnizor?')) {
      return;
    }
    
    try {
      await SuppliersService.deleteSupplier(supplierId);
      await loadFurnizori();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setError(error.message);
    }
  };

  const toggleSelectAll = () => {
    if (selectedFurnizori.length === filteredFurnizori.length) {
      setSelectedFurnizori([]);
    } else {
      setSelectedFurnizori(filteredFurnizori.map(supplier => supplier.id));
    }
  };

  const toggleSelectSupplier = (id) => {
    if (selectedFurnizori.includes(id)) {
      setSelectedFurnizori(selectedFurnizori.filter(supplierId => supplierId !== id));
    } else {
      setSelectedFurnizori([...selectedFurnizori, id]);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingBg = (rating) => {
    if (rating >= 4.5) return "bg-green-100";
    if (rating >= 3.5) return "bg-yellow-100";
    if (rating >= 2.5) return "bg-orange-100";
    return "bg-red-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Se încarcă furnizorii...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Gestiune Furnizori
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează furnizorii și partenerii de afaceri
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adaugă Furnizor
            </button>
            <div className="inline-flex rounded-xl border border-gray-200 bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-l-xl transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-r-xl transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Actualizare
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Caută după nume, cod, CUI sau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Furnizori</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {furnizori.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Truck className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {furnizori.filter(supplier => supplier.activ).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating Mediu</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {furnizori.length > 0 ? (
                    (furnizori.reduce((sum, s) => sum + (parseFloat(s.rating) || 0), 0) / furnizori.filter(s => s.rating).length || 0).toFixed(1)
                  ) : "0.0"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cu CUI</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {furnizori.filter(supplier => supplier.cui).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Hash className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFurnizori.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {supplier.cod}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedFurnizori.includes(supplier.id)}
                      onChange={() => toggleSelectSupplier(supplier.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {supplier.nume}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {supplier.cui || "CUI lipsește"}
                  </p>

                  <div className="space-y-3 mb-4">
                    {supplier.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 truncate">
                          {supplier.email}
                        </span>
                      </div>
                    )}
                    {supplier.telefon && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {supplier.telefon}
                        </span>
                      </div>
                    )}
                    {(supplier.oras || supplier.judet) && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 truncate">
                          {[supplier.oras, supplier.judet].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {supplier.rating && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getRatingBg(supplier.rating)} ${getRatingColor(supplier.rating)}`}>
                          {parseFloat(supplier.rating).toFixed(1)} ⭐
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        supplier.activ 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {supplier.activ ? "Activ" : "Inactiv"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => openModal(supplier)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => openModal(supplier)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteSupplier(supplier.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedFurnizori.length === filteredFurnizori.length && filteredFurnizori.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Furnizor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Locație
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFurnizori.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedFurnizori.includes(supplier.id)}
                          onChange={() => toggleSelectSupplier(supplier.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                            <Truck className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {supplier.nume}
                            </div>
                            <div className="text-sm text-gray-500">
                              {supplier.cod} • {supplier.cui || "Fără CUI"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {supplier.email && (
                            <div className="text-sm text-gray-900">
                              {supplier.email}
                            </div>
                          )}
                          {supplier.telefon && (
                            <div className="text-sm text-gray-500">
                              {supplier.telefon}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {[supplier.oras, supplier.judet].filter(Boolean).join(', ') || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.rating ? (
                          <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getRatingBg(supplier.rating)} ${getRatingColor(supplier.rating)}`}>
                            {parseFloat(supplier.rating).toFixed(1)} ⭐
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                          supplier.activ 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {supplier.activ ? "Activ" : "Inactiv"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openModal(supplier)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => openModal(supplier)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => deleteSupplier(supplier.id)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600" />
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
          </div>
        )}
      </div>

      {/* Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedSupplier ? "Editare Furnizor" : "Furnizor Nou"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nume Furnizor *
                    </label>
                    <input
                      type="text"
                      value={formData.nume}
                      onChange={(e) => handleFormChange('nume', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numele companiei"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cod Furnizor *
                    </label>
                    <input
                      type="text"
                      value={formData.cod}
                      onChange={(e) => handleFormChange('cod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Cod unic"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CUI
                    </label>
                    <input
                      type="text"
                      value={formData.cui}
                      onChange={(e) => handleFormChange('cui', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ROxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresa
                    </label>
                    <input
                      type="text"
                      value={formData.adresa}
                      onChange={(e) => handleFormChange('adresa', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Strada, numărul"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Oraș
                      </label>
                      <input
                        type="text"
                        value={formData.oras}
                        onChange={(e) => handleFormChange('oras', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Orașul"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Județ
                      </label>
                      <input
                        type="text"
                        value={formData.judet}
                        onChange={(e) => handleFormChange('judet', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Județul"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cod Poștal
                    </label>
                    <input
                      type="text"
                      value={formData.cod_postal}
                      onChange={(e) => handleFormChange('cod_postal', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formData.telefon}
                        onChange={(e) => handleFormChange('telefon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+40123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="contact@furnizor.ro"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleFormChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://furnizor.ro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reprezentant
                    </label>
                    <input
                      type="text"
                      value={formData.reprezentant_nume}
                      onChange={(e) => handleFormChange('reprezentant_nume', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numele reprezentantului"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon Reprezentant
                      </label>
                      <input
                        type="tel"
                        value={formData.reprezentant_telefon}
                        onChange={(e) => handleFormChange('reprezentant_telefon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+40123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Reprezentant
                      </label>
                      <input
                        type="email"
                        value={formData.reprezentant_email}
                        onChange={(e) => handleFormChange('reprezentant_email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="reprezentant@furnizor.ro"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Termeni Plată
                      </label>
                      <select
                        value={formData.termeni_plata}
                        onChange={(e) => handleFormChange('termeni_plata', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selectează</option>
                        <option value="cash">Cash</option>
                        <option value="transfer">Transfer bancar</option>
                        <option value="card">Card</option>
                        <option value="credit">Credit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zile Plată
                      </label>
                      <input
                        type="number"
                        value={formData.zile_plata}
                        onChange={(e) => handleFormChange('zile_plata', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleFormChange('rating', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="4.5"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conturi Bancare
                  </label>
                  <textarea
                    rows="2"
                    value={formData.conturi_bancare}
                    onChange={(e) => handleFormChange('conturi_bancare', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="IBAN-uri, unul pe linie"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observații
                  </label>
                  <textarea
                    rows="3"
                    value={formData.observatii}
                    onChange={(e) => handleFormChange('observatii', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Observații despre furnizor..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isModalLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button 
                onClick={saveSupplier}
                disabled={isModalLoading || !formData.nume || !formData.cod}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isModalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedSupplier ? "Actualizează" : "Adaugă Furnizor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedFurnizori.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedFurnizori.length} selectate
          </span>
          <button 
            onClick={() => setSelectedFurnizori([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GestiuneFurnizori;
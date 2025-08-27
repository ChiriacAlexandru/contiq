import React, { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Search,
  RefreshCw,
  Filter,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  X,
  Globe,
  Mail,
  Phone,
  Image,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Grid3X3,
  List,
  Calendar,
  Activity,
  ExternalLink
} from "lucide-react";
import { BrandsService } from "../../../../config/api";

const GestiuneBrand = () => {
  // State management
  const [branduri, setBranduri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranduri, setSelectedBranduri] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Form data
  const [formData, setFormData] = useState({
    nume: "",
    cod: "",
    descriere: "",
    website: "",
    contact_email: "",
    contact_telefon: "",
    logo_path: ""
  });

  // Load data
  useEffect(() => {
    loadBranduri();
  }, []);

  const loadBranduri = async () => {
    try {
      setLoading(true);
      const data = await BrandsService.getBrands();
      setBranduri(data || []);
    } catch (error) {
      console.error('Error loading brands:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadBranduri();
  };

  // Filter brands
  const filteredBranduri = branduri.filter(brand =>
    brand.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.cod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.descriere && brand.descriere.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (brand = null) => {
    if (brand) {
      setSelectedBrand(brand);
      setFormData({
        nume: brand.nume || "",
        cod: brand.cod || "",
        descriere: brand.descriere || "",
        website: brand.website || "",
        contact_email: brand.contact_email || "",
        contact_telefon: brand.contact_telefon || "",
        logo_path: brand.logo_path || ""
      });
    } else {
      setSelectedBrand(null);
      setFormData({
        nume: "",
        cod: "",
        descriere: "",
        website: "",
        contact_email: "",
        contact_telefon: "",
        logo_path: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBrand(null);
    setFormData({});
  };

  const handleFormChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveBrand = async () => {
    try {
      setIsModalLoading(true);
      
      if (selectedBrand) {
        await BrandsService.updateBrand(selectedBrand.id, formData);
      } else {
        await BrandsService.createBrand(formData);
      }
      
      await loadBranduri();
      closeModal();
      
    } catch (error) {
      console.error('Error saving brand:', error);
      setError(error.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  const deleteBrand = async (brandId) => {
    if (!window.confirm('Sigur doriți să ștergeți acest brand?')) {
      return;
    }
    
    try {
      await BrandsService.deleteBrand(brandId);
      await loadBranduri();
    } catch (error) {
      console.error('Error deleting brand:', error);
      setError(error.message);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBranduri.length === filteredBranduri.length) {
      setSelectedBranduri([]);
    } else {
      setSelectedBranduri(filteredBranduri.map(brand => brand.id));
    }
  };

  const toggleSelectBrand = (id) => {
    if (selectedBranduri.includes(id)) {
      setSelectedBranduri(selectedBranduri.filter(brandId => brandId !== id));
    } else {
      setSelectedBranduri([...selectedBranduri, id]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Se încarcă brand-urile...</p>
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
              Gestiune Brand-uri
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează mărcile și producătorii
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adaugă Brand
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
                placeholder="Caută după nume, cod sau descriere..."
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
                <p className="text-sm text-gray-600">Total Brand-uri</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {branduri.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cu Website</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {branduri.filter(brand => brand.website).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cu Contact</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {branduri.filter(brand => brand.contact_email || brand.contact_telefon).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {branduri.filter(brand => brand.activ).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBranduri.map((brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {brand.cod}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedBranduri.includes(brand.id)}
                      onChange={() => toggleSelectBrand(brand.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {brand.nume}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {brand.descriere || "Fără descriere"}
                  </p>

                  <div className="space-y-3 mb-4">
                    {brand.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        <a 
                          href={brand.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {brand.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    {brand.contact_email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 truncate">
                          {brand.contact_email}
                        </span>
                      </div>
                    )}
                    {brand.contact_telefon && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {brand.contact_telefon}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Produse:</span>
                      <span className="font-medium text-blue-600">
                        {brand.numar_produse || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        brand.activ 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {brand.activ ? "Activ" : "Inactiv"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => openModal(brand)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => openModal(brand)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteBrand(brand.id)}
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
                        checked={selectedBranduri.length === filteredBranduri.length && filteredBranduri.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Cod
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Produse
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
                  {filteredBranduri.map((brand) => (
                    <tr
                      key={brand.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedBranduri.includes(brand.id)}
                          onChange={() => toggleSelectBrand(brand.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mr-3">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {brand.nume}
                            </div>
                            <div className="text-sm text-gray-500">
                              {brand.descriere || "Fără descriere"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {brand.cod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {brand.contact_email && (
                            <div className="text-sm text-gray-900">
                              {brand.contact_email}
                            </div>
                          )}
                          {brand.contact_telefon && (
                            <div className="text-sm text-gray-500">
                              {brand.contact_telefon}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {brand.website ? (
                          <a 
                            href={brand.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:underline"
                          >
                            {brand.website.replace(/^https?:\/\//, '')}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">
                          {brand.numar_produse || 0} produse
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                          brand.activ 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {brand.activ ? "Activ" : "Inactiv"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openModal(brand)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => openModal(brand)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => deleteBrand(brand.id)}
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

      {/* Brand Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedBrand ? "Editare Brand" : "Brand Nou"}
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.nume}
                    onChange={(e) => handleFormChange('nume', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Numele brand-ului"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cod Brand *
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
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleFormChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Contact
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleFormChange('contact_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="contact@brand.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon Contact
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_telefon}
                      onChange={(e) => handleFormChange('contact_telefon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+40123456789"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.logo_path}
                    onChange={(e) => handleFormChange('logo_path', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descriere
                  </label>
                  <textarea
                    rows="3"
                    value={formData.descriere}
                    onChange={(e) => handleFormChange('descriere', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrierea brand-ului..."
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
                onClick={saveBrand}
                disabled={isModalLoading || !formData.nume || !formData.cod}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isModalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedBrand ? "Actualizează" : "Adaugă Brand"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedBranduri.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedBranduri.length} selectate
          </span>
          <button 
            onClick={() => setSelectedBranduri([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GestiuneBrand;
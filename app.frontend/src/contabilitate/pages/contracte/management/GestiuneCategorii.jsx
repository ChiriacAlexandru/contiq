import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  X,
  Hash,
  Loader2,
  Grid3X3,
  List,
  AlertTriangle,
  CheckCircle,
  Package
} from "lucide-react";
import { CategoriesService } from "../../../../config/api";

const GestiuneCategorii = () => {
  // State management
  const [categorii, setCategorii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategorii, setSelectedCategorii] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [parentCategories, setParentCategories] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    nume: "",
    cod: "",
    descriere: "",
    parinte_id: "",
    ordinea: "",
    activ: true
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, parentData] = await Promise.all([
        CategoriesService.getCategories(),
        CategoriesService.getParentCategories()
      ]);
      setCategorii(categoriesData || []);
      setParentCategories(parentData || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  // Filter categories
  const filteredCategorii = categorii.filter(category =>
    category.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.cod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.descriere && category.descriere.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        nume: category.nume || "",
        cod: category.cod || "",
        descriere: category.descriere || "",
        parinte_id: category.parinte_id || "",
        ordinea: category.ordinea || "",
        activ: category.activ !== undefined ? category.activ : true
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        nume: "",
        cod: "",
        descriere: "",
        parinte_id: "",
        ordinea: "",
        activ: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setFormData({});
  };

  const handleFormChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveCategory = async () => {
    try {
      setIsModalLoading(true);
      
      if (selectedCategory) {
        await CategoriesService.updateCategory(selectedCategory.id, formData);
      } else {
        await CategoriesService.createCategory(formData);
      }
      
      await loadData();
      closeModal();
      
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Sigur doriți să ștergeți această categorie?')) {
      return;
    }
    
    try {
      await CategoriesService.deleteCategory(categoryId);
      await loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(error.message);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCategorii.length === filteredCategorii.length) {
      setSelectedCategorii([]);
    } else {
      setSelectedCategorii(filteredCategorii.map(category => category.id));
    }
  };

  const toggleSelectCategory = (id) => {
    if (selectedCategorii.includes(id)) {
      setSelectedCategorii(selectedCategorii.filter(categoryId => categoryId !== id));
    } else {
      setSelectedCategorii([...selectedCategorii, id]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Se încarcă categoriile...</p>
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
              Gestiune Categorii
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează categoriile de produse
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adaugă Categorie
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
                <p className="text-sm text-gray-600">Total Categorii</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {categorii.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Tag className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {categorii.filter(category => category.activ).length}
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
                <p className="text-sm text-gray-600">Categorii Părinte</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {categorii.filter(category => !category.parinte_id).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Hash className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cu Produse</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {categorii.filter(category => category.numar_produse > 0).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategorii.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {category.cod}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCategorii.includes(category.id)}
                      onChange={() => toggleSelectCategory(category.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {category.nume}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {category.descriere || "Fără descriere"}
                  </p>

                  <div className="space-y-3 mb-4">
                    {category.parinte_nume && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Părinte:</span>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg">
                          {category.parinte_nume}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Produse:</span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                        {category.numar_produse || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        category.activ 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {category.activ ? "Activ" : "Inactiv"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => openModal(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => openModal(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteCategory(category.id)}
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
                        checked={selectedCategorii.length === filteredCategorii.length && filteredCategorii.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Categorie
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Descriere
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Părinte
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
                  {filteredCategorii.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCategorii.includes(category.id)}
                          onChange={() => toggleSelectCategory(category.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                            <Tag className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {category.nume}
                            </div>
                            <div className="text-sm text-gray-500">
                              {category.cod}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {category.descriere || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {category.parinte_nume ? (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg">
                              {category.parinte_nume}
                            </span>
                          ) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {category.numar_produse || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                          category.activ 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {category.activ ? "Activ" : "Inactiv"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openModal(category)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => openModal(category)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => deleteCategory(category.id)}
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

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCategory ? "Editare Categorie" : "Categorie Nouă"}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume Categorie *
                  </label>
                  <input
                    type="text"
                    value={formData.nume}
                    onChange={(e) => handleFormChange('nume', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Numele categoriei"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cod Categorie *
                  </label>
                  <input
                    type="text"
                    value={formData.cod}
                    onChange={(e) => handleFormChange('cod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cod unic"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descriere
                  </label>
                  <textarea
                    rows="3"
                    value={formData.descriere}
                    onChange={(e) => handleFormChange('descriere', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrierea categoriei..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie Părinte
                  </label>
                  <select
                    value={formData.parinte_id}
                    onChange={(e) => handleFormChange('parinte_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Fără părinte</option>
                    {parentCategories.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.nume}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordinea
                  </label>
                  <input
                    type="number"
                    value={formData.ordinea}
                    onChange={(e) => handleFormChange('ordinea', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.activ}
                      onChange={(e) => handleFormChange('activ', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Categoria este activă</span>
                  </label>
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
                onClick={saveCategory}
                disabled={isModalLoading || !formData.nume || !formData.cod}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isModalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedCategory ? "Actualizează" : "Adaugă Categoria"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedCategorii.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedCategorii.length} selectate
          </span>
          <button 
            onClick={() => setSelectedCategorii([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GestiuneCategorii;
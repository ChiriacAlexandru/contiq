import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  Filter,
  Download,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  X,
  Barcode,
  Tag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Archive,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Grid3X3,
  List,
  Calendar,
  Activity,
  Box,
  Layers,
  Loader2,
} from "lucide-react";
import { ProductsService } from "../../../../config/api";

const GestiuneProduse = () => {
  // State management
  const [produse, setProduse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [relatedData, setRelatedData] = useState({
    categories: [],
    brands: [],
    locations: [],
    suppliers: []
  });
  
  // UI State
  const [viewMode, setViewMode] = useState("grid");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedProduse, setSelectedProduse] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    minStock: "",
    maxStock: "",
    location: "",
    sortBy: "nume",
    sortOrder: "asc",
    limit: 50,
    offset: 0
  });

  // Form data for product modal
  const [formData, setFormData] = useState({
    nume: "",
    cod: "",
    descriere: "",
    category_id: "",
    brand_id: "",
    supplier_id: "",
    location_id: "",
    pret_vanzare: "",
    pret_achizitie: "",
    stoc_actual: "",
    stoc_minim: "",
    unitate_masura: "buc",
    garantie_luni: "",
    greutate: "",
    dimensiuni_lungime: "",
    dimensiuni_latime: "",
    dimensiuni_inaltime: "",
    cod_bare: "",
    imagine_principala: "",
    conditii_pastrare: "",
    instructiuni_folosire: ""
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load products when filters change
  useEffect(() => {
    if (!loading) {
      loadProducts();
    }
  }, [filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load all initial data in parallel
      const [productsData, statsData, relatedData] = await Promise.all([
        ProductsService.getProducts(filters),
        ProductsService.getStatistics(),
        ProductsService.getRelatedData()
      ]);

      setProduse(productsData.products || []);
      setStatistics(statsData || {});
      setRelatedData(relatedData || {
        categories: [],
        brands: [],
        locations: [],
        suppliers: []
      });
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await ProductsService.getProducts(filters);
      setProduse(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setError(error.message);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0 // Reset pagination when filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      minStock: "",
      maxStock: "",
      location: "",
      sortBy: "nume",
      sortOrder: "asc",
      limit: 50,
      offset: 0
    });
  };

  const openProductModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        nume: product.nume || "",
        cod: product.cod || "",
        descriere: product.descriere || "",
        category_id: product.category_id || "",
        brand_id: product.brand_id || "",
        supplier_id: product.supplier_id || "",
        location_id: product.location_id || "",
        pret_vanzare: product.pret_vanzare || "",
        pret_achizitie: product.pret_achizitie || "",
        stoc_actual: product.stoc_actual || "",
        stoc_minim: product.stoc_minim || "",
        unitate_masura: product.unitate_masura || "buc",
        garantie_luni: product.garantie_luni || "",
        greutate: product.greutate || "",
        dimensiuni_lungime: product.dimensiuni_lungime || "",
        dimensiuni_latime: product.dimensiuni_latime || "",
        dimensiuni_inaltime: product.dimensiuni_inaltime || "",
        cod_bare: product.cod_bare || "",
        imagine_principala: product.imagine_principala || "",
        conditii_pastrare: product.conditii_pastrare || "",
        instructiuni_folosire: product.instructiuni_folosire || ""
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        nume: "",
        cod: "",
        descriere: "",
        category_id: "",
        brand_id: "",
        supplier_id: "",
        location_id: "",
        pret_vanzare: "",
        pret_achizitie: "",
        stoc_actual: "",
        stoc_minim: "",
        unitate_masura: "buc",
        garantie_luni: "",
        greutate: "",
        dimensiuni_lungime: "",
        dimensiuni_latime: "",
        dimensiuni_inaltime: "",
        cod_bare: "",
        imagine_principala: "",
        conditii_pastrare: "",
        instructiuni_folosire: ""
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    setFormData({});
  };

  const handleFormChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveProduct = async () => {
    try {
      setIsModalLoading(true);
      
      if (selectedProduct) {
        // Update existing product
        await ProductsService.updateProduct(selectedProduct.id, formData);
      } else {
        // Create new product
        await ProductsService.createProduct(formData);
      }
      
      // Refresh products list
      await loadProducts();
      closeProductModal();
      
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Sigur doriți să ștergeți acest produs?')) {
      return;
    }
    
    try {
      await ProductsService.deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "activ":
        return "bg-green-100 text-green-700";
      case "stoc_redus":
        return "bg-yellow-100 text-yellow-700";
      case "epuizat":
        return "bg-red-100 text-red-700";
      case "inactiv":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "activ":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "stoc_redus":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "epuizat":
        return <X className="w-4 h-4 text-red-600" />;
      case "inactiv":
        return <Archive className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const toggleSelectAll = () => {
    if (selectedProduse.length === produse.length) {
      setSelectedProduse([]);
    } else {
      setSelectedProduse(produse.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id) => {
    if (selectedProduse.includes(id)) {
      setSelectedProduse(selectedProduse.filter((pId) => pId !== id));
    } else {
      setSelectedProduse([...selectedProduse, id]);
    }
  };

  const bulkUpdateStatus = async (status) => {
    try {
      await ProductsService.bulkUpdateStatus(selectedProduse, status);
      await loadProducts();
      setSelectedProduse([]);
    } catch (error) {
      console.error('Error bulk updating status:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Se încarcă produsele...</p>
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
              Gestiune Produse
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează inventarul și cataloagele de produse
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => openProductModal()}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adaugă Produs
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
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtre
            </button>
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
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Caută după nume, cod, brand..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toate statusurile</option>
              <option value="activ">Activ</option>
              <option value="stoc_redus">Stoc redus</option>
              <option value="epuizat">Epuizat</option>
              <option value="inactiv">Inactiv</option>
            </select>
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toate categoriile</option>
                    {relatedData.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nume}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toate brandurile</option>
                    {relatedData.brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.nume}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preț (RON)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stoc
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minStock}
                      onChange={(e) => handleFilterChange('minStock', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxStock}
                      onChange={(e) => handleFilterChange('maxStock', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Resetează
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
                <p className="text-sm text-gray-600">Total Produse</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.totalProducts || produse.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valoare Stoc</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.totalValue ? 
                    `${statistics.totalValue.toLocaleString("ro-RO")} RON` :
                    `${produse.reduce((sum, p) => sum + (p.pret_vanzare || 0) * (p.stoc_actual || 0), 0).toLocaleString("ro-RO")} RON`
                  }
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stoc Redus</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.lowStockCount || 
                    produse.filter((p) => (p.stoc_actual || 0) <= (p.stoc_minim || 0) && (p.stoc_actual || 0) > 0).length
                  }
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorii</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.categoriesCount || relatedData.categories.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Layers className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {produse.map((produs) => (
              <div
                key={produs.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {produs.cod}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedProduse.includes(produs.id)}
                      onChange={() => toggleSelectProduct(produs.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {produs.nume}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {produs.brand} • {produs.categorie}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Preț:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {(produs.pret_vanzare || 0).toLocaleString("ro-RO")} RON
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stoc:</span>
                      <span
                        className={`font-medium ${
                          (produs.stoc_actual || 0) === 0
                            ? "text-red-600"
                            : (produs.stoc_actual || 0) <= (produs.stoc_minim || 0)
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {produs.stoc_actual || 0} {produs.unitate_masura}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Profit:</span>
                      <span className="font-medium text-green-600">
                        {((produs.pret_vanzare || 0) - (produs.pret_achizitie || 0)).toLocaleString("ro-RO")} RON
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(produs.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          produs.status
                        )}`}
                      >
                        {produs.status?.replace("_", " ") || "activ"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => openProductModal(produs)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => openProductModal(produs)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteProduct(produs.id)}
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
                        checked={selectedProduse.length === produse.length && produse.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Produs
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Categorie
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Preț
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Stoc
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produse.map((produs) => (
                    <tr
                      key={produs.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProduse.includes(produs.id)}
                          onChange={() => toggleSelectProduct(produs.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {produs.nume}
                            </div>
                            <div className="text-sm text-gray-500">
                              {produs.cod} • {produs.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {produs.categorie}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {(produs.pret_vanzare || 0).toLocaleString("ro-RO")} RON
                        </div>
                        <div className="text-sm text-gray-500">
                          Cost: {(produs.pret_achizitie || 0).toLocaleString("ro-RO")} RON
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            (produs.stoc_actual || 0) === 0
                              ? "text-red-600"
                              : (produs.stoc_actual || 0) <= (produs.stoc_minim || 0)
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {produs.stoc_actual || 0} {produs.unitate_masura}
                        </div>
                        <div className="text-sm text-gray-500">
                          Min: {produs.stoc_minim || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(produs.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                              produs.status
                            )}`}
                          >
                            {produs.status?.replace("_", " ") || "activ"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          +{((produs.pret_vanzare || 0) - (produs.pret_achizitie || 0)).toLocaleString("ro-RO")} RON
                        </div>
                        <div className="text-sm text-gray-500">
                          {produs.pret_vanzare > 0 ? 
                            (((produs.pret_vanzare - produs.pret_achizitie) / produs.pret_vanzare) * 100).toFixed(1) : 0
                          }% marjă
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openProductModal(produs)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => openProductModal(produs)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(produs.id)}
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

      {/* Bulk Actions */}
      {selectedProduse.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedProduse.length} selectate
          </span>
          <button 
            onClick={() => bulkUpdateStatus('activ')}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Activează
          </button>
          <button 
            onClick={() => bulkUpdateStatus('inactiv')}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Dezactivează
          </button>
          <button
            onClick={() => setSelectedProduse([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedProduct ? "Editare Produs" : "Produs Nou"}
                </h2>
                <button
                  onClick={closeProductModal}
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
                      Nume Produs *
                    </label>
                    <input
                      type="text"
                      value={formData.nume}
                      onChange={(e) => handleFormChange('nume', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numele produsului"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cod Produs *
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
                      Categorie
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => handleFormChange('category_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează categoria</option>
                      {relatedData.categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nume}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <select
                      value={formData.brand_id}
                      onChange={(e) => handleFormChange('brand_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează brandul</option>
                      {relatedData.brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.nume}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preț Vânzare (RON)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.pret_vanzare}
                        onChange={(e) => handleFormChange('pret_vanzare', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preț Achiziție (RON)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.pret_achizitie}
                        onChange={(e) => handleFormChange('pret_achizitie', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stoc Actual
                      </label>
                      <input
                        type="number"
                        value={formData.stoc_actual}
                        onChange={(e) => handleFormChange('stoc_actual', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stoc Minim
                      </label>
                      <input
                        type="number"
                        value={formData.stoc_minim}
                        onChange={(e) => handleFormChange('stoc_minim', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unitate Măsură
                    </label>
                    <select
                      value={formData.unitate_masura}
                      onChange={(e) => handleFormChange('unitate_masura', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="buc">Bucată</option>
                      <option value="kg">Kilogram</option>
                      <option value="m">Metru</option>
                      <option value="l">Litru</option>
                      <option value="set">Set</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Furnizor
                    </label>
                    <select
                      value={formData.supplier_id}
                      onChange={(e) => handleFormChange('supplier_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează furnizorul</option>
                      {relatedData.suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.nume}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    placeholder="Descrierea produsului..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeProductModal}
                disabled={isModalLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button 
                onClick={saveProduct}
                disabled={isModalLoading || !formData.nume || !formData.cod}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isModalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedProduct ? "Actualizează" : "Adaugă Produs"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestiuneProduse;
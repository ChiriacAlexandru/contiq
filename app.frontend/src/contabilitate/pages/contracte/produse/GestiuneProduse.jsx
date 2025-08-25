import React, { useState } from "react";
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
} from "lucide-react";

const GestiuneProduse = () => {
  const [produse, setProduse] = useState([
    {
      id: 1,
      nume: "Laptop Dell XPS 13",
      cod: "DELL-XPS-001",
      categorie: "Electronice",
      brand: "Dell",
      pret: 4999.99,
      pretAchizitie: 4200.0,
      stoc: 15,
      stocMinim: 5,
      unitate: "buc",
      status: "activ",
      locatie: "Depozit A",
      furnizor: "Tech Solutions SRL",
      dataAdaugare: "2024-01-15",
      ultimaVanzare: "2025-08-20",
      rating: 5,
      vanzari: 25,
      descriere: "Laptop performant pentru business",
      garantie: "24 luni",
      dimensiuni: "30.2 x 19.9 x 1.47 cm",
      greutate: "1.2 kg",
    },
    {
      id: 2,
      nume: "iPhone 15 Pro",
      cod: "APPLE-IP15P-001",
      categorie: "Telefoane",
      brand: "Apple",
      pret: 5499.99,
      pretAchizitie: 4800.0,
      stoc: 8,
      stocMinim: 3,
      unitate: "buc",
      status: "activ",
      locatie: "Depozit B",
      furnizor: "iStore Romania",
      dataAdaugare: "2024-02-20",
      ultimaVanzare: "2025-08-22",
      rating: 5,
      vanzari: 18,
      descriere: "Smartphone premium cu cameră avansată",
      garantie: "12 luni",
      dimensiuni: "14.67 x 7.08 x 0.83 cm",
      greutate: "187 g",
    },
    {
      id: 3,
      nume: "Monitor Samsung 27''",
      cod: "SAMSUNG-M27-001",
      categorie: "Monitoare",
      brand: "Samsung",
      pret: 1299.99,
      pretAchizitie: 1050.0,
      stoc: 2,
      stocMinim: 5,
      unitate: "buc",
      status: "stoc_redus",
      locatie: "Depozit A",
      furnizor: "Display Tech SRL",
      dataAdaugare: "2024-03-10",
      ultimaVanzare: "2025-07-15",
      rating: 4,
      vanzari: 12,
      descriere: "Monitor 4K pentru profesionisti",
      garantie: "36 luni",
      dimensiuni: "61.7 x 36.8 x 5.2 cm",
      greutate: "4.2 kg",
    },
    {
      id: 4,
      nume: "Tastatura Mechanical RGB",
      cod: "LOGI-MX-001",
      categorie: "Accesorii",
      brand: "Logitech",
      pret: 349.99,
      pretAchizitie: 280.0,
      stoc: 25,
      stocMinim: 10,
      unitate: "buc",
      status: "activ",
      locatie: "Depozit C",
      furnizor: "Gaming Gear SRL",
      dataAdaugare: "2024-04-05",
      ultimaVanzare: "2025-08-18",
      rating: 4,
      vanzari: 45,
      descriere: "Tastatura mecanică pentru gaming",
      garantie: "24 luni",
      dimensiuni: "44 x 15.3 x 3.4 cm",
      greutate: "980 g",
    },
    {
      id: 5,
      nume: "Imprimantă Canon PIXMA",
      cod: "CANON-PIX-001",
      categorie: "Imprimante",
      brand: "Canon",
      pret: 899.99,
      pretAchizitie: 720.0,
      stoc: 0,
      stocMinim: 3,
      unitate: "buc",
      status: "epuizat",
      locatie: "Depozit B",
      furnizor: "Office Solutions SRL",
      dataAdaugare: "2024-05-12",
      ultimaVanzare: "2025-08-10",
      rating: 3,
      vanzari: 8,
      descriere: "Imprimantă multifuncțională color",
      garantie: "12 luni",
      dimensiuni: "40.3 x 31.5 x 15.8 cm",
      greutate: "6.5 kg",
    },
    {
      id: 6,
      nume: "Căști Sony WH-1000XM5",
      cod: "SONY-WH-001",
      categorie: "Audio",
      brand: "Sony",
      pret: 1499.99,
      pretAchizitie: 1200.0,
      stoc: 12,
      stocMinim: 5,
      unitate: "buc",
      status: "activ",
      locatie: "Depozit A",
      furnizor: "Audio Pro SRL",
      dataAdaugare: "2024-06-18",
      ultimaVanzare: "2025-08-19",
      rating: 5,
      vanzari: 22,
      descriere: "Căști wireless cu noise cancelling",
      garantie: "24 luni",
      dimensiuni: "25.4 x 19.2 x 7.3 cm",
      greutate: "250 g",
    },
  ]);

  const [viewMode, setViewMode] = useState("grid");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedProduse, setSelectedProduse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toate");
  const [filterCategorie, setFilterCategorie] = useState("toate");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        return <AlertTriangle className="w-4 h-4 text-white" />;
      case "epuizat":
        return <X className="w-4 h-4 text-red-600" />;
      case "inactiv":
        return <Archive className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStockStatus = (produs) => {
    if (produs.stoc === 0) return "epuizat";
    if (produs.stoc <= produs.stocMinim) return "stoc_redus";
    return "stoc_ok";
  };

  const filteredProduse = produse.filter((produs) => {
    const matchesSearch =
      produs.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produs.cod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produs.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produs.categorie.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "toate" || produs.status === filterStatus;
    const matchesCategorie =
      filterCategorie === "toate" ||
      produs.categorie.toLowerCase() === filterCategorie;
    return matchesSearch && matchesStatus && matchesCategorie;
  });

  const toggleSelectAll = () => {
    if (selectedProduse.length === filteredProduse.length) {
      setSelectedProduse([]);
    } else {
      setSelectedProduse(filteredProduse.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id) => {
    if (selectedProduse.includes(id)) {
      setSelectedProduse(selectedProduse.filter((pId) => pId !== id));
    } else {
      setSelectedProduse([...selectedProduse, id]);
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-white fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getCategorii = () => {
    const categorii = [...new Set(produse.map((p) => p.categorie))];
    return categorii;
  };

  const calculateProfit = (pret, pretAchizitie) => {
    return pret - pretAchizitie;
  };

  const calculateProfitMargin = (pret, pretAchizitie) => {
    return (((pret - pretAchizitie) / pret) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Gestiune Produse
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează inventarul și cataloagele de produse
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => setShowProductModal(true)}
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
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
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
                placeholder="Caută după nume, cod, brand sau categorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="toate">Toate statusurile</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Categorie
                  </label>
                  <select
                    value={filterCategorie}
                    onChange={(e) => setFilterCategorie(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="toate">Toate categoriile</option>
                    {getCategorii().map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Preț (RON)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Stoc
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    placeholder="Brand produs"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setFilterStatus("toate");
                    setFilterCategorie("toate");
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
                <p className="text-sm text-gray-600">Total Produse</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {produse.length}
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
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {produse
                    .reduce((sum, p) => sum + p.pret * p.stoc, 0)
                    .toLocaleString("ro-RO")}{" "}
                  RON
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
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {
                    produse.filter((p) => p.stoc <= p.stocMinim && p.stoc > 0)
                      .length
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
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {getCategorii().length}
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
            {filteredProduse.map((produs) => (
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

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 mb-1">
                    {produs.nume}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {produs.brand} • {produs.categorie}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Preț:</span>
                      <span className="text-lg font-semibold text-gray-900 mb-3">
                        {produs.pret.toLocaleString("ro-RO")} RON
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stoc:</span>
                      <span
                        className={`font-medium ${
                          produs.stoc === 0
                            ? "text-red-600"
                            : produs.stoc <= produs.stocMinim
                            ? "text-white"
                            : "text-green-600"
                        }`}
                      >
                        {produs.stoc} {produs.unitate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Profit:</span>
                      <span className="font-medium text-green-600">
                        {calculateProfit(
                          produs.pret,
                          produs.pretAchizitie
                        ).toLocaleString("ro-RO")}{" "}
                        RON
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        {getRatingStars(produs.rating)}
                      </div>
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
                        {produs.status.replace("_", " ")}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {produs.vanzari} vândute
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => {
                        setSelectedProduct(produs);
                        setShowProductModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Barcode className="w-4 h-4 text-gray-600" />
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
                        checked={
                          selectedProduse.length === filteredProduse.length
                        }
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
                  {filteredProduse.map((produs) => (
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
                            <div className="text-sm text-gray-600 text-gray-500">
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
                          {produs.pret.toLocaleString("ro-RO")} RON
                        </div>
                        <div className="text-sm text-gray-600 text-gray-500">
                          Cost: {produs.pretAchizitie.toLocaleString("ro-RO")}{" "}
                          RON
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            produs.stoc === 0
                              ? "text-red-600"
                              : produs.stoc <= produs.stocMinim
                              ? "text-white"
                              : "text-green-600"
                          }`}
                        >
                          {produs.stoc} {produs.unitate}
                        </div>
                        <div className="text-sm text-gray-600 text-gray-500">
                          Min: {produs.stocMinim}
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
                            {produs.status.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          +
                          {calculateProfit(
                            produs.pret,
                            produs.pretAchizitie
                          ).toLocaleString("ro-RO")}{" "}
                          RON
                        </div>
                        <div className="text-sm text-gray-600 text-gray-500">
                          {calculateProfitMargin(
                            produs.pret,
                            produs.pretAchizitie
                          )}
                          % marjă
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
                            <Barcode className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
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
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Exportă
          </button>
          <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
            Activează
          </button>
          <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            Actualizează Stoc
          </button>
          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedProduct ? "Detalii Produs" : "Produs Nou"}
                </h2>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setSelectedProduct(null);
                  }}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Nume Produs
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.nume || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numele produsului"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Cod Produs
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.cod || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Cod unic"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Categorie
                    </label>
                    <select
                      defaultValue={selectedProduct?.categorie || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează categoria</option>
                      {getCategorii().map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.brand || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brandul produsului"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                        Preț Vânzare (RON)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.pret || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                        Preț Achiziție (RON)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.pretAchizitie || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                        Stoc Actual
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedProduct?.stoc || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                        Stoc Minim
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedProduct?.stocMinim || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Unitate Măsură
                    </label>
                    <select
                      defaultValue={selectedProduct?.unitate || "buc"}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Locație
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.locatie || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Locația în depozit"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Descriere
                  </label>
                  <textarea
                    rows="3"
                    defaultValue={selectedProduct?.descriere || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrierea produsului..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
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

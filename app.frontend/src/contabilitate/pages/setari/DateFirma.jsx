import React, { useState } from "react";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  CreditCard,
  Users,
  Calendar,
  Save,
  Upload,
  Camera,
  Edit,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Shield,
  Lock,
  Key,
  Receipt,
  User,
  Settings,
  Info,
} from "lucide-react";

const DateFirma = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [formData, setFormData] = useState({
    // General Info
    numeFirma: "SC ContIQ Solutions SRL",
    cui: "RO12345678",
    nrRegComert: "J40/1234/2024",
    adresaSediu: "Str. Aviatorilor nr. 15, Sector 1",
    oras: "București",
    judet: "Ilfov",
    codPostal: "014012",
    tara: "România",
    telefon: "+40 312 345 678",
    email: "contact@contiq.ro",
    website: "www.contiq.ro",
    
    // Financial Info
    capitalSocial: "50000",
    contBancar: "RO49 AAAA 1B31 0075 9384 0000",
    banca: "Banca Transilvania",
    platitorTVA: true,
    
    // Representative
    reprezentantLegal: "Chiriac Alexandru",
    functieReprezentant: "Administrator",
    cnpReprezentant: "1234567890123",
    
    // Other Settings
    anFiscal: "2025",
    monedaPrincipala: "RON",
    limbaImplicita: "RO",
    timpZona: "Europe/Bucharest"
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      message: "Datele companiei au fost actualizate cu succes",
      show: false
    }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simulate save operation
    setIsEditing(false);
    setNotifications(prev => prev.map(notif => 
      notif.id === 1 ? { ...notif, show: true } : notif
    ));
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.map(notif => 
        notif.id === 1 ? { ...notif, show: false } : notif
      ));
    }, 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const companyStats = [
    { 
      label: "Angajați Activi", 
      value: "24", 
      icon: Users, 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      label: "Ani de Activitate", 
      value: "5", 
      icon: Calendar, 
      color: "from-green-500 to-green-600" 
    },
    { 
      label: "Documente Procesate", 
      value: "1,247", 
      icon: FileText, 
      color: "from-purple-500 to-purple-600" 
    },
    { 
      label: "Contracte Active", 
      value: "89", 
      icon: Receipt, 
      color: "from-orange-500 to-orange-600" 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="responsive-title">
              Date Firmă
            </h1>
            <p className="mt-1 body-small">
              Gestionează informațiile și setările companiei tale
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editează
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <X className="w-5 h-5 mr-2" />
                  Anulează
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Salvează
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.map(notification => (
        notification.show && (
          <div key={notification.id} className="bg-green-50 border border-green-200 rounded-lg p-4 mx-4 sm:mx-6 lg:mx-8 mt-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-800">{notification.message}</p>
            </div>
          </div>
        )
      ))}

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {companyStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-small">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "general"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Building className="w-5 h-5 mr-2 inline" />
            Informații Generale
          </button>
          <button
            onClick={() => setActiveTab("financial")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "financial"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <CreditCard className="w-5 h-5 mr-2 inline" />
            Date Financiare
          </button>
          <button
            onClick={() => setActiveTab("legal")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "legal"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Shield className="w-5 h-5 mr-2 inline" />
            Reprezentant Legal
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "settings"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Settings className="w-5 h-5 mr-2 inline" />
            Setări Sistem
          </button>
        </div>

        {/* General Information Tab */}
        {activeTab === "general" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="section-title mb-6">
              Informații Generale
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numele Firmei
                    </label>
                    <input
                      type="text"
                      value={formData.numeFirma}
                      onChange={(e) => handleInputChange("numeFirma", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CUI
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.cui}
                        onChange={(e) => handleInputChange("cui", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      />
                      <button
                        onClick={() => copyToClipboard(formData.cui)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nr. Registrul Comerțului
                  </label>
                  <input
                    type="text"
                    value={formData.nrRegComert}
                    onChange={(e) => handleInputChange("nrRegComert", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresa Sediu
                  </label>
                  <input
                    type="text"
                    value={formData.adresaSediu}
                    onChange={(e) => handleInputChange("adresaSediu", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Oraș
                    </label>
                    <input
                      type="text"
                      value={formData.oras}
                      onChange={(e) => handleInputChange("oras", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Județ
                    </label>
                    <input
                      type="text"
                      value={formData.judet}
                      onChange={(e) => handleInputChange("judet", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cod Poștal
                    </label>
                    <input
                      type="text"
                      value={formData.codPostal}
                      onChange={(e) => handleInputChange("codPostal", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="text"
                      value={formData.telefon}
                      onChange={(e) => handleInputChange("telefon", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Company Logo Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Logo Companie</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Building className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Logo actual</p>
                    {isEditing && (
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                          <Upload className="w-4 h-4 mr-2 inline" />
                          Încarcă Logo
                        </button>
                        <p className="text-xs text-gray-500">
                          PNG, JPG până la 2MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Informații Importante
                      </h4>
                      <p className="text-sm text-blue-700">
                        Datele companiei vor apărea în toate documentele generate. 
                        Asigură-te că informațiile sunt corecte și actualizate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Information Tab */}
        {activeTab === "financial" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Date Financiare
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capital Social (RON)
                  </label>
                  <input
                    type="number"
                    value={formData.capitalSocial}
                    onChange={(e) => handleInputChange("capitalSocial", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cont Bancar (IBAN)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.contBancar}
                      onChange={(e) => handleInputChange("contBancar", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                    <button
                      onClick={() => copyToClipboard(formData.contBancar)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banca
                  </label>
                  <input
                    type="text"
                    value={formData.banca}
                    onChange={(e) => handleInputChange("banca", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="platitorTVA"
                      checked={formData.platitorTVA}
                      onChange={(e) => handleInputChange("platitorTVA", e.target.checked)}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="platitorTVA" className="ml-2 text-sm text-gray-700">
                      Plătitor de TVA
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informații Contabile
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-600">An fiscal curent</span>
                    <span className="font-medium text-gray-900">{formData.anFiscal}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-600">Moneda principală</span>
                    <span className="font-medium text-gray-900">{formData.monedaPrincipala}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-600">Status TVA</span>
                    <span className={`px-2 py-1 text-xs rounded-lg ${
                      formData.platitorTVA 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {formData.platitorTVA ? "Plătitor TVA" : "Neplătitor TVA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legal Representative Tab */}
        {activeTab === "legal" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Reprezentant Legal
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume Complet
                  </label>
                  <input
                    type="text"
                    value={formData.reprezentantLegal}
                    onChange={(e) => handleInputChange("reprezentantLegal", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funcția în Companie
                  </label>
                  <select
                    value={formData.functieReprezentant}
                    onChange={(e) => handleInputChange("functieReprezentant", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Director General">Director General</option>
                    <option value="Manager">Manager</option>
                    <option value="Asociat">Asociat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNP
                  </label>
                  <input
                    type="text"
                    value={formData.cnpReprezentant}
                    onChange={(e) => handleInputChange("cnpReprezentant", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                    placeholder="1234567890123"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-white mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Atenție!
                    </h3>
                    <p className="text-sm text-white mb-3">
                      Datele reprezentantului legal sunt folosite în documentele oficiale 
                      și contractele generate de sistem.
                    </p>
                    <ul className="text-sm text-white space-y-1">
                      <li>• Semnătură electronică pe contracte</li>
                      <li>• Documente către ANAF</li>
                      <li>• Corespondență oficială</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Setări Sistem
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Setări Generale
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Limba Implicită
                      </label>
                      <select
                        value={formData.limbaImplicita}
                        onChange={(e) => handleInputChange("limbaImplicita", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      >
                        <option value="RO">Română</option>
                        <option value="EN">English</option>
                        <option value="FR">Français</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fus Orar
                      </label>
                      <select
                        value={formData.timpZona}
                        onChange={(e) => handleInputChange("timpZona", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      >
                        <option value="Europe/Bucharest">Europa/București</option>
                        <option value="Europe/London">Europa/Londra</option>
                        <option value="Europe/Paris">Europa/Paris</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Moneda Principală
                      </label>
                      <select
                        value={formData.monedaPrincipala}
                        onChange={(e) => handleInputChange("monedaPrincipala", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      >
                        <option value="RON">RON - Leu românesc</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="USD">USD - Dolar american</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Setări API
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cheie API
                      </label>
                      <div className="flex gap-2">
                        <input
                          type={showApiKeys ? "text" : "password"}
                          value="sk_live_123456789abcdef"
                          disabled
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                        />
                        <button
                          onClick={() => setShowApiKeys(!showApiKeys)}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          {showApiKeys ? (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <RefreshCw className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">
                    Backup și Securitate
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Backup Automat
                        </p>
                        <p className="text-xs text-gray-500">
                          Zilnic la 02:00
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Criptare Date
                        </p>
                        <p className="text-xs text-gray-500">
                          AES-256
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Autentificare 2FA
                        </p>
                        <p className="text-xs text-gray-500">
                          Activă
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Acțiuni Rapide
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 text-sm font-medium text-gray-700 hover:text-blue-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export Date Companie
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 text-sm font-medium text-gray-700 hover:text-green-700">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resetare Setări
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateFirma;
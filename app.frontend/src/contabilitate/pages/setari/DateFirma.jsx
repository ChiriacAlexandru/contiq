import React, { useState, useEffect } from "react";
import { UserService, ApiClient } from "../../../config/api";
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
  ChevronDown,
} from "lucide-react";

const DateFirma = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    // General Info
    numeFirma: "",
    cui: "",
    nrRegComert: "",
    adresaSediu: "",
    oras: "",
    judet: "",
    codPostal: "",
    tara: "România",
    telefon: "",
    email: "",
    website: "",
    
    // Financial Info
    capitalSocial: "",
    contBancar: "",
    banca: "",
    platitorTVA: false,
    
    // Representative
    reprezentantLegal: "",
    functieReprezentant: "Administrator",
    cnpReprezentant: "",
    
    // Other Settings
    anFiscal: new Date().getFullYear().toString(),
    monedaPrincipala: "RON",
    limbaImplicita: "RO",
    timpZona: "Europe/Bucharest"
  });

  const [notifications, setNotifications] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "RO",
    name: "România", 
    prefix: "+40",
    flag: "🇷🇴"
  });

  // Country data with phone prefixes
  const countries = [
    { code: "RO", name: "România", prefix: "+40", flag: "🇷🇴" },
    { code: "US", name: "United States", prefix: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", prefix: "+44", flag: "🇬🇧" },
    { code: "DE", name: "Germany", prefix: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", prefix: "+33", flag: "🇫🇷" },
    { code: "IT", name: "Italy", prefix: "+39", flag: "🇮🇹" },
    { code: "ES", name: "Spain", prefix: "+34", flag: "🇪🇸" },
    { code: "HU", name: "Hungary", prefix: "+36", flag: "🇭🇺" },
    { code: "BG", name: "Bulgaria", prefix: "+359", flag: "🇧🇬" },
    { code: "PL", name: "Poland", prefix: "+48", flag: "🇵🇱" }
  ];

  // Load company data on component mount
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setIsLoading(true);
        const profile = await UserService.getProfile();
        
        if (profile && profile.profile) {
          const companyData = profile.profile;
          
          // Map backend data to frontend form structure
          setFormData(prev => ({
            ...prev,
            // General Info
            numeFirma: companyData.nume_firma || "",
            cui: companyData.cui || "",
            nrRegComert: companyData.nr_reg_comert || "",
            adresaSediu: companyData.adresa_sediu || "",
            oras: companyData.oras || "",
            judet: companyData.judet || "",
            codPostal: companyData.cod_postal || "",
            tara: companyData.tara || "România",
            telefon: companyData.telefon || "",
            email: companyData.email || "",
            website: companyData.website || "",
            
            // Financial Info
            capitalSocial: companyData.capital_social || "",
            contBancar: companyData.cont_bancar || "",
            banca: companyData.banca || "",
            platitorTVA: companyData.platitor_tva || false,
            
            // Representative
            reprezentantLegal: companyData.reprezentant_legal || "",
            functieReprezentant: companyData.functie_reprezentant || "Administrator",
            cnpReprezentant: companyData.cnp_reprezentant || "",
            
            // Other Settings
            anFiscal: companyData.an_fiscal || new Date().getFullYear().toString(),
            monedaPrincipala: companyData.moneda_principala || "RON",
            limbaImplicita: companyData.limba_implicita || "RO",
            timpZona: companyData.timp_zona || "Europe/Bucharest"
          }));
        }
      } catch (error) {
        console.error('Error loading company data:', error);
        showNotification("error", "Eroare la încărcarea datelor companiei");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  // Real-time validation functions
  const validateCUI = (cui, isPlatitorTVA) => {
    if (!cui || cui.trim() === '') return null;
    
    const cleanCui = cui.trim().toUpperCase();
    
    if (isPlatitorTVA) {
      // For TVA payers, CUI must start with RO
      if (!cleanCui.startsWith('RO')) {
        return 'Pentru plătitorii de TVA, CUI-ul trebuie să înceapă cu RO';
      }
      const numbers = cleanCui.substring(2);
      if (!/^[0-9]{2,10}$/.test(numbers)) {
        return 'CUI-ul trebuie să aibă formatul RO urmând cu 2-10 cifre';
      }
    } else {
      // For non-TVA payers, CUI can be with or without RO
      if (cleanCui.startsWith('RO')) {
        const numbers = cleanCui.substring(2);
        if (!/^[0-9]{2,10}$/.test(numbers)) {
          return 'CUI-ul trebuie să aibă formatul RO urmând cu 2-10 cifre';
        }
      } else {
        if (!/^[0-9]{2,10}$/.test(cleanCui)) {
          return 'CUI-ul trebuie să conțină doar cifre (2-10 cifre)';
        }
      }
    }
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') return null;
    
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\+[1-9][0-9]{1,14}$/.test(cleanPhone)) {
      return 'Numărul de telefon nu este valid';
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Email-ul nu este valid';
    }
    return null;
  };

  const validateCodPostal = (codPostal) => {
    if (!codPostal || codPostal.trim() === '') return null;
    
    const cleanCod = codPostal.trim();
    if (!/^[0-9]{4,6}$/.test(cleanCod)) {
      return 'Codul poștal trebuie să conțină între 4-6 cifre';
    }
    return null;
  };

  const validateCNP = (cnp) => {
    if (!cnp || cnp.trim() === '') return null;
    
    const cleanCnp = cnp.trim();
    if (!/^[0-9]{13}$/.test(cleanCnp)) {
      return 'CNP-ul trebuie să conțină exact 13 cifre';
    }
    return null;
  };

  const validateWebsite = (website) => {
    if (!website || website.trim() === '') return null;
    
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(website.trim())) {
      return 'Website-ul nu este valid';
    }
    return null;
  };

  // Clean and format phone number with country prefix
  const formatPhoneNumber = (phone, countryPrefix) => {
    if (!phone) return '';
    
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    if (cleanPhone.startsWith(countryPrefix)) {
      return cleanPhone;
    }
    
    if (cleanPhone.startsWith('+')) {
      return cleanPhone;
    }
    
    if (cleanPhone.startsWith('0')) {
      return countryPrefix + cleanPhone.substring(1);
    }
    
    return countryPrefix + cleanPhone;
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;
    let newErrors = { ...validationErrors };

    // Clean and process value based on field type
    if (typeof value === 'string') {
      processedValue = value.trimStart(); // Remove leading spaces but allow trailing for UX
    }

    // Special handling for phone number
    if (field === 'telefon') {
      processedValue = formatPhoneNumber(value, selectedCountry.prefix);
      const phoneError = validatePhone(processedValue);
      if (phoneError) {
        newErrors.telefon = phoneError;
      } else {
        delete newErrors.telefon;
      }
    }

    // Real-time validation
    switch (field) {
      case 'cui':
        const cuiError = validateCUI(processedValue, formData.platitorTVA);
        if (cuiError) {
          newErrors.cui = cuiError;
        } else {
          delete newErrors.cui;
        }
        break;
        
      case 'email':
        const emailError = validateEmail(processedValue);
        if (emailError) {
          newErrors.email = emailError;
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'codPostal':
        const codError = validateCodPostal(processedValue);
        if (codError) {
          newErrors.codPostal = codError;
        } else {
          delete newErrors.codPostal;
        }
        break;
        
      case 'cnpReprezentant':
        const cnpError = validateCNP(processedValue);
        if (cnpError) {
          newErrors.cnpReprezentant = cnpError;
        } else {
          delete newErrors.cnpReprezentant;
        }
        break;
        
      case 'website':
        const websiteError = validateWebsite(processedValue);
        if (websiteError) {
          newErrors.website = websiteError;
        } else {
          delete newErrors.website;
        }
        break;
        
      case 'platitorTVA':
        // Re-validate CUI when TVA status changes
        const cuiErrorTVA = validateCUI(formData.cui, processedValue);
        if (cuiErrorTVA) {
          newErrors.cui = cuiErrorTVA;
        } else {
          delete newErrors.cui;
        }
        break;
    }

    setValidationErrors(newErrors);
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    // Update phone number with new country prefix
    if (formData.telefon) {
      const newPhone = formatPhoneNumber(formData.telefon, country.prefix);
      handleInputChange('telefon', newPhone);
    }
  };

  const showNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      show: true
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === newNotification.id 
            ? { ...notif, show: false }
            : notif
        )
      );
    }, 3000);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Check for validation errors before saving
      if (Object.keys(validationErrors).length > 0) {
        showNotification("error", "Vă rugăm să corectați erorile de validare înainte de salvare");
        return;
      }

      // Clean and prepare data
      const cleanValue = (value) => {
        if (typeof value === 'string') {
          const cleaned = value.trim();
          return cleaned === '' ? undefined : cleaned;
        }
        return value;
      };

      // Map frontend form data to backend structure with cleaning
      const companyUpdateData = {
        nume_firma: cleanValue(formData.numeFirma),
        cui: cleanValue(formData.cui),
        nr_reg_comert: cleanValue(formData.nrRegComert),
        adresa_sediu: cleanValue(formData.adresaSediu),
        oras: cleanValue(formData.oras),
        judet: cleanValue(formData.judet),
        cod_postal: cleanValue(formData.codPostal),
        tara: cleanValue(formData.tara),
        telefon: cleanValue(formData.telefon),
        email: cleanValue(formData.email),
        website: cleanValue(formData.website),
        capital_social: formData.capitalSocial && formData.capitalSocial.trim() !== '' ? parseFloat(formData.capitalSocial) : undefined,
        cont_bancar: cleanValue(formData.contBancar),
        banca: cleanValue(formData.banca),
        platitor_tva: Boolean(formData.platitorTVA),
        reprezentant_legal: cleanValue(formData.reprezentantLegal),
        functie_reprezentant: cleanValue(formData.functieReprezentant),
        cnp_reprezentant: cleanValue(formData.cnpReprezentant),
        an_fiscal: cleanValue(formData.anFiscal),
        moneda_principala: cleanValue(formData.monedaPrincipala),
        limba_implicita: cleanValue(formData.limbaImplicita),
        timp_zona: cleanValue(formData.timpZona)
      };

      // Remove undefined and empty values
      Object.keys(companyUpdateData).forEach(key => {
        if (companyUpdateData[key] === undefined || companyUpdateData[key] === null || companyUpdateData[key] === '') {
          delete companyUpdateData[key];
        }
      });
      
      console.log('Sending company data:', companyUpdateData);
      await UserService.updateCompanyData(companyUpdateData);
      
      setIsEditing(false);
      showNotification("success", "Datele companiei au fost actualizate cu succes");
    } catch (error) {
      console.error('Error saving company data:', error);
      
      // Handle validation errors with specific details
      if (error.message === 'Validation failed') {
        // Try to get more details from the API response
        showNotification("error", "Validare eșuată. Verificați formatul datelor introduse (CUI: RO + cifre, Cod poștal: 6 cifre, CNP: 13 cifre)");
      } else {
        showNotification("error", error.message || "Eroare la salvarea datelor companiei");
      }
    } finally {
      setIsSaving(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Se încarcă datele companiei...</p>
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Date Firmă
            </h1>
            <p className="mt-1 text-sm text-gray-600">
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
                  disabled={isSaving}
                  className={`inline-flex items-center px-4 py-2 rounded-xl shadow-lg transition-all duration-200 ${
                    isSaving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40"
                  }`}
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {isSaving ? "Se salvează..." : "Salvează"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.map(notification => (
        notification.show && (
          <div key={notification.id} className={`p-4 mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-lg border ${
            notification.type === "success" 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
              )}
              <p className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
                {notification.message}
              </p>
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
                  <p className="text-sm text-gray-600">{stat.label}</p>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4 mb-6">
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
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.cui}
                          onChange={(e) => handleInputChange("cui", e.target.value)}
                          disabled={!isEditing}
                          placeholder={formData.platitorTVA ? "RO12345678" : "12345678 sau RO12345678"}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                            !isEditing ? "bg-gray-50 text-gray-600 border-gray-200" : 
                            validationErrors.cui ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                          }`}
                        />
                        <button
                          onClick={() => copyToClipboard(formData.cui)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      {validationErrors.cui && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.cui}</p>
                      )}
                      {!validationErrors.cui && formData.platitorTVA && (
                        <p className="mt-1 text-sm text-blue-600">Pentru plătitorii de TVA, CUI-ul trebuie să înceapă cu RO</p>
                      )}
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
                    <div>
                      <input
                        type="text"
                        value={formData.codPostal}
                        onChange={(e) => handleInputChange("codPostal", e.target.value)}
                        disabled={!isEditing}
                        placeholder="012345"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          !isEditing ? "bg-gray-50 text-gray-600 border-gray-200" : 
                          validationErrors.codPostal ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                        }`}
                      />
                      {validationErrors.codPostal && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.codPostal}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <span className="mr-1">{selectedCountry.flag}</span>
                            <span className="text-sm">{selectedCountry.prefix}</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </button>
                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                              {countries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    handleCountryChange(country);
                                    setShowCountryDropdown(false);
                                  }}
                                  className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                                >
                                  <span className="mr-2">{country.flag}</span>
                                  <span className="flex-1">{country.name}</span>
                                  <span className="text-sm text-gray-500">{country.prefix}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                          <span className="mr-1">{selectedCountry.flag}</span>
                          <span className="text-sm text-gray-600">{selectedCountry.prefix}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.telefon}
                          onChange={(e) => handleInputChange("telefon", e.target.value)}
                          disabled={!isEditing}
                          placeholder="123456789"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            !isEditing ? "bg-gray-50 text-gray-600 border-gray-200" : 
                            validationErrors.telefon ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                          }`}
                        />
                        {validationErrors.telefon && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.telefon}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                        placeholder="contact@companie.ro"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          !isEditing ? "bg-gray-50 text-gray-600 border-gray-200" : 
                          validationErrors.email ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>
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
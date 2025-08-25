import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Save,
  Edit,
  X,
  Check,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Monitor,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Trash2,
  Key,
  LogOut,
  Settings,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Languages,
  Palette,
  Zap,
  Database,
} from "lucide-react";

const SetariCont = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [profileData, setProfileData] = useState({
    nume: "Chiriac Alexandru",
    email: "chiriac1910@gmail.com",
    telefon: "+40 721 123 456",
    pozitie: "Administrator Sistem",
    companie: "SC ContIQ Solutions SRL",
    locatie: "București, România",
    bio: "Administrator sistem cu experiență în dezvoltarea și implementarea soluțiilor de management pentru companii.",
    website: "www.contiq.ro",
    linkedin: "linkedin.com/in/chiriac-alexandru"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      documente_noi: true,
      cereri_concediu: true,
      scadente: true,
      newsletter: false,
      marketing: false
    },
    push: {
      documente_noi: true,
      cereri_concediu: true,
      scadente: false,
      mesaje: true
    },
    sms: {
      urgente: true,
      autentificare: true
    }
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: "60",
    loginNotifications: true,
    deviceTracking: true
  });

  const [preferences, setPreferences] = useState({
    tema: "light",
    limba: "ro",
    timezone: "Europe/Bucharest",
    dateFormat: "dd/MM/yyyy",
    currency: "RON",
    sounds: true,
    animations: true,
    compactMode: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState([]);

  const handleInputChange = (section, field, value) => {
    switch (section) {
      case "profile":
        setProfileData(prev => ({ ...prev, [field]: value }));
        break;
      case "notifications":
        setNotificationSettings(prev => ({
          ...prev,
          [field.split('.')[0]]: {
            ...prev[field.split('.')[0]],
            [field.split('.')[1]]: value
          }
        }));
        break;
      case "security":
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
        break;
      case "preferences":
        setPreferences(prev => ({ ...prev, [field]: value }));
        break;
      case "password":
        setPasswordForm(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Simulate success notification
    showNotification("success", "Setările au fost salvate cu succes");
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("error", "Parolele nu se potrivesc");
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      showNotification("error", "Parola trebuie să aibă minim 8 caractere");
      return;
    }

    showNotification("success", "Parola a fost schimbată cu succes");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const connectedDevices = [
    { name: "Windows PC", location: "București", lastActive: "Acum", current: true },
    { name: "iPhone 13", location: "București", lastActive: "Acum 2h", current: false },
    { name: "Chrome Browser", location: "Cluj-Napoca", lastActive: "Ieri", current: false }
  ];

  const activityLog = [
    { action: "Login reușit", device: "Windows PC", time: "Acum 10 minute", ip: "192.168.1.1" },
    { action: "Schimbare parolă", device: "Windows PC", time: "Acum 2 zile", ip: "192.168.1.1" },
    { action: "Login reușit", device: "iPhone", time: "Acum 1 săptămână", ip: "10.0.0.1" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="responsive-title">
              Setări Cont
            </h1>
            <p className="mt-1 body-small">
              Gestionează profilul și preferințele tale
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
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <User className="w-5 h-5 mr-2 inline" />
            Profil
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "security"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Shield className="w-5 h-5 mr-2 inline" />
            Securitate
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "notifications"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Bell className="w-5 h-5 mr-2 inline" />
            Notificări
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "preferences"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Settings className="w-5 h-5 mr-2 inline" />
            Preferințe
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "activity"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Activity className="w-5 h-5 mr-2 inline" />
            Activitate
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="section-title mb-6">
                  Informații Personale
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nume Complet
                      </label>
                      <input
                        type="text"
                        value={profileData.nume}
                        onChange={(e) => handleInputChange("profile", "nume", e.target.value)}
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
                        value={profileData.email}
                        onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={profileData.telefon}
                        onChange={(e) => handleInputChange("profile", "telefon", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Poziție
                      </label>
                      <input
                        type="text"
                        value={profileData.pozitie}
                        onChange={(e) => handleInputChange("profile", "pozitie", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Companie
                    </label>
                    <input
                      type="text"
                      value={profileData.companie}
                      onChange={(e) => handleInputChange("profile", "companie", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Locație
                    </label>
                    <input
                      type="text"
                      value={profileData.locatie}
                      onChange={(e) => handleInputChange("profile", "locatie", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Despre Mine
                    </label>
                    <textarea
                      rows="3"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("profile", "bio", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "bg-gray-50 text-gray-600" : ""
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => handleInputChange("profile", "website", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={profileData.linkedin}
                        onChange={(e) => handleInputChange("profile", "linkedin", e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Poză de Profil
                </h3>
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    CA
                  </div>
                  {isEditing && (
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                        <Upload className="w-4 h-4 mr-2 inline" />
                        Încarcă Poză
                      </button>
                      <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                        <Camera className="w-4 h-4 mr-2 inline" />
                        Fă o Poză
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Profilul Tău
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-blue-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Profil completat 95%
                  </div>
                  <div className="flex items-center text-blue-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Cont verificat
                  </div>
                  <div className="flex items-center text-blue-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Activ azi
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Schimbare Parolă
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parola Curentă
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => handleInputChange("password", "currentPassword", e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parola Nouă
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => handleInputChange("password", "newPassword", e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmă Parola
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handleInputChange("password", "confirmPassword", e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Schimbă Parola
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Autentificare cu Doi Factori
                </h3>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        2FA Activat
                      </p>
                      <p className="text-xs text-green-700">
                        Contul tău este protejat
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-green-200 rounded-lg text-sm text-green-700 hover:bg-green-50">
                    Configurează
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Dispozitive Conectate
                </h3>
                <div className="space-y-3">
                  {connectedDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          {device.name.includes("PC") ? (
                            <Monitor className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Smartphone className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {device.name}
                            {device.current && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-lg">
                                Actual
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {device.location} • {device.lastActive}
                          </p>
                        </div>
                      </div>
                      {!device.current && (
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Deconectează
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-900 mb-3">
                  Zona Periculoasă
                </h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-white border border-red-200 rounded-lg hover:border-red-300 text-sm font-medium text-red-700 hover:text-red-800">
                    <LogOut className="w-4 h-4 mr-2" />
                    Deconectează Toate Sesiunile
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Șterge Contul
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Notificări Email
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Documente noi</p>
                      <p className="text-xs text-gray-500">Primește notificări pentru documente încărcate</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email.documente_noi}
                      onChange={(e) => handleInputChange("notifications", "email.documente_noi", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cereri concediu</p>
                      <p className="text-xs text-gray-500">Notificări pentru aprobare/respingere cereri</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email.cereri_concediu}
                      onChange={(e) => handleInputChange("notifications", "email.cereri_concediu", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Scadențe importante</p>
                      <p className="text-xs text-gray-500">Alerte pentru termene apropiate</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email.scadente}
                      onChange={(e) => handleInputChange("notifications", "email.scadente", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Newsletter</p>
                      <p className="text-xs text-gray-500">Noutăți și actualizări săptămânale</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email.newsletter}
                      onChange={(e) => handleInputChange("notifications", "email.newsletter", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Marketing</p>
                      <p className="text-xs text-gray-500">Oferte și promovări speciale</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email.marketing}
                      onChange={(e) => handleInputChange("notifications", "email.marketing", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Notificări Push
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Documente noi</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.push.documente_noi}
                      onChange={(e) => handleInputChange("notifications", "push.documente_noi", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cereri concediu</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.push.cereri_concediu}
                      onChange={(e) => handleInputChange("notifications", "push.cereri_concediu", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mesaje</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.push.mesaje}
                      onChange={(e) => handleInputChange("notifications", "push.mesaje", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Notificări SMS
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Situații urgente</p>
                      <p className="text-xs text-gray-500">Probleme critice de sistem</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.sms.urgente}
                      onChange={(e) => handleInputChange("notifications", "sms.urgente", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Coduri autentificare</p>
                      <p className="text-xs text-gray-500">Coduri pentru 2FA</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.sms.autentificare}
                      onChange={(e) => handleInputChange("notifications", "sms.autentificare", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Gestionarea Notificărilor
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Poți activa/dezactiva notificările oricând. Recomandăm să păstrezi 
                  activate notificările importante pentru securitate.
                </p>
                <button className="text-blue-600 text-sm hover:text-blue-800">
                  Vezi toate tipurile de notificări →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Aspect și Interfață
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temă
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleInputChange("preferences", "tema", "light")}
                        className={`p-3 rounded-lg border text-center ${
                          preferences.tema === "light"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <Sun className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">Luminoasă</span>
                      </button>
                      <button
                        onClick={() => handleInputChange("preferences", "tema", "dark")}
                        className={`p-3 rounded-lg border text-center ${
                          preferences.tema === "dark"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <Moon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">Întunecată</span>
                      </button>
                      <button
                        onClick={() => handleInputChange("preferences", "tema", "auto")}
                        className={`p-3 rounded-lg border text-center ${
                          preferences.tema === "auto"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <Monitor className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">Auto</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Limba
                    </label>
                    <select
                      value={preferences.limba}
                      onChange={(e) => handleInputChange("preferences", "limba", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ro">Română</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sunete</p>
                      <p className="text-xs text-gray-500">Sunete pentru notificări</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.sounds}
                      onChange={(e) => handleInputChange("preferences", "sounds", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Animații</p>
                      <p className="text-xs text-gray-500">Efecte de tranziție</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.animations}
                      onChange={(e) => handleInputChange("preferences", "animations", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mod Compact</p>
                      <p className="text-xs text-gray-500">Interfață mai densă</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.compactMode}
                      onChange={(e) => handleInputChange("preferences", "compactMode", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Regional și Format
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fus Orar
                    </label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => handleInputChange("preferences", "timezone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Europe/Bucharest">Europa/București</option>
                      <option value="Europe/London">Europa/Londra</option>
                      <option value="Europe/Paris">Europa/Paris</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format Dată
                    </label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => handleInputChange("preferences", "dateFormat", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                      <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monedă
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => handleInputChange("preferences", "currency", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="RON">RON - Leu românesc</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dolar american</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Acțiuni Rapide
                </h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 text-sm font-medium text-gray-700 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export Setări
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-green-300 text-sm font-medium text-gray-700 hover:text-green-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Setări
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Activitate Recentă
                </h2>
                
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.device} • {activity.time}
                        </p>
                        <p className="text-xs text-gray-400">
                          IP: {activity.ip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Statistici Cont
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">127</div>
                    <div className="text-sm text-blue-700">Zile active</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1,247</div>
                    <div className="text-sm text-green-700">Documente</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">89</div>
                    <div className="text-sm text-purple-700">Șabloane</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">24</div>
                    <div className="text-sm text-orange-700">Angajați</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">
                  Recomandări Securitate
                </h4>
                <ul className="text-sm text-white space-y-1">
                  <li>• Activează autentificarea cu doi factori</li>
                  <li>• Verifică dispozitivele conectate regulat</li>
                  <li>• Folosește o parolă puternică unică</li>
                  <li>• Păstrează aplicația actualizată</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetariCont;
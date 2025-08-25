import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  Phone,
  MapPin,
  UserPlus,
  CheckCircle,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Pas 1 - Date personale
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Pas 2 - Date companie
    companyName: "",
    companyType: "",
    cui: "",
    address: "",
    city: "",
    county: "",
    
    // Pas 3 - Preferințe
    agreeToTerms: false,
    agreeToNewsletter: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Prenumele este obligatoriu';
      if (!formData.lastName.trim()) newErrors.lastName = 'Numele este obligatoriu';
      if (!formData.email) {
        newErrors.email = 'Email-ul este obligatoriu';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email-ul nu este valid';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Telefonul este obligatoriu';
      if (!formData.password) {
        newErrors.password = 'Parola este obligatorie';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Parola trebuie să aibă cel puțin 6 caractere';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Parolele nu se potrivesc';
      }
    }
    
    if (step === 2) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Numele companiei este obligatoriu';
      if (!formData.companyType) newErrors.companyType = 'Tipul companiei este obligatoriu';
      if (!formData.cui.trim()) newErrors.cui = 'CUI-ul este obligatoriu';
      if (!formData.address.trim()) newErrors.address = 'Adresa este obligatorie';
      if (!formData.city.trim()) newErrors.city = 'Orașul este obligatoriu';
      if (!formData.county.trim()) newErrors.county = 'Județul este obligatoriu';
    }
    
    if (step === 3) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'Trebuie să accepți termenii și condițiile';
      }
    }
    
    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep(3);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulare înregistrare
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration successful:', formData);
      // Redirect după înregistrare cu succes
      // window.location.href = '/dashboard';
      
    } catch (error) {
      setErrors({ general: 'Eroare la înregistrare. Te rugăm să încerci din nou.' });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Clock,
      title: "Economisește timp",
      description: "Automatizează procesele repetitive și concentrează-te pe creșterea afacerii"
    },
    {
      icon: Shield,
      title: "Securitate maximă",
      description: "Datele tale sunt protejate cu cele mai avansate tehnologii de criptare"
    },
    {
      icon: Zap,
      title: "Performanță superioară",
      description: "Platformă rapidă și eficientă, optimizată pentru companiile românești"
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="section-title">Date personale</h2>
              <p className="body-small text-muted">Completează informațiile tale personale</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Prenume</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Ion"
                  />
                </div>
                {errors.firstName && <p className="form-error">{errors.firstName}</p>}
              </div>

              <div>
                <label className="form-label">Nume</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Popescu"
                />
                {errors.lastName && <p className="form-error">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="ion.popescu@exemplu.com"
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div>
              <label className="form-label">Telefon</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="+40 123 456 789"
                />
              </div>
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Parola</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Introdu parola"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div>
                <label className="form-label">Confirmă parola</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Confirmă parola"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="section-title">Date companie</h2>
              <p className="body-small text-muted">Informații despre compania ta</p>
            </div>

            <div>
              <label className="form-label">Nume companie</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Tech Solutions SRL"
                />
              </div>
              {errors.companyName && <p className="form-error">{errors.companyName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Tip societate</label>
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.companyType ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Selectează tipul</option>
                  <option value="SRL">SRL</option>
                  <option value="SA">SA</option>
                  <option value="PFA">PFA</option>
                  <option value="II">Întreprindere individuală</option>
                  <option value="ONG">ONG</option>
                </select>
                {errors.companyType && <p className="form-error">{errors.companyType}</p>}
              </div>

              <div>
                <label className="form-label">CUI</label>
                <input
                  type="text"
                  name="cui"
                  value={formData.cui}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.cui ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="RO12345678"
                />
                {errors.cui && <p className="form-error">{errors.cui}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">Adresa</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Str. Exemplu Nr. 123"
                />
              </div>
              {errors.address && <p className="form-error">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Oraș</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="București"
                />
                {errors.city && <p className="form-error">{errors.city}</p>}
              </div>

              <div>
                <label className="form-label">Județ</label>
                <input
                  type="text"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.county ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="București"
                />
                {errors.county && <p className="form-error">{errors.county}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="section-title">Finalizare cont</h2>
              <p className="body-small text-muted">Ultimele detalii pentru finalizarea contului</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="card-title mb-4">Rezumatul datelor</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="body-small text-muted">Nume complet:</span>
                  <span className="body-small font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-muted">Email:</span>
                  <span className="body-small font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-muted">Companie:</span>
                  <span className="body-small font-medium">{formData.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-muted">Tip:</span>
                  <span className="body-small font-medium">{formData.companyType}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                />
                <div className="ml-3">
                  <label className="body-small">
                    Sunt de acord cu{' '}
                    <Link to="/terms" className="text-orange-600 hover:text-orange-700">
                      termenii și condițiile
                    </Link>
                    {' '}și{' '}
                    <Link to="/privacy" className="text-orange-600 hover:text-orange-700">
                      politica de confidențialitate
                    </Link>
                  </label>
                  {errors.agreeToTerms && <p className="form-error">{errors.agreeToTerms}</p>}
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToNewsletter"
                  checked={formData.agreeToNewsletter}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                />
                <label className="body-small ml-3">
                  Doresc să primesc newsletter-ul cu noutăți și oferte speciale
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      <div className="flex min-h-screen">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white p-12">
          <div className="max-w-lg mx-auto">
            <div className="mb-12">
              <h2 className="responsive-title text-white mb-4">
                Alătură-te comunității ContIQ
              </h2>
              <p className="body-large text-white">
                Peste 10,000+ companii au ales deja ContIQ pentru gestionarea afacerilor. 
                Fii următorul care îți optimizează procesele!
              </p>
            </div>

            <div className="space-y-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="card-title text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="body-small text-white">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <div className="flex items-center space-x-4 text-white">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">JP</span>
                  </div>
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">MA</span>
                  </div>
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">IC</span>
                  </div>
                </div>
                <div>
                  <p className="body-small font-medium">Înregistrări recent</p>
                  <p className="meta-text">3 companii în ultima oră</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="page-title text-center">
                Creează un cont ContIQ
              </h1>
              <p className="body-small text-center mt-2">
                Începe să gestionezi afacerea mai eficient
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      step <= currentStep 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{step}</span>
                      )}
                    </div>
                    {step < 3 && (
                      <div className={`h-1 w-12 mx-2 transition-all duration-200 ${
                        step < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="body-xs">Date personale</span>
                <span className="body-xs">Date companie</span>
                <span className="body-xs">Finalizare</span>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={currentStep === 3 ? handleSubmit : undefined}>
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="body-small text-red-600">{errors.general}</p>
                  </div>
                )}

                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center"
                    >
                      Înapoi
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className={`px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200 flex items-center ${
                        currentStep === 1 ? 'ml-auto' : ''
                      }`}
                    >
                      Continuă
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center ${
                        isLoading
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                      ) : (
                        <UserPlus className="w-5 h-5 mr-2" />
                      )}
                      {isLoading ? 'Se creează contul...' : 'Creează contul'}
                    </button>
                  )}
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6 pt-6 border-t border-gray-100">
                <p className="body-small">
                  Ai deja un cont?{' '}
                  <Link
                    to="/login"
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Conectează-te aici
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="meta-text">
                © 2024 ContIQ. Toate drepturile rezervate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
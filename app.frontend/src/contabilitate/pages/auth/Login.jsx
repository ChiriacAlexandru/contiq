import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  CheckCircle,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email-ul nu este valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Parola este obligatorie';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Parola trebuie să aibă cel puțin 6 caractere';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulare autentificare
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect la dashboard după autentificare cu succes
      console.log('Login successful:', formData);
      // window.location.href = '/dashboard';
      
    } catch (error) {
      setErrors({ general: 'Eroare la autentificare. Verificați datele introduse.' });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: FileText,
      title: "Gestiune Documente",
      description: "Administrează facturile și documentele cu ușurință"
    },
    {
      icon: Users,
      title: "Management Echipă",
      description: "Gestionează angajații și concediile eficient"
    },
    {
      icon: BarChart3,
      title: "Rapoarte & Analize",
      description: "Monitorizează performanțele în timp real"
    },
    {
      icon: Shield,
      title: "Securitate Avansată",
      description: "Datele tale sunt protejate cu criptare de nivel enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
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
                Bine ai venit înapoi
              </h1>
              <p className="body-small text-center mt-2">
                Conectează-te pentru a accesa platforma ContIQ
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="body-small text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="form-label">
                    Email
                  </label>
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
                      placeholder="nume@exemplu.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="form-error">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="form-label">
                    Parola
                  </label>
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
                  {errors.password && (
                    <p className="form-error">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label className="body-small ml-2">
                      Ține-mă minte
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="body-small text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Ai uitat parola?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                  ) : (
                    <LogIn className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Se conectează...' : 'Conectează-te'}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="body-small bg-white px-4 text-muted">
                      sau
                    </span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="body-small">
                    Nu ai un cont?{' '}
                    <Link
                      to="/register"
                      className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Înregistrează-te acum
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="meta-text">
                © 2024 ContIQ. Toate drepturile rezervate.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white p-12">
          <div className="max-w-lg mx-auto">
            <div className="mb-12">
              <h2 className="responsive-title text-white mb-4">
                Gestionează-ți afacerea cu ContIQ
              </h2>
              <p className="body-large text-white">
                Platforma completă pentru contabilitate și management business. 
                Simplu, rapid și securizat.
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="card-title text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="body-small text-white">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-300 mr-2" />
                <span className="body-small text-white font-medium">
                  Încrederea a peste 10,000+ companii
                </span>
              </div>
              <p className="body-small text-white">
                "ContIQ ne-a simplificat procesele de contabilitate și ne-a economisit ore întregi pe săptămână."
              </p>
              <p className="body-small text-white mt-2 font-medium">
                - Maria Popescu, CEO TechStart SRL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
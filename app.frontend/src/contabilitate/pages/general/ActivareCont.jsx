import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../../config/api";
import {
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  Shield,
  TrendingUp,
  RefreshCw,
  LogOut,
  User,
  Building,
  CreditCard,
  Calendar,
} from "lucide-react";

const ActivareCont = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [countdown, setCountdown] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    // Get user data from localStorage or context
    const userData = AuthService.getCurrentUser();
    setUser(userData);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    if (window.confirm('Ești sigur că vrei să te deconectezi?')) {
      AuthService.logout();
      navigate('/login');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const benefits = [
    {
      icon: Building,
      title: "Gestiune Complet",
      description: "Administreaz toate aspectele companiei tale dintr-un singur loc"
    },
    {
      icon: CreditCard,
      title: "Facturare Automat",
      description: "Genereaz i trimite facturi automat ctre clieni"
    },
    {
      icon: User,
      title: "Management Angajai",
      description: "Gestioneaz echipa, concediile i performanele"
    },
    {
      icon: Calendar,
      title: "Raportare �n Timp Real",
      description: "Monitorizeaz performanele i analizele business"
    }
  ];

  const activationSteps = [
    {
      step: 1,
      title: "Verificare Date",
      description: "Administratorul verific informaiile contului tu",
      status: "completed"
    },
    {
      step: 2,
      title: "Validare Companie",
      description: "Se valideaz datele companiei i documentele",
      status: "in-progress"
    },
    {
      step: 3,
      title: "Activare Cont",
      description: "Contul va fi activat i vei primi acces complet",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="flex min-h-screen">
        {/* Left Side - Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30 relative">
                  <Clock className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Cont �n Curs de Activare
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                Mulumim pentru �nregistrare! Contul tu este �n proces de verificare i va fi activat �n cur�nd.
              </p>
              
              {/* Countdown Timer */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Timp estimat rmas</span>
                </div>
                <div className="text-2xl font-bold font-mono">
                  {formatTime(countdown)}
                </div>
                <p className="text-sm mt-1 opacity-90">
                  Procesul de activare dureaz �n medie 24 de ore
                </p>
              </div>
            </div>

            {/* Activation Steps */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Proces de Activare
              </h2>
              
              <div className="space-y-4">
                {activationSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : step.status === 'in-progress'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : step.status === 'in-progress' ? (
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      ) : (
                        step.step
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ai �ntrebri?
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Email Support</p>
                    <a href="mailto:support@contiq.ro" className="text-sm text-blue-600 hover:text-blue-800">
                      support@contiq.ro
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Telefon</p>
                    <a href="tel:+40312345678" className="text-sm text-green-600 hover:text-green-800">
                      +40 312 345 678
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Chat Live</p>
                    <span className="text-sm text-purple-600">
                      Disponibil L-V, 09:00-17:00
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRefresh}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Verific Status
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Deconectare
              </button>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                � 2024 ContIQ. Toate drepturile rezervate.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center bg-gradient-to-br from-orange-500 to-red-600 text-white p-12">
          <div className="max-w-lg mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                �n Cur�nd Vei Avea Acces La
              </h2>
              <p className="text-lg text-white leading-relaxed">
                Platforma complet ContIQ �i va oferi toate instrumentele necesare 
                pentru gestionarea eficient a afacerii tale.
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
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-white">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-6 bg-white/10 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">
                Activare Rapid
              </h3>
              <p className="text-sm text-white mb-4">
                Echipa noastr lucreaz pentru a-i activa contul c�t mai repede posibil. 
                Vei primi o notificare prin email imediat ce procesul este finalizat.
              </p>
              <div className="flex items-center text-sm text-white">
                <Shield className="w-4 h-4 mr-2" />
                Verificare securizat i conform GDPR
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivareCont;
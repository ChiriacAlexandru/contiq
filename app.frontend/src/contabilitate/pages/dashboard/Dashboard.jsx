import React from "react";
import {
  FileText,
  FileInput,
  BarChart3,
  Users,
  Package,
  Calendar,
  Plus,
  ArrowRight,
  Activity,
  Clock,
  HelpCircle,
} from "lucide-react";

const Dashboard = () => {
  const statsCards = [
    {
      title: "Facturi",
      value: "2",
      change: "+0.0%",
      icon: FileText,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Documente de intrare",
      value: "0",
      change: "0%",
      icon: FileInput,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
    },
    {
      title: "Angajați",
      value: "0",
      change: "0%",
      icon: Users,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Concedii active",
      value: "0",
      change: "0%",
      icon: Calendar,
      color: "orange",
      bgGradient: "from-orange-500 to-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Factură nouă",
      description: "Creează o factură nouă",
      icon: Plus,
      color: "blue",
      bgColor: "bg-blue-500",
    },
    {
      title: "Document nou",
      description: "Adaugă un document de intrare",
      icon: FileInput,
      color: "green",
      bgColor: "bg-green-500",
    },
    {
      title: "Angajat nou",
      description: "Adaugă un nou angajat",
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-500",
    },
    {
      title: "Tichet nou",
      description: "Creează un tichet de suport",
      icon: Package,
      color: "orange",
      bgColor: "bg-orange-500",
    },
  ];

  const recentActivities = [
    {
      type: "invoice",
      title: "Factură creată",
      description: "Factura FDS002/2025",
      time: "41 zile în urmă",
      icon: FileText,
      color: "blue",
    },
    {
      type: "invoice",
      title: "Factură creată",
      description: "Factura FDS001/2025",
      time: "42 zile în urmă",
      icon: FileText,
      color: "blue",
    },
    {
      type: "product",
      title: "Produs adăugat",
      description: "Dezvoltare Web - 250 RON",
      time: "42 zile în urmă",
      icon: Package,
      color: "purple",
    },
  ];

  const systemStatus = [
    {
      label: "Sistem online",
      status: "Funcțional",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
    },
    {
      label: "Performanță",
      status: "98%",
      statusColor: "text-blue-600",
      dotColor: "bg-blue-500",
    },
    {
      label: "Backup",
      status: "Actualizat",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Acțiuni rapide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg ${action.bgColor} shadow-lg group-hover:shadow-xl transition-all duration-200`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activities & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Activitate recentă
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  Ultimele activități din platformă
                </p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 group"
                    >
                      <div
                        className={`p-2 rounded-lg bg-${activity.color}-50 group-hover:bg-${activity.color}-100 transition-all duration-200`}
                      >
                        <IconComponent
                          className={`w-4 h-4 text-${activity.color}-600`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sistemul tău
                </h2>
                <p className="text-sm text-gray-500">Status și performanță</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {systemStatus.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 ${item.dotColor} rounded-full mr-3 animate-pulse`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center text-white hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200 z-30">
        <Plus className="w-6 h-6" />
      </button>

      {/* Help Button */}
      <button className="fixed bottom-6 right-20 lg:bottom-6 lg:right-6 w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 z-30">
        <HelpCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;

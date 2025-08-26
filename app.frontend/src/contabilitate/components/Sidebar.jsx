import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../config/api";
import {
  Home,
  FileText,
  FileInput,
  BarChart3,
  Users,
  Package,
  User,
  Calendar,
  File,
  MessageCircle,
  Settings,
  Wrench,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(["Contracte"]);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Documente de ieșire", path: "/documente-iesire" },
    { icon: FileInput, label: "Documente de intrare", path: "/documente-intrare" },
    {
      icon: BarChart3,
      label: "Contracte",
      hasSubmenu: true,
      submenu: [
        { icon: Users, label: "Clienți", path: "/clienti" },
        { icon: Package, label: "Produse", path: "/produse" },
        { icon: User, label: "Angajați", path: "/angajati" },
        { icon: Calendar, label: "Concedii", path: "/concedii" },
      ],
    },
    { icon: File, label: "Șabloane", path: "/sabloane" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleMobileMenuClose = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (window.confirm('Ești sigur că vrei să te deconectezi?')) {
      AuthService.logout();
      navigate('/login');
    }
  };

  const getPageTitle = () => {
    const currentRoute = menuItems.find(item => 
      item.path === location.pathname || 
      (item.submenu && item.submenu.find(subItem => subItem.path === location.pathname))
    );
    
    if (currentRoute) {
      if (currentRoute.path === location.pathname) {
        return currentRoute.label;
      }
      const subRoute = currentRoute.submenu?.find(subItem => subItem.path === location.pathname);
      return subRoute?.label || "Dashboard";
    }
    
    // Handle settings pages
    if (location.pathname === '/date-firma') return 'Date firmă';
    if (location.pathname === '/setari-cont') return 'Setări cont';
    if (location.pathname === '/suport') return 'Suport';
    
    return "Dashboard";
  };

  return (
    <>
      {/* Mobile/Tablet Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ContIQ
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:sticky top-0 left-0 h-screen
        bg-white border-r border-gray-100
        transition-all duration-300 ease-out z-50
        ${
          isMobileMenuOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }
        ${isCollapsed ? "lg:w-20" : "w-72 lg:w-72"}
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div
            className={`flex items-center ${
              isCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ContIQ
              </h1>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isExpanded = expandedMenus.includes(item.label);
              const isActive = item.path ? isActiveRoute(item.path) : false;

              return (
                <li key={index}>
                  {item.hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                        transition-all duration-200 group
                        ${
                          isActive
                            ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 shadow-sm"
                            : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <div
                          className={`
                          p-2 rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? "bg-orange-500 shadow-lg shadow-orange-500/30"
                              : "bg-gray-100 group-hover:bg-gray-200"
                          }
                        `}
                        >
                          <IconComponent
                            className={`
                            w-5 h-5 transition-all duration-200
                            ${
                              isActive
                                ? "text-white"
                                : "text-gray-600 group-hover:text-gray-800"
                            }
                          `}
                          />
                        </div>
                        {!isCollapsed && (
                          <span
                            className={`
                            ml-3 font-medium transition-all duration-200
                            ${isActive ? "text-orange-700" : ""}
                          `}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && item.hasSubmenu && (
                        <ChevronDown
                          className={`
                          w-4 h-4 transition-transform duration-200
                          ${isExpanded ? "rotate-180" : ""}
                          ${isActive ? "text-orange-600" : "text-gray-400"}
                        `}
                        />
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleMobileMenuClose}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                        transition-all duration-200 group block
                        ${
                          isActive
                            ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 shadow-sm"
                            : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <div
                          className={`
                          p-2 rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? "bg-orange-500 shadow-lg shadow-orange-500/30"
                              : "bg-gray-100 group-hover:bg-gray-200"
                          }
                        `}
                        >
                          <IconComponent
                            className={`
                            w-5 h-5 transition-all duration-200
                            ${
                              isActive
                                ? "text-white"
                                : "text-gray-600 group-hover:text-gray-800"
                            }
                          `}
                          />
                        </div>
                        {!isCollapsed && (
                          <span
                            className={`
                            ml-3 font-medium transition-all duration-200
                            ${isActive ? "text-orange-700" : ""}
                          `}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Submenu */}
                  {item.hasSubmenu && isExpanded && !isCollapsed && (
                    <ul className="mt-1 ml-5 space-y-1">
                      {item.submenu.map((subItem, subIndex) => {
                        const SubIconComponent = subItem.icon;
                        const isSubActive = isActiveRoute(subItem.path);

                        return (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              onClick={handleMobileMenuClose}
                              className={`
                                w-full flex items-center px-3 py-2 rounded-lg
                                transition-all duration-200 group block
                                ${
                                  isSubActive
                                    ? "bg-orange-50 text-orange-600"
                                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                                }
                              `}
                            >
                              <SubIconComponent
                                className={`
                                w-4 h-4 mr-3 transition-all duration-200
                                ${
                                  isSubActive
                                    ? "text-orange-500"
                                    : "text-gray-400 group-hover:text-gray-600"
                                }
                              `}
                              />
                              <span
                                className={`text-sm ${
                                  isSubActive ? "font-medium" : ""
                                }`}
                              >
                                {subItem.label}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Support Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              to="/suport"
              onClick={handleMobileMenuClose}
              className={`
                w-full flex items-center px-3 py-2.5 rounded-xl
                transition-all duration-200 group block
                ${
                  isActiveRoute("/suport")
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600"
                    : "hover:bg-gray-50 text-gray-700"
                }
              `}
            >
              <div
                className={`
                p-2 rounded-lg transition-all duration-200
                ${
                  isActiveRoute("/suport")
                    ? "bg-blue-500 shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }
              `}
              >
                <MessageCircle
                  className={`
                  w-5 h-5
                  ${
                    isActiveRoute("/suport")
                      ? "text-white"
                      : "text-gray-600 group-hover:text-gray-800"
                  }
                `}
                />
              </div>
              {!isCollapsed && <span className="ml-3 font-medium">Suport</span>}
            </Link>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-100 p-4 bg-gradient-to-br from-gray-50 to-white">
          {!isCollapsed ? (
            <>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/30">
                  CA
                </div>
                <div className="ml-3">
                  <div className="text-sm text-gray-600 font-semibold text-gray-800">
                    Chiriac Alexandru
                  </div>
                  <div className="text-xs text-gray-500">
                    chiriac1910@gmail.com
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1">
                <Link 
                  to="/date-firma"
                  onClick={handleMobileMenuClose}
                  className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-200 group block ${
                    isActiveRoute("/date-firma") 
                      ? "bg-orange-50 text-orange-600" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className={`w-4 h-4 mr-3 ${
                    isActiveRoute("/date-firma") 
                      ? "text-orange-500" 
                      : "text-gray-400 group-hover:text-gray-600"
                  }`} />
                  Date firmă
                </Link>
                <Link 
                  to="/setari-cont"
                  onClick={handleMobileMenuClose}
                  className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-200 group block ${
                    isActiveRoute("/setari-cont") 
                      ? "bg-orange-50 text-orange-600" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Wrench className={`w-4 h-4 mr-3 ${
                    isActiveRoute("/setari-cont") 
                      ? "text-orange-500" 
                      : "text-gray-400 group-hover:text-gray-600"
                  }`} />
                  Setări cont
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-600" />
                  Deconectare
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/30">
                CA
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Deconectare"
              >
                <LogOut className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Content Area */}
      <div className="lg:hidden h-20"></div>
    </>
  );
};

export default Sidebar;

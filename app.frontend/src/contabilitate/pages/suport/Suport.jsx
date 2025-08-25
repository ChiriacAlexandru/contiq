import React, { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Search,
  BookOpen,
  Video,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Send,
  Paperclip,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Download,
  Play,
  Calendar,
  Headphones,
  Shield,
  Zap,
  Coffee,
  Award,
  Target,
  TrendingUp,
  Globe,
  Smartphone,
} from "lucide-react";

const Suport = () => {
  const [activeTab, setActiveTab] = useState("help");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "normal",
    description: "",
    attachments: []
  });
  const [showContactModal, setShowContactModal] = useState(false);

  const helpCategories = [
    {
      id: 1,
      title: "Comenzi Rapide",
      description: "Învață să folosești eficient aplicația",
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      articlesCount: 12,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Gestiune Documente",
      description: "Tot ce trebuie să știi despre documente",
      icon: <FileText className="w-8 h-8 text-green-500" />,
      articlesCount: 18,
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      title: "Contracte și Angajați",
      description: "Management HR și contracte",
      icon: <Users className="w-8 h-8 text-purple-500" />,
      articlesCount: 15,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      title: "Șabloane",
      description: "Crearea și utilizarea șabloanelorr",
      icon: <BookOpen className="w-8 h-8 text-orange-500" />,
      articlesCount: 8,
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 5,
      title: "Securitate",
      description: "Protecția datelor și cont",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      articlesCount: 6,
      color: "from-red-500 to-red-600"
    },
    {
      id: 6,
      title: "Integrări",
      description: "Conectarea cu alte aplicații",
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      articlesCount: 10,
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const faqData = [
    {
      id: 1,
      question: "Cum pot să adaug un angajat nou în sistem?",
      answer: "Pentru a adăuga un angajat nou, mergi la secțiunea 'Contracte' > 'Angajați', apoi apasă pe butonul 'Adaugă Angajat'. Completează toate câmpurile obligatorii: nume, funcție, departament, email și telefon. Poți seta și informații suplimentare precum salariul, contractul și statusul.",
      category: "angajati",
      helpful: 24,
      views: 156
    },
    {
      id: 2,
      question: "Ce tipuri de documente pot încărca în sistem?",
      answer: "Sistemul acceptă următoarele formate: PDF, DOCX, XLSX, JPG, PNG. Dimensiunea maximă per fișier este de 10MB. Poți încărca contracte, facturi, chitanțe, procese verbale și orice alt document relevant pentru activitatea companiei.",
      category: "documente",
      helpful: 31,
      views: 203
    },
    {
      id: 3,
      question: "Cum pot să creez un șablon personalizat?",
      answer: "Pentru a crea un șablon nou, accesează secțiunea 'Șabloane' și apasă 'Șablon Nou'. Alege tipul de document, completează informațiile de bază și definește câmpurile personalizabile. Poți încărca un fișier template existent sau poți crea unul nou folosind editorul integrat.",
      category: "sabloane",
      helpful: 18,
      views: 89
    },
    {
      id: 4,
      question: "Cum funcționează sistemul de concedii?",
      answer: "Sistemul de concedii permite crearea, aprobarea și gestionarea cererilor de concediu. Angajații pot depune cereri, managerii pot aproba/respinge, iar HR-ul poate monitoriza zilele rămase pentru fiecare angajat. Toate concediile sunt trackuite automat.",
      category: "concedii",
      helpful: 22,
      views: 134
    },
    {
      id: 5,
      question: "Pot să export datele din sistem?",
      answer: "Da, poți exporta date din orice secțiune a aplicației. Folosește funcția de export disponibilă în fiecare pagină pentru a descărca informațiile în format Excel sau PDF. Poți selecta câmpurile specifice pe care vrei să le incluzi în export.",
      category: "export",
      helpful: 15,
      views: 76
    },
    {
      id: 6,
      question: "Cum îmi resetez parola?",
      answer: "Pentru a-ți reseta parola, click pe 'Am uitat parola' din pagina de login. Introdu adresa de email și vei primi un link de resetare. Alternativ, poți contacta administratorul sistem pentru asistență directă.",
      category: "cont",
      helpful: 28,
      views: 187
    },
    {
      id: 7,
      question: "Există o aplicație mobilă disponibilă?",
      answer: "Momentan, ContIQ este disponibil ca aplicație web optimizată pentru mobile. Poți accesa toate funcțiile prin browserul telefonului. O aplicație nativă este în dezvoltare și va fi disponibilă în curând.",
      category: "mobile",
      helpful: 12,
      views: 98
    },
    {
      id: 8,
      question: "Cum pot să configurez notificările?",
      answer: "Mergi la 'Setări cont' > 'Notificări' pentru a configura ce notificări vrei să primești și prin ce canale (email, SMS, push). Poți seta notificări pentru documente noi, cereri de concediu, scadențe și multe altele.",
      category: "setari",
      helpful: 19,
      views: 112
    }
  ];

  const supportTickets = [
    {
      id: 1,
      subject: "Problemă la încărcarea documentelor",
      status: "open",
      priority: "high",
      created: "2025-08-23",
      lastUpdate: "2025-08-24",
      category: "Technical",
      messages: 3
    },
    {
      id: 2,
      subject: "Solicitare funcție nouă - rapoarte",
      status: "in_progress",
      priority: "normal",
      created: "2025-08-20",
      lastUpdate: "2025-08-22",
      category: "Feature Request",
      messages: 5
    },
    {
      id: 3,
      subject: "Întrebare despre export date",
      status: "resolved",
      priority: "low",
      created: "2025-08-18",
      lastUpdate: "2025-08-19",
      category: "Question",
      messages: 2
    }
  ];

  const quickActions = [
    { icon: Video, title: "Tutorial Video", description: "Ghid complet de utilizare" },
    { icon: Download, title: "Ghid PDF", description: "Manual utilizator detaliat" },
    { icon: Calendar, title: "Programează Demo", description: "Sesiune personalizată" },
    { icon: Phone, title: "Suport Telefonic", description: "Vorbește cu un expert" }
  ];

  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-700";
      case "in_progress":
        return "bg-yellow-100 text-white";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "normal":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    console.log("Ticket submitted:", ticketForm);
    // Reset form
    setTicketForm({
      subject: "",
      category: "",
      priority: "normal",
      description: "",
      attachments: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="responsive-title mb-2">
              Centru de Suport
            </h1>
            <p className="text-lg text-gray-600">
              Găsește răspunsuri rapid sau contactează echipa noastră
            </p>
          </div>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Caută în baza de cunoștințe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <action.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
                <p className="text-xs text-gray-500 text-center mt-1">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab("help")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "help"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2 inline" />
            Bază de Cunoștințe
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "faq"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <MessageCircle className="w-5 h-5 mr-2 inline" />
            Întrebări Frecvente
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "tickets"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Headphones className="w-5 h-5 mr-2 inline" />
            Tichetele Mele
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "contact"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Phone className="w-5 h-5 mr-2 inline" />
            Contact
          </button>
        </div>

        {/* Help Categories Tab */}
        {activeTab === "help" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
              >
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {category.icon}
                  </div>
                  <h3 className="section-title mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.articlesCount} articole
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="page-title mb-6">
                Întrebări Frecvente
              </h2>
              <div className="space-y-4">
                {filteredFAQ.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{faq.views} vizualizări</span>
                            <span>{faq.helpful} consideră util</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">A fost util?</span>
                            <button className="p-1 hover:bg-white rounded transition-colors">
                              <ThumbsUp className="w-4 h-4 text-gray-500 hover:text-green-600" />
                            </button>
                            <button className="p-1 hover:bg-white rounded transition-colors">
                              <ThumbsDown className="w-4 h-4 text-gray-500 hover:text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            {/* Create New Ticket */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="page-title mb-6">
                Creează Tichet de Suport
              </h2>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block form-label mb-1">
                      Subiect
                    </label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descrie pe scurt problema..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block form-label mb-1">
                      Categorie
                    </label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selectează categoria</option>
                      <option value="technical">Problemă Tehnică</option>
                      <option value="feature">Solicitare Funcție</option>
                      <option value="account">Cont și Facturare</option>
                      <option value="other">Altele</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioritate
                  </label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                    className="w-full md:w-48 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Scăzută</option>
                    <option value="normal">Normală</option>
                    <option value="high">Ridicată</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descriere Detaliată
                  </label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrie problema în detaliu..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atașamente
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Trage fișierele aici sau{" "}
                        <button type="button" className="text-blue-600 hover:text-blue-800">
                          selectează-le
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Trimite Tichet
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Tickets */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="section-title mb-4">
                Tichetele Tale
              </h3>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {ticket.subject}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>#{ticket.id}</span>
                          <span>{ticket.category}</span>
                          <span>{ticket.messages} mesaje</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Creat: {new Date(ticket.created).toLocaleDateString("ro-RO")}</span>
                      <span>Actualizat: {new Date(ticket.lastUpdate).toLocaleDateString("ro-RO")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Options */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="page-title mb-6">
                  Contactează-ne Direct
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Suport Telefonic</h3>
                      <p className="text-gray-600">+40 312 345 678</p>
                      <p className="text-sm text-gray-500">Luni - Vineri, 8:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email Suport</h3>
                      <p className="text-gray-600">suport@contiq.ro</p>
                      <p className="text-sm text-gray-500">Răspuns în max 24h</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Chat Live</h3>
                      <p className="text-gray-600">Disponibil acum</p>
                      <button className="text-sm text-purple-600 hover:text-purple-800">
                        Începe conversația
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="card-title mb-4">
                  Program Suport
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Luni - Vineri</span>
                    <span className="text-gray-900">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sâmbătă</span>
                    <span className="text-gray-900">9:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duminică</span>
                    <span className="text-gray-900">Închis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="section-title mb-6">
                Trimite-ne un Mesaj
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nume
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numele tău"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@exemple.ro"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Companie
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Numele companiei"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subiect
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Despre ce vrei să ne vorbești?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mesajul tău..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Trimite Mesajul
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suport;
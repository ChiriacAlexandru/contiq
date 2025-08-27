import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  Filter,
  Download,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Calendar,
  ChevronDown,
  X,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
  Copy,
  Send,
  CreditCard,
  Loader2,
  ShoppingCart,
} from "lucide-react";

import { DocumentsService, ClientsService, ProductsService } from "../../../config/api";

const DocumenteIesire = () => {
  // State management
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [relatedData, setRelatedData] = useState({
    documentTypes: [],
    documentStatuses: [],
    paymentStatuses: [],
    currencies: [],
    paymentMethods: []
  });
  
  // UI State
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  
  // Client & Product Search
  const [clientSearch, setClientSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [clientResults, setClientResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [showClientResults, setShowClientResults] = useState(false);
  const [showProductResults, setShowProductResults] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    tip_document: '',
    status_document: '',
    status_plata: '',
    client_id: '',
    data_de: '',
    data_pana: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    limit: 50,
    offset: 0
  });

  // Form data for document modal
  const [formData, setFormData] = useState({
    tip_document: 'factura',
    client_id: '',
    data_emitere: new Date().toISOString().split('T')[0],
    data_scadenta: '',
    data_livrare: '',
    observatii: '',
    conditii_plata: '',
    modalitate_transport: '',
    delegate_info: '',
    moneda: 'RON',
    modalitate_plata: 'transfer',
    status_document: 'draft',
    items: []
  });

  // New item form
  const [newItem, setNewItem] = useState({
    product_id: null,
    product_nume: '',
    product_cod: '',
    product_descriere: '',
    product_unitate_masura: 'buc',
    cantitate: 1,
    pret_unitar: 0,
    discount_procent: 0,
    cota_tva: 19,
    observatii: ''
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load documents when filters change
  useEffect(() => {
    if (!loading) {
      loadDocuments();
    }
  }, [filters]);

  // Client search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (clientSearch.length >= 2) {
        searchClients(clientSearch);
      } else {
        setClientResults([]);
        setShowClientResults(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [clientSearch]);

  // Product search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (productSearch.length >= 2) {
        searchProducts(productSearch);
      } else {
        setProductResults([]);
        setShowProductResults(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [productSearch]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [documentsData, statsData, relatedData] = await Promise.all([
        DocumentsService.getDocuments(filters),
        DocumentsService.getStatistics(),
        DocumentsService.getRelatedData()
      ]);

      setDocuments(documentsData.documents || []);
      setStatistics(statsData || {});
      setRelatedData(relatedData || {
        documentTypes: [],
        documentStatuses: [],
        paymentStatuses: [],
        currencies: [],
        paymentMethods: []
      });
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await DocumentsService.getDocuments(filters);
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError(error.message);
    }
  };

  const searchClients = async (searchTerm) => {
    try {
      const data = await ClientsService.getClients({
        search: searchTerm,
        limit: 10,
        offset: 0
      });
      setClientResults(data.clients || []);
      setShowClientResults(true);
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  const searchProducts = async (searchTerm) => {
    try {
      const data = await ProductsService.getProducts({
        search: searchTerm,
        limit: 10,
        offset: 0
      });
      setProductResults(data.products || []);
      setShowProductResults(true);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      tip_document: '',
      status_document: '',
      status_plata: '',
      client_id: '',
      data_de: '',
      data_pana: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      limit: 50,
      offset: 0
    });
  };

  const openDocumentModal = async (document = null, documentType = 'factura') => {
    if (document) {
      // Edit existing document
      const fullDocument = await DocumentsService.getDocument(document.id);
      setSelectedDocument(fullDocument);
      setFormData({
        tip_document: fullDocument.tip_document,
        client_id: fullDocument.client_id,
        data_emitere: fullDocument.data_emitere?.split('T')[0] || new Date().toISOString().split('T')[0],
        data_scadenta: fullDocument.data_scadenta?.split('T')[0] || '',
        data_livrare: fullDocument.data_livrare?.split('T')[0] || '',
        observatii: fullDocument.observatii || '',
        conditii_plata: fullDocument.conditii_plata || '',
        modalitate_transport: fullDocument.modalitate_transport || '',
        delegate_info: fullDocument.delegate_info || '',
        moneda: fullDocument.moneda || 'RON',
        modalitate_plata: fullDocument.modalitate_plata || 'transfer',
        status_document: fullDocument.status_document || 'draft',
        items: fullDocument.items || []
      });
      setClientSearch(fullDocument.client_nume || '');
    } else {
      // Create new document
      setSelectedDocument(null);
      
      // Get next document number
      try {
        const nextNumber = await DocumentsService.getNextDocumentNumber(documentType);
        setFormData({
          tip_document: documentType,
          client_id: '',
          data_emitere: new Date().toISOString().split('T')[0],
          data_scadenta: '',
          data_livrare: '',
          observatii: '',
          conditii_plata: '',
          modalitate_transport: '',
          delegate_info: '',
          moneda: 'RON',
          modalitate_plata: 'transfer',
          status_document: 'draft',
          items: []
        });
        setClientSearch('');
      } catch (error) {
        console.error('Error getting next document number:', error);
      }
    }
    
    setShowDocumentModal(true);
  };

  const closeDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
    setFormData({});
    setClientSearch('');
    setProductSearch('');
    setNewItem({
      product_id: null,
      product_nume: '',
      product_cod: '',
      product_descriere: '',
      product_unitate_masura: 'buc',
      cantitate: 1,
      pret_unitar: 0,
      discount_procent: 0,
      cota_tva: 19,
      observatii: ''
    });
  };

  const handleFormChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const selectClient = (client) => {
    setFormData(prev => ({
      ...prev,
      client_id: client.id
    }));
    setClientSearch(client.nume);
    setShowClientResults(false);
  };

  const selectProduct = (product) => {
    setNewItem(prev => ({
      ...prev,
      product_id: product.id,
      product_nume: product.nume,
      product_cod: product.cod,
      product_descriere: product.descriere,
      product_unitate_masura: product.unitate_masura,
      pret_unitar: parseFloat(product.pret_vanzare) || 0
    }));
    setProductSearch(product.nume);
    setShowProductResults(false);
  };

  const addItemToDocument = () => {
    if (!newItem.product_nume.trim()) {
      alert('Numele produsului este obligatoriu');
      return;
    }

    const item = {
      ...newItem,
      cantitate: parseFloat(newItem.cantitate) || 1,
      pret_unitar: parseFloat(newItem.pret_unitar) || 0,
      discount_procent: parseFloat(newItem.discount_procent) || 0,
      cota_tva: parseFloat(newItem.cota_tva) || 19
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    // Reset item form
    setNewItem({
      product_id: null,
      product_nume: '',
      product_cod: '',
      product_descriere: '',
      product_unitate_masura: 'buc',
      cantitate: 1,
      pret_unitar: 0,
      discount_procent: 0,
      cota_tva: 19,
      observatii: ''
    });
    setProductSearch('');
  };

  const removeItemFromDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateItemTotal = (item) => {
    const cantitate = parseFloat(item.cantitate) || 0;
    const pretUnitar = parseFloat(item.pret_unitar) || 0;
    const discountProcent = parseFloat(item.discount_procent) || 0;
    const cotaTva = parseFloat(item.cota_tva) || 19;

    const subtotal = cantitate * pretUnitar;
    const discountAmount = (subtotal * discountProcent) / 100;
    const netAmount = subtotal - discountAmount;
    const tvaAmount = (netAmount * cotaTva) / 100;
    const total = netAmount + tvaAmount;

    return { subtotal, discountAmount, netAmount, tvaAmount, total };
  };

  const calculateDocumentTotals = () => {
    const totals = formData.items.reduce((acc, item) => {
      const itemTotals = calculateItemTotal(item);
      acc.subtotal += itemTotals.subtotal;
      acc.discount += itemTotals.discountAmount;
      acc.net += itemTotals.netAmount;
      acc.tva += itemTotals.tvaAmount;
      acc.total += itemTotals.total;
      return acc;
    }, { subtotal: 0, discount: 0, net: 0, tva: 0, total: 0 });

    return totals;
  };

  const saveDocument = async () => {
    try {
      setIsModalLoading(true);
      
      if (!formData.client_id) {
        alert('Selectarea unui client este obligatorie');
        return;
      }

      if (formData.items.length === 0) {
        alert('Documentul trebuie să conțină cel puțin un produs');
        return;
      }

      const documentData = {
        ...formData,
        data_scadenta: formData.data_scadenta || null,
        data_livrare: formData.data_livrare || null,
        observatii: formData.observatii || null,
        conditii_plata: formData.conditii_plata || null,
        modalitate_transport: formData.modalitate_transport || null,
        delegate_info: formData.delegate_info || null
      };
      
      if (selectedDocument) {
        await DocumentsService.updateDocument(selectedDocument.id, documentData);
      } else {
        await DocumentsService.createDocument(documentData);
      }
      
      await loadDocuments();
      closeDocumentModal();
      
    } catch (error) {
      console.error('Error saving document:', error);
      setError(error.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm('Sigur doriți să ștergeți acest document?')) {
      return;
    }
    
    try {
      await DocumentsService.deleteDocument(documentId);
      await loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      setError(error.message);
    }
  };

  const duplicateDocument = async (documentId) => {
    try {
      await DocumentsService.duplicateDocument(documentId);
      await loadDocuments();
    } catch (error) {
      console.error('Error duplicating document:', error);
      setError(error.message);
    }
  };

  const updateDocumentStatus = async (documentId, status) => {
    try {
      await DocumentsService.updateDocumentStatus(documentId, status);
      await loadDocuments();
    } catch (error) {
      console.error('Error updating document status:', error);
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'emis':
        return 'bg-blue-100 text-blue-700';
      case 'finalizat':
        return 'bg-green-100 text-green-700';
      case 'anulat':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'neplatit':
        return 'bg-red-100 text-red-700';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700';
      case 'platit':
        return 'bg-green-100 text-green-700';
      case 'anulat':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-600" />;
      case 'emis':
        return <Send className="w-4 h-4 text-blue-600" />;
      case 'finalizat':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'anulat':
        return <Ban className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getDocumentTypeLabel = (tip_document) => {
    const types = {
      factura: 'Factură',
      factura_storno: 'Factură Storno',
      proforma: 'Proformă',
      aviz: 'Aviz'
    };
    return types[tip_document] || tip_document;
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(d => d.id));
    }
  };

  const toggleSelectDocument = (id) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(dId => dId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const handleViewDetails = (document) => {
    setSelectedDocument(document);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Se încarcă documentele...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  const documentTotals = calculateDocumentTotals();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Documente de Ieșire
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestionează facturi, proforme, avize și documente storno
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {/* Mobile: Show dropdown for document creation */}
            <div className="sm:hidden mb-3">
              <div className="relative">
                <button
                  onClick={() => setShowDocumentDropdown(!showDocumentDropdown)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Document Nou
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {showDocumentDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                    <button
                      onClick={() => {
                        openDocumentModal(null, 'factura');
                        setShowDocumentDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Factură</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        openDocumentModal(null, 'proforma');
                        setShowDocumentDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Proformă</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        openDocumentModal(null, 'aviz');
                        setShowDocumentDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Aviz</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        openDocumentModal(null, 'factura_storno');
                        setShowDocumentDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 last:rounded-b-xl"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Factură Storno</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Desktop: Show individual buttons */}
            <div className="hidden sm:flex flex-wrap gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openDocumentModal(null, 'factura')}
                  className="inline-flex items-center px-3 lg:px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1 lg:mr-2" />
                  <span className="hidden md:inline">Factură</span>
                  <span className="md:hidden">F</span>
                </button>
                <button
                  onClick={() => openDocumentModal(null, 'proforma')}
                  className="inline-flex items-center px-3 lg:px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1 lg:mr-2" />
                  <span className="hidden md:inline">Proformă</span>
                  <span className="md:hidden">P</span>
                </button>
                <button
                  onClick={() => openDocumentModal(null, 'aviz')}
                  className="inline-flex items-center px-3 lg:px-4 py-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1 lg:mr-2" />
                  <span className="hidden md:inline">Aviz</span>
                  <span className="md:hidden">A</span>
                </button>
                <button
                  onClick={() => openDocumentModal(null, 'factura_storno')}
                  className="inline-flex items-center px-3 lg:px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-200 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1 lg:mr-2" />
                  <span className="hidden md:inline">Storno</span>
                  <span className="md:hidden">S</span>
                </button>
              </div>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="inline-flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                <Filter className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Filtre</span>
              </button>
              <button 
                onClick={refreshData}
                className="inline-flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Actualizare</span>
              </button>
            </div>
            
            {/* Mobile: Action buttons */}
            <div className="sm:hidden flex gap-2">
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtre
              </button>
              <button 
                onClick={refreshData}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizare
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Main search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Caută după numărul documentului, client..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              <select
                value={filters.tip_document}
                onChange={(e) => handleFilterChange('tip_document', e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Toate tipurile</option>
                <option value="factura">Factură</option>
                <option value="factura_storno">Factură Storno</option>
                <option value="proforma">Proformă</option>
                <option value="aviz">Aviz</option>
              </select>
              <select
                value={filters.status_document}
                onChange={(e) => handleFilterChange('status_document', e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Toate statusurile</option>
                <option value="draft">Draft</option>
                <option value="emis">Emis</option>
                <option value="finalizat">Finalizat</option>
                <option value="anulat">Anulat</option>
              </select>
            </div>
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Plată
                  </label>
                  <select
                    value={filters.status_plata}
                    onChange={(e) => handleFilterChange('status_plata', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toate</option>
                    <option value="neplatit">Neplătit</option>
                    <option value="partial">Plătit Parțial</option>
                    <option value="platit">Plătit</option>
                    <option value="anulat">Anulat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de la
                  </label>
                  <input
                    type="date"
                    value={filters.data_de}
                    onChange={(e) => handleFilterChange('data_de', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data până la
                  </label>
                  <input
                    type="date"
                    value={filters.data_pana}
                    onChange={(e) => handleFilterChange('data_pana', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Resetează
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Total Documente</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.total_documents || documents.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex-shrink-0 ml-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Facturi</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.facturi_count || documents.filter(d => d.tip_document === 'factura').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg flex-shrink-0 ml-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Valoare Facturi</p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
                  {(statistics.valoare_facturi || 0).toLocaleString('ro-RO')} RON
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg flex-shrink-0 ml-2">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Neplătite</p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
                  {(statistics.valoare_neplatita || 0).toLocaleString('ro-RO')} RON
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex-shrink-0 ml-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Bulk actions header - mobile */}
          {selectedDocuments.length > 0 && (
            <div className="lg:hidden p-4 border-b border-gray-100 bg-blue-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedDocuments.length} documente selectate
                </span>
                <button
                  onClick={() => setSelectedDocuments([])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Deselectează toate
                </button>
              </div>
            </div>
          )}
          
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.length === documents.length && documents.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Plată
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((document) => (
                  <tr
                    key={document.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(document.id)}
                        onChange={() => toggleSelectDocument(document.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow mr-3">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {document.numar_document}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getDocumentTypeLabel(document.tip_document)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {document.client_nume}
                      </div>
                      <div className="text-xs text-gray-500">
                        {document.client_cui || document.client_cnp || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(document.data_emitere).toLocaleDateString('ro-RO')}
                      </div>
                      {document.data_scadenta && (
                        <div className="text-xs text-gray-500">
                          Scadență: {new Date(document.data_scadenta).toLocaleDateString('ro-RO')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {parseFloat(document.total).toLocaleString('ro-RO', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })} {document.moneda}
                      </div>
                      <div className="text-xs text-gray-500">
                        TVA: {parseFloat(document.total_tva).toLocaleString('ro-RO', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })} {document.moneda}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(document.status_document)}
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                            document.status_document
                          )}`}
                        >
                          {document.status_document?.charAt(0).toUpperCase() + document.status_document?.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-lg ${getPaymentStatusColor(
                          document.status_plata
                        )}`}
                      >
                        {document.status_plata === 'neplatit' ? 'Neplătit' : 
                         document.status_plata === 'partial' ? 'Parțial' :
                         document.status_plata === 'platit' ? 'Plătit' : 
                         document.status_plata?.charAt(0).toUpperCase() + document.status_plata?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(document)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Vezi detalii"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => openDocumentModal(document)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Editează"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => duplicateDocument(document.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplică"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deleteDocument(document.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Șterge"
                        >
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
          
          {/* Mobile Card Layout */}
          <div className="lg:hidden">
            {documents.map((document) => (
              <div
                key={document.id}
                className="border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(document.id)}
                      onChange={() => toggleSelectDocument(document.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 mt-1"
                    />
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow mr-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {document.numar_document}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getDocumentTypeLabel(document.tip_document)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleViewDetails(document)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Vezi detalii"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => openDocumentModal(document)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editează"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Client</div>
                    <div className="text-sm text-gray-900">
                      {document.client_nume}
                    </div>
                    <div className="text-xs text-gray-500">
                      {document.client_cui || document.client_cnp || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Data</div>
                    <div className="text-sm text-gray-900">
                      {new Date(document.data_emitere).toLocaleDateString('ro-RO')}
                    </div>
                    {document.data_scadenta && (
                      <div className="text-xs text-gray-500">
                        Scad: {new Date(document.data_scadenta).toLocaleDateString('ro-RO')}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Total</div>
                    <div className="text-sm font-medium text-gray-900">
                      {parseFloat(document.total).toLocaleString('ro-RO', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })} {document.moneda}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Status</div>
                    <div className="flex items-center">
                      {getStatusIcon(document.status_document)}
                      <span
                        className={`ml-1 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          document.status_document
                        )}`}
                      >
                        {document.status_document?.charAt(0).toUpperCase() + document.status_document?.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Plată</div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg ${getPaymentStatusColor(
                        document.status_plata
                      )}`}
                    >
                      {document.status_plata === 'neplatit' ? 'Neplătit' : 
                       document.status_plata === 'partial' ? 'Parțial' :
                       document.status_plata === 'platit' ? 'Plătit' : 
                       document.status_plata?.charAt(0).toUpperCase() + document.status_plata?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty state */}
          {documents.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">Nu există documente</p>
              <p className="text-sm text-gray-500 mt-1">Creează primul document pentru a începe</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedDocument ? `Editare ${getDocumentTypeLabel(formData.tip_document)}` : `${getDocumentTypeLabel(formData.tip_document)} Nou${formData.tip_document === 'proforma' ? 'ă' : ''}`}
                </h2>
                <button
                  onClick={closeDocumentModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Căută și selectează clientul..."
                      />
                      {showClientResults && clientResults.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                          {clientResults.map((client) => (
                            <button
                              key={client.id}
                              onClick={() => selectClient(client)}
                              className="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                            >
                              <div className="font-medium text-gray-900 text-sm">{client.nume}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{client.cui || client.cnp}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Emiterii *
                      </label>
                      <input
                        type="date"
                        value={formData.data_emitere}
                        onChange={(e) => handleFormChange('data_emitere', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Scadentă
                      </label>
                      <input
                        type="date"
                        value={formData.data_scadenta}
                        onChange={(e) => handleFormChange('data_scadenta', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda
                    </label>
                    <select
                      value={formData.moneda}
                      onChange={(e) => handleFormChange('moneda', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="RON">RON - Leu Românesc</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dolar American</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modalitate Plată
                    </label>
                    <select
                      value={formData.modalitate_plata}
                      onChange={(e) => handleFormChange('modalitate_plata', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="transfer">Transfer Bancar</option>
                      <option value="numerar">Numerar</option>
                      <option value="card">Card</option>
                      <option value="cec">Cec</option>
                      <option value="ramburs">Ramburs</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observații
                    </label>
                    <textarea
                      rows="3"
                      value={formData.observatii}
                      onChange={(e) => handleFormChange('observatii', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Note suplimentare..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condiții de Plată
                    </label>
                    <textarea
                      rows="2"
                      value={formData.conditii_plata}
                      onChange={(e) => handleFormChange('conditii_plata', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Plata în 30 de zile..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modalitate Transport
                    </label>
                    <input
                      type="text"
                      value={formData.modalitate_transport}
                      onChange={(e) => handleFormChange('modalitate_transport', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Curier, propriu, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status_document}
                      onChange={(e) => handleFormChange('status_document', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="emis">Emis</option>
                      <option value="finalizat">Finalizat</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Produse</h3>
                
                {/* Add Product Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Adaugă Produs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Caută sau introdu numele produsului..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showProductResults && productResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {productResults.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => selectProduct(product)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                              >
                                <div className="font-medium text-gray-900">{product.nume}</div>
                                <div className="text-sm text-gray-500">{product.cod} - {product.pret_vanzare} RON</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1 sm:hidden">
                          Cantitate
                        </label>
                        <input
                          type="number"
                          placeholder="Cant."
                          step="0.001"
                          min="0"
                          value={newItem.cantitate}
                          onChange={(e) => setNewItem({...newItem, cantitate: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1 sm:hidden">
                          Preț Unitar
                        </label>
                        <input
                          type="number"
                          placeholder="Preț"
                          step="0.01"
                          min="0"
                          value={newItem.pret_unitar}
                          onChange={(e) => setNewItem({...newItem, pret_unitar: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1 sm:hidden">
                          Discount %
                        </label>
                        <input
                          type="number"
                          placeholder="Disc %"
                          step="0.01"
                          min="0"
                          max="100"
                          value={newItem.discount_procent}
                          onChange={(e) => setNewItem({...newItem, discount_procent: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1 sm:hidden">
                          Cotă TVA %
                        </label>
                        <input
                          type="number"
                          placeholder="TVA %"
                          step="0.01"
                          min="0"
                          value={newItem.cota_tva}
                          onChange={(e) => setNewItem({...newItem, cota_tva: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <button
                          onClick={addItemToDocument}
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          <Plus className="w-4 h-4 mx-auto sm:mr-2 sm:mx-0" />
                          <span className="hidden sm:inline">Adaugă</span>
                        </button>
                      </div>
                  </div>
                  
                  {!newItem.product_id && productSearch && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Notă:</strong> Produsul nu există în baza de date și va fi adăugat temporar doar pentru acest document.
                      </p>
                    </div>
                  )}
                </div>

                {/* Products List */}
                {formData.items && formData.items.length > 0 && (
                  <div>
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Produs</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cant.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Preț</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Disc.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">TVA</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {formData.items.map((item, index) => {
                            const totals = calculateItemTotal(item);
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <div className="text-sm font-medium text-gray-900">{item.product_nume}</div>
                                  {item.product_cod && (
                                    <div className="text-xs text-gray-500">Cod: {item.product_cod}</div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {parseFloat(item.cantitate)} {item.product_unitate_masura}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {parseFloat(item.pret_unitar).toLocaleString('ro-RO', { 
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2 
                                  })} {formData.moneda}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {parseFloat(item.discount_procent)}%
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {parseFloat(item.cota_tva)}%
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {totals.total.toLocaleString('ro-RO', { 
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2 
                                  })} {formData.moneda}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => removeItemFromDocument(index)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile Cards */}
                    <div className="lg:hidden space-y-3">
                      {formData.items.map((item, index) => {
                        const totals = calculateItemTotal(item);
                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{item.product_nume}</div>
                                {item.product_cod && (
                                  <div className="text-xs text-gray-500">Cod: {item.product_cod}</div>
                                )}
                              </div>
                              <button
                                onClick={() => removeItemFromDocument(index)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-red-600 ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-500">Cantitate:</span>
                                <span className="ml-1 font-medium">{parseFloat(item.cantitate)} {item.product_unitate_masura}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Preț:</span>
                                <span className="ml-1 font-medium">
                                  {parseFloat(item.pret_unitar).toLocaleString('ro-RO', { 
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2 
                                  })} {formData.moneda}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Discount:</span>
                                <span className="ml-1 font-medium">{parseFloat(item.discount_procent)}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">TVA:</span>
                                <span className="ml-1 font-medium">{parseFloat(item.cota_tva)}%</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="text-right">
                                <span className="text-sm text-gray-500">Total: </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {totals.total.toLocaleString('ro-RO', { 
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2 
                                  })} {formData.moneda}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Totals */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {documentTotals.net.toLocaleString('ro-RO', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })} {formData.moneda}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">TVA:</span>
                        <span className="font-medium">
                          {documentTotals.tva.toLocaleString('ro-RO', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })} {formData.moneda}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center text-lg font-bold">
                        <span>TOTAL:</span>
                        <span>
                          {documentTotals.total.toLocaleString('ro-RO', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })} {formData.moneda}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={closeDocumentModal}
                disabled={isModalLoading}
                className="px-4 py-2 text-center text-gray-600 hover:text-gray-800 transition-colors order-2 sm:order-1"
              >
                Anulează
              </button>
              <button 
                onClick={saveDocument}
                disabled={isModalLoading || !formData.client_id || formData.items.length === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2 text-sm sm:text-base"
              >
                {isModalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span className="truncate">
                  {selectedDocument ? "Actualizează Document" : "Creează Document"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumenteIesire;
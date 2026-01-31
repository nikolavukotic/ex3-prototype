import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp,
  query
} from 'firebase/firestore';
import {
  LayoutDashboard,
  Box,
  Wand2,
  BarChart3,
  Settings,
  Upload,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Eye,
  Briefcase,
  Users,
  Award,
  Globe,
  Package,
  FileText,
  Building2,
  Mail,
  Phone,
  User,
  Check,
  Clock,
  MousePointer,
  Glasses,
  Database,
  ShoppingBag,
  Bot,
  TrendingUp,
  Download,
  Calendar,
  Share2,
  PieChart,
  Activity,
  Target,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Zap,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

// --- FIREBASE SETUP (DEMO MODE) ---
// Using demo mode - Firebase auth is bypassed for local development
const firebaseConfig = __firebase_config;
let app = null;
let auth = null;
let db = null;

// Only initialize Firebase if valid config is provided
const isValidFirebaseConfig = firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('demo');

if (isValidFirebaseConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- COMPONENTS ---

// 1. Navigation Sidebar
const Sidebar = ({ activeTab, setActiveTab, theme, setTheme }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'profile', icon: Building2, label: 'Company Profile' },
    { id: 'ai-studio', icon: Wand2, label: 'AI Asset Studio' },
    { id: 'analytics', icon: BarChart3, label: 'XR Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`w-64 bg-slate-900 text-white border-slate-800 flex flex-col h-full border-r shrink-0`}>
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-center">
          {/* EX3 LOGO */}
          <div className="w-full h-12 flex items-center justify-center overflow-hidden">
            <img src="/img/Logo EX3.jpg" alt="EX3 Logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Theme Switcher */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          <span className="text-sm font-medium">Theme</span>
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <>
                <div className="text-xs">Dark</div>
                <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs">Light</div>
                <div className="w-10 h-6 bg-slate-300 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                </div>
              </>
            )}
          </div>
        </button>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            ITC
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-white">ITC Studio</p>
            <p className="text-xs truncate text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Company Profile Component (Screen 1 Focus)
const CompanyProfile = ({ onSave, initialData, theme }) => {

  // Form State - Pre-filled with Demo Data
  const [formData, setFormData] = useState(initialData || {
    companyName: 'CANANDI DOO',
    industry: 'iot',
    targetAudience: ['Tech Enthusiasts', 'Early Adopters'],
    contacts: [
      { id: 1, name: 'Dejan Stevanović', title: 'CEO', email: 'dejan.stevanovic@canandi.com', phone: '+381 65 123 456' }
    ],
    description: 'Canandi develops advanced GPS tracking and protection systems for hunting dogs, designed to ensure their safety and precise real-time location tracking even in the most remote environments. By leveraging proprietary IoT mesh technology, Canandi\'s solution works independently of mobile networks, making it reliable in forests, mountains, and off-grid hunting areas. The system combines durable smart collars with an intuitive mobile platform, providing hunters with accurate positioning, movement monitoring, and situational awareness. Canandi focuses on animal welfare, reliability, and rugged design, tailored specifically to the needs of professional and recreational hunters. With its innovative approach, Canandi addresses a critical gap in the hunting and outdoor IoT market by offering a dependable, field-proven tracking solution where conventional technologies fail.',
    products: [
      { id: 1, name: 'Product One', description: 'Amazing product with cutting-edge features.', status: 'Active' },
      { id: 2, name: 'Product Two', description: 'Next-generation solution for modern challenges.', status: 'Prototype' }
    ],
    awards: ['Best Innovation Award 2024'],
    certifications: ['ISO 9001', 'Industry Leader Certification'],
    targetMarkets: ['North America', 'Western Europe']
  });

  const [errors, setErrors] = useState({});

  // Handlers
  const handleContactChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map(c => {
        if (c.id !== id) return c;
        // Validation logic for specific fields
        if (field === 'email' && !value.endsWith('@canandi.com') && value.length > 0) {
          setErrors(prev => ({ ...prev, [`email-${id}`]: 'Email must end with @canandi.com' }));
        } else if (field === 'email') {
          const newErrors = { ...errors };
          delete newErrors[`email-${id}`];
          setErrors(newErrors);
        }
        return { ...c, [field]: value };
      })
    }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { id: Date.now(), name: '', title: '', email: '', phone: '' }]
    }));
  };

  const removeContact = (id) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== id)
    }));
  };

  const handleProductChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { id: Date.now(), name: '', description: '', status: 'Active' }]
    }));
  };

  const removeProduct = (id) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  // Generic array handlers (awards, certs, markets)
  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  return (
    <div className="max-w-full pr-8 pb-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Company Profile</h2>
          <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Manage your official ExpoTech presence and digital assets.</p>
        </div>
        <div className="flex space-x-2">
          <button className={`px-3 py-1.5 border text-sm font-medium rounded-lg transition-colors flex items-center shadow-sm ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}>
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview Public Profile
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md shadow-blue-200"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Company Profile
          </button>
        </div>
      </div>

      <div>
        {/* Main Form Content */}
        <div className="space-y-3">
          
          {/* 1. Identity */}
          <section id="identity" className={`rounded-lg shadow-sm border p-3 scroll-mt-4 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold mb-2 flex items-center pb-1.5 border-b ${
              theme === 'dark'
                ? 'text-white border-slate-700'
                : 'text-slate-900 border-slate-100'
            }`}>
              <Building2 className="w-4 h-4 mr-1.5 text-blue-600" />
              Company Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Logo Upload */}
              <div className="col-span-1">
                <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Company Logo</label>
                <div className={`border-2 border-dashed rounded-lg p-2 flex flex-col items-center justify-center text-center transition-colors cursor-pointer h-32 group ${
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-900 hover:bg-slate-800'
                    : 'border-slate-300 bg-white hover:bg-slate-50'
                }`}>
                    {/* Canandi Logo */}
                    <div className="transform group-hover:scale-105 transition-transform flex items-center justify-center w-full h-full px-2">
                         <img src="/img/canandi-logo-black.svg" alt="Company Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="col-span-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className={`w-full px-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-600 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className={`w-full px-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-600 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="iot">Internet of Things</option>
                      <option value="saas">SaaS</option>
                      <option value="fintech">Fintech</option>
                      <option value="agritech">Agritech</option>
                    </select>
                  </div>
                </div>

                <div>
                    <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Target Audience</label>
                    <div className="flex flex-wrap gap-1.5">
                        {formData.targetAudience.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tag}
                                <button className="ml-1.5 hover:text-blue-900">×</button>
                            </span>
                        ))}
                        <button className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                          theme === 'dark'
                            ? 'border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                            : 'border-slate-300 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}>
                            <Plus className="w-3 h-3 mr-0.5" /> Add Tag
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Contacts */}
          <section id="contacts" className={`rounded-lg shadow-sm border p-3 scroll-mt-4 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center mb-2 pb-1.5 border-b ${
              theme === 'dark' ? 'border-slate-700' : 'border-slate-100'
            }`}>
                <h3 className={`text-sm font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <Users className="w-4 h-4 mr-1.5 text-blue-600" />
                    Contact Information
                </h3>
                <button onClick={addContact} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> Add Person
                </button>
            </div>

            <div className="space-y-2">
                {formData.contacts.map((contact) => (
                    <div key={contact.id} className={`relative rounded-lg p-2 border group ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => removeContact(contact.id)} className="text-slate-400 hover:text-red-500">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                }`}>Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-2 top-2 text-slate-400 w-3.5 h-3.5" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Dejan Stevanović"
                                        value={contact.name}
                                        onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)}
                                        className={`w-full pl-7 pr-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                                          theme === 'dark'
                                            ? 'bg-slate-800 border-slate-600 text-white'
                                            : 'bg-white border-slate-300 text-slate-900'
                                        }`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                }`}>Job Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-2 top-2 text-slate-400 w-3.5 h-3.5" />
                                    <input
                                        type="text"
                                        value={contact.title}
                                        onChange={(e) => handleContactChange(contact.id, 'title', e.target.value)}
                                        className={`w-full pl-7 pr-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                                          theme === 'dark'
                                            ? 'bg-slate-800 border-slate-600 text-white'
                                            : 'bg-white border-slate-300 text-slate-900'
                                        }`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                }`}>Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-2 top-2 text-slate-400 w-3.5 h-3.5" />
                                    <input
                                        type="email"
                                        value={contact.email}
                                        onChange={(e) => handleContactChange(contact.id, 'email', e.target.value)}
                                        className={`w-full pl-7 pr-2 py-1.5 text-sm border rounded-md focus:ring-2 outline-none ${
                                          errors[`email-${contact.id}`]
                                            ? 'border-red-300 focus:ring-red-200'
                                            : theme === 'dark'
                                              ? 'bg-slate-800 border-slate-600 text-white focus:ring-blue-500'
                                              : 'bg-white border-slate-300 text-slate-900 focus:ring-blue-500'
                                        }`}
                                    />
                                </div>
                                {errors[`email-${contact.id}`] && <p className="text-xs text-red-500 mt-0.5">{errors[`email-${contact.id}`]}</p>}
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                }`}>Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-2 top-2 text-slate-400 w-3.5 h-3.5" />
                                    <input
                                        type="tel"
                                        value={contact.phone}
                                        onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)}
                                        className={`w-full pl-7 pr-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                                          theme === 'dark'
                                            ? 'bg-slate-800 border-slate-600 text-white'
                                            : 'bg-white border-slate-300 text-slate-900'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </section>

          {/* 3. Description */}
          <section id="description" className={`rounded-lg shadow-sm border p-3 scroll-mt-4 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold mb-1.5 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <FileText className="w-4 h-4 mr-1.5 text-blue-600" />
              Company Description
            </h3>
            <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none min-h-[60px] ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
                placeholder="Describe your company, mission, and core values..."
            />
             <p className={`text-xs mt-1 text-right ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>0 / 500 characters</p>
          </section>

          {/* 4. Products & Services */}
          <section id="products" className={`rounded-lg shadow-sm border p-3 scroll-mt-4 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center mb-2 pb-1.5 border-b ${
              theme === 'dark' ? 'border-slate-700' : 'border-slate-100'
            }`}>
                <h3 className={`text-sm font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <Package className="w-4 h-4 mr-1.5 text-blue-600" />
                    Products & Services
                </h3>
                <button onClick={addProduct} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> Add Product
                </button>
            </div>

            <div className="space-y-2">
                {formData.products.map((product) => (
                    <div key={product.id} className={`flex gap-2 items-center p-2.5 border rounded-lg hover:border-blue-300 transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}>
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={product.name}
                                onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                                className={`w-48 px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium ${
                                  theme === 'dark'
                                    ? 'bg-slate-800 border-slate-600 text-white'
                                    : 'bg-white border-slate-300 text-slate-900'
                                }`}
                            />
                            <input
                                type="text"
                                placeholder="Short description"
                                value={product.description}
                                onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                                className={`flex-1 px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-xs ${
                                  theme === 'dark'
                                    ? 'bg-slate-800 border-slate-600 text-slate-300'
                                    : 'bg-white border-slate-300 text-slate-600'
                                }`}
                            />
                            <select
                                value={product.status}
                                onChange={(e) => handleProductChange(product.id, 'status', e.target.value)}
                                className={`w-24 px-2 py-1.5 border rounded-md text-xs outline-none ${product.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                            >
                                <option value="Active">Active</option>
                                <option value="Prototype">Prototype</option>
                            </select>
                        </div>
                        <button onClick={() => removeProduct(product.id)} className={`p-1 text-slate-400 hover:text-red-500 rounded ${
                          theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                        }`}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
          </section>

          {/* 5. Achievements & 6. Markets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <section id="achievements" className={`rounded-lg shadow-sm border p-3 scroll-mt-4 flex flex-col ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}>
                 <h3 className={`text-sm font-bold mb-1.5 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <Award className="w-4 h-4 mr-1.5 text-blue-600" />
                    Achievements
                </h3>

                <div className="space-y-2 flex-1">
                    <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>Previous Awards</label>
                        <div className="space-y-1">
                             {formData.awards.map((item, idx) => (
                                <div key={`award-${idx}`} className="flex gap-1.5">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayChange('awards', idx, e.target.value)}
                                        className={`flex-1 px-2 py-1.5 border rounded-md text-xs outline-none focus:border-blue-500 ${
                                          theme === 'dark'
                                            ? 'bg-slate-900 border-slate-600 text-white'
                                            : 'bg-white border-slate-300 text-slate-900'
                                        }`}
                                    />
                                    <button onClick={() => removeArrayItem('awards', idx)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                             ))}
                             <button onClick={() => addArrayItem('awards')} className="text-xs font-medium text-blue-600 flex items-center">
                                <Plus className="w-3 h-3 mr-0.5" /> Add Award
                             </button>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>Certifications</label>
                        <div className="space-y-1">
                             {formData.certifications.map((item, idx) => (
                                <div key={`cert-${idx}`} className="flex gap-1.5">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayChange('certifications', idx, e.target.value)}
                                        className={`flex-1 px-2 py-1.5 border rounded-md text-xs outline-none focus:border-blue-500 ${
                                          theme === 'dark'
                                            ? 'bg-slate-900 border-slate-600 text-white'
                                            : 'bg-white border-slate-300 text-slate-900'
                                        }`}
                                    />
                                    <button onClick={() => removeArrayItem('certifications', idx)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                             ))}
                             <button onClick={() => addArrayItem('certifications')} className="text-xs font-medium text-blue-600 flex items-center">
                                <Plus className="w-3 h-3 mr-0.5" /> Add Certification
                             </button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="markets" className={`rounded-lg shadow-sm border p-3 scroll-mt-4 ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}>
                <h3 className={`text-sm font-bold mb-1.5 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <Globe className="w-4 h-4 mr-1.5 text-blue-600" />
                    Target Markets
                </h3>

                <div className={`rounded-lg p-2 border h-full ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-slate-50 border-slate-100'
                }`}>
                    <label className={`block text-xs font-medium mb-1.5 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>Selected Regions</label>
                    <div className="space-y-1">
                        {formData.targetMarkets.map((market, idx) => (
                            <div key={idx} className={`flex justify-between items-center p-2 rounded border ${
                              theme === 'dark'
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white border-slate-200'
                            }`}>
                                <span className={`font-medium text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{market}</span>
                                <button onClick={() => removeArrayItem('targetMarkets', idx)} className="text-slate-400 hover:text-red-500">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-2 pt-2 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                        <select
                            onChange={(e) => {
                                if(e.target.value) {
                                    setFormData(prev => ({...prev, targetMarkets: [...prev.targetMarkets, e.target.value]}));
                                    e.target.value = "";
                                }
                            }}
                            className={`w-full px-2 py-1 border rounded-md text-xs outline-none focus:border-blue-500 ${
                              theme === 'dark'
                                ? 'bg-slate-800 border-slate-600 text-white'
                                : 'bg-white border-slate-300 text-slate-900'
                            }`}
                        >
                            <option value="">+ Add Market Region</option>
                            <option value="North America">North America</option>
                            <option value="Western Europe">Western Europe</option>
                            <option value="MENA">MENA (Middle East & North Africa)</option>
                            <option value="APAC">APAC (Asia Pacific)</option>
                        </select>
                    </div>
                </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

// 3. XR Analytics Professional Component
const AnalyticsPro = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('reach');
  const [timeRange, setTimeRange] = useState('Event');

  const tabs = [
    { id: 'reach', label: 'Overview', icon: LayoutDashboard },
    { id: 'engagement', label: 'Engagement', icon: MousePointer },
    { id: 'xr', label: 'XR Usage', icon: Glasses },
    { id: 'leads', label: 'Leads', icon: Database },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'ai', label: 'AI Q&A', icon: Bot },
    { id: 'benchmarks', label: 'Benchmarks', icon: TrendingUp },
  ];

  // Helper for Chart Placeholders
  const ChartPlaceholder = ({ title, type }) => (
    <div className={`rounded-lg border h-64 flex flex-col items-center justify-center p-4 ${
      theme === 'dark'
        ? 'bg-slate-800 border-slate-700'
        : 'bg-slate-50 border-slate-200'
    }`}>
       <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>{title}</p>
       <div className="w-full h-full flex items-end space-x-2 px-8 pb-4">
          {type === 'bar' && [40, 70, 50, 90, 60, 80, 45].map((h, i) => (
            <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-blue-500/20 rounded-t hover:bg-blue-500/40 transition-colors"></div>
          ))}
          {type === 'line' && (
             <svg className="w-full h-full" preserveAspectRatio="none">
                <polyline points="0,100 50,80 100,90 150,40 200,60 250,20 300,50" fill="none" stroke="#3b82f6" strokeWidth="3" />
             </svg>
          )}
       </div>
    </div>
  );

  const KPICard = ({ title, value, sub, color = 'blue' }) => (
    <div className={`p-5 rounded-xl border shadow-sm ${
      theme === 'dark'
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-200'
    }`}>
      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
      <div className="mt-2 flex items-baseline">
        <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{value}</span>
        {sub && <span className={`ml-2 text-xs font-medium ${color === 'green' ? 'text-green-600' : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</span>}
      </div>
    </div>
  );

  const InsightCallout = ({ text }) => (
    <div className={`border p-4 rounded-lg flex items-start gap-3 ${
      theme === 'dark'
        ? 'bg-gradient-to-r from-indigo-900/50 to-blue-900/50 border-indigo-800'
        : 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100'
    }`}>
       <div className={`p-2 rounded-full mt-1 ${
         theme === 'dark'
           ? 'bg-indigo-800 text-indigo-300'
           : 'bg-indigo-100 text-indigo-600'
       }`}>
          <Zap size={18} />
       </div>
       <div>
          <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'}`}>Strategic Insight</h4>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-800'}`}>{text}</p>
       </div>
    </div>
  );

  return (
    <div className="max-w-full pr-8 space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
         <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>XR Analytics Dashboard</h2>
            <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Real-time performance metrics and ROI analysis.</p>
         </div>
         <div className="flex items-center gap-2">
            <div className={`flex rounded-lg border p-1 shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}>
               {['Today', 'Event', 'Custom'].map(r => (
                 <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      timeRange === r
                        ? 'bg-slate-900 text-white shadow'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:bg-slate-700'
                          : 'text-slate-600 hover:bg-slate-50'
                    }`}
                 >
                   {r}
                 </button>
               ))}
            </div>
            <button className={`p-1.5 border rounded-lg shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
               <Download size={18} />
            </button>
            <button className={`p-1.5 border rounded-lg shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
               <Share2 size={18} />
            </button>
         </div>
      </div>

      {/* Tab Nav */}
      <div className={`border-b rounded-t-lg shadow-sm overflow-x-auto ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}>
         <div className="flex space-x-1 pb-1">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
                     activeTab === tab.id
                       ? 'border-blue-600 text-blue-600'
                       : theme === 'dark'
                         ? 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                         : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
               >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
               </button>
            ))}
         </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">

         {/* 1. Reach & Executive Summary */}
         {activeTab === 'reach' && (
            <div className="space-y-4">
               {/* Executive Summary Cards */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                     <p className="text-blue-100 text-xs mb-1">Total Visitors</p>
                     <p className="text-2xl font-bold">12,543</p>
                     <p className="text-blue-200 text-xs mt-1">+14% vs avg</p>
                  </div>
                  <div className="bg-white text-slate-900 p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-slate-500 text-xs mb-1">Avg Engagement</p>
                     <p className="text-2xl font-bold">4m 12s</p>
                     <p className="text-green-600 text-xs mt-1">Top 10%</p>
                  </div>
                  <div className="bg-white text-slate-900 p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-slate-500 text-xs mb-1">Leads Generated</p>
                     <p className="text-2xl font-bold">342</p>
                     <p className="text-slate-400 text-xs mt-1">3.8% conv.</p>
                  </div>
                  <div className="bg-white text-slate-900 p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-slate-500 text-xs mb-1">Top Product</p>
                     <p className="text-lg font-bold truncate">Dog Tracker</p>
                     <p className="text-slate-400 text-xs mt-1">95 score</p>
                  </div>
               </div>

               {/* Detailed Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <KPICard title="Booth Impressions" value="12,543" sub="+14% vs avg" color="green" />
                  <KPICard title="Unique Visitors" value="8,920" sub="71% new" />
                  <KPICard title="Repeat Visitors" value="1,240" sub="Highly interested" />
                  <KPICard title="Screen Exposure" value="48h 20m" sub="Total time" />
               </div>

               {/* AI Recommendations */}
               <div className={`p-4 rounded-xl border shadow-sm ${
                 theme === 'dark'
                   ? 'bg-slate-800 border-slate-700'
                   : 'bg-white border-slate-200'
               }`}>
                  <h3 className={`font-bold mb-3 flex items-center text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                     <Target className="mr-1.5 text-red-500" size={16} />
                     Recommended Next Actions (AI)
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                     <div className="flex items-start gap-2 p-2.5 bg-red-50 rounded-lg border border-red-100">
                        <CheckCircle2 className="text-red-600 mt-0.5 shrink-0" size={16} />
                        <div className="flex-1">
                           <p className="font-bold text-red-900 text-xs">Follow up with 45 High-Intent Leads</p>
                           <p className="text-red-700 text-xs">These users spent &gt;5 mins in VR and viewed pricing.</p>
                        </div>
                        <button className="ml-auto text-xs bg-white border border-red-200 text-red-700 px-2 py-1 rounded hover:bg-red-50">Action</button>
                     </div>
                     <div className="flex items-start gap-2 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                        <CheckCircle2 className="text-blue-600 mt-0.5 shrink-0" size={16} />
                        <div className="flex-1">
                           <p className="font-bold text-blue-900 text-xs">Adjust "Subscription" FAQ Answer</p>
                           <p className="text-blue-700 text-xs">Sentiment analysis shows confusion around monthly vs annual billing.</p>
                        </div>
                        <button className="ml-auto text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-50">Edit AI</button>
                     </div>
                  </div>
               </div>

               {/* Heatmap and Trends */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className={`lg:col-span-2 p-4 rounded-xl border shadow-sm ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}>
                     <h3 className={`font-bold mb-4 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Hourly Heatmap (Visitor Traffic)</h3>
                     <div className="grid grid-cols-12 gap-1 h-32">
                        {[...Array(12 * 5)].map((_, i) => (
                           <div key={i}
                                className={`rounded-sm ${['bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600'][Math.floor(Math.random() * 4)]}`}
                                title="Traffic Density"
                           ></div>
                        ))}
                     </div>
                     <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>10:00 AM</span>
                        <span>02:00 PM</span>
                        <span>06:00 PM</span>
                     </div>
                  </div>
                  <div className="space-y-4">
                      <InsightCallout text="Peak traffic occurs between 11 AM and 2 PM. Consider scheduling live demos during these windows to maximize reach." />
                      <div className={`text-white p-4 rounded-xl shadow-lg flex flex-col justify-center items-center text-center ${
                        theme === 'dark'
                          ? 'bg-slate-700'
                          : 'bg-slate-900'
                      }`}>
                         <div className="mb-3 bg-white/10 p-3 rounded-full">
                            <Download size={20} />
                         </div>
                         <h3 className="font-bold text-sm mb-1.5">Export Report</h3>
                         <p className="text-slate-400 text-xs mb-3">Download comprehensive PDF</p>
                         <button className="w-full py-1.5 bg-blue-600 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">Download PDF</button>
                      </div>
                  </div>
               </div>
            </div>
         )}

         {/* 2. Engagement */}
         {activeTab === 'engagement' && (
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <KPICard title="Avg. Dwell Time" value="4m 12s" sub="Top 10% of event" color="green" />
                  <KPICard title="Total Interactions" value="4,892" sub="Touch & Clicks" />
                  <KPICard title="Content CTR" value="18.5%" sub="High engagement" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border shadow-sm ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}>
                     <h3 className={`font-bold mb-4 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Engagement Funnel</h3>
                     <div className="space-y-3">
                        <div className="relative">
                           <div className="bg-slate-100 h-8 rounded w-full flex items-center px-3 justify-between text-xs">
                              <span className="font-medium">Passersby</span>
                              <span className="text-slate-500">12,500</span>
                           </div>
                        </div>
                        <div className="relative pl-6">
                           <div className="bg-blue-100 h-8 rounded w-[80%] flex items-center px-3 justify-between text-xs">
                              <span className="font-medium text-blue-900">Stopped at Booth</span>
                              <span className="text-blue-700">8,900</span>
                           </div>
                        </div>
                        <div className="relative pl-12">
                           <div className="bg-blue-200 h-8 rounded w-[60%] flex items-center px-3 justify-between text-xs">
                              <span className="font-medium text-blue-900">Interacted with Screen</span>
                              <span className="text-blue-700">4,800</span>
                           </div>
                        </div>
                        <div className="relative pl-18">
                           <div className="bg-blue-600 h-8 rounded w-[30%] flex items-center px-3 justify-between text-white text-xs">
                              <span className="font-medium">VR Session</span>
                              <span>1,200</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <InsightCallout text="Your conversion from 'Passerby' to 'Stopped' is 71%, significantly higher than the floor average of 45%." />
                     <ChartPlaceholder title="Content Interaction by Type" type="bar" />
                  </div>
               </div>
            </div>
         )}

         {/* 3. XR Usage */}
         {activeTab === 'xr' && (
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <KPICard title="VR Sessions" value="1,240" sub="Total started" />
                  <KPICard title="Completion Rate" value="82%" sub="Fully watched" color="green" />
                  <KPICard title="Avg. Session" value="3m 45s" sub="Deep immersion" />
                  <KPICard title="Avatar Chats" value="650" sub="AI interactions" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border-[12px] border-slate-100 border-t-blue-600 border-r-blue-600 border-b-blue-400 rotate-45 flex items-center justify-center">
                         <div className="text-center -rotate-45">
                            <h3 className="text-3xl font-bold text-slate-900">82%</h3>
                            <p className="text-slate-500 text-xs">Completion Rate</p>
                         </div>
                      </div>
                  </div>
                  <div className="space-y-4">
                     <InsightCallout text="High completion rate (82%) indicates your VR content is compelling. Most users drop off only during the 'Pricing' scene." />
                     <div className={`p-4 rounded-xl border shadow-sm ${
                       theme === 'dark'
                         ? 'bg-slate-800 border-slate-700'
                         : 'bg-white border-slate-200'
                     }`}>
                        <h3 className={`font-bold mb-3 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Top VR Scenes</h3>
                        <div className="space-y-2">
                           {['Product Demo', 'Virtual Tour', 'CEO Intro', 'Pricing'].map((s, i) => (
                              <div key={s} className="flex items-center gap-3">
                                 <span className="text-xs font-medium w-20">{s}</span>
                                 <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                                    <div className="bg-blue-500 rounded-full h-1.5" style={{width: `${100 - (i*15)}%`}}></div>
                                 </div>
                                 <span className="text-xs text-slate-500">{100 - (i*15)}%</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* 4. Leads */}
         {activeTab === 'leads' && (
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <KPICard title="Total Leads" value="342" sub="Qualified" color="green" />
                  <KPICard title="Conversion Rate" value="3.8%" sub="Visitor to Lead" />
                  <KPICard title="GDPR Consent" value="100%" sub="Compliant" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-4 text-sm">Lead Sources</h3>
                     <div className="flex items-center justify-center gap-6">
                        <div className="w-32 h-32 rounded-full bg-blue-100 relative overflow-hidden">
                           <div className="absolute inset-0 bg-blue-500 w-1/2 h-full"></div>
                           <div className="absolute inset-0 bg-purple-500 w-full h-1/2 opacity-80"></div>
                        </div>
                        <div className="space-y-1.5">
                           <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                              <span className="text-xs">VR Experience (45%)</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                              <span className="text-xs">AI Avatar (30%)</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 bg-blue-100 rounded-full"></div>
                              <span className="text-xs">Screen Form (25%)</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                      <InsightCallout text="Leads generated through VR have a 2x higher completion rate for contact details compared to standard screen forms." />
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-900 mb-3 text-sm">Contact Types</h3>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-lg text-center">
                               <Mail className="mx-auto mb-1.5 text-slate-400" size={18} />
                               <span className="block font-bold text-lg">310</span>
                               <span className="text-xs text-slate-500">Emails</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg text-center">
                               <Phone className="mx-auto mb-1.5 text-slate-400" size={18} />
                               <span className="block font-bold text-lg">185</span>
                               <span className="text-xs text-slate-500">Phone #</span>
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            </div>
         )}

         {/* 5. Products */}
         {activeTab === 'products' && (
            <div className="space-y-4">
               <InsightCallout text="Product B is generating the most interest despite being placed second in the menu. Consider promoting it to the featured slot." />

               <div className={`rounded-xl border overflow-hidden shadow-sm ${
                 theme === 'dark'
                   ? 'bg-slate-800 border-slate-700'
                   : 'bg-white border-slate-200'
               }`}>
                  <table className="w-full text-left">
                     <thead className={`border-b ${
                       theme === 'dark'
                         ? 'bg-slate-900 border-slate-700'
                         : 'bg-slate-50 border-slate-200'
                     }`}>
                        <tr>
                           <th className={`p-3 font-semibold text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Product Name</th>
                           <th className={`p-3 font-semibold text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Views</th>
                           <th className={`p-3 font-semibold text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Avg. Time</th>
                           <th className={`p-3 font-semibold text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Interest Score</th>
                        </tr>
                     </thead>
                     <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                        {[
                           { name: 'Canandi Dog Tracker', views: 890, time: '2m 10s', score: 95 },
                           { name: 'Hunter App v2', views: 640, time: '1m 45s', score: 82 },
                           { name: 'Mesh Repeater', views: 320, time: '0m 50s', score: 45 },
                           { name: 'Accessories Kit', views: 150, time: '0m 30s', score: 20 },
                        ].map((p, i) => (
                           <tr key={p.name} className={theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}>
                              <td className="p-3 flex items-center gap-2">
                                 <span className={`w-5 h-5 rounded text-xs flex items-center justify-center font-bold ${
                                   theme === 'dark'
                                     ? 'bg-slate-700 text-slate-400'
                                     : 'bg-slate-100 text-slate-500'
                                 }`}>#{i+1}</span>
                                 <span className={`font-medium text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{p.name}</span>
                              </td>
                              <td className={`p-3 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{p.views}</td>
                              <td className={`p-3 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{p.time}</td>
                              <td className="p-3">
                                 <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-20">
                                       <div className={`rounded-full h-1.5 ${p.score > 80 ? 'bg-green-500' : p.score > 50 ? 'bg-blue-500' : 'bg-slate-300'}`} style={{width: `${p.score}%`}}></div>
                                    </div>
                                    <span className="text-xs font-bold">{p.score}</span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* 6. AI Q&A */}
         {activeTab === 'ai' && (
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className={`p-4 rounded-xl border shadow-sm ${
                     theme === 'dark'
                       ? 'bg-slate-800 border-slate-700'
                       : 'bg-white border-slate-200'
                   }`}>
                      <h3 className={`font-bold mb-4 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Common Question Topics</h3>
                      <div className="flex flex-wrap gap-1.5">
                         {['Pricing', 'Battery Life', 'Subscription', 'Waterproof', 'Warranty', 'Range', 'Shipping', 'Distributors'].map((tag, i) => (
                            <span
                               key={tag}
                               className={`px-2.5 py-1 rounded-full text-xs font-medium ${i < 3 ? 'bg-blue-100 text-blue-800 text-sm px-3 py-1.5' : 'bg-slate-100 text-slate-600'}`}
                            >
                               {tag}
                            </span>
                         ))}
                      </div>
                   </div>

                   <div className={`p-4 rounded-xl border shadow-sm ${
                     theme === 'dark'
                       ? 'bg-slate-800 border-slate-700'
                       : 'bg-white border-slate-200'
                   }`}>
                      <h3 className={`font-bold mb-4 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Sentiment Analysis</h3>
                      <div className="space-y-3">
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                               <span className="text-green-600 font-medium">Positive (Excitement)</span>
                               <span>65%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                               <div className="bg-green-500 rounded-full h-1.5 w-[65%]"></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                               <span className="text-slate-600 font-medium">Neutral (Inquiry)</span>
                               <span>25%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                               <div className="bg-slate-400 rounded-full h-1.5 w-[25%]"></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                               <span className="text-amber-600 font-medium">Concern (Price/Tech)</span>
                               <span>10%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                               <div className="bg-amber-500 rounded-full h-1.5 w-[10%]"></div>
                            </div>
                         </div>
                      </div>
                   </div>
               </div>
               <InsightCallout text="10% of users expressed concern about subscription pricing. Consider adding a 'Lifetime Plan' option to the FAQ to address this." />
            </div>
         )}

         {/* 7. Benchmarks */}
         {activeTab === 'benchmarks' && (
            <div className="space-y-4">
               <InsightCallout text="You are outperforming the Event Average by 40% in Lead Generation, likely due to the high engagement of your XR content." />

               <div className={`p-4 rounded-xl border shadow-sm ${
                 theme === 'dark'
                   ? 'bg-slate-800 border-slate-700'
                   : 'bg-white border-slate-200'
               }`}>
                  <h3 className={`font-bold mb-4 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Performance vs Event Average</h3>
                  <div className="space-y-4">
                     {[
                        { label: 'Booth Traffic', my: 85, avg: 60 },
                        { label: 'Dwell Time', my: 92, avg: 45 },
                        { label: 'Leads Generated', my: 78, avg: 30 },
                        { label: 'Cost per Lead', my: 40, avg: 80, invert: true },
                     ].map((m) => (
                        <div key={m.label}>
                           <div className="flex justify-between mb-1.5">
                              <span className="font-medium text-slate-700 text-xs">{m.label}</span>
                           </div>
                           <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
                              <div className="absolute top-0 bottom-0 bg-slate-300 w-1 z-10" style={{left: `${m.avg}%`}}></div>
                              <div className="absolute top-0 text-xs text-slate-500 font-medium -mt-4" style={{left: `${m.avg}%`}}>Avg</div>

                              <div
                                 className={`h-full rounded-full flex items-center justify-end px-2 text-xs font-bold text-white transition-all duration-1000 ${m.invert ? 'bg-green-500' : 'bg-blue-600'}`}
                                 style={{width: `${m.my}%`}}
                              >
                                 You
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

// 4. AI Asset Studio Component
const AIAssetStudio = ({ theme }) => {
  const [activeStudioTab, setActiveStudioTab] = useState('product-assets');
  const [uploaded2DImages] = useState([
    '/img/0J03JYWkygHJcCtCeDIcWwai0EVI7O.jpg',
    '/img/92mmxGgcg6rCPTqKFduzeo0tJdB9Vq.jpg',
    null,
    null
  ]);
  const [uploaded3DModels] = useState([
    '/img/3d 1.png',
    '/img/3d 2.png'
  ]);
  const [selectedBackground, setSelectedBackground] = useState('neo-grid');
  const [voiceType, setVoiceType] = useState('female');
  const [selectedAvatar, setSelectedAvatar] = useState('female');

  const studioTabs = [
    { id: 'product-assets', label: 'Product Assets', icon: Package },
    { id: 'vr-visualization', label: 'VR Visualization', icon: Glasses },
  ];

  const backgrounds = [
    { id: 'neo-grid', name: 'Neo Grid', gradient: 'from-blue-900 via-purple-900 to-slate-900' },
    { id: 'forest-xr', name: 'Forest XR', gradient: 'from-green-900 via-emerald-800 to-slate-900' },
    { id: 'dark-tech', name: 'Dark Tech', gradient: 'from-slate-900 via-gray-800 to-black' },
    { id: 'minimal-glow', name: 'Minimal Glow', gradient: 'from-cyan-900 via-blue-900 to-slate-900' },
  ];

  const avatars = [
    { id: 'female', name: 'Female Avatar', image: '/img/female avatar.jpeg' },
    { id: 'male', name: 'Male Avatar', image: '/img/male avatar.jpeg' },
    { id: 'female-synthetic', name: 'Female Synthetic', image: '/img/female syntetic avatar.jpeg' },
    { id: 'male-synthetic', name: 'Male Synthetic', image: '/img/male syntetic avatar.jpeg' },
  ];

  return (
    <div className="max-w-full pr-8 space-y-6 pb-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 blur-3xl"></div>
        <div className="relative">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Asset Studio
          </h2>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1 text-sm`}>Generate immersive XR exhibition experiences powered by AI</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'} backdrop-blur-xl rounded-2xl border ${theme === 'dark' ? 'border-cyan-500/20 shadow-2xl shadow-cyan-500/10' : 'border-slate-200 shadow-lg'} overflow-hidden`}>
        <div className="flex">
          {studioTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveStudioTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                activeStudioTab === tab.id
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-b-2 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-600 border-b-2 border-cyan-500 shadow-sm'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30'
                    : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeStudioTab === 'product-assets' && (
        <div className="space-y-4">
          {/* 2D Pictures Section */}
          <div className={`relative ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'} backdrop-blur-xl rounded-2xl border ${theme === 'dark' ? 'border-cyan-500/20 shadow-2xl shadow-cyan-500/10' : 'border-slate-200 shadow-lg'} p-4`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/5 to-purple-500/5' : 'bg-gradient-to-br from-cyan-500/3 to-purple-500/3'} rounded-2xl`}></div>
            <div className="relative">
              <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-1 flex items-center`}>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 animate-pulse"></div>
                2D Pictures
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-xs mb-3`}>Upload exactly 4 high-quality product images</p>

              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`relative group aspect-square rounded-lg border-2 border-dashed ${theme === 'dark' ? 'border-cyan-500/30 hover:border-cyan-400/60 bg-slate-800/50' : 'border-cyan-400/30 hover:border-cyan-500/60 bg-slate-50'} backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                    <div className="relative h-full flex flex-col items-center justify-center p-2">
                      {uploaded2DImages[index] ? (
                        <div className="w-full h-full rounded overflow-hidden">
                          <img
                            src={uploaded2DImages[index]}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-cyan-400/60 mb-1 group-hover:text-cyan-400 transition-colors" />
                          <p className={`text-[10px] text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} group-hover:text-cyan-400 transition-colors`}>
                            Drag & Drop
                          </p>
                          <p className={`text-[10px] text-center ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>or click</p>
                        </>
                      )}
                    </div>
                    <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/90'} backdrop-blur-sm flex items-center justify-center border border-cyan-500/30`}>
                      <span className="text-[10px] font-bold text-cyan-400">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Models Section */}
          <div className={`relative ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'} backdrop-blur-xl rounded-2xl border ${theme === 'dark' ? 'border-purple-500/20 shadow-2xl shadow-purple-500/10' : 'border-slate-200 shadow-lg'} p-4`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-500/5 to-blue-500/5' : 'bg-gradient-to-br from-purple-500/3 to-blue-500/3'} rounded-2xl`}></div>
            <div className="relative">
              <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-1 flex items-center`}>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2 animate-pulse"></div>
                3D Models
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-xs mb-3`}>Upload 3D model files (GLB, GLTF, FBX formats supported)</p>

              <div className="grid grid-cols-6 gap-2">
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className={`relative group aspect-square rounded-lg border-2 border-dashed ${theme === 'dark' ? 'border-purple-500/30 hover:border-purple-400/60 bg-slate-800/50' : 'border-purple-400/30 hover:border-purple-500/60 bg-slate-50'} backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
                    <div className="relative h-full flex flex-col items-center justify-center p-1.5">
                      {uploaded3DModels[index] ? (
                        <div className="w-full h-full rounded overflow-hidden bg-white flex items-center justify-center">
                          <img
                            src={uploaded3DModels[index]}
                            alt={`3D Model ${index + 1}`}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                      ) : (
                        <>
                          <Box className="w-6 h-6 text-purple-400/60 mb-1 group-hover:text-purple-400 transition-colors" />
                          <p className={`text-[10px] text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} group-hover:text-purple-400 transition-colors`}>
                            Drag & Drop 3D
                          </p>
                          <p className={`text-[10px] text-center ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>GLB, GLTF, FBX</p>
                        </>
                      )}
                    </div>
                    <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/90'} backdrop-blur-sm flex items-center justify-center border border-purple-500/30`}>
                      <span className="text-[10px] font-bold text-purple-400">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeStudioTab === 'vr-visualization' && (
        <div className="space-y-4">
          {/* Digital Screen Backgrounds */}
          <div className={`relative ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'} backdrop-blur-xl rounded-2xl border ${theme === 'dark' ? 'border-purple-500/20 shadow-2xl shadow-purple-500/10' : 'border-slate-200 shadow-lg'} p-4`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-500/5 to-blue-500/5' : 'bg-gradient-to-br from-purple-500/3 to-blue-500/3'} rounded-2xl`}></div>
            <div className="relative">
              <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-1 flex items-center`}>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2 animate-pulse"></div>
                Digital Screen Backgrounds
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-xs mb-3`}>Choose an immersive XR environment for your exhibition</p>

              <div className="grid grid-cols-6 gap-2">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                    className={`relative group aspect-video rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${
                      selectedBackground === bg.id
                        ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/40 scale-105'
                        : 'ring-1 ring-purple-500/20 hover:ring-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${bg.gradient}`}></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>

                    {selectedBackground === bg.id && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-[10px] font-bold text-white">{bg.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Avatar Customization */}
          <div className={`relative ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'} backdrop-blur-xl rounded-2xl border ${theme === 'dark' ? 'border-blue-500/20 shadow-2xl shadow-blue-500/10' : 'border-slate-200 shadow-lg'} p-4`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5' : 'bg-gradient-to-br from-blue-500/3 to-cyan-500/3'} rounded-2xl`}></div>
            <div className="relative">
              <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-1 flex items-center`}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 animate-pulse"></div>
                AI Avatar Customization
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-xs mb-3`}>Configure your virtual exhibition assistant</p>

              <div className="space-y-4">
                {/* Voice Selection */}
                <div>
                  <label className={`block text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} mb-2`}>Voice Type</label>
                  <div className="flex gap-2">
                    {['male', 'female', 'robotic'].map((voice) => (
                      <button
                        key={voice}
                        onClick={() => setVoiceType(voice)}
                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 ${
                          voiceType === voice
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                            : theme === 'dark'
                              ? 'bg-slate-800/50 text-slate-400 border border-blue-500/20 hover:border-blue-400/60 hover:text-blue-400'
                              : 'bg-slate-50 text-slate-500 border border-blue-300/30 hover:border-blue-400/60 hover:text-blue-500'
                        }`}
                      >
                        {voice.charAt(0).toUpperCase() + voice.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Appearance */}
                <div>
                  <label className={`block text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} mb-2`}>Avatar Appearance</label>
                  <div className="grid grid-cols-4 gap-3">
                    {avatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`relative group cursor-pointer rounded-lg transition-all duration-300 overflow-hidden ${
                          selectedAvatar === avatar.id
                            ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/40 scale-105'
                            : 'ring-1 ring-blue-500/20 hover:ring-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20'
                        }`}
                      >
                        <div className={`aspect-square ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-slate-50'} flex items-center justify-center overflow-hidden`}>
                          <img
                            src={avatar.image}
                            alt={avatar.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {selectedAvatar === avatar.id && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                          <p className="text-[10px] font-bold text-white text-center">{avatar.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="relative">
        <button className={`w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 p-[2px] transition-all duration-300 ${theme === 'dark' ? 'hover:shadow-2xl hover:shadow-cyan-500/50' : 'hover:shadow-xl hover:shadow-cyan-500/30'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          <div className={`relative ${theme === 'dark' ? 'bg-slate-900 group-hover:bg-slate-900/80' : 'bg-white group-hover:bg-slate-50'} rounded-xl px-6 py-3 transition-all duration-300`}>
            <div className="flex items-center justify-center gap-2">
              <Wand2 className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-500 group-hover:text-cyan-600'} transition-colors`} />
              <span className={`text-base font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-cyan-400 via-purple-400 to-blue-400' : 'from-cyan-500 via-purple-500 to-blue-500'} bg-clip-text text-transparent`}>
                Generate AI Assets
              </span>
              <ArrowRight className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-500 group-hover:text-cyan-600'} group-hover:translate-x-1 transition-all`} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // Default to Analytics
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark'); // Default to dark theme

  // 1. Auth & Init
  useEffect(() => {
    const initAuth = async () => {
      // Demo mode - simulate authenticated user
      if (!auth) {
        setUser({ uid: 'demo-user', email: 'demo@ex3.com' });
        return;
      }

      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.warn('Firebase auth failed, using demo mode:', error);
        setUser({ uid: 'demo-user', email: 'demo@ex3.com' });
      }
    };
    initAuth();

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleSave = async (data) => {
    setLoading(true);

    // Demo mode - simulate save with local storage
    try {
      localStorage.setItem('ex3-company-profile', JSON.stringify(data));
      console.log("Saving Profile Data:", data);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      alert("✓ Company Profile Saved Successfully!");
    } catch (error) {
      console.error('Save error:', error);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className={`h-screen flex items-center justify-center font-medium animate-pulse ${
    theme === 'dark' ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'
  }`}>Initializing EX3 Platform...</div>;

  return (
    <div className={`flex h-screen font-sans ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} />

      <main className={`flex-1 overflow-y-auto ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        <div className="p-4">
          {activeTab === 'profile' && <CompanyProfile onSave={handleSave} theme={theme} />}
          {activeTab === 'analytics' && <AnalyticsPro theme={theme} />}
          {activeTab === 'ai-studio' && <AIAssetStudio theme={theme} />}
          {(activeTab !== 'profile' && activeTab !== 'analytics' && activeTab !== 'ai-studio') && (
             <div className={`flex flex-col items-center justify-center h-[70vh] ${
               theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
             }`}>
                <Settings size={48} className="mb-4 opacity-20" />
                <p>This module is not the focus of the current demo.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
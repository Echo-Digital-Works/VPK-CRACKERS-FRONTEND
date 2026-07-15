import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, type Product } from '../data/products';
import { HiOutlineChartBar, HiOutlineCube, HiOutlinePhone, HiOutlineLogout } from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx-js-style';

type Tab = 'dashboard' | 'products' | 'my_products' | 'product_enquiries' | 'contact_enquiries' | 'offers' | 'offer_enquiries';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '', category: 'Flower Pots', price: '', discount: '', img: '', desc: ''
  });
  const [currentOffer, setCurrentOffer] = useState<any>({
    title: '', discount: '', description: '', image: '', price: '', discountPrice: '', products: [], isActive: true
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin-vpk-secure');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, enquiriesRes, offersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/products`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/api/enquiry`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/api/offers`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const pData = await productsRes.json();
      const eData = await enquiriesRes.json();
      const oData = await offersRes.json();
      
      setProducts(pData.map((p: any) => ({ ...p, id: p._id })));
      setEnquiries(eData);
      setOffers(oData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      setProducts(data.map((p: any) => ({ ...p, id: p._id })));
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (activeTab === 'offers') {
          setCurrentOffer((prev: any) => ({ ...prev, image: reader.result as string }));
        } else {
          setCurrentProduct(prev => ({ ...prev, img: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-vpk-secure');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'offers') {
      const url = isEditing && currentOffer._id 
        ? `${import.meta.env.VITE_API_URL}/api/offers/${currentOffer._id}`
        : `${import.meta.env.VITE_API_URL}/api/offers`;
        
      const method = isEditing ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(currentOffer)
        });

        if (res.ok) {
          setIsEditing(false);
          setCurrentOffer({ title: '', discount: '', description: '', image: '', price: '', discountPrice: '', products: [], isActive: true });
          fetchData();
        } else {
          alert('Error saving offer');
        }
      } catch (err) {
        console.error('Error:', err);
      }
      return;
    }

    const url = isEditing && currentProduct.id 
      ? `${import.meta.env.VITE_API_URL}/api/products/${currentProduct.id}`
      : `${import.meta.env.VITE_API_URL}/api/products`;
      
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentProduct)
      });

      if (res.ok) {
        setIsEditing(false);
        setCurrentProduct({ name: '', category: 'Flower Pots', price: '', discount: '', img: '', desc: '' });
        fetchProducts();
      } else {
        alert('Error saving product');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (activeTab === 'offers') {
      if (window.confirm('Are you sure you want to delete this offer?')) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            fetchData();
          }
        } catch (err) {
          console.error('Error deleting offer:', err);
        }
      }
      return;
    }

    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          fetchProducts();
        }
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const updateEnquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/enquiry/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        const updatedEnquiry = await res.json();
        setEnquiries(enquiries.map(e => e._id === id ? updatedEnquiry : e));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(updatedEnquiry);
        }
      }
    } catch (err) {
      console.error('Error updating enquiry status:', err);
    }
  };

  const handleDownloadReport = () => {
    const headers = ['Date', 'Type', 'Customer Name', 'Phone', 'Email', 'Location', 'Products', 'Status', 'Total Amount', 'Message'];
    
    const aoa = [
      ['VPK PREM CRACKERS'], // Row 1 (Title)
      ['Orders & Enquiries Report'], // Row 2 (Subtitle)
      [], // Row 3 (Empty spacer)
      headers // Row 4 (Headers)
    ];
    
    enquiries.forEach(enq => {
      const date = new Date(enq.createdAt).toLocaleDateString();
      const type = (enq.type || 'contact').toUpperCase();
      const status = (enq.status || (enq.type === 'product' ? 'pending' : '-')).toUpperCase();
      
      let productsStr = '';
      if (enq.cartItems && enq.cartItems.length > 0) {
        productsStr = enq.cartItems.map((item: any) => `${item.name} (Qty: ${item.quantity})`).join('\n'); // Use newline for multiline in Excel
      }
      
      aoa.push([
        date,
        type,
        enq.name || '',
        String(enq.phone || ''), // Cast to string to prevent scientific notation
        enq.email || '',
        enq.place || '',
        productsStr,
        status,
        enq.cartTotal ? `₹${enq.cartTotal}` : '₹0',
        enq.message && enq.message !== 'No additional message provided.' ? enq.message : '-'
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    
    // Merge the title cells across all columns
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }
    ];

    // Style the main title
    const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
    worksheet[titleCell].s = {
      font: { name: 'Arial', sz: 22, bold: true, color: { rgb: "FF6B00" } }, // Brand Orange
      alignment: { horizontal: 'center', vertical: 'center' }
    };

    // Style the subtitle
    const subtitleCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
    worksheet[subtitleCell].s = {
      font: { name: 'Arial', sz: 14, bold: true, color: { rgb: "4B5563" } }, // Gray
      alignment: { horizontal: 'center', vertical: 'center' }
    };
    
    // Style the header row (now at row 3)
    for (let C = 0; C < headers.length; ++C) {
      const address = XLSX.utils.encode_cell({ r: 3, c: C });
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        fill: {
          patternType: 'solid',
          fgColor: { rgb: "2563EB" } // A nice brand blue
        },
        font: {
          color: { rgb: "FFFFFF" },
          bold: true
        }
      };
    }
    
    // Set row heights for the header
    worksheet['!rows'] = [
      { hpt: 40 }, // Row 0 (Title)
      { hpt: 25 }, // Row 1 (Subtitle)
      { hpt: 15 }, // Row 2 (Spacer)
      { hpt: 25 }  // Row 3 (Headers)
    ];

    // Set column widths for better readability
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 10 }, // Type
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Phone
      { wch: 25 }, // Email
      { wch: 18 }, // Location
      { wch: 50 }, // Products
      { wch: 12 }, // Status
      { wch: 15 }, // Total Amount
      { wch: 50 }, // Message
    ];
    worksheet['!cols'] = colWidths;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Enquiries Report');
    
    XLSX.writeFile(workbook, `VPK_Cracker_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const { chartData, topProducts } = useMemo(() => {
    // Top Products
    const sales: Record<string, number> = {};
    enquiries.forEach(enq => {
      if (enq.type === 'product' && enq.cartItems) {
        enq.cartItems.forEach((item: any) => {
          sales[item.name] = (sales[item.name] || 0) + item.quantity;
        });
      }
    });
    
    const topProducts = Object.entries(sales)
      .map(([name, count]) => ({ name, sales: count }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
      
    // Chart Data (Enquiries by Date)
    const dates: Record<string, number> = {};
    const sortedEnquiries = [...enquiries].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    sortedEnquiries.forEach(enq => {
      const d = new Date(enq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      dates[d] = (dates[d] || 0) + 1;
    });
    
    const chartData = Object.entries(dates).map(([date, Enquiries]) => ({ date, Enquiries }));
    
    return { chartData, topProducts };
  }, [enquiries]);

  const handleAddProductToOffer = () => {
    setCurrentOffer((prev: any) => ({
      ...prev,
      products: [...(prev.products || []), { name: '', category: '', price: 0, quantity: 1, total: 0 }]
    }));
  };

  const handleUpdateOfferProduct = (index: number, field: string, value: any) => {
    const updatedProducts = [...(currentOffer.products || [])];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    
    if (field === 'price' || field === 'quantity') {
      updatedProducts[index].total = (Number(updatedProducts[index].price) || 0) * (Number(updatedProducts[index].quantity) || 0);
    }
    
    const newOverallPrice = updatedProducts.reduce((sum, p) => sum + p.total, 0);

    setCurrentOffer((prev: any) => ({
      ...prev,
      products: updatedProducts,
      price: newOverallPrice.toString()
    }));
  };

  const handleRemoveOfferProduct = (index: number) => {
    const updatedProducts = (currentOffer.products || []).filter((_: any, i: number) => i !== index);
    const newOverallPrice = updatedProducts.reduce((sum: number, p: any) => sum + p.total, 0);
    
    setCurrentOffer((prev: any) => ({
      ...prev,
      products: updatedProducts,
      price: newOverallPrice.toString()
    }));
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600 font-medium">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between md:justify-center">
          <img src="/images.png" alt="Luminary Logo" className="h-12 w-auto object-contain rounded-md" />
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => handleTabChange('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <HiOutlineChartBar className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => { handleTabChange('products'); setIsEditing(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <HiOutlineCube className="w-5 h-5" />
            <span>Manage Products</span>
          </button>

          <button 
            onClick={() => { handleTabChange('offers'); setIsEditing(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'offers' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
            <span>Manage Offers</span>
          </button>

          <button 
            onClick={() => handleTabChange('my_products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'my_products' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <HiOutlineCube className="w-5 h-5" />
            <span>My Products</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('product_enquiries')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'product_enquiries' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <HiOutlineCube className="w-5 h-5" />
            <span>Product Enquiries</span>
          </button>

          <button 
            onClick={() => handleTabChange('contact_enquiries')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'contact_enquiries' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <HiOutlinePhone className="w-5 h-5" />
            <span>Contact Enquiries</span>
          </button>

          <button 
            onClick={() => handleTabChange('offer_enquiries')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'offer_enquiries' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <HiOutlineChartBar className="w-5 h-5" />
            <span>Offer Enquiries</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <img src="/images.png" alt="Logo" className="h-8 w-auto object-contain rounded" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
              <button 
                onClick={handleDownloadReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Report</span>
              </button>
            </div>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-transform hover:-translate-y-1">
                <div className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Total Products</div>
                <div className="text-4xl font-black text-gray-900">{products.length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-transform hover:-translate-y-1">
                <div className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Total Enquiries</div>
                <div className="text-4xl font-black text-blue-600">{enquiries.length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-transform hover:-translate-y-1">
                <div className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Product Orders</div>
                <div className="text-4xl font-black text-indigo-600">{enquiries.filter(e => e.type === 'product').length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-transform hover:-translate-y-1">
                <div className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">General Contact</div>
                <div className="text-4xl font-black text-orange-500">{enquiries.filter(e => e.type === 'contact' || !e.type).length}</div>
              </div>
            </div>
            
            {/* Charts & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Enquiries Over Time</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                      />
                      <Line type="monotone" dataKey="Enquiries" stroke="#2563eb" strokeWidth={4} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, stroke: '#bfdbfe', strokeWidth: 4}} animationDuration={1500} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Fast Selling Products</h3>
                <div className="space-y-4 flex-1">
                  {topProducts.length > 0 ? topProducts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden pr-2">
                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' : idx === 1 ? 'bg-gray-200 text-gray-700 ring-2 ring-gray-300' : idx === 2 ? 'bg-orange-100 text-orange-800 ring-2 ring-orange-200' : 'bg-blue-50 text-blue-600'}`}>
                          #{idx + 1}
                        </div>
                        <span className="font-semibold text-gray-900 truncate">{p.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm shrink-0">{p.sales} Sold</span>
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">No sales data available yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Manage Products</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input 
                      list="category-options"
                      value={currentProduct.category} 
                      onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Select or type a category"
                      required 
                    />
                    <datalist id="category-options">
                      {Array.from(new Set([...categories.filter(c => c !== 'All'), ...products.map(p => p.category)])).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </datalist>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (e.g., ₹250)</label>
                      <input type="text" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (optional)</label>
                      <input type="text" value={currentProduct.discount} onChange={e => setCurrentProduct({...currentProduct, discount: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={currentProduct.desc} onChange={e => setCurrentProduct({...currentProduct, desc: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} required></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" />
                    {currentProduct.img && (
                      <div className="mt-4">
                        <img src={currentProduct.img} alt="Preview" className="h-32 object-contain rounded-lg border border-gray-200 p-2" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                      {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={() => { setIsEditing(false); setCurrentProduct({ name: '', category: 'Flower Pots', price: '', discount: '', img: '', desc: '' }); }} className="px-5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Products List Section */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-xl font-bold text-gray-900">Product List</h3>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">{products.length} Items</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Image</th>
                        <th className="px-6 py-4">Name & Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <img src={product.img} alt={product.name} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{product.price}</div>
                            {product.discount && <div className="text-xs text-red-500 mt-1">{product.discount}</div>}
                          </td>
                          <td className="px-6 py-4 text-right space-x-3">
                            <button 
                              onClick={() => { setIsEditing(true); setCurrentProduct(product); }}
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:text-red-700 font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-12 text-gray-500">
                            No products found. Add your first product to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Products Tab */}
        {activeTab === 'my_products' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Products</h2>
            
            {products.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                No products available. Add some products in the Manage Products tab.
              </div>
            ) : (
              <div className="space-y-12">
                {Array.from(new Set(products.map(p => p.category))).map(category => (
                  <div key={category}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.filter(p => p.category === category).map(product => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                          <div className="h-48 relative overflow-hidden bg-gray-50">
                            <img 
                              src={product.img} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                            {product.discount && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                {product.discount}
                              </div>
                            )}
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                              {product.category}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">
                              {product.desc}
                            </p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                              <span className="text-xl font-black text-gray-900">{product.price}</span>
                              <button 
                                onClick={() => { setActiveTab('products'); setIsEditing(true); setCurrentProduct(product); }}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Manage Offers</h2>
            
            <div className="flex flex-col gap-8">
              {/* Form Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                  {isEditing ? 'Edit Offer' : 'Add New Offer'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                    <input type="text" value={currentOffer.title} onChange={e => setCurrentOffer({...currentOffer, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Tag (e.g. Flat 30% OFF)</label>
                    <input type="text" value={currentOffer.discount} onChange={e => setCurrentOffer({...currentOffer, discount: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={currentOffer.description} onChange={e => setCurrentOffer({...currentOffer, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} required></textarea>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-bold text-gray-900">Combo Products</label>
                      <button 
                        type="button" 
                        onClick={handleAddProductToOffer}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                      >
                        + Add Product
                      </button>
                    </div>
                    
                    {(!currentOffer.products || currentOffer.products.length === 0) && (
                      <div className="text-sm text-gray-500 text-center py-4 italic">No products added yet. Click "+ Add Product" to build this combo.</div>
                    )}

                    <div className="overflow-x-auto">
                      <div className="space-y-3 min-w-[700px]">
                        {currentOffer.products && currentOffer.products.length > 0 && (
                          <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <div>Name</div>
                            <div>Category</div>
                            <div>Price (₹)</div>
                            <div>Qty</div>
                            <div>Total</div>
                            <div className="w-6"></div>
                          </div>
                        )}
                        {(currentOffer.products || []).map((prod: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-2 items-center bg-white border border-gray-200 rounded-lg p-2">
                            <input type="text" placeholder="Product Name" value={prod.name} onChange={e => handleUpdateOfferProduct(idx, 'name', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md px-2 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input type="text" placeholder="Category" value={prod.category} onChange={e => handleUpdateOfferProduct(idx, 'category', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md px-2 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input type="number" placeholder="Price" value={prod.price || ''} onChange={e => handleUpdateOfferProduct(idx, 'price', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md px-2 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input type="number" placeholder="Qty" value={prod.quantity || ''} onChange={e => handleUpdateOfferProduct(idx, 'quantity', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md px-2 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <div className="bg-gray-100 rounded-md px-2 py-2 text-sm font-bold text-gray-900 flex items-center justify-center">
                              ₹{prod.total}
                            </div>
                            <button type="button" onClick={() => handleRemoveOfferProduct(idx)} className="text-red-500 hover:text-red-700 p-1 flex justify-center items-center rounded hover:bg-red-50 transition-colors">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calculated Original Price</label>
                      <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-600 font-bold">
                        ₹ {currentOffer.price || '0'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (e.g. 3500)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input type="text" value={currentOffer.discountPrice} onChange={e => setCurrentOffer({...currentOffer, discountPrice: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={currentOffer.isActive} onChange={e => setCurrentOffer({...currentOffer, isActive: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                      <span className="text-gray-900 font-medium">Active (Visible on homepage)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" />
                    {currentOffer.image && (
                      <div className="mt-4">
                        <img src={currentOffer.image} alt="Preview" className="h-32 w-full object-cover rounded-lg border border-gray-200" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                      {isEditing ? 'Update Offer' : 'Add Offer'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={() => { setIsEditing(false); setCurrentOffer({ title: '', discount: '', description: '', image: '', price: '', discountPrice: '', products: [], isActive: true }); }} className="px-5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Offers List Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-xl font-bold text-gray-900">Offer List</h3>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">{offers.length} Offers</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Image</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {offers.map((offer) => (
                        <tr key={offer._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <img src={offer.image} alt={offer.title} className="w-16 h-12 object-cover rounded-md border border-gray-200" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{offer.title}</div>
                            <div className="text-xs text-brand-orange font-bold mt-1">{offer.discount}</div>
                            {offer.discountPrice && <div className="text-xs text-gray-500 mt-1">{offer.discountPrice}</div>}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {offer.isActive ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">Inactive</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-3">
                            <button 
                              onClick={() => { setIsEditing(true); setCurrentOffer(offer); }}
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(offer._id)}
                              className="text-red-500 hover:text-red-700 font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {offers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-12 text-gray-500">
                            No offers found. Create your first offer to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Enquiries Tab */}
        {activeTab === 'product_enquiries' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Product Enquiries</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Received Cart Orders</h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{enquiries.filter(e => e.type === 'product').length} Total</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4 max-w-md">Items / Requirements</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enquiries.filter(e => e.type === 'product').map((enquiry) => (
                      <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors align-top">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                          {new Date(enquiry.createdAt).toLocaleDateString()} <br/>
                          {new Date(enquiry.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{enquiry.name}</div>
                          {enquiry.place && <div className="text-xs text-gray-500 mt-1">{enquiry.place}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{enquiry.phone}</div>
                          {enquiry.email && <div className="text-xs text-blue-600 mt-1">{enquiry.email}</div>}
                        </td>
                        <td className="px-6 py-4">
                          {enquiry.cartItems && enquiry.cartItems.length > 0 ? (
                            <button
                              onClick={() => setSelectedEnquiry(enquiry)}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
                            >
                              View Items
                            </button>
                          ) : (
                            <div className="text-gray-600 text-sm whitespace-pre-wrap">{enquiry.message}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {enquiry.cartItems && enquiry.cartItems.length > 0 ? (
                            <div>
                              {enquiry.status === 'completed' ? (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">COMPLETED</span>
                              ) : enquiry.status === 'delivered' ? (
                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-200">DELIVERED</span>
                              ) : (
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">PENDING</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {enquiries.filter(e => e.type === 'product').length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-500">
                          No product enquiries received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Contact Enquiries Tab */}
        {activeTab === 'contact_enquiries' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Enquiries</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">General Messages</h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{enquiries.filter(e => e.type === 'contact' || !e.type).length} Total</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4 max-w-md">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enquiries.filter(e => e.type === 'contact' || !e.type).map((enquiry) => (
                      <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors align-top">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                          {new Date(enquiry.createdAt).toLocaleDateString()} <br/>
                          {new Date(enquiry.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{enquiry.name}</div>
                          {enquiry.place && <div className="text-xs text-gray-500 mt-1">{enquiry.place}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{enquiry.phone}</div>
                          {enquiry.email && <div className="text-xs text-blue-600 mt-1">{enquiry.email}</div>}
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <div className="text-gray-600 text-sm whitespace-pre-wrap">{enquiry.message}</div>
                        </td>
                      </tr>
                    ))}
                    {enquiries.filter(e => e.type === 'contact' || !e.type).length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-gray-500">
                          No contact enquiries received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Offer Enquiries Tab */}
        {activeTab === 'offer_enquiries' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Offer Enquiries</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Received Offer Enquiries</h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{enquiries.filter(e => e.type === 'offer').length} Total</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4 max-w-md">Offer Requested</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enquiries.filter(e => e.type === 'offer').map((enquiry) => (
                      <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors align-top">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                          {new Date(enquiry.createdAt).toLocaleDateString()} <br/>
                          {new Date(enquiry.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{enquiry.name}</div>
                          {enquiry.place && <div className="text-xs text-gray-500 mt-1">{enquiry.place}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{enquiry.phone}</div>
                          {enquiry.email && <div className="text-xs text-blue-600 mt-1">{enquiry.email}</div>}
                        </td>
                        <td className="px-6 py-4">
                          {enquiry.cartItems && enquiry.cartItems.length > 0 ? (
                            <button
                              onClick={() => setSelectedEnquiry(enquiry)}
                              className="px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-lg font-semibold hover:bg-brand-orange/20 transition-colors border border-brand-orange/20"
                            >
                              View Offer Details
                            </button>
                          ) : (
                            <div className="text-gray-600 text-sm whitespace-pre-wrap">{enquiry.message}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {enquiry.cartItems && enquiry.cartItems.length > 0 ? (
                            <div>
                              {enquiry.status === 'completed' ? (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">COMPLETED</span>
                              ) : enquiry.status === 'delivered' ? (
                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-200">DELIVERED</span>
                              ) : (
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">PENDING</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {enquiries.filter(e => e.type === 'offer').length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-500">
                          No offer enquiries received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Enquiry Details</h3>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Customer Name</span>
                  <span className="font-bold text-gray-900">{selectedEnquiry.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Phone</span>
                  <span className="font-bold text-gray-900">{selectedEnquiry.phone}</span>
                </div>
                {selectedEnquiry.email && (
                  <div>
                    <span className="text-gray-500 block">Email</span>
                    <span className="font-medium text-gray-900">{selectedEnquiry.email}</span>
                  </div>
                )}
                {selectedEnquiry.place && (
                  <div>
                    <span className="text-gray-500 block">Location</span>
                    <span className="font-medium text-gray-900">{selectedEnquiry.place}</span>
                  </div>
                )}
              </div>

              <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Requested Items</h4>
              <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedEnquiry.cartItems?.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{item.price}</td>
                        <td className="px-4 py-3 text-right font-medium">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right text-gray-900">Overall Total Amount:</td>
                      <td className="px-4 py-3 text-right text-blue-700 text-lg">₹{selectedEnquiry.cartTotal}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {selectedEnquiry.message && selectedEnquiry.message !== 'No additional message provided.' && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Additional Message</h4>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm whitespace-pre-wrap border border-gray-100">
                    {selectedEnquiry.message}
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                {(!selectedEnquiry.status || selectedEnquiry.status === 'pending') && (
                  <button 
                    onClick={() => updateEnquiryStatus(selectedEnquiry._id, 'delivered')}
                    className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Mark as Delivered
                  </button>
                )}
                
                {selectedEnquiry.status === 'delivered' && (
                  <button 
                    onClick={() => updateEnquiryStatus(selectedEnquiry._id, 'completed')}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                  >
                    Mark as Complete
                  </button>
                )}
                
                {selectedEnquiry.status === 'completed' && (
                  <button 
                    disabled
                    className="px-6 py-3 bg-gray-100 text-green-600 font-bold rounded-lg cursor-not-allowed border border-green-200"
                  >
                    Fully Completed ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}


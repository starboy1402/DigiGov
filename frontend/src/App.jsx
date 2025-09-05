import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { CheckCircle, XCircle, Clock, BarChart, User, FileText, DollarSign, LogIn, UserPlus, Home, Shield, ArrowRight, Edit, Download, HeartPulse, Baby, LandPlot, Receipt, MessageSquare } from 'lucide-react';

// --- Anime.js (CDN) ---
const useAnime = (animationFn, deps = []) => {
    const elementRef = useRef(null);
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.anime) {
                clearInterval(interval);
                if (elementRef.current) {
                    animationFn(elementRef.current, window.anime);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, deps);
    return elementRef;
};

// --- REAL API CONNECTION ---
const API_BASE_URL = 'http://localhost:8080';

const API = {
    signup: async (data) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Signup failed');
        }
        return response.json();
    },
    login: async (data) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Login failed');
        }
        return response.json();
    },
    adminLogin: async (data) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Admin login failed');
        }
        return response.json();
    },
    createProfile: async (data, token) => {
        const response = await fetch(`${API_BASE_URL}/api/citizen-profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Profile creation failed');
        }
        return response.json();
    },
    updateProfile: async (data, token) => {
        const response = await fetch(`${API_BASE_URL}/api/citizen-profiles`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Profile update failed');
        }
        return response.json();
    },
    getMyProfile: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/citizen-profiles/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        return response.json();
    },
    createApplication: async (data, token) => {
        const response = await fetch(`${API_BASE_URL}/api/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Application submission failed');
        }
        return response.json();
    },
    getMyApplications: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/applications/my-applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }
        return response.json();
    },
    submitPayment: async (data, token) => {
        const response = await fetch(`${API_BASE_URL}/api/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Payment submission failed');
        }
        return response.json();
    },
    getAllApplications: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch all applications');
        }
        return response.json();
    },
    getApplicationStats: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }
        return response.json();
    },
    approveApplication: async (id, token) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/applications/${id}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to approve application');
        }
        return response.json();
    },
    rejectApplication: async (id, token) => {
        const response = await fetch(`${API_BASE_URL}/api/admin/applications/${id}/reject`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to reject application');
        }
        return response.json();
    }
};


// --- MOCK API (For features not yet built in the backend) ---
const MOCK_API = {
    uploadDocument: async (data) => { console.log("Uploading document:", data); await new Promise(r => setTimeout(r, 500)); return { success: true, documentId: `doc_${Date.now()}` }; },
    submitFeedback: async (data) => {
        console.log("Submitting feedback:", data); await new Promise(r => setTimeout(r, 500));
        const newFeedback = { id: Date.now(), submission_date: new Date().toISOString(), status: 'New', ...data, admin_notes: null, updated_at: new Date().toISOString() };
        const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        localStorage.setItem('feedback', JSON.stringify([...existingFeedback, newFeedback]));
        return { success: true };
    },
    getFeedback: async () => {
        console.log("Getting all feedback"); await new Promise(r => setTimeout(r, 500));
        return JSON.parse(localStorage.getItem('feedback') || '[]');
    },
    updateFeedbackStatus: async (feedbackId, newStatus) => {
        console.log(`Updating feedback ${feedbackId} to ${newStatus}`);
        await new Promise(r => setTimeout(r, 500));
        const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        const updatedFeedback = feedback.map(item => 
            item.id === feedbackId 
            ? { ...item, status: newStatus, updated_at: new Date().toISOString() } 
            : item
        );
        localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
        return { success: true };
    }
};

const SERVICES = [
    { id: 1, name: "Characteristic Certificate" }, 
    { id: 2, name: "Marriage Certificate" },
    { id: 3, name: "Disability Certificate" }, 
    { id: 4, name: "Death Certificate" },
    { id: 5, name: "Citizen Certificate" }, 
    { id: 6, name: "Holding Tax Payment" },
    { id: 7, name: "National Health Card" },
    { id: 8, name: "Birth Certificate" },
    { id: 9, name: "Land Ownership Transfer" },
    { id: 10, name: "E-Tax Filing" }
];

const getServiceName = (id) => {
    const service = SERVICES.find(s => s.id === id);
    return service ? service.name : "Unknown Service";
};

// --- CONTEXTS ---
const AuthContext = createContext(null);
const AppContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        const userData = JSON.parse(localStorage.getItem('user'));
        if (token && userData) { setUser(userData); setIsAdmin(userType === 'admin'); }
        setLoading(false);
    }, []);
    const login = (userData, token, type = 'user') => { localStorage.setItem('token', token); localStorage.setItem('userType', type); localStorage.setItem('user', JSON.stringify(userData)); setUser(userData); setIsAdmin(type === 'admin'); };
    const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('userType'); localStorage.removeItem('user'); localStorage.removeItem('profile'); setUser(null); setIsAdmin(false); };
    return <AuthContext.Provider value={{ user, isAdmin, login, logout, isAuthenticated: !!user, loading }}>{children}</AuthContext.Provider>;
};

const AppProvider = ({ children }) => {
    const [route, setRoute] = useState('home');
    const [currentApplication, setCurrentApplication] = useState(null);
    const navigate = (newRoute, data = null) => { if (newRoute === 'payment' || newRoute === 'apply') { setCurrentApplication(data); } setRoute(newRoute); };
    return <AppContext.Provider value={{ route, navigate, currentApplication, setCurrentApplication }}>{children}</AppContext.Provider>;
};

// --- HOOKS ---
const useAuth = () => useContext(AuthContext);
const useApp = () => useContext(AppContext);

// --- UI COMPONENTS ---
const AnimatedCard = ({ children, className = '', delay = 0 }) => {
    const cardRef = useAnime((el, anime) => {
        anime({ targets: el, translateY: [50, 0], opacity: [0, 1], duration: 800, delay, easing: 'easeOutExpo' });
    });
    return <div ref={cardRef} className={`bg-white/80 backdrop-blur-sm shadow-2xl shadow-[#4E2A2A]/10 rounded-2xl p-6 md:p-8 ${className}`}>{children}</div>;
};

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
    const baseClasses = 'w-full font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg';
    const variants = {
        primary: 'bg-gradient-to-r from-[#E97451] to-[#c15c41] text-white hover:shadow-lg hover:shadow-[#E97451]/40 focus:ring-[#E97451]/50',
        secondary: 'bg-gray-200 text-[#4E2A2A] hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-orange-500/40 focus:ring-orange-300',
        success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-emerald-500/40 focus:ring-emerald-300',
    };
    return <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} disabled={disabled}>{children}</button>;
};

const Input = ({ id, label, type = 'text', value, onChange, required = false, ...props }) => (
    <div className="relative">
        <input type={type} id={id} value={value} onChange={onChange} required={required} className="peer mt-1 block w-full px-4 py-3 bg-[#FFFBF5]/50 border-2 border-gray-300 rounded-lg shadow-sm placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#E97451] transition-colors text-[#4E2A2A]" placeholder={label} {...props} />
        <label htmlFor={id} className="absolute left-4 -top-3.5 text-sm text-gray-500 bg-white/0 peer-placeholder-shown:bg-transparent bg-clip-padding px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#c15c41] peer-focus:bg-[#FFFBF5]">{label}</label>
    </div>
);

const Textarea = ({ id, label, value, onChange, required = false, ...props }) => (
    <div className="relative">
        <textarea id={id} value={value} onChange={onChange} required={required} rows="5" className="peer mt-1 block w-full px-4 py-3 bg-[#FFFBF5]/50 border-2 border-gray-300 rounded-lg shadow-sm placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#E97451] transition-colors text-[#4E2A2A]" placeholder={label} {...props} />
        <label htmlFor={id} className="absolute left-4 -top-3.5 text-sm text-gray-500 bg-white/0 peer-placeholder-shown:bg-transparent bg-clip-padding px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#c15c41] peer-focus:bg-[#FFFBF5]">{label}</label>
    </div>
);

const Select = ({ id, label, value, onChange, options, required = false, className = '' }) => (
    <div className={`relative ${className}`}>
        <select id={id} value={value || ''} onChange={onChange} required={required} className="peer mt-1 block w-full px-4 py-3 bg-[#FFFBF5]/50 border-2 border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-[#E97451] transition-colors text-[#4E2A2A] placeholder-transparent">
            <option value="" disabled></option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <label htmlFor={id} className={`absolute left-4 text-gray-500 bg-white/0 bg-clip-padding px-1 transition-all duration-100 ease-in-out 
            ${value ? '-top-3.5 text-sm text-[#c15c41] bg-[#FFFBF5]' : 'top-3.5 text-base'} 
            peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#c15c41] peer-focus:bg-[#FFFBF5]`}>
            {label}
        </label>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
    </div>
);


const Spinner = () => <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E97451]"></div></div>;

const Header = ({}) => {
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const { navigate } = useApp();
    const headerRef = useAnime((el, anime) => { anime({ targets: el, translateY: [-100, 0], opacity: [0, 1], duration: 1000, easing: 'easeOutExpo' }); });
    return (
        <header ref={headerRef} className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-md">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div onClick={() => navigate('home')} className="cursor-pointer group">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4E2A2A] to-[#8c4a32]">GovPortal</h1>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                    {!isAdmin && (
                        <button 
                            onClick={() => navigate('feedback')} 
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#4E2A2A] bg-gray-200/50 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E97451] transform hover:scale-105 duration-300"
                        >
                            <MessageSquare size={16} />
                            Feedback
                        </button>
                    )}
                    {isAuthenticated ? (
                        <>
                            <Button onClick={() => navigate(isAdmin ? 'adminDashboard' : 'dashboard')} variant="secondary" className="w-auto px-4 py-2 text-sm">Dashboard</Button>
                            <Button onClick={logout} variant="primary" className="w-auto px-4 py-2 text-sm">Logout</Button>
                        </>
                    ) : (
                        <>
                           <Button onClick={() => navigate('login')} variant="secondary" className="w-auto px-4 py-2 text-sm">Login</Button>
                           <Button onClick={() => navigate('signup')} variant="primary" className="w-auto px-4 py-2 text-sm">Sign Up</Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

const StatusBadge = ({ status }) => {
    const styles = { PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300', COMPLETED: 'bg-green-100 text-green-800 border-green-300', APPROVED: 'bg-purple-100 text-purple-800 border-purple-300', REJECTED: 'bg-red-100 text-red-800 border-red-300', New: 'bg-blue-100 text-blue-800 border-blue-300', 'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-300', Resolved: 'bg-gray-100 text-gray-800 border-gray-300' };
    const icons = { PENDING: <Clock className="w-4 h-4 mr-1.5" />, COMPLETED: <CheckCircle className="w-4 h-4 mr-1.5" />, APPROVED: <CheckCircle className="w-4 h-4 mr-1.5" />, REJECTED: <XCircle className="w-4 h-4 mr-1.5" />, New: <MessageSquare className="w-4 h-4 mr-1.5" />, 'In Progress': <Clock className="w-4 h-4 mr-1.5" />, Resolved: <CheckCircle className="w-4 h-4 mr-1.5" /> };
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>{icons[status]} {status}</span>;
};

// --- PAGES ---
const HomePage = () => {
    const { navigate } = useApp();
    const services = [
        { id: 1, name: "Characteristic Certificate", icon: User, color: "text-[#E97451]", description: "Apply for a certificate of good character." },
        { id: 2, name: "Marriage Certificate", icon: UserPlus, color: "text-pink-500", description: "Register your marriage and get a certificate." },
        { id: 3, name: "Disability Certificate", icon: User, color: "text-indigo-500", description: "Official certification for persons with disabilities." },
        { id: 4, name: "Death Certificate", icon: XCircle, color: "text-gray-500", description: "Official document declaring a person's death." },
        { id: 5, name: "Citizen Certificate", icon: Home, color: "text-emerald-500", description: "Proof of citizenship for official purposes." },
        { id: 6, name: "Holding Tax", icon: DollarSign, color: "text-amber-500", description: "Pay your municipal holding taxes online." },
        { id: 7, name: "National Health Card", icon: HeartPulse, color: "text-red-600", description: "Register for medical benefits and services." },
        { id: 8, name: "Birth Certificate", icon: Baby, color: "text-sky-500", description: "Officially register a newborn's birth." },
        { id: 9, name: "Land Ownership Transfer", icon: LandPlot, color: "text-lime-600", description: "Process the transfer of land property." },
        { id: 10, name: "E-Tax Filing", icon: Receipt, color: "text-violet-500", description: "File your annual income tax returns online." },
    ];

    const heroRef = useAnime((el, anime) => {
        anime.timeline({ easing: 'easeOutExpo' })
            .add({ targets: '.hero-letter', translateY: [100, 0], opacity: [0, 1], delay: anime.stagger(30) })
            .add({ targets: el.querySelector('p'), translateY: [-30, 0], opacity: [0, 1], duration: 600 }, '-=600')
            .add({ targets: el.querySelector('button'), scale: [0.8, 1], opacity: [0, 1], duration: 500 }, '-=400');
    });

    const servicesRef = useAnime((el, anime) => {
        anime({ targets: '.service-card', translateY: [100, 0], opacity: [0, 1], delay: anime.stagger(100, { start: 200 }), easing: 'easeOutExpo' });
    });

    return (
        <div className="space-y-24 relative">
            <div ref={heroRef} className="text-center pt-16 pb-20 relative z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#4E2A2A] leading-tight tracking-tighter">
                    {"Seamless Digital Government Services".split("").map((l, i) => <span key={i} className="hero-letter inline-block" style={{ opacity: 0 }}>{l === ' ' ? '\u00A0' : l}</span>)}
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-[#4E2A2A]/80">
                    Access essential public services from the comfort of your home. Fast, secure, and efficient.
                </p>
                <div className="mt-8">
                    <Button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="inline-flex w-auto px-8 py-4 text-lg">
                        Explore Services <ArrowRight className="ml-2"/>
                    </Button>
                </div>
            </div>

            <div id="services" ref={servicesRef} className="text-center relative z-10">
                <h2 className="text-4xl font-bold text-[#4E2A2A]">Available Services</h2>
                <p className="mt-4 text-lg text-[#4E2A2A]/80">Select a service to start your application.</p>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {services.map(service => {
                        const Icon = service.icon;
                        return (
                            <div key={service.id} onClick={() => navigate('apply', { serviceId: service.id })} className="service-card cursor-pointer bg-white/60 backdrop-blur-md border border-gray-200/50 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-[#E97451]/20 transition-all duration-300 transform hover:-translate-y-2 group hover:border-[#E97451]/50">
                                <div className={`flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-100 mb-6 mx-auto transition-colors duration-300 group-hover:bg-[#E97451]/20`}>
                                    <Icon className={`w-8 h-8 ${service.color} transition-transform duration-300 group-hover:scale-110 group-hover:text-[#c15c41]`} />
                                </div>
                                <h3 className="text-xl font-bold text-[#4E2A2A]">{service.name}</h3>
                                <p className="mt-2 text-[#4E2A2A]/80">{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
             <div className="text-center pb-16 relative z-10">
                <Button onClick={() => navigate('adminLogin')} variant="secondary" className="inline-flex items-center w-auto px-6 py-3">
                    <Shield className="w-5 h-5 mr-2" />
                    Admin Panel
                </Button>
            </div>
        </div>
    );
};

const AuthForm = ({ isLogin, isAdminLogin }) => {
    const { login } = useAuth();
    const { navigate } = useApp();
    const [formData, setFormData] = useState(isLogin ? { email: '', password: '' } : { email: '', phone: '', password: '' });
    const [adminFormData, setAdminFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => { const { id, value } = e.target; if (isAdminLogin) setAdminFormData(p => ({ ...p, [id]: value })); else setFormData(p => ({ ...p, [id]: value })); };
    
    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            if (isAdminLogin) { 
                const response = await API.adminLogin(adminFormData);
                const userData = { adminId: response.adminId, username: response.username };
                login(userData, response.token, 'admin');
                navigate('adminDashboard');
            } else if (isLogin) {
                const response = await API.login(formData);
                const userData = { userId: response.userId, email: response.email };
                login(userData, response.token, 'user');
                navigate('dashboard');
            } else {
                await API.signup(formData);
                alert('Signup successful! Please login.');
                navigate('login');
            }
        } catch (err) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    const title = isAdminLogin ? "Admin Login" : (isLogin ? "Login" : "Sign Up");
    const buttonText = loading ? "Processing..." : (isLogin ? "Login" : "Sign Up");
    const switchLinkText = isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login";
    const switchLinkTarget = isLogin ? 'signup' : 'login';
    
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <AnimatedCard className="w-full max-w-md">
                <h2 className="text-center text-4xl font-extrabold text-[#4E2A2A] mb-8">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
                    {isAdminLogin ? (<><Input id="username" label="Username" value={adminFormData.username} onChange={handleChange} required /><Input id="password" label="Password" type="password" value={adminFormData.password} onChange={handleChange} required /></>) : (<><Input id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required /> {!isLogin && <Input id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required />} <Input id="password" label="Password" type="password" value={formData.password} onChange={handleChange} required /></>)}
                    <Button type="submit" disabled={loading}>{buttonText}</Button>
                    {!isAdminLogin && (<div className="text-center"><a href="#" onClick={(e) => { e.preventDefault(); navigate(switchLinkTarget); }} className="font-medium text-[#c15c41] hover:text-[#E97451]">{switchLinkText}</a></div>)}
                </form>
            </AnimatedCard>
        </div>
    );
};

const ProfilePage = ({}) => {
    const { user } = useAuth();
    const { navigate } = useApp();
    const [formData, setFormData] = useState({ name: '', fathersName: '', mothersName: '', dateOfBirth: '', nidNumber: '', gender: '', religion: '', currentAddress: '', permanentAddress: '', profession: '' });
    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => { 
        const profileData = JSON.parse(localStorage.getItem('profile'));
        if (profileData) {
            const formattedProfile = {
                ...profileData,
                dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : ''
            };
            setFormData(formattedProfile);
            setIsUpdate(true);
        }
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Authentication error. Please log in again.");
            setLoading(false);
            navigate('login');
            return;
        }

        try { 
            const apiCall = isUpdate ? API.updateProfile : API.createProfile;
            const profileData = await apiCall(formData, token); 
            localStorage.setItem('profile', JSON.stringify(profileData)); 
            alert(`Profile ${isUpdate ? 'updated' : 'created'} successfully!`); 
            navigate('dashboard'); 
        }
        catch (error) { 
            alert(`Failed to save profile: ${error.message}`); 
        }
        finally { 
            setLoading(false); 
        }
    };

    if (!user) return <Spinner />;
    return (
        <AnimatedCard className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#4E2A2A] mb-2">{isUpdate ? 'Update Your Citizen Profile' : 'Create Your Citizen Profile'}</h2>
            <p className="text-[#4E2A2A]/80 mb-8">{isUpdate ? 'You can modify your information below.' : 'This information is required before you can apply for any services.'}</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input id="name" label="Full Name" value={formData.name} onChange={handleChange} required />
                <Input id="fathersName" label="Father's Name" value={formData.fathersName} onChange={handleChange} required />
                <Input id="mothersName" label="Mother's Name" value={formData.mothersName} onChange={handleChange} required />
                <Input id="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                <Input id="nidNumber" label="NID Number" value={formData.nidNumber} onChange={handleChange} required />
                <Select id="gender" label="Gender" value={formData.gender} onChange={handleChange} required options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]} />
                <Select id="religion" label="Religion" value={formData.religion} onChange={handleChange} required options={[{ value: 'ISLAM', label: 'Islam' }, { value: 'HINDUISM', label: 'Hinduism' }, { value: 'CHRISTIANITY', label: 'Christianity' }, { value: 'BUDDHISM', label: 'Buddhism' }, { value: 'OTHER', label: 'Other' }]} />
                <Input id="profession" label="Profession" value={formData.profession} onChange={handleChange} required />
                <div className="md:col-span-2"><Input id="currentAddress" label="Current Address" value={formData.currentAddress} onChange={handleChange} required /></div>
                <div className="md:col-span-2"><Input id="permanentAddress" label="Permanent Address" value={formData.permanentAddress} onChange={handleChange} required /></div>
                <div className="md:col-span-2 mt-4"><Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isUpdate ? 'Update Profile' : 'Save Profile')}</Button></div>
            </form>
        </AnimatedCard>
    );
};

const ApplicationPage = () => {
    const { user } = useAuth();
    const { navigate, currentApplication } = useApp();
    const [extraFields, setExtraFields] = useState({});
    const [documents, setDocuments] = useState({ NID_COPY: null, PASSPORT_PHOTO: null });
    const [loading, setLoading] = useState(false);
    
    const serviceId = currentApplication?.serviceId;

    useEffect(() => {
        setExtraFields({});
    }, [serviceId]);

    const serviceName = getServiceName(serviceId);
    const handleExtraChange = (e) => setExtraFields({ ...extraFields, [e.target.id]: e.target.value });
    const handleFileChange = (e) => setDocuments({ ...documents, [e.target.id]: e.target.files[0] });
    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Authentication error. Please log in again.");
            setLoading(false);
            navigate('login');
            return;
        }

        const applicationData = {
            serviceId: serviceId,
            serviceSpecificData: extraFields
        };

        try {
            await API.createApplication(applicationData, token);
            alert('Application submitted successfully!'); 
            navigate('dashboard');
        } catch (error) { 
            alert(`Failed to submit application: ${error.message}`); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleServiceChange = (e) => {
        const newServiceId = parseInt(e.target.value);
        if (newServiceId) {
            navigate('apply', { serviceId: newServiceId });
        }
    };

    const renderExtraFields = () => {
        switch (serviceId) {
            case 1: // Characteristic Certificate
                return <>
                    <Input id="purpose" label="Purpose for Certificate" value={extraFields.purpose || ''} onChange={handleExtraChange} required />
                    <Input id="referenceOneName" label="Reference Person Name" value={extraFields.referenceOneName || ''} onChange={handleExtraChange} required />
                    <Input id="referenceOneNID" label="Reference Person NID" value={extraFields.referenceOneNID || ''} onChange={handleExtraChange} required />
                    <Input id="referenceOneContact" label="Reference Person Contact" value={extraFields.referenceOneContact || ''} onChange={handleExtraChange} required />
                </>;
            case 2: // Marriage Certificate
                return <>
                    <Input id="spouseName" label="Spouse's Full Name" value={extraFields.spouseName || ''} onChange={handleExtraChange} required />
                    <Input id="spouseNID" label="Spouse's NID Number" value={extraFields.spouseNID || ''} onChange={handleExtraChange} required />
                    <Input id="marriageDate" label="Date of Marriage" type="date" value={extraFields.marriageDate || ''} onChange={handleExtraChange} required />
                    <Input id="placeOfMarriage" label="Place of Marriage" value={extraFields.placeOfMarriage || ''} onChange={handleExtraChange} required />
                    <Input id="registrarLicenseNo" label="Marriage Registrar License No." value={extraFields.registrarLicenseNo || ''} onChange={handleExtraChange} required />
                    <Input id="registrationSerialNo" label="Marriage Register Serial No." value={extraFields.registrationSerialNo || ''} onChange={handleExtraChange} required />
                </>;
            case 3: // Disability Certificate
                return <>
                    <Select id="disabilityType" label="Type of Disability" value={extraFields.disabilityType || ''} onChange={handleExtraChange} required 
                        options={[{ value: 'PHYSICAL', label: 'Physical' }, { value: 'VISUAL', label: 'Visual' }, { value: 'HEARING', label: 'Hearing' }, { value: 'SPEECH', label: 'Speech' }, { value: 'INTELLECTUAL', label: 'Intellectual' }]} 
                    />
                    <Input id="medicalReportNo" label="Medical Report Reference No." value={extraFields.medicalReportNo || ''} onChange={handleExtraChange} required />
                    <div className="md:col-span-2">
                        <Textarea id="disabilityDescription" label="Brief Description of Disability" value={extraFields.disabilityDescription || ''} onChange={handleExtraChange} />
                    </div>
                </>;
            case 4: // Death Certificate
                return <>
                    <Input id="deceasedName" label="Deceased Person's Full Name" value={extraFields.deceasedName || ''} onChange={handleExtraChange} required />
                    <Input id="deceasedNID" label="Deceased Person's NID / Birth Cert. No." value={extraFields.deceasedNID || ''} onChange={handleExtraChange} required />
                    <Input id="dateOfDeath" label="Date of Death" type="date" value={extraFields.dateOfDeath || ''} onChange={handleExtraChange} required />
                    <Input id="placeOfDeath" label="Place of Death (Hospital/Address)" value={extraFields.placeOfDeath || ''} onChange={handleExtraChange} required />
                    <Input id="causeOfDeath" label="Cause of Death" value={extraFields.causeOfDeath || ''} onChange={handleExtraChange} required />
                    <Input id="applicantRelation" label="Relationship with Deceased" value={extraFields.applicantRelation || ''} onChange={handleExtraChange} required />
                </>;
            case 5: // Citizen Certificate
                return <>
                    <Input id="purpose" label="Purpose of Certificate" value={extraFields.purpose || ''} onChange={handleExtraChange} required placeholder="e.g., Passport Application" />
                    <Input id="durationOfStay" label="Duration of Stay at Permanent Address" value={extraFields.durationOfStay || ''} onChange={handleExtraChange} required placeholder="e.g., 15 years" />
                </>;
            case 6: // Holding Tax
                return <>
                    <Input id="holdingNumber" label="Holding Number" value={extraFields.holdingNumber || ''} onChange={handleExtraChange} required />
                    <Input id="wardNumber" label="Ward Number" type="number" value={extraFields.wardNumber || ''} onChange={handleExtraChange} required />
                    <Input id="assessmentYear" label="Assessment Year" value={extraFields.assessmentYear || ''} onChange={handleExtraChange} required placeholder="e.g., 2024-2025" />
                     <Select id="paymentPeriod" label="Payment Period" value={extraFields.paymentPeriod || ''} onChange={handleExtraChange} required 
                        options={[{ value: 'Q1', label: 'Q1 (July - September)' }, { value: 'Q2', label: 'Q2 (October - December)' }, { value: 'Q3', label: 'Q3 (January - March)' }, { value: 'Q4', label: 'Q4 (April - June)' }]} 
                    />
                </>;
            case 7: // National Health Card
                return <>
                    <Select id="bloodGroup" label="Blood Group" value={extraFields.bloodGroup || ''} onChange={handleExtraChange} required options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({value: bg, label: bg}))}/>
                    <Input id="emergencyContactName" label="Emergency Contact Name" value={extraFields.emergencyContactName || ''} onChange={handleExtraChange} required />
                    <Input id="emergencyContactPhone" label="Emergency Contact Phone" type="tel" value={extraFields.emergencyContactPhone || ''} onChange={handleExtraChange} required />
                    <div className="md:col-span-2"><Textarea id="preExistingConditions" label="Pre-existing Conditions (optional)" value={extraFields.preExistingConditions || ''} onChange={handleExtraChange} /></div>
                </>;
            case 8: // Birth Certificate
                return <>
                    <Input id="childsName" label="Child's Full Name" value={extraFields.childsName || ''} onChange={handleExtraChange} required />
                    <Input id="dateOfBirth" label="Date of Birth" type="date" value={extraFields.dateOfBirth || ''} onChange={handleExtraChange} required />
                    <Input id="placeOfBirth" label="Place of Birth (Address)" value={extraFields.placeOfBirth || ''} onChange={handleExtraChange} required />
                    <Input id="hospitalName" label="Hospital/Clinic Name (if any)" value={extraFields.hospitalName || ''} onChange={handleExtraChange} />
                    <Input id="fathersName" label="Father's Name" value={extraFields.fathersName || ''} onChange={handleExtraChange} required />
                    <Input id="mothersName" label="Mother's Name" value={extraFields.mothersName || ''} onChange={handleExtraChange} required />
                </>;
            case 9: // Land Ownership Transfer
                return <>
                    <Input id="sellerName" label="Seller's Full Name" value={extraFields.sellerName || ''} onChange={handleExtraChange} required />
                    <Input id="sellerNID" label="Seller's NID" value={extraFields.sellerNID || ''} onChange={handleExtraChange} required />
                    <Input id="deedNumber" label="Deed (Dalil) Number" value={extraFields.deedNumber || ''} onChange={handleExtraChange} required />
                    <Input id="landLocation" label="Land Location (Mouza, Khatian, Dag No.)" value={extraFields.landLocation || ''} onChange={handleExtraChange} required />
                    <Input id="landArea" label="Area of Land (in decimals)" type="number" value={extraFields.landArea || ''} onChange={handleExtraChange} required />
                </>;
             case 10: // E-Tax Filing
                return <>
                    <Input id="tinNumber" label="Taxpayer's Identification Number (TIN)" value={extraFields.tinNumber || ''} onChange={handleExtraChange} required />
                    <Input id="assessmentYear" label="Assessment Year" value={extraFields.assessmentYear || ''} onChange={handleExtraChange} required placeholder="e.g., 2024-2025"/>
                    <Input id="taxableIncome" label="Total Taxable Income" type="number" value={extraFields.taxableIncome || ''} onChange={handleExtraChange} required />
                    <Input id="taxPaid" label="Total Tax Paid" type="number" value={extraFields.taxPaid || ''} onChange={handleExtraChange} required />
                    <Input id="paymentChallanNo" label="Payment Challan No." value={extraFields.paymentChallanNo || ''} onChange={handleExtraChange} />
                </>;
            default:
                return <p className="text-center text-gray-500">Please select a service from the dropdown above to see the form.</p>;
        }
    };

    if (!user) return <Spinner />;

    return (
        <AnimatedCard className="max-w-4xl mx-auto">
            <div className="mb-8 p-4 bg-gray-50/50 rounded-xl border">
                <Select
                    id="serviceSwitcher"
                    label="Switch to another service"
                    value={serviceId || ''}
                    onChange={handleServiceChange}
                    options={SERVICES.map(s => ({ value: s.id, label: s.name }))}
                />
            </div>
            
            <h2 className="text-3xl font-bold text-[#4E2A2A] mb-2">Application for {serviceName || '...'}</h2>
            <p className="text-[#4E2A2A]/80 mb-8">Please fill out the required details below.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {serviceId ? (
                    <>
                        <div className="p-6 border rounded-xl bg-gray-50/30 border-gray-200">
                            <h3 className="font-semibold text-lg mb-4 text-[#4E2A2A]">Service Specific Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{renderExtraFields()}</div>
                        </div>
                        <div className="p-6 border rounded-xl bg-gray-50/30 border-gray-200">
                            <h3 className="font-semibold text-lg mb-4 text-[#4E2A2A]">Document Uploads (Coming Soon)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input id="NID_COPY" label="NID Copy (PDF, JPG)" type="file" onChange={handleFileChange} />
                                <Input id="PASSPORT_PHOTO" label="Passport Size Photo (JPG, PNG)" type="file" onChange={handleFileChange} />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</Button>
                    </>
                ) : <p className="text-center text-gray-500">Please select a service to begin.</p>}
            </form>
        </AnimatedCard>
    );
};

const PaymentPage = () => {
    const { navigate, currentApplication } = useApp();
    const [formData, setFormData] = useState({ applicationId: currentApplication?.applicationId, amount: 200.00, paymentMethod: 'BKASH', transactionId: '' });
    const [loading, setLoading] = useState(false);
    
    if (!currentApplication) return (<AnimatedCard className="text-center"><p>No application selected for payment.</p><Button onClick={() => navigate('dashboard')} className="mt-4 w-auto">Go to Dashboard</Button></AnimatedCard>);

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Authentication error. Please log in again.");
            setLoading(false);
            navigate('login');
            return;
        }

        try { 
            await API.submitPayment(formData, token); 
            alert('Payment information submitted successfully!'); 
            navigate('dashboard'); 
        }
        catch (error) { 
            alert(`Failed to submit payment: ${error.message}`); 
        }
        finally { 
            setLoading(false); 
        }
    };

    return (
        <AnimatedCard className="max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-[#4E2A2A] mb-4">Complete Your Payment</h2>
            <div className="bg-[#E97451]/10 p-4 rounded-xl mb-6 text-[#c15c41] border border-[#E97451]/20"><p><strong>Service:</strong> {currentApplication.serviceName}</p><p><strong>Application ID:</strong> {currentApplication.applicationId}</p><p className="font-bold text-xl mt-2"><strong>Amount to Pay:</strong> BDT {formData.amount.toFixed(2)}</p></div>
            <p className="text-[#4E2A2A]/80 mb-6">Please complete the payment and submit the Transaction ID below.</p>
            <form onSubmit={handleSubmit} className="space-y-8">
                <Select id="paymentMethod" label="Payment Method" value={formData.paymentMethod} onChange={handleChange} options={[{ value: 'BKASH', label: 'bKash' }, { value: 'NAGAD', label: 'Nagad' }, { value: 'ROCKET', label: 'Rocket' }]} />
                <Input id="transactionId" label="Transaction ID" value={formData.transactionId} onChange={handleChange} required placeholder="e.g., TXN123456" />
                <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Transaction ID'}</Button>
            </form>
        </AnimatedCard>
    );
};

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { navigate, route } = useApp();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
        const checkProfileAndFetchApps = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                logout();
                navigate('login');
                return;
            }

            try {
                const profile = await API.getMyProfile(token);
                if (profile) {
                    localStorage.setItem('profile', JSON.stringify(profile));
                    setHasProfile(true);
                    const userApps = await API.getMyApplications(token);
                    setApplications(userApps);
                } else {
                    localStorage.removeItem('profile');
                    setHasProfile(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                // Clear potentially stale profile data on error
                localStorage.removeItem('profile');
                setHasProfile(false); 
            } finally {
                setLoading(false);
            }
        };

        checkProfileAndFetchApps();
    }, [user, navigate, logout, route]);


    if (loading) return (<div className="flex justify-center items-center h-64"><Spinner /></div>);
    if (!user) return null;
    if (!hasProfile) return (<AnimatedCard className="text-center max-w-lg mx-auto"><h2 className="text-2xl font-bold mb-4 text-[#4E2A2A]">Welcome!</h2><p className="text-[#4E2A2A]/80 mb-6">Create a citizen profile to apply for services.</p><Button onClick={() => navigate('profile')}>Create Profile</Button></AnimatedCard>);
    
    return (
        <AnimatedCard className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-[#4E2A2A]">My Applications</h2>
                    {hasProfile && <button onClick={() => navigate('profile')} className="flex items-center gap-2 text-sm text-[#c15c41] hover:text-[#E97451] mt-2"><Edit size={14}/> Update Profile</button>}
                </div>
                <Button onClick={() => navigate('home')} className="w-full md:w-auto">Apply for New Service</Button>
            </div>
            {applications.length === 0 ? (
                <div className="text-center py-16">
                    <FileText className="mx-auto h-16 w-16 text-gray-300" />
                    <p className="text-gray-500 mt-4 text-lg">You have not submitted any applications yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-6 md:-mx-8">
                    <table className="min-w-full">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Application Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.map((app) => (
                                <tr key={app.applicationId} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-[#4E2A2A]">{app.serviceName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{app.submissionDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-md"><StatusBadge status={app.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-md"><StatusBadge status={app.paymentStatus} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium">
                                        {app.status === 'APPROVED' ? (
                                            <Button variant="primary" className="w-auto px-4 py-2 text-xs">
                                                <Download size={14} className="mr-1"/> Download
                                            </Button>
                                        ) : app.paymentStatus === 'PENDING' ? (
                                            <Button onClick={() => navigate('payment', app)} variant="success" className="w-auto px-4 py-2 text-xs">
                                                Submit Payment
                                            </Button>
                                        ) : (
                                            <span className="text-gray-400">--</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AnimatedCard>
    );
};

const FeedbackPage = () => {
    const { navigate } = useApp();
    const [formData, setFormData] = useState({ feedbackType: 'Complaint', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await MOCK_API.submitFeedback(formData);
            alert('Thank you! Your feedback has been submitted successfully.');
            navigate('home');
        } catch (error) {
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedCard className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#4E2A2A] mb-2">Complaint or Suggestion</h2>
            <p className="text-center text-[#4E2A2A]/80 mb-8">Please use the form below to submit your feedback.</p>
            <form onSubmit={handleSubmit} className="space-y-8">
                <Select
                    id="feedbackType"
                    label="Type of Feedback"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    required
                    options={[{ value: 'Complaint', label: 'Complaint' }, { value: 'Suggestion', label: 'Suggestion' }]}
                />
                <Input id="subject" label="Subject" value={formData.subject} onChange={handleChange} required />
                <Textarea id="message" label="Your Message" value={formData.message} onChange={handleChange} required />
                <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Feedback'}</Button>
            </form>
        </AnimatedCard>
    );
};


const ServiceAnalyticsChart = ({ data }) => {
    const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = window.Recharts || {};
    if (!PieChart) {
        return <div className="flex items-center justify-center h-full">Loading Chart...</div>
    }
    
    const COLORS = ['#E97451', '#4E2A2A', '#F4A261', '#2A9D8F', '#264653', '#E76F51'];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
    const [applications, setApplications] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);

    const fetchData = async () => { 
        setLoading(true); 
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }

        try { 
            const [statsData, appsData, feedbackData] = await Promise.all([
                API.getApplicationStats(token), 
                API.getAllApplications(token),
                MOCK_API.getFeedback() // This is still mocked
            ]); 
            setStats(statsData); 
            setApplications(appsData); 
            setFilteredApps(appsData); 
            setFeedback(feedbackData);
            
            const serviceCounts = appsData.reduce((acc, app) => {
                acc[app.serviceName] = (acc[app.serviceName] || 0) + 1;
                return acc;
            }, {});
            setChartData(Object.entries(serviceCounts).map(([name, value]) => ({ name, value })));

        } catch (error) { 
            console.error("Failed to fetch admin data", error); 
        } finally { 
            setLoading(false); 
        } 
    };
    
    useEffect(() => { fetchData(); }, []);
    
    useEffect(() => { 
        let tempApps = applications;
        if (filter !== 'ALL') {
            tempApps = tempApps.filter(app => app.status === filter);
        }
        if (searchTerm) {
            tempApps = tempApps.filter(app => String(app.userId).includes(searchTerm));
        }
        setFilteredApps(tempApps);
    }, [filter, searchTerm, applications]);

    const handleApprove = async (id) => { 
        const token = localStorage.getItem('token');
        try {
            await API.approveApplication(id, token);
            fetchData();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };
    const handleReject = async (id) => { 
        const token = localStorage.getItem('token');
        try {
            await API.rejectApplication(id, token);
            fetchData();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };
    const handleFeedbackStatusChange = async (feedbackId, newStatus) => {
        await MOCK_API.updateFeedbackStatus(feedbackId, newStatus);
        fetchData();
    };

    const StatCard = ({ title, value, icon, color, delay }) => (<AnimatedCard delay={delay} className={`flex items-center space-x-4 border-l-8 ${color}`}>{icon}<div><p className="text-md font-medium text-gray-500 truncate">{title}</p><p className="mt-1 text-4xl font-bold text-[#4E2A2A]">{value}</p></div></AnimatedCard>);
    if (loading) return <Spinner />;

    return (
        <div className="space-y-12">
            <h2 className="text-5xl font-bold text-[#4E2A2A]">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total Applications" value={stats.total} icon={<FileText className="h-10 w-10 text-[#E97451]"/>} color="border-[#E97451]" delay={0} />
                <StatCard title="Pending" value={stats.pending} icon={<Clock className="h-10 w-10 text-yellow-500"/>} color="border-yellow-500" delay={100} />
                <StatCard title="Approved" value={stats.approved} icon={<CheckCircle className="h-10 w-10 text-green-500"/>} color="border-green-500" delay={200} />
                <StatCard title="Rejected" value={stats.rejected} icon={<XCircle className="h-10 w-10 text-red-500"/>} color="border-red-500" delay={300} />
            </div>
             <AnimatedCard delay={400}>
                <h3 className="text-2xl font-bold text-[#4E2A2A] mb-4">Service Analytics</h3>
                 {chartData.length > 0 ? <ServiceAnalyticsChart data={chartData} /> : <p className="text-center text-gray-500 py-8">No application data to display chart.</p>}
            </AnimatedCard>
            <AnimatedCard delay={500}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-2xl font-bold text-[#4E2A2A]">All Applications</h3>
                    <div className="w-full md:w-1/3">
                         <Input id="search" label="Search by User ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex space-x-2">{['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (<Button key={f} onClick={() => setFilter(f)} variant={filter === f ? 'primary' : 'secondary'} className="w-auto px-4 py-2 text-xs">{f}</Button>))}</div>
                </div>
                 <div className="overflow-x-auto -mx-6 md:-mx-8"><table className="min-w-full"><thead className="border-b-2 border-gray-200"><tr><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">User ID</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Application ID</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Service</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">App Status</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Payment</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">
                    {filteredApps.map(app => (<tr key={app.applicationId} className="hover:bg-gray-50/50 transition-colors"><td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{app.userId}</td><td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{app.applicationId}</td><td className="px-6 py-4 whitespace-nowrap text-md font-medium text-[#4E2A2A]">{app.serviceName}</td><td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{app.submissionDate}</td><td className="px-6 py-4 whitespace-nowrap text-md"><StatusBadge status={app.status} /></td><td className="px-6 py-4 whitespace-nowrap text-md"><StatusBadge status={app.paymentStatus} /></td><td className="px-6 py-4 whitespace-nowrap text-md font-medium space-x-2">{app.status === 'PENDING' && app.paymentStatus === 'COMPLETED' ? (<><Button onClick={() => handleApprove(app.applicationId)} variant="success" className="w-auto px-3 py-1 text-xs">Approve</Button><Button onClick={() => handleReject(app.applicationId)} variant="danger" className="w-auto px-3 py-1 text-xs">Reject</Button></>) : app.paymentStatus === 'PENDING' ? (<span className="text-xs text-gray-400">Awaiting Payment</span>) : <span className="text-gray-400">--</span>}</td></tr>))}
                </tbody></table></div>
            </AnimatedCard>
             <AnimatedCard delay={600}>
                <h3 className="text-2xl font-bold text-[#4E2A2A] mb-4">Feedback Submissions</h3>
                {feedback.length > 0 ? (
                     <div className="overflow-x-auto -mx-6 md:-mx-8"><table className="min-w-full"><thead className="border-b-2 border-gray-200"><tr><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Last Updated</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Type</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Subject</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Message</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th></tr></thead><tbody className="divide-y divide-gray-100">
                        {feedback.map(item => (<tr key={item.id} className="hover:bg-gray-50/50 transition-colors"><td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{new Date(item.submission_date).toLocaleDateString()}</td><td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{new Date(item.updated_at).toLocaleDateString()}</td><td className="px-6 py-4 whitespace-nowrap text-md font-medium text-[#4E2A2A]">{item.feedbackType}</td><td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{item.subject}</td><td className="px-6 py-4 text-md text-gray-500"><p className="w-48 truncate" title={item.message}>{item.message}</p></td>
                        <td className="px-6 py-4 whitespace-nowrap text-md">
                           <Select 
                             value={item.status}
                             onChange={(e) => handleFeedbackStatusChange(item.id, e.target.value)}
                             options={[{value: 'New', label: 'New'}, {value: 'In Progress', label: 'In Progress'}, {value: 'Resolved', label: 'Resolved'}]}
                             className="w-40 text-xs"
                           />
                        </td>
                        </tr>))}
                    </tbody></table></div>
                ) : <p className="text-center text-gray-500 py-8">No feedback has been submitted yet.</p>}
            </AnimatedCard>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const AppContent = () => {
    const { route, navigate } = useApp();
    const { isAuthenticated, isAdmin, loading } = useAuth();
    useEffect(() => { const pUser = ['dashboard', 'profile', 'apply', 'payment', 'feedback']; const pAdmin = ['adminDashboard']; if (!loading && !isAuthenticated && (pUser.includes(route) || pAdmin.includes(route))) navigate('login'); if (!loading && isAuthenticated && !isAdmin && pAdmin.includes(route)) navigate('dashboard'); if (!loading && isAuthenticated && isAdmin && pUser.includes(route)) navigate('adminDashboard'); }, [route, isAuthenticated, isAdmin, loading, navigate]);
    if (loading) return <div className="h-screen bg-[#FFFBF5]"><Spinner/></div>;
    const renderRoute = () => {
        switch (route) {
            case 'signup': return <AuthForm isLogin={false} />;
            case 'login': return <AuthForm isLogin={true} />;
            case 'adminLogin': return <AuthForm isLogin={true} isAdminLogin={true} />;
            case 'profile': return <ProfilePage />;
            case 'apply': return <ApplicationPage />;
            case 'payment': return <PaymentPage />;
            case 'dashboard': return <UserDashboard />;
            case 'adminDashboard': return <AdminDashboard />;
            case 'feedback': return <FeedbackPage />;
            default: return <HomePage />;
        }
    };
    return (
        <div className="bg-[#FFFBF5] min-h-screen font-sans text-[#4E2A2A]">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap'); body { font-family: 'Manrope', sans-serif; }`}</style>
            <Header />
            <main className="container mx-auto px-6 py-12">
                {renderRoute()}
            </main>
            <footer className="text-center py-6 mt-12 bg-white/50 border-t backdrop-blur-sm">
                 <p className="text-gray-600">&copy; {new Date().getFullYear()} Government Service Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default function App() {
    useEffect(() => {
        const animeScript = document.createElement('script');
        animeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js";
        animeScript.async = true;
        document.body.appendChild(animeScript);

        const rechartsScript = document.createElement('script');
        rechartsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/recharts/2.1.9/recharts.min.js";
        rechartsScript.async = true;
        document.body.appendChild(rechartsScript);

        return () => { 
            document.body.removeChild(animeScript);
            document.body.removeChild(rechartsScript); 
        }
    }, []);
    return (<AuthProvider><AppProvider><AppContent /></AppProvider></AuthProvider>);
}


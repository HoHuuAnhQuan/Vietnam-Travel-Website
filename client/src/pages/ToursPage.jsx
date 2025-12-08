import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // 1. Thêm import useNavigate
import { MapPin, Clock, Search, ArrowRight, X, Shield } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import vietnamFlag from '../assets/engaged!.png';

const ToursPage = () => {
    const navigate = useNavigate(); // 2. Khởi tạo navigate
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);

    // State bộ lọc
    const [filters, setFilters] = useState({
        search: '',
        region: 'All', // All, Bac, Trung, Nam
        sortPrice: 'default' // default, asc, desc
    });

    // --- 3. Gộp các logic khởi tạo vào 1 useEffect ---
    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({ duration: 800, once: true });

        // Lấy user từ localStorage (Chỉ chạy 1 lần khi mount)
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }

        // Xử lý sự kiện cuộn trang cho Header
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Dọn dẹp sự kiện khi component bị hủy
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Xử lý Book Now (Sửa lỗi ID map-container)
    const handleBookNowHeader = () => {
        const user = localStorage.getItem('user');
        if (user) {
            // Vì trang này không có Map, ta chuyển hướng về trang chủ phần Map
            // Hoặc cuộn xuống danh sách tour ở trang hiện tại
            const tourListElement = document.getElementById('tour-list-section');
            if (tourListElement) {
                tourListElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/'); // Nếu không thì về trang chủ
            }
        } else {
            if (window.confirm("You need to log in to use the tour booking feature. Go to the login page now?")) {
                navigate('/login');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/'); // Logout xong nên về trang chủ thay vì reload
    };

    // Gọi API mỗi khi filters thay đổi
    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/api/tours', {
                    params: {
                        search: filters.search,
                        region: filters.region
                    }
                });

                let data = res.data;

                // Xử lý sắp xếp giá
                if (filters.sortPrice === 'asc') {
                    data.sort((a, b) => a.price - b.price);
                } else if (filters.sortPrice === 'desc') {
                    data.sort((a, b) => b.price - a.price);
                }

                setTours(data);
            } catch (error) {
                console.error("Error loading tour:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchTours();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    return (
        <div className="min-h-screen bg-cream font-sans text-gray-800 overflow-x-hidden selection:bg-red-200 selection:text-red-900">
            
            {/* --- HEADER --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-red-900 ${isScrolled ? 'py-2 shadow-lg' : 'py-5'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="relative">
                            <img
                                src={vietnamFlag}
                                alt="Logo"
                                className="w-10 h-10 object-contain rounded-full border-2 border-yellow-400 shadow-md group-hover:scale-110 transition duration-300"
                            />
                            <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30 group-hover:opacity-60 transition"></div>
                        </div>
                        <span className="text-2xl font-heading font-extrabold tracking-wide text-white drop-shadow-md">
                            Vietnam<span className="text-yellow-400">Travel</span>
                        </span>
                    </div>

                    {/* Nav */}
                    <nav className="hidden md:flex gap-10">
                        <Link to="/" className="font-semibold text-lg text-white/90 hover:text-yellow-300 transition relative group">
                            Home Page
                        </Link>
                        {/* Sửa nút Map: Chuyển về trang chủ thay vì tìm ID lỗi */}
                        <Link to="/" className="font-semibold text-lg text-white/90 hover:text-yellow-300 transition relative group">
                            Map
                        </Link>
                        <Link to="/tours" className="font-semibold text-lg text-yellow-300 transition relative group">
                            Tour Hot
                        </Link>
                        <a href="#" className="font-semibold text-lg text-white/90 hover:text-yellow-300 transition relative group">
                            Contact
                        </a>
                    </nav>

                    {/* Auth & Button */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4 animate-fade-in">
                                <div className="text-right hidden md:block">
                                    {user.role === 'admin' && (
                                        <span className="text-[10px] uppercase font-bold bg-yellow-400 text-red-900 px-2 py-0.5 rounded shadow-sm">Admin</span>
                                    )}
                                    <Link to="/profile" className="block text-white font-bold hover:text-yellow-200 transition text-sm">
                                        Hi, {user.full_name}
                                    </Link>
                                </div>

                                {user.role === 'admin' && (
                                    <Link to="/admin" className="bg-white/10 backdrop-blur p-2 rounded-full text-white hover:bg-white hover:text-primary transition border border-white/20">
                                        <Shield size={18} />
                                    </Link>
                                )}

                                <button onClick={handleLogout} className="text-white/80 hover:text-white text-sm font-semibold border-l border-white/30 pl-4 transition">
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-4 text-sm font-bold text-white">
                                <Link to="/login" className="hover:text-yellow-300 transition">Log in</Link>
                                <span className="text-white/40">/</span>
                                <Link to="/register" className="hover:text-yellow-300 transition">Register</Link>
                            </div>
                        )}

                        <button
                            onClick={handleBookNowHeader}
                            className="hidden md:block bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-6 py-2.5 rounded-full font-heading font-bold hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-105 transition duration-300 border border-yellow-300">
                            Book Now !
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6">
                {/* --- HEADER TRANG --- */}
                <div className="text-center mb-12 pt-32" data-aos="fade-down"> {/* Tăng pt để ko bị header che */}
                    <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-2 block">Explore Vietnam</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
                        Featured Tour List
                    </h1>
                    <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
                </div>

                {/* --- THANH CÔNG CỤ (FILTER BAR) --- */}
                {/* Thêm id="tour-list-section" để nút Book Now có thể cuộn tới */}
                <div id="tour-list-section" className="bg-white p-6 rounded-3xl shadow-card border border-gray-100 mb-10 flex flex-col md:flex-row gap-6 items-center justify-between sticky top-24 z-30" data-aos="fade-up">

                    {/* 1. Tìm kiếm */}
                    <div className="relative w-full md:w-1/3 group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
                        <input
                            type="text"
                            placeholder="Search for tour names, locations..."
                            className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                        {filters.search && (
                            <button onClick={() => setFilters({ ...filters, search: '' })} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* 2. Lọc Miền & Sắp xếp */}
                    <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center">
                        {/* Nút lọc miền */}
                        {[
                            { key: 'All', label: 'All' },
                            { key: 'Bac', label: 'North' },
                            { key: 'Trung', label: 'Central' },
                            { key: 'Nam', label: 'South' }
                        ].map(region => (
                            <button
                                key={region.key}
                                onClick={() => setFilters({ ...filters, region: region.key })}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm border ${filters.region === region.key
                                        ? 'bg-primary text-white border-primary shadow-red-900/20'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {region.label}
                            </button>
                        ))}

                        {/* Dropdown Sắp xếp giá */}
                        <select
                            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white text-gray-600 border border-gray-200 focus:outline-none focus:border-primary cursor-pointer hover:bg-gray-50"
                            onChange={(e) => setFilters({ ...filters, sortPrice: e.target.value })}
                            value={filters.sortPrice}
                        >
                            <option value="default">Sort by price</option>
                            <option value="asc">Price increasing</option>
                            <option value="desc">Price decreasing</option>
                        </select>
                    </div>
                </div>

                {/* --- DANH SÁCH KẾT QUẢ --- */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8 pb-20">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white h-96 rounded-3xl shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : tours.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {tours.map((tour, index) => (
                            <Link
                                to={`/tour/${tour.tour_id}`}
                                key={tour.tour_id}
                                className="group bg-white rounded-3xl shadow-card hover:shadow-card-hover border border-transparent hover:border-secondary/30 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                            >
                                {/* Phần ảnh */}
                                <div className="h-60 overflow-hidden relative">
                                    <img
                                        src={tour.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        onError={e => e.target.src = 'https://placehold.co/400x300?text=No+Image'}
                                        alt={tour.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-md">
                                        HOT
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white flex items-center gap-1 text-sm font-medium">
                                        <MapPin size={16} className="text-secondary" /> {tour.province_name}
                                    </div>
                                </div>

                                {/* Phần nội dung */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition h-14">
                                        {tour.name}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                        <Clock size={16} className="text-secondary" /> {tour.duration}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Reference price</p>
                                            <span className="text-xl font-extrabold text-primary">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}
                                            </span>
                                        </div>
                                        <span className="bg-cream text-secondary p-3 rounded-full group-hover:bg-primary group-hover:text-white transition shadow-sm">
                                            <ArrowRight size={20} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <Search size={60} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-600">No tours found</h3>
                        <p className="text-gray-400 mt-2">Try changing the keyword or filter and see what happens.</p>
                        <button onClick={() => setFilters({ search: '', region: 'All', sortPrice: 'default' })} className="mt-6 text-primary font-bold hover:underline">
                            Clear filter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToursPage;
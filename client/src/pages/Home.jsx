import { useEffect, useState } from "react";
import axios from "axios";
import Map from "../components/Map"; 
import {
  MapPin,
  Calendar,
  Star,
  Shield,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Search,
  ArrowRight,
  Filter,
  X 
} from "lucide-react";
import { Link } from "react-router-dom"; 
import { useNavigate } from 'react-router-dom';
import vietnamFlag from '../assets/engaged!.png';
import videoIntro from '../assets/Live Fully in Vietnam Explore, Relax, Play.mp4';
import mapBg from '../assets/h.png';
// Import thư viện hiệu ứng
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [tours, setTours] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  
  // State Search & Filter
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterRegion, setFilterRegion] = useState("All"); 

  // --- 1. CALL API & CHECK LOGIN & INIT AOS ---
  useEffect(() => {
    // Khởi tạo hiệu ứng chuyển động
    AOS.init({
      duration: 800, // Thời gian chạy hiệu ứng (ms)
      once: true, // Chỉ chạy 1 lần
      easing: 'ease-out-cubic'
    });

    axios
      .get("http://localhost:5000/api/provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error(err));

    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 2. FETCH TOURS KHI CHỌN TỈNH ---
  useEffect(() => {
    if (selectedProvince) {
      setTours([]);
      axios
        .get(`http://localhost:5000/api/tours/province/${selectedProvince.province_id}`)
        .then((res) => setTours(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedProvince]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  // --- 3. XỬ LÝ CLICK BẢN ĐỒ ---
  const handleProvinceClick = (rawName) => {
    const nameMapping = {
      "TP. Hồ Chí Minh": "Hồ Chí Minh",
      "Ha Noi": "Hà Nội",
    };
    const provinceName = nameMapping[rawName] || rawName;
    const found = provinces.find(
      (p) => p.name.trim().toLowerCase() === provinceName.trim().toLowerCase()
    );

    if (found) {
      setSelectedProvince(found);
      document
        .getElementById("map-container")
        .scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookNowHeader = () => {
    const user = localStorage.getItem('user');
    if (user) {
      document.getElementById('map-container').scrollIntoView({ behavior: 'smooth' });
    } else {
      if (window.confirm("You need to log in to use the tour booking feature. Go to the login page now.?")) {
        navigate('/login');
      }
    }
  };

  // --- LOGIC LỌC DANH SÁCH TỈNH ---
  const filteredProvinces = provinces.filter((province) => {
    const matchesSearch = province.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === "All" || province.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    
    <div className="min-h-screen bg-cream font-sans text-gray-800 overflow-x-hidden selection:bg-red-200 selection:text-red-900">

      {/* ================= HEADER  ================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo(0, 0)}
          >
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

          <nav className="hidden md:flex gap-10">
            <Link to="/" className="font-semibold text-lg text-white/90 hover:text-yellow-300 transition relative group">
                Home Page
            </Link>
            
            <button 
                onClick={() => document.getElementById("map-container").scrollIntoView({ behavior: "smooth" })}
                className="font-semibold text-lg text-white/90 hover:text-yellow-300 transition relative group"
            >
                Map
            </button>

            {/* 👇 LINK NÀY DẪN ĐẾN TRANG TOUR HOT 👇 */}
            <Link to="/tours" className="font-semibold text-lg text-white/90 hover:text-yellow-300 transition relative group">
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
                
                <button 
                   onClick={handleLogout} 
                   className="text-white/80 hover:text-white text-sm font-semibold border-l border-white/30 pl-4 transition"
                >
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

      {/* ================= HERO SECTION (MODERN UI) ================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover object-center scale-125"
            src={videoIntro}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-primary/20 to-cream"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center mt-10" data-aos="fade-up">
          <div className="inline-block mb-6">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-sm font-bold px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
              Spirit of Vietnam
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-heading font-extrabold mb-6 leading-tight text-white drop-shadow-2xl">
            VIET NAM <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">A Land of Wonders</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Exploring the timeless beauty of Vietnam’s S-shaped land, from towering peaks to shimmering seas.
          </p>
          
          <button
            onClick={() => document.getElementById("map-container").scrollIntoView({ behavior: "smooth" })}
            className="group bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-800 transition-all shadow-xl shadow-red-900/40 flex items-center justify-center gap-3 mx-auto border-4 border-primary/30 bg-clip-padding"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition" /> Explore the Vietnam Map
          </button>
        </div>
      </section>

      {/* ================= MAP SECTION (CLEAN & MINIMAL) ================= */}
      <section id="map-container" className="py-20 bg-white relative">
        <div className="container mx-auto px-6">
            
          <div className="text-center mb-12" data-aos="fade-up">
             <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">Vietnam Travel Map</h2>
             <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row h-[700px] bg-cream rounded-[40px] overflow-hidden shadow-2xl border border-gray-100" data-aos="zoom-in" data-aos-duration="1000">
            
            {/* CỘT TRÁI: BẢN ĐỒ (60%) */}
            <div className="w-full lg:w-[60%] relative border-r border-gray-200 bg-[#F0F4F8]">
              <div className="w-full h-full p-8 flex items-center justify-center">
                <Map onProvinceClick={handleProvinceClick} />
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img 
                  src={mapBg} 
                  alt="Map Background" 
                  className="w-full h-full object-cover opacity-20 grayscale" 
                  />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur px-3 py-3 rounded-2xl text-sm text-primary font-semibold shadow-lg border border-white flex items-center gap-1">
                <MapPin className="text-secondary" size={6} /> Hover over a location to see its name – Click to select
              </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN & TÌM KIẾM (40%) */}
            <div className="w-full lg:w-[40%] bg-white flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
              
              {/* Header Cột Phải */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="font-heading font-bold text-xl text-gray-800 line-clamp-1">
                  {selectedProvince ? selectedProvince.name : "Search Destinations"}
                </h2>
                {selectedProvince && (
                  <button
                    onClick={() => setSelectedProvince(null)}
                    className="text-xs font-bold text-gray-500 hover:text-primary bg-gray-100 px-4 py-2 rounded-full transition flex items-center gap-1"
                  >
                    <ArrowRight className="rotate-180" size={14}/> Back
                  </button>
                )}
              </div>

              {/* --- THANH TÌM KIẾM (DESIGN MỚI) --- */}
              {!selectedProvince && (
                <div className="p-6 bg-white space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
                    <input 
                      type="text" 
                      placeholder="Where do you want to go? (e.g., Hanoi)" 
                      className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition shadow-inner"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { key: 'All', label: 'All' },
                      { key: 'Bac', label: 'North' },
                      { key: 'Trung', label: 'Central' },
                      { key: 'Nam', label: 'South' }
                    ].map(region => (
                      <button
                        key={region.key}
                        onClick={() => setFilterRegion(region.key)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm border ${
                          filterRegion === region.key 
                          ? 'bg-primary text-white border-primary shadow-red-900/20' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {region.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Nội dung cuộn */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-gray-50/50">
                {selectedProvince ? (
                  // === CHI TIẾT TỈNH (CARD PREMIUM) ===
                  <div className="animate-fade-in space-y-6">
                    <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-lg group">
                      <img
                        src={selectedProvince.thumbnail}
                        alt={selectedProvince.name}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                         <h3 className="text-3xl font-heading font-bold">{selectedProvince.name}</h3>
                         <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                            <MapPin size={14}/> 
                            {selectedProvince.region === 'Bac' ? 'North' : selectedProvince.region === 'Trung' ? 'Central' : 'South'}
                         </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-justify">
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Introduction</span>
                      <p className="text-gray-600 text-sm leading-7">
                        {selectedProvince.description || "Description updating..."}
                      </p>
                    </div>

                    <Link
                      to={`/province/${selectedProvince.province_id}`}
                      className="group flex items-center justify-center w-full bg-gradient-to-r from-primary to-red-700 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-red-900/30 transition-all transform hover:-translate-y-1"
                    >
                      View Details <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
                    </Link>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Star className="text-secondary fill-current" size={20} /> Featured Tours
                      </h3>
                      {tours.length > 0 ? (
                        <div className="space-y-4">
                          {tours.map((tour) => (
                            <Link to={`/tour/${tour.tour_id}`} key={tour.tour_id} className="block group">
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition flex gap-4">
                                    <img
                                        src={tour.image}
                                        className="w-20 h-20 object-cover rounded-xl shadow-sm group-hover:scale-105 transition"
                                        onError={(e) => (e.target.src = "https://placehold.co/150")}
                                    />
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h4 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-primary transition">{tour.name}</h4>
                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-sm font-extrabold text-secondary">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tour.price)}
                                            </p>
                                            <span className="bg-gray-100 p-1.5 rounded-lg text-gray-400 group-hover:bg-primary group-hover:text-white transition">
                                                <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-300">
                           <p className="text-gray-400 text-sm">No tours available.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // === DANH SÁCH MẶC ĐỊNH (LIST CARD HIỆN ĐẠI) ===
                  <div className="space-y-3">
                    {filteredProvinces.length > 0 ? (
                      filteredProvinces.map((province) => (
                        <div
                          key={province.province_id}
                          onClick={() => setSelectedProvince(province)}
                          className="group flex gap-4 p-3 bg-white rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-card-hover cursor-pointer transition-all duration-300 items-center"
                        >
                          <img
                            src={province.thumbnail}
                            className="w-16 h-16 object-cover rounded-xl shadow-sm group-hover:scale-105 transition"
                            onError={(e) => { e.target.src = "https://placehold.co/150"; }}
                          />
                          <div>
                            <h4 className="font-bold text-gray-700 text-sm group-hover:text-primary transition font-heading">
                              {province.name}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                                province.region === 'Bac' ? 'bg-red-100 text-red-600' : 
                                province.region === 'Trung' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                            }`}>
                              {province.region === "Bac" ? "North" : province.region === "Trung" ? "Central" : "South"}
                            </span>
                          </div>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                             <ArrowRight size={16} className="text-primary"/>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-20">
                        <Search size={40} className="mx-auto mb-2 opacity-20"/>
                        No results found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION (HOVER EFFECT) ================= */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
              Why Choose Us?
            </h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-10 h-10 text-primary" />, title: "Absolute Safety",desc: "Comprehensive travel insurance with 24/7 medical support."},
              { icon: <Star className="w-10 h-10 text-secondary" />, title: "5-Star Quality",desc: "Committed to international-standard services and top hotels. "},
              { icon: <MapPin className="w-10 h-10 text-primary" />, title: "Unique Destinations",desc: "Explore new and extraordinary lands like never before." },
            ].map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white p-10 rounded-[30px] shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 border border-gray-50 text-center group"
              >
                <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:scale-110 transition duration-300 shadow-sm">
                  <div className="group-hover:text-white transition duration-300 transform group-hover:rotate-12">
                      {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold mb-4 text-gray-800 group-hover:text-primary transition">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER (CLEAN) ================= */}
      <footer className="bg-primary text-white pt-20 pb-10 border-t-8 border-secondary rounded-t-[50px] mt-10">
        <div className="container mx-auto px-10 grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white rounded-full">
                  <img src={vietnamFlag} alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-2xl font-heading font-bold text-white">
                Vietnam<span className="text-yellow-400">Travel</span>
              </span>
            </div>
            <p className="text-white/80 text-sm leading-7">
              Proud to be a leading travel agency, bringing the beauty of Vietnam closer to friends around the world.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-6 text-lg text-yellow-200">About Us</h4>
            <ul className="space-y-4 text-white/80 text-sm">
              <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight size={12}/> Brand Story</a></li>
              <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight size={12}/> Our Team</a></li>
              <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight size={12}/> Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-6 text-lg text-yellow-200">Support</h4>
            <ul className="space-y-4 text-white/80 text-sm">
              <li className="flex gap-3 items-center"><Phone size={16} className="text-yellow-400"/> 0888 827 003</li>
              <li className="flex gap-3 items-center"><Mail size={16} className="text-yellow-400"/> support@vietnamtravel.com</li>
              <li className="flex gap-3 items-center"><MapPin size={16} className="text-yellow-400"/> DaNang, VietNam</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-6 text-lg text-yellow-200">Contact</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white hover:text-primary transition backdrop-blur-sm"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white hover:text-primary transition backdrop-blur-sm"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-white/10 text-white/60 text-sm font-light">
          © 2024 VietnamTravel. Designed with ❤️ & 🇻🇳.
        </div>
      </footer>
    </div>
  );
}

export default Home;
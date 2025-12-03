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

function Home() {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [tours, setTours] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); m
  const [filterRegion, setFilterRegion] = useState("All"); 
  // --- 1. CALL API & CHECK LOGIN ---
  useEffect(() => {
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
      if (window.confirm("Bạn cần đăng nhập để sử dụng tính năng đặt tour. Đi đến trang đăng nhập ngay?")) {
        navigate('/login');
      }
    }
  };

  // --- LOGIC LỌC DANH SÁCH TỈNH  ---
  const filteredProvinces = provinces.filter((province) => {
    // 1. Lọc theo tên (Tìm kiếm)
    const matchesSearch = province.name.toLowerCase().includes(searchTerm.toLowerCase());
    // 2. Lọc theo miền
    const matchesRegion = filterRegion === "All" || province.region === filterRegion;
    return matchesSearch && matchesRegion;
  });
  return (
    <div className="min-h-screen bg-[#FFFBE6] font-sans text-gray-800 overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-red-900 py-3 shadow-xl border-b border-yellow-500/30`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo(0, 0)}
          >
            <Star className="w-6 h-6 md:w-8 md:h-8 fill-yellow-400 text-yellow-400" />
            <span className="text-xl md:text-2xl font-bold tracking-wide text-white">
              Vietnam<span className="text-yellow-400">Travel</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-8">
            {["Trang chủ", "Bản đồ", "Tour Hot", "Liên hệ"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-bold text-lg text-yellow-100 hover:text-yellow-400 transition"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-yellow-100 font-bold hidden md:block text-sm">
                  {user.role === 'admin' && (
                      <span className="text-xs text-yellow-400 font-bold bg-red-800 px-2 py-0.5 rounded border border-yellow-500 mr-2">
                        Admin
                      </span>
                    )}
                    <Link to="/profile" className="text-yellow-100 font-bold hover:text-white hover:underline">
                      Xin chào, {user.full_name}
                    </Link>
                  </span>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="bg-white text-red-900 p-2 rounded-full hover:bg-gray-200 transition" title="Trang quản trị">
                      <Shield className="w-5 h-5" />
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-800 border border-yellow-500 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-700 transition"
                  >
                    Đăng xuất
                  </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-white">
                <Link to="/login" className="hover:text-yellow-400 transition-colors">Đăng nhập</Link>
                <span className="text-yellow-600">|</span>
                <Link to="/register" className="hover:text-yellow-400 transition-colors">Đăng ký</Link>
              </div>
            )}

            <button 
              onClick={handleBookNowHeader}
              className="hidden md:block bg-yellow-400 text-red-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition shadow-md border-2 border-yellow-200">
              Đặt ngay
            </button>
          </div>

        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://th.bing.com/th/id/R.532bccab419d02ae9036e695fa97d41e?rik=E4p1YXsiaxy2Qg&riu=http%3a%2f%2ffiles.auditnews.vn%2f2022%2f03%2f23%2fhttp-media.baokiemtoannhanuoc.vn-files-library-images-site-3-20220323-web-quang-ba-ve-dep-dat-nuoc-con-nguoi-viet-nam-qua-anh-315-104419.jpg&ehk=htoV583xiN8LhChsbmjSJt7%2bZeY%2fZp5pchVbwyu%2ffVY%3d&risl=&pid=ImgRaw&r=0"
            alt="Vietnam Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-red-900/30 to-[#FFFBE6]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center mt-16">
          <div className="inline-block mb-4">
              <span className="bg-red-600/90 text-yellow-100 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm border border-red-400">
                Hào khí Việt Nam
              </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6 leading-tight text-white drop-shadow-2xl">
            Việt Nam <br /> <span className="text-yellow-400">Diệu Kỳ</span>
          </h1>
          <button
            onClick={() =>
              document
                .getElementById("map-container")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="bg-red-700 text-yellow-100 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-800 transition shadow-xl border border-red-600"
          >
            <Search className="w-5 h-5 inline mr-2" /> Khám phá Bản đồ
          </button>
        </div>
      </section>

      {/* ================= MAP SECTION (CÓ TÌM KIẾM) ================= */}
      <section
        id="map-container"
        className="h-[90vh] bg-white border-t-4 border-red-800 flex flex-col"
      >
        <div className="bg-red-50 py-2 text-center border-b border-red-100">
          <h2 className="text-xl font-bold text-red-800 uppercase tracking-widest flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" /> Bản đồ du lịch Việt Nam
          </h2>
        </div>

        <div className="flex-1 flex flex-row overflow-hidden">
          {/* CỘT TRÁI: BẢN ĐỒ (60%) */}
          <div className="w-[60%] bg-[#FFFBE6] relative border-r border-red-200">
            <div className="w-full h-full p-6">
              <Map onProvinceClick={handleProvinceClick} />
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs text-red-600 shadow-md border border-red-100 pointer-events-none">
              * Rê chuột để xem tên, Click để xem chi tiết
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN & TÌM KIẾM (40%) */}
          <div className="w-[40%] bg-white flex flex-col shadow-xl z-20 relative">
            
            {/* Header cột phải: Tiêu đề & Nút Quay Lại */}
            <div className="p-4 border-b border-red-100 flex justify-between items-center bg-red-50">
              <h2 className="font-bold text-lg text-red-900 line-clamp-1">
                {selectedProvince ? selectedProvince.name : "Tìm kiếm điểm đến"}
              </h2>
              {selectedProvince && (
                <button
                  onClick={() => setSelectedProvince(null)}
                  className="text-xs text-red-600 hover:underline font-bold bg-white px-3 py-1 rounded border border-red-200 shadow-sm whitespace-nowrap"
                >
                  ← Quay lại
                </button>
              )}
            </div>

            {/* --- THANH TÌM KIẾM & LỌC --- */}
            {!selectedProvince && (
              <div className="p-4 bg-white border-b border-gray-100 space-y-3">
                {/* Input tìm kiếm */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Nhập tên tỉnh thành..." 
                    className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {/* Bộ lọc Miền */}
                <div className="flex gap-2">
                  {[
                    { key: 'All', label: 'Tất cả' },
                    { key: 'Bac', label: 'Miền Bắc' },
                    { key: 'Trung', label: 'Miền Trung' },
                    { key: 'Nam', label: 'Miền Nam' }
                  ].map(region => (
                    <button
                      key={region.key}
                      onClick={() => setFilterRegion(region.key)}
                      className={`flex-1 text-xs py-1.5 rounded font-bold border transition ${
                        filterRegion === region.key 
                        ? 'bg-red-100 text-red-700 border-red-200' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nội dung cuộn */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {selectedProvince ? (
                // === KHI ĐÃ CHỌN 1 TỈNH  ===
                <div className="animate-fade-in space-y-5">
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md border border-yellow-200">
                    <img
                      src={selectedProvince.thumbnail}
                      alt={selectedProvince.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300";
                      }}
                    />
                  </div>

                  <div className="bg-[#FFFBE6] p-4 rounded-xl border border-yellow-200 text-justify shadow-sm">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide block mb-2">
                      Giới thiệu
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                      {selectedProvince.description || "Đang cập nhật mô tả..."}
                    </p>
                  </div>

                  <Link
                    to={`/province/${selectedProvince.province_id}`}
                    className="block w-full bg-red-600 text-yellow-50 text-center font-bold py-3 rounded-xl hover:bg-red-700 transition shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
                  >
                    Khám phá chi tiết {selectedProvince.name} →
                  </Link>

                  <div className="border-t border-red-100 pt-4">
                    <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-red-500" /> Tour nổi bật
                    </h3>
                    {tours.length > 0 ? (
                      <div className="space-y-3">
                        {tours.map((tour) => (
                          <div
                            key={tour.tour_id}
                            className="bg-white border border-red-100 p-3 rounded-xl shadow-sm flex gap-4 group hover:border-red-300 transition"
                          >
                            <img
                              src={tour.image}
                              className="w-16 h-16 object-cover rounded-lg shadow-sm"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                            />
                            <div className="flex-1 flex flex-col justify-center">
                              <h4 className="font-bold text-sm text-gray-800 line-clamp-1">
                                {tour.name}
                              </h4>
                              <p className="text-xs text-red-600 font-bold mt-1">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(tour.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        Chưa có tour nào.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // === DANH SÁCH MẶC ĐỊNH  ===
                <div className="space-y-3">
                  {filteredProvinces.length > 0 ? (
                    filteredProvinces.map((province) => (
                      <div
                        key={province.province_id}
                        onClick={() => setSelectedProvince(province)}
                        className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-red-300 hover:bg-red-50 hover:shadow-md cursor-pointer transition group items-center"
                      >
                        <img
                          src={province.thumbnail}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-gray-700 text-sm group-hover:text-red-700 transition">
                            {province.name}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                            {province.region === "Bac"
                              ? "Miền Bắc"
                              : province.region === "Trung"
                              ? "Miền Trung"
                              : "Miền Nam"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-10">
                      Không tìm thấy kết quả phù hợp.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-20 bg-yellow-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-10 h-10 text-red-600" />,
                title: "An toàn tuyệt đối",
                desc: "Đồng hành cùng bạn trên mọi nẻo đường.",
              },
              {
                icon: <Star className="w-10 h-10 text-yellow-500" />,
                title: "Chất lượng 5 sao",
                desc: "Trải nghiệm dịch vụ đẳng cấp nhất.",
              },
              {
                icon: <MapPin className="w-10 h-10 text-red-600" />,
                title: "Điểm đến độc đáo",
                desc: "Khám phá những nơi chưa ai đặt chân.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#FFFDF5] p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-red-900/10 transition duration-300 border border-yellow-100 text-center group"
              >
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-red-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-red-900 text-yellow-50 pt-16 pb-8 border-t-4 border-yellow-500">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold text-white">
                VietnamTravel
              </span>
            </div>
            <p className="text-red-100/80 text-sm leading-relaxed">
              Tự hào Việt Nam - Vẻ đẹp bất tận.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-yellow-200 uppercase tracking-wide">
              Về chúng tôi
            </h4>
            <ul className="space-y-3 text-red-100/80 text-sm">
              <li><a href="#" className="hover:text-yellow-300 transition">Câu chuyện thương hiệu</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition">Tuyển dụng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-yellow-200 uppercase tracking-wide">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-red-100/80 text-sm">
              <li className="flex gap-3 items-center"><Phone className="w-4 h-4" /> 0888827003</li>
              <li className="flex gap-3 items-center"><Mail className="w-4 h-4" /> vietnamtravel776@gmail.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-yellow-200 uppercase tracking-wide">
              Kết nối
            </h4>
            <div className="flex gap-4">
              <a href="#" className="bg-red-800 p-3 rounded-full hover:bg-yellow-400 hover:text-red-900 transition shadow-lg"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="bg-red-800 p-3 rounded-full hover:bg-yellow-400 hover:text-red-900 transition shadow-lg"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-red-800 text-red-200/50 text-xs">
          © 2024 VietnamTravel. Designed with ❤️ & 🇻🇳.
        </div>
      </footer>
    </div>
  );
}

export default Home;
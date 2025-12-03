import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Utensils, BookOpen, Calendar, ArrowRight, Star, ArrowLeft, Clock ,Heart} from 'lucide-react';

const ProvincePage = () => {
   const { id } = useParams();
   const [province, setProvince] = useState(null);
   const [tours, setTours] = useState([]);
   const [loading, setLoading] = useState(true);
   const [isLiked, setIsLiked] = useState(false);
   const user = JSON.parse(localStorage.getItem('user'));
   useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi mới vào
    
    // 1. Lấy thông tin Tỉnh
    axios.get(`http://localhost:5000/api/provinces/${id}`)
      .then(res => setProvince(res.data))
      .catch(err => console.error(err));
      
    // 2. Lấy danh sách Tour của Tỉnh
    axios.get(`http://localhost:5000/api/tours/province/${id}`)
      .then(res => setTours(res.data))
      .catch(err => console.error(err));
      // 3. Kiểm tra nếu người dùng đã thích Tỉnh này
      if (user && id) {
      axios.get(`http://localhost:5000/api/users/wishlist/check/${user.user_id}/${id}`)
        .then(res => setIsLiked(res.data.isLiked))
        .catch(err => console.error(err));
    }
    setLoading(false);
    
  }, [id]);
  
  if (!province) return <div className="min-h-screen flex justify-center items-center bg-[#FFFBE6] text-red-800 font-bold">Đang tải dữ liệu...</div>;
   const handleToggleWishlist = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để lưu yêu thích!");
      return;
    }
    
    axios.post('http://localhost:5000/api/users/wishlist/toggle', {
      user_id: user.user_id,
      province_id: province.province_id
    })
    .then(res => {
      setIsLiked(!isLiked); // Đổi trạng thái tim
      // alert(res.data.message); // Có thể hiện hoặc không
    })
    .catch(err => console.error(err));
  };
  return (
    <div className="min-h-screen bg-[#FFFBE6] font-sans text-gray-800">
      
      {/* --- HEADER ẢNH (HERO) --- */}
      <div className="relative h-[60vh]">
        <img src={province.thumbnail} alt={province.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-red-900/40 to-transparent"></div>
        
        {/* Nút quay lại */}
        <Link to="/" className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-yellow-400 hover:text-red-900 transition border border-white/30">
           <ArrowLeft />
        </Link>

        {/* Tên Tỉnh */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 text-white">
           <span className="bg-yellow-400 text-red-900 px-4 py-1 rounded-full font-bold uppercase tracking-wider text-sm mb-4 inline-block shadow-lg">
             Điểm đến nổi bật
           </span>
           <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg tracking-tight">{province.name}</h1>
           {/* NÚT TIM */}
   <button 
     onClick={handleToggleWishlist}
     className={`p-3 rounded-full shadow-lg transition transform hover:scale-110 ${isLiked ? 'bg-white text-red-600' : 'bg-black/30 text-white hover:bg-white hover:text-red-600'}`}
     title={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
   >
     <Heart className={`w-8 h-8 ${isLiked ? 'fill-current' : ''}`} />
   </button>
           <div className="flex items-center gap-2 text-yellow-200 text-lg">
              <MapPin className="w-5 h-5" /> 
              {province.region === 'Bac' ? 'Miền Bắc' : province.region === 'Trung' ? 'Miền Trung' : 'Miền Nam'}
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        
        {/* --- PHẦN 1: GIỚI THIỆU CHUNG --- */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-red-600 mb-12">
           <h2 className="text-3xl font-bold text-red-800 mb-6 flex items-center gap-3">
             <Star className="w-8 h-8 text-yellow-500 fill-current" /> Tổng quan
           </h2>
           <p className="text-gray-700 text-lg leading-relaxed text-justify">
             {province.description}
           </p>
        </div>

        {/* --- PHẦN 2: VĂN HÓA & ẨM THỰC (2 Cột) --- */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
           {/* Cột Văn hóa */}
           <div className="bg-red-50 p-8 rounded-3xl border border-red-100 relative overflow-hidden group hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-6">
                 <div className="bg-red-600 p-3 rounded-full text-white shadow-md">
                    <BookOpen className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-red-900">Văn hóa & Con người</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed text-justify">
                 {province.culture || "Thông tin văn hóa đang được cập nhật..."}
              </p>
           </div>

           {/* Cột Ẩm thực */}
           <div className="bg-yellow-50 p-8 rounded-3xl border border-yellow-200 relative overflow-hidden group hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-6">
                 <div className="bg-yellow-500 p-3 rounded-full text-white shadow-md">
                    <Utensils className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-yellow-800">Ẩm thực đặc sắc</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed text-justify">
                 {province.food || "Thông tin ẩm thực đang được cập nhật..."}
              </p>
           </div>
        </div>

        {/* --- PHẦN 3: DANH SÁCH TOUR --- */}
        <div className="mb-10 flex items-center gap-4 border-b border-red-200 pb-4">
           <h2 className="text-4xl font-bold text-red-800">Các Tour tại {province.name}</h2>
        </div>

        {tours.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {tours.map(tour => (
              <Link to={`/tour/${tour.tour_id}`} key={tour.tour_id} className="group">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-red-200 transition h-full flex flex-col">
                   <div className="h-56 overflow-hidden relative">
                      <img src={tour.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" onError={e => e.target.src='https://via.placeholder.com/400'} />
                      <div className="absolute top-4 right-4 bg-yellow-400 text-red-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                         HOT
                      </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                         <Clock className="w-4 h-4 text-red-500" /> {tour.duration}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-red-700 transition">
                        {tour.name}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
                         <div>
                            <p className="text-xs text-gray-400">Giá tham khảo</p>
                            <p className="text-2xl font-extrabold text-red-600">
                               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}
                            </p>
                         </div>
                         <span className="bg-red-50 text-red-600 p-2 rounded-full group-hover:bg-red-600 group-hover:text-white transition">
                            <ArrowRight className="w-5 h-5" />
                         </span>
                      </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
             <p className="text-gray-400 text-xl">Hiện chưa có tour nào tại địa điểm này.</p>
             <Link to="/" className="mt-4 inline-block text-red-600 font-bold hover:underline">Quay về trang chủ</Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProvincePage;
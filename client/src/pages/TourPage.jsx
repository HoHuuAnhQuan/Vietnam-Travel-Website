import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { MapPin, Clock, ArrowLeft, CheckCircle, User, Phone, Calendar } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import { toast } from 'react-toastify';

const TourPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', guests: 1, date: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    // Gọi API lấy chi tiết tour
    axios.get(`http://localhost:5000/api/tours/${id}`)
      .then(res => {
        setTour(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải tour:", err);
        setError("Không thể tải thông tin tour này.");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. KIỂM TRA ĐĂNG NHẬP
    const userStorage = localStorage.getItem('user');
    if (!userStorage) {
      if(window.confirm("Bạn cần đăng nhập để đặt tour. Đi đến trang đăng nhập ngay?")) {
        navigate('/login');
      }
      return;
    }

    const user = JSON.parse(userStorage);

    // 2. GỬI DỮ LIỆU VỀ BACKEND
    const bookingData = {
      user_id: user.user_id,
      tour_id: tour.tour_id,
      start_date: formData.date,
      num_people: formData.guests,
      total_price: tour.price * formData.guests 
    };

    try {
      await axios.post('http://localhost:5000/api/bookings', bookingData);
      toast.success("🎉 Đặt tour thành công! Nhân viên sẽ liên hệ với bạn sớm.");
      navigate('/'); 
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi đặt tour. Vui lòng thử lại.");
    }
  };

  // --- XỬ LÝ GIAO DIỆN KHI TẢI HOẶC LỖI ---
  if (loading) return <div className="min-h-screen flex justify-center items-center text-red-600 font-bold">Đang tải dữ liệu...</div>;
  if (error) return <div className="min-h-screen flex justify-center items-center text-gray-500">{error}</div>;
  if (!tour) return <div className="min-h-screen flex justify-center items-center text-gray-500">Không tìm thấy tour</div>;

  return (
    <div className="min-h-screen bg-[#FFFBE6] font-sans text-gray-800 pb-20">
      
      {/* HERO IMAGE */}
      <div className="relative h-[50vh]">
        <img 
            src={tour.image} 
            alt={tour.name} 
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = 'https://via.placeholder.com/800x400'}} 
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <Link to={`/province/${tour.province_id}`} className="absolute top-6 left-6 bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white hover:text-red-900 transition">
          <ArrowLeft />
        </Link>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 drop-shadow-md">{tour.name}</h1>
          <div className="flex gap-6 text-yellow-200 font-medium">
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/> {tour.start_location}</span>
            <span className="flex items-center gap-2"><Clock className="w-5 h-5"/> {tour.duration}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10 grid md:grid-cols-3 gap-10">
        
        {/* CỘT TRÁI: THÔNG TIN */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
            <h2 className="text-2xl font-bold text-red-800 mb-4 border-b border-red-100 pb-2">Giới thiệu tour</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">{tour.description}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
            <h2 className="text-2xl font-bold text-red-800 mb-4 border-b border-red-100 pb-2">Dịch vụ bao gồm</h2>
            <ul className="space-y-3">
              {['Xe đưa đón đời mới', 'Hướng dẫn viên nhiệt tình', 'Vé tham quan các điểm', 'Nước uống, khăn lạnh'].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <ReviewSection tourId={id} />
        </div>

        {/* CỘT PHẢI: FORM ĐẶT TOUR */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-red-600 sticky top-4">
            <div className="mb-6">
              <p className="text-sm text-gray-500">Giá trọn gói</p>
              <p className="text-3xl font-extrabold text-red-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}
                <span className="text-sm text-gray-400 font-normal">/khách</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Họ tên</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-1 focus-within:border-red-500 bg-gray-50">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  <input required type="text" className="w-full bg-transparent outline-none text-sm" placeholder="Nguyễn Văn A" 
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Số điện thoại</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-1 focus-within:border-red-500 bg-gray-50">
                  <Phone className="w-5 h-5 text-gray-400 mr-2" />
                  <input required type="tel" className="w-full bg-transparent outline-none text-sm" placeholder="0905..." 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Số khách</label>
                  <input required type="number" min="1" defaultValue="1" className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-red-500 bg-gray-50" 
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Ngày đi</label>
                  <input required type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 outline-none focus:border-red-500 bg-gray-50 text-sm text-gray-600" 
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 text-yellow-100 font-bold py-3 rounded-xl hover:bg-red-700 transition shadow-lg mt-4">
                ĐẶT TOUR NGAY
              </button>
              
              {!localStorage.getItem('user') && (
                <p className="text-xs text-center text-red-500 mt-2 font-bold animate-pulse">
                  * Bạn cần đăng nhập để đặt tour
                </p>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TourPage;
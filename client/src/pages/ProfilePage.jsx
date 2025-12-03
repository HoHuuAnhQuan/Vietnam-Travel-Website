import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, Heart, Save, MapPin, LogOut, Trash2, Calendar, Clock, CheckCircle, XCircle, AlertCircle, ShoppingBag,ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [bookings, setBookings] = useState([]); 
  const [activeTab, setActiveTab] = useState('bookings');'wishlist'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '' });
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // 1. Lấy thông tin user
    axios.get(`http://localhost:5000/api/users/${currentUser.user_id}`)
      .then(res => {
        setUser(res.data);
        setFormData({ full_name: res.data.full_name, phone: res.data.phone || '' });
      });

    // 2. Lấy dữ liệu ban đầu
    fetchWishlist();
    fetchBookings();
  }, []);

  const fetchWishlist = () => {
    axios.get(`http://localhost:5000/api/users/wishlist/${currentUser.user_id}`)
      .then(res => setWishlist(res.data));
  };

  // --- HÀM LẤY ĐƠN HÀNG ---
  const fetchBookings = () => {
    axios.get(`http://localhost:5000/api/bookings/user/${currentUser.user_id}`)
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  };

  // --- HÀM HỦY ĐƠN ---
  const handleCancelBooking = (bookingId) => {
    if(!window.confirm("Are you sure you want to cancel this tour?")) return;

    axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`, { user_id: currentUser.user_id })
      .then(() => {
        toast.success("The tour has been successfully canceled.");
        fetchBookings(); // Load lại danh sách
      })
      .catch(() => toast.error("Error when cancelling the tour."));
  };

  // Các hàm cũ (Update Profile, Remove Wishlist...)
  const handleRemoveWishlist = (e, provinceId) => {
    e.preventDefault();
    if(!window.confirm("Remove from favorites?")) return;
    axios.post('http://localhost:5000/api/users/wishlist/toggle', { user_id: currentUser.user_id, province_id: provinceId })
    .then(() => fetchWishlist());
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/users/${currentUser.user_id}`, formData)
      .then(() => {
        toast.success("Updated successfully!");
        setIsEditing(false);
        setUser({ ...user, ...formData });
        const newUserStorage = { ...currentUser, full_name: formData.full_name };
        localStorage.setItem('user', JSON.stringify(newUserStorage));
        window.location.reload();
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FFFBE6] font-sans text-gray-800 pt-24 pb-10">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
         {/* Nút quay lại */}
        <Link to="/" className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-red-600 p-3 rounded-full hover:bg-yellow-400 hover:text-red-900 transition border border-white/30">
           <ArrowLeft />
        </Link>
        {/* CỘT TRÁI: THÔNG TIN */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100 sticky top-24">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-red-900">{user.full_name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Full name</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-1 bg-gray-50">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <input disabled={!isEditing} type="text" className="w-full bg-transparent outline-none text-sm disabled:text-gray-500" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Phone number</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-1 bg-gray-50">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <input disabled={!isEditing} type="text" className="w-full bg-transparent outline-none text-sm disabled:text-gray-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-1 bg-gray-100">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <input disabled type="text" className="w-full bg-transparent outline-none text-sm text-gray-500" value={user.email} />
                </div>
              </div>

              {isEditing ? (
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 flex items-center justify-center gap-2"><Save size={16}/> Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-300">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="w-full bg-yellow-400 text-red-900 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 transition shadow-sm border border-yellow-500">Edit profile</button>
              )}
            </form>
            <button onClick={handleLogout} className="w-full mt-6 flex items-center justify-center gap-2 text-red-600 py-2 hover:bg-red-50 rounded-lg transition text-sm font-medium"><LogOut size={16} /> Log out</button>
          </div>
        </div>
        {/* CỘT PHẢI: TABS (ĐƠN HÀNG & WISHLIST) */}
        <div className="md:col-span-2">
          
          {/* THANH TAB CHUYỂN ĐỔI */}
          <div className="flex gap-4 mb-6 border-b border-red-200 pb-1">
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-lg transition ${activeTab === 'bookings' ? 'text-red-600 border-b-4 border-red-600' : 'text-gray-400 hover:text-red-400'}`}
            >
              <ShoppingBag size={20} /> Booking history
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-lg transition ${activeTab === 'wishlist' ? 'text-red-600 border-b-4 border-red-600' : 'text-gray-400 hover:text-red-400'}`}
            >
              <Heart size={20} /> Favorite
            </button>
          </div>

          {/* NỘI DUNG TAB: ĐƠN HÀNG */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map(item => (
                  <div key={item.booking_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 hover:shadow-md transition">
                    <img src={item.image} className="w-full md:w-32 h-24 object-cover rounded-lg" onError={e => e.target.src='https://via.placeholder.com/150'} />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.tour_name}</h3>
                         {/* Badge Trạng thái */}
                         {item.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12}/> Pending Approval</span>}
                         {item.status === 'confirmed' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Approved</span>}
                         {item.status === 'cancelled' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Cancelled</span>}
                      </div>

                      <div className="flex gap-4 text-sm text-gray-500 mt-2">
                         <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(item.start_date).toLocaleDateString('vi-VN')}</span>
                         <span className="flex items-center gap-1"><User size={14}/> {item.num_people} guest</span>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                         <span className="text-red-600 font-extrabold text-lg">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price)}
                         </span>
                         
                         {/* Nút Hủy (Chỉ hiện khi trạng thái là pending) */}
                         {item.status === 'pending' && (
                           <button 
                             onClick={() => handleCancelBooking(item.booking_id)}
                             className="text-gray-400 text-xs hover:text-red-600 font-bold border border-gray-200 px-3 py-1 rounded hover:bg-red-50 transition"
                           >
                             Cancel order
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">You haven't booked any tours.</div>
              )}
            </div>
          )}

          {/* NỘI DUNG TAB: WISHLIST (Code cũ) */}
          {activeTab === 'wishlist' && (
            <div className="grid md:grid-cols-2 gap-6">
              {wishlist.length > 0 ? wishlist.map(p => (
                <div key={p.province_id} className="relative group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition overflow-hidden flex h-32">
                  <Link to={`/province/${p.province_id}`} className="flex w-full h-full">
                    <img src={p.thumbnail} className="w-1/3 object-cover" />
                    <div className="w-2/3 p-4 flex flex-col justify-center pr-10">
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{p.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{p.description}</p>
                    </div>
                  </Link>
                  <button onClick={(e) => handleRemoveWishlist(e, p.province_id)} className="absolute top-2 right-2 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-red-600 transition z-10"><Trash2 size={16} /></button>
                </div>
              )) : <div className="text-center py-10 text-gray-400 col-span-2">The list is empty.</div>}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
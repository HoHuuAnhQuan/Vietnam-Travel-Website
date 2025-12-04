import { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, X, Image as ImageIcon, Users } from 'lucide-react'; // Thêm icon Users
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null); 
  
  // Dữ liệu Form (Khớp với DB của bạn)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    start_location: '',
    province_id: '',
    image: '',
    available_slots: 20 // Mặc định
  });

  // 1. LẤY DANH SÁCH TOUR
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = () => {
    axios.get('http://localhost:5000/api/tours')
      .then(res => {
        setTours(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi kết nối Server!");
        setLoading(false);
      });
  };

  // 2. XÓA TOUR
  const handleDelete = (id) => {
    Swal.fire({
        title: 'Xóa tour này?',
        text: "Dữ liệu sẽ mất vĩnh viễn!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Xóa ngay'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`http://localhost:5000/api/tours/${id}`)
            .then(() => {
                Swal.fire('Đã xóa!', 'Tour đã bị xóa.', 'success');
                fetchTours();
            })
            .catch(() => toast.error("Không thể xóa (Có thể do đang có đơn đặt)"));
        }
    });
  };

  // 3. SUBMIT FORM
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate cơ bản
    if (!formData.province_id) return toast.warn("Vui lòng nhập ID Tỉnh");

    if (editingTour) {
      // Update
      axios.put(`http://localhost:5000/api/tours/${editingTour.tour_id}`, formData)
        .then(() => {
          toast.success("Cập nhật thành công!");
          closeModal();
          fetchTours();
        })
        .catch(err => toast.error("Lỗi cập nhật!"));
    } else {
      // Create
      axios.post('http://localhost:5000/api/tours', formData)
        .then(() => {
          toast.success("Thêm tour mới thành công!");
          closeModal();
          fetchTours();
        })
        .catch(err => toast.error("Lỗi thêm mới!"));
    }
  };

  // Mở Modal (Reset hoặc Fill data)
  const openModal = (tour = null) => {
    setEditingTour(tour);
    if (tour) {
      setFormData({
        name: tour.name,
        description: tour.description,
        price: tour.price,
        duration: tour.duration,
        start_location: tour.start_location,
        province_id: tour.province_id,
        image: tour.image,
        available_slots: tour.available_slots // Thêm dòng này
      });
    } else {
      setFormData({ 
        name: '', description: '', price: '', duration: '', 
        start_location: '', province_id: '', image: '', available_slots: 20 
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải danh sách...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-fade-in">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
            <h2 className="font-bold text-xl text-gray-800">Danh sách Tour</h2>
            <p className="text-sm text-gray-500">Tổng: {tours.length} tour</p>
        </div>
        <button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-sm transition">
          <Plus size={18} /> Thêm Tour
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-white text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Ảnh</th>
              <th className="p-4">Tên Tour</th>
              <th className="p-4">Giá / Thời gian</th>
              <th className="p-4">Điểm đi</th>
              <th className="p-4">Số chỗ</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {tours.map(tour => (
              <tr key={tour.tour_id} className="hover:bg-gray-50 border-b last:border-b-0 transition">
                <td className="p-4 text-gray-500">#{tour.tour_id}</td>
                <td className="p-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img src={tour.image} className="w-full h-full object-cover" onError={e => e.target.src='https://placehold.co/150'}/>
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-800 max-w-xs">{tour.name}</td>
                <td className="p-4">
                    <div className="text-red-600 font-extrabold">{new Intl.NumberFormat('vi-VN').format(tour.price)}đ</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">{tour.duration}</div>
                </td>
                <td className="p-4">{tour.start_location}</td>
                <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-max">
                        <Users size={12}/> {tour.available_slots}
                    </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(tour)} className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(tour.tour_id)} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tours.length === 0 && <div className="p-10 text-center text-gray-400 italic">Chưa có dữ liệu tour.</div>}
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">{editingTour ? "Cập nhật Tour" : "Thêm Tour Mới"}</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-red-600 transition"><X size={24}/></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Hàng 1: Tên & Tỉnh */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tên Tour</label>
                            <input required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">ID Tỉnh</label>
                            <input type="number" required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" value={formData.province_id} onChange={e => setFormData({...formData, province_id: e.target.value})} placeholder="VD: 1, 18..." />
                        </div>
                    </div>

                    {/* Hàng 2: Giá, Thời gian, Số chỗ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Giá (VNĐ)</label>
                            <input required type="number" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-bold text-red-600" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Thời gian</label>
                            <input required placeholder="VD: 2N1Đ" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Số chỗ (Slots)</label>
                            <input required type="number" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" value={formData.available_slots} onChange={e => setFormData({...formData, available_slots: e.target.value})} />
                        </div>
                    </div>

                    {/* Hàng 3: Điểm đi & Ảnh */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Điểm khởi hành</label>
                            <input required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" value={formData.start_location} onChange={e => setFormData({...formData, start_location: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Link Ảnh (URL)</label>
                            <div className="flex gap-2">
                                <input required placeholder="https://..." className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                                <div className="w-10 h-10 border rounded overflow-hidden shrink-0 bg-gray-100">
                                    {formData.image && <img src={formData.image} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'}/>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hàng 4: Mô tả */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Mô tả chi tiết</label>
                        <textarea required rows="5" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg mt-2">
                        {editingTour ? "LƯU THAY ĐỔI" : "TẠO TOUR MỚI"}
                    </button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTours;
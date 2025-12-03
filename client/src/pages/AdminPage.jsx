import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, LogOut, LayoutDashboard, ArrowLeft} from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const AdminPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    // 1. Kiểm tra quyền Admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        toast.error("Bạn không có quyền truy cập trang này!");
        navigate('/');
        return;
    }
    fetchBookings();
    }, []);
    const fetchBookings = () => {
    axios.get('http://localhost:5000/api/bookings/all')
        .then(res => {
        setBookings(res.data);
        setLoading(false);
        })
        .catch(err => console.error(err));
    };

    // Hàm xử lý duyệt/hủy
    const handleStatusUpdate = (id, newStatus) => {
    const isApprove = newStatus === 'confirmed';
    const actionText = isApprove ? 'DUYỆT' : 'HỦY';
    const actionColor = isApprove ? '#16a34a' : '#dc2626'; // Xanh lá hoặc Đỏ
    // Hiện Popup hỏi xác nhận
    Swal.fire({
        title: `Xác nhận ${actionText}?`,
        text: `Bạn có chắc chắn muốn ${actionText} đơn hàng #${id} không?`,
        icon: isApprove ? 'question' : 'warning',
        showCancelButton: true,
        confirmButtonColor: actionColor,
        cancelButtonColor: '#6b7280',
        confirmButtonText: `Đồng ý ${actionText}`,
        cancelButtonText: 'Suy nghĩ lại',
        background: '#fff',
        customClass: {
        popup: 'rounded-xl' 
        }
    }).then((result) => {
        // Nếu người dùng bấm "Đồng ý"
        if (result.isConfirmed) {
        // Gọi API cập nhật
        axios.put(`http://localhost:5000/api/bookings/${id}`, { status: newStatus })
            .then(() => {
            // Hiện thông báo thành công
            Swal.fire({
                title: 'Thành công!',
                text: `Đã ${actionText} đơn hàng xong.`,
                icon: 'success',
                confirmButtonColor: '#b91c1c'
            });
            fetchBookings(); // Tải lại danh sách
            })
            .catch(err => {
            Swal.fire('Lỗi!', 'Không thể cập nhật trạng thái.', 'error');
            });
        }
    });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="p-10 text-center">Đang tải dữ liệu quản trị...</div>;

    return (
    <div className="min-h-screen bg-gray-100 font-sans">
        <Link to="/" className="absolute top-16 left-7 bg-red-700/20 backdrop-blur-md text-red-600 p-3 rounded-full hover:bg-yellow-400 hover:text-red-900 transition border border-white/30">
            <ArrowLeft />
        </Link>
        {/* Sidebar giả lập */}
        <div className="bg-red-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl">
            <LayoutDashboard /> Admin Dashboard
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 text-sm bg-red-800 px-3 py-1 rounded hover:bg-red-700">
            <LogOut size={16} /> Đăng xuất
        </button>
        </div>
        
        <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đơn đặt tour</h2>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                <tr>
                    <th className="p-4 border-b">Mã đơn</th>
                    <th className="p-4 border-b">Khách hàng</th>
                    <th className="p-4 border-b">Tour đăng ký</th>
                    <th className="p-4 border-b">Ngày đi</th>
                    <th className="p-4 border-b">Tổng tiền</th>
                    <th className="p-4 border-b text-center">Trạng thái</th>
                    <th className="p-4 border-b text-center">Hành động</th>
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
                {bookings.map((item) => (
                <tr key={item.booking_id} className="hover:bg-gray-50 border-b last:border-b-0">
                    <td className="p-4 font-bold text-red-600">#{item.booking_id}</td>
                    <td className="p-4">
                    <div className="font-bold">{item.full_name}</div>
                    <div className="text-xs text-gray-500">{item.phone}</div>
                    </td>
                    <td className="p-4 max-w-xs truncate" title={item.tour_name}>{item.tour_name}</td>
                    <td className="p-4">{new Date(item.start_date).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price)}
                    <div className="text-xs font-normal text-gray-500">({item.num_people} khách)</div>
                    </td>
                    <td className="p-4 text-center">
                    {item.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1"><Clock size={12}/> Chờ duyệt</span>}
                    {item.status === 'confirmed' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1"><CheckCircle size={12}/> Đã duyệt</span>}
                    {item.status === 'cancelled' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1"><XCircle size={12}/> Đã hủy</span>}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                    {item.status === 'pending' && (
                        <>
                        <button 
                            onClick={() => handleStatusUpdate(item.booking_id, 'confirmed')}
                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition" title="Duyệt đơn"
                        >
                            <CheckCircle size={16} />
                        </button>
                        <button 
                            onClick={() => handleStatusUpdate(item.booking_id, 'cancelled')}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition" title="Hủy đơn"
                        >
                            <XCircle size={16} />
                        </button>
                        </>
                    )}
                    {item.status !== 'pending' && <span className="text-gray-400 text-xs italic">Đã xử lý</span>}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {bookings.length === 0 && <div className="p-8 text-center text-gray-500">Chưa có đơn hàng nào.</div>}
        </div>
        </div>
    </div>
    );
};

export default AdminPage;
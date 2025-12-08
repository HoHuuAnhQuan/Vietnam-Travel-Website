import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, LogOut, ArrowLeft, LayoutDashboard, Map, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AdminTours from './AdminTours'; // Component con quản lý Tour

const AdminPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // State chuyển Tab

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

    // Hàm xử lý duyệt/hủy đơn hàng
    const handleStatusUpdate = (id, newStatus) => {
        const isApprove = newStatus === 'confirmed';
        const actionText = isApprove ? 'Approve' : 'Cancel';
        const actionColor = isApprove ? '#16a34a' : '#dc2626';

        Swal.fire({
            title: `Confirm ${actionText}?`,
            text: `Are you sure you want to ${actionText} order #${id}?`,
            icon: isApprove ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: actionColor,
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Agree ${actionText}`,
            cancelButtonText: 'Think again',
            background: '#fff',
            customClass: { popup: 'rounded-xl' }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`http://localhost:5000/api/bookings/${id}`, { status: newStatus })
                    .then(() => {
                        Swal.fire({
                            title: 'Success!',
                            text: `The order has been ${actionText} successfully.`,
                            icon: 'success',
                            confirmButtonColor: '#b91c1c'
                        });
                        fetchBookings();
                    })
                    .catch(err => {
                        Swal.fire('Error!!', 'Unable to update status.', 'error');
                    });
            }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="p-10 text-center">Loading admin data...</div>;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Link to="/" className="absolute top-20 left-6 z-20 bg-red-700/20 backdrop-blur-md text-red-600 p-3 rounded-full hover:bg-yellow-400 hover:text-red-900 transition border border-white/30 shadow-md">
                <ArrowLeft />
            </Link>

            {/* Sidebar / Header */}
            <div className="bg-red-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-xl ml-12 md:ml-0">
                    <LayoutDashboard /> Admin Dashboard
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 text-sm bg-red-800 px-3 py-1 rounded hover:bg-red-700 border border-red-700">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="container mx-auto p-6 pt-8">
                
                {/* --- PHẦN BỊ THIẾU CỦA BẠN: THANH CHUYỂN TAB --- */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-sm border ${
                            activeTab === 'bookings' 
                            ? 'bg-red-900 text-yellow-400 border-red-900' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                        }`}
                    >
                        <ShoppingBag size={20}/> Order Management
                    </button>
                    <button 
                        onClick={() => setActiveTab('tours')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-sm border ${
                            activeTab === 'tours' 
                            ? 'bg-red-900 text-yellow-400 border-red-900' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                        }`}
                    >
                        <Map size={20}/> Tour Management
                    </button>
                </div>

                {/* --- PHẦN BỊ THIẾU: LOGIC HIỂN THỊ DỰA TRÊN TAB --- */}
                <div className="transition-all duration-300">
                    {activeTab === 'bookings' ? (
                        /* === TAB BOOKINGS (Code cũ của bạn nằm ở đây) === */
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-fade-in">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">
                                Recent order list
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead className="bg-white text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
                                        <tr>
                                            <th className="p-4">Order Code</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Tour</th>
                                            <th className="p-4">Departure Date</th>
                                            <th className="p-4">Total Amount</th>
                                            <th className="p-4 text-center">Status</th>
                                            <th className="p-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-700">
                                        {bookings.map((item) => (
                                            <tr key={item.booking_id} className="hover:bg-gray-50 border-b last:border-b-0 transition">
                                                <td className="p-4 font-bold text-red-600">#{item.booking_id}</td>
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-800">{item.full_name}</div>
                                                    <div className="text-xs text-gray-500">{item.phone}</div>
                                                </td>
                                                <td className="p-4 max-w-xs truncate font-medium" title={item.tour_name}>{item.tour_name}</td>
                                                <td className="p-4 text-gray-500">{new Date(item.start_date).toLocaleDateString('vi-VN')}</td>
                                                <td className="p-4 font-bold text-gray-800">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price)}
                                                    <div className="text-xs font-normal text-gray-400">({item.num_people} khách)</div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {item.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-max mx-auto"><Clock size={12}/> Pending approval</span>}
                                                    {item.status === 'confirmed' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-max mx-auto"><CheckCircle size={12}/> Approved</span>}
                                                    {item.status === 'cancelled' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-max mx-auto"><XCircle size={12}/> Canceled</span>}
                                                </td>
                                                <td className="p-4 flex justify-center gap-2">
                                                    {item.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleStatusUpdate(item.booking_id, 'confirmed')} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-600 hover:text-white transition" title="Approve order">
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button onClick={() => handleStatusUpdate(item.booking_id, 'cancelled')} className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-600 hover:text-white transition" title="Cancel order">
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {item.status !== 'pending' && <span className="text-gray-400 text-xs italic bg-gray-100 px-2 py-1 rounded">Processed</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {bookings.length === 0 && <div className="p-10 text-center text-gray-400 italic">No orders yet.</div>}
                        </div>
                    ) : (
                        /* === TAB QUẢN LÝ TOUR (HIỂN THỊ COMPONENT ADMINTOURS) === */
                        <AdminTours />
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminPage;
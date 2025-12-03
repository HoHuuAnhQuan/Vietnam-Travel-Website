import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, User, Mail, Lock, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBE6] flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-6 left-6 text-red-800 hover:underline flex items-center gap-2 font-bold"><ArrowLeft/> Về trang chủ</Link>
      
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-red-100">
        <div className="text-center mb-8">
           <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
              <Star className="w-10 h-10 text-yellow-500 fill-current" />
           </div>
           <h2 className="text-3xl font-extrabold text-red-900">Tạo tài khoản mới</h2>
           <p className="text-gray-500 mt-2">Bắt đầu hành trình của bạn</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-red-500">
             <User className="w-5 h-5 text-gray-400 mr-3" />
             <input type="text" required placeholder="Họ và tên" className="w-full bg-transparent outline-none" 
               onChange={e => setFormData({...formData, full_name: e.target.value})}
             />
          </div>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-red-500">
             <Mail className="w-5 h-5 text-gray-400 mr-3" />
             <input type="email" required placeholder="Email" className="w-full bg-transparent outline-none" 
               onChange={e => setFormData({...formData, email: e.target.value})}
             />
          </div>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-red-500">
             <Lock className="w-5 h-5 text-gray-400 mr-3" />
             <input type="password" required placeholder="Mật khẩu" className="w-full bg-transparent outline-none"
               onChange={e => setFormData({...formData, password: e.target.value})}
             />
          </div>

          <button type="submit" className="w-full bg-red-700 text-yellow-50 font-bold py-3.5 rounded-xl hover:bg-red-800 transition shadow-lg">
            ĐĂNG KÝ
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Đã có tài khoản? <Link to="/login" className="text-red-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Lưu thông tin user vào localStorage (Bộ nhớ trình duyệt)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast.success('Đăng nhập thành công!');
      navigate('/'); // Chuyển về trang chủ
      window.location.reload(); // Load lại để cập nhật Header
    } catch (err) {
      setError(err.response?.data?.message || 'Error!!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBE6] flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-6 left-6 text-red-800 hover:underline flex items-center gap-2 font-bold"><ArrowLeft/> Back to homepage</Link>
      
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-red-100">
        <div className="text-center mb-8">
           <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
              <Star className="w-10 h-10 text-yellow-500 fill-current" />
           </div>
           <h2 className="text-3xl font-extrabold text-red-900">Welcome Backk!!</h2>
           <p className="text-gray-500 mt-2">Log in to explore Vietnam</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition bg-gray-50">
               <Mail className="w-5 h-5 text-gray-400 mr-3" />
               <input type="email" required placeholder="example@gmail.com" className="w-full bg-transparent outline-none text-gray-800" 
                 onChange={e => setFormData({...formData, email: e.target.value})}
               />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition bg-gray-50">
               <Lock className="w-5 h-5 text-gray-400 mr-3" />
               <input type="password" required placeholder="••••••••" className="w-full bg-transparent outline-none text-gray-800"
                 onChange={e => setFormData({...formData, password: e.target.value})}
               />
            </div>
          </div>

          <button type="submit" className="w-full bg-red-700 text-yellow-50 font-bold py-3.5 rounded-xl hover:bg-red-800 transition shadow-lg shadow-red-900/20">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account? <Link to="/register" className="text-red-600 font-bold hover:underline">Sign up now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
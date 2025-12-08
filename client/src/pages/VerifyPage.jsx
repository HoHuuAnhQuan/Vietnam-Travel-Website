import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyPage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy email được truyền từ trang đăng ký sang
  const email = location.state?.email; 

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify', { email, otp });
      toast.success("✅ Authentication successful! Please log in.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Incorrect OTP code!");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-red-100 text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Email Verification</h2>
        <p className="text-gray-600 mb-6">The 6-digit OTP has been sent: <br/> <b>{email}</b></p>
        
        <form onSubmit={handleVerify}>
          <input 
            type="text" 
            maxLength="6"
            className="w-full text-center text-3xl tracking-widest border border-gray-300 rounded-lg p-3 mb-6 focus:border-red-500 focus:outline-none font-mono"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition">
            CONFIRM
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
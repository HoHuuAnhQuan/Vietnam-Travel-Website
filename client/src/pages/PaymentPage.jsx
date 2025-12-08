import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData; // Nhận dữ liệu từ trang TourPage
  const tourInfo = location.state?.tourInfo;

  useEffect(() => {
    if (!bookingData) {
      toast.error("Order information not found!");
      navigate('/');
    }
  }, []);

  if (!bookingData || !tourInfo) return null;

  // Tạo link QR VietQR (Thay số tài khoản của bạn vào đây nếu muốn)
  // Cấu trúc: https://img.vietqr.io/image/[BANK_ID]-[ACCOUNT_NO]-[TEMPLATE].png?amount=[AMOUNT]&addInfo=[CONTENT]
  const bankId = 'MB'; // Ngân hàng MB Bank (Ví dụ)
  const accountNo = '0888827003'; // Số tài khoản (Thay bằng của bạn)
  const template = 'compact';
  const amount = bookingData.total_price;
  const description = `TOUR PAYMENT ${tourInfo.name}`;
  
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}`;

  const handleConfirmPayment = () => {
    // Ở đây thực tế sẽ gọi API kiểm tra giao dịch ngân hàng
    // Nhưng ta giả lập là đã thành công
    toast.success("🎉 Payment successful! The ticket has been sent to your email.");
    navigate('/profile'); // Chuyển về trang lịch sử đơn hàng
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* CỘT TRÁI: THÔNG TIN ĐƠN HÀNG */}
        <div className="w-full md:w-1/2 p-8 border-r border-gray-100">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-red-600 mb-6 transition">
            <ArrowLeft size={18} /> Back
          </button>
          
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">Payment information</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Tour</span>
                <span className="font-bold text-gray-800 text-right w-2/3">{tourInfo.name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Customer</span>
                <span className="font-bold text-gray-800">{bookingData.fullName}</span> {/* Lưu ý: Cần sửa TourPage để truyền cái này sang */}
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Start Day</span>
                <span className="font-bold text-gray-800">{bookingData.start_date}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Slots</span>
                <span className="font-bold text-gray-800">{bookingData.num_people} khách</span>
            </div>
            <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-gray-600">Total</span>
                <span className="text-3xl font-extrabold text-red-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
                </span>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-sm text-yellow-800">
            <p className="font-bold mb-1">⚠️ Note:</p>
            Please make the transfer with the correct content on the side so the system can process it automatically.
          </div>
        </div>

        {/* CỘT PHẢI: MÃ QR */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-red-600 to-red-800 flex flex-col items-center justify-center text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard /> Scan the code to pay
            </h3>
            
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
                <img src={qrUrl} alt="QR Code" className="w-64 h-64 object-contain" />
            </div>

            <p className="text-white/80 text-sm mb-6 text-center">
                Open your banking app or e-wallet<br/>to scan the QR code
            </p>

            <button 
                onClick={handleConfirmPayment}
                className="w-full bg-yellow-400 text-red-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition shadow-lg flex items-center justify-center gap-2"
            >
                <CheckCircle size={20} /> TRANSFER CONFIRMED
            </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;
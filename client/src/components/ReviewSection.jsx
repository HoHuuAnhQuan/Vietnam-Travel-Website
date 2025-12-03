import { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, User, Send } from 'lucide-react';

const ReviewSection = ({ tourId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));

  // Lấy danh sách review khi load
  useEffect(() => {
    fetchReviews();
  }, [tourId]);

  const fetchReviews = () => {
    axios.get(`http://localhost:5000/api/reviews/${tourId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    axios.post('http://localhost:5000/api/reviews', {
      user_id: user.user_id,
      tour_id: tourId,
      rating,
      comment
    })
    .then(() => {
      alert("Cảm ơn bạn đã đánh giá!");
      setComment("");
      setRating(5);
      fetchReviews(); // Load lại danh sách sau khi comment
    })
    .catch(() => alert("Lỗi khi gửi đánh giá"));
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-10">
      <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center gap-2">
        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" /> 
        Đánh giá ({reviews.length})
      </h2>

      {/* --- FORM VIẾT ĐÁNH GIÁ --- */}
      <div className="mb-10 bg-yellow-50 p-6 rounded-xl border border-yellow-100">
        <h3 className="font-bold text-gray-800 mb-4">Viết cảm nhận của bạn</h3>
        <form onSubmit={handleSubmit}>
          {/* Chọn sao */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition transform hover:scale-110"
              >
                <Star 
                  className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              </button>
            ))}
          </div>

          <textarea
            required
            className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-red-500 bg-white"
            rows="3"
            placeholder="Bạn thấy tour này thế nào?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <div className="text-right mt-3">
            <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition flex items-center gap-2 ml-auto">
              <Send size={16} /> Gửi đánh giá
            </button>
          </div>
        </form>
      </div>

      {/* --- DANH SÁCH REVIEW --- */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((rv) => (
            <div key={rv.review_id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                  {rv.full_name ? rv.full_name.charAt(0).toUpperCase() : <User size={20}/>}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{rv.full_name}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(rv.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(rv.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-gray-600 ml-14 bg-gray-50 p-3 rounded-lg rounded-tl-none inline-block">
                {rv.comment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center italic">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
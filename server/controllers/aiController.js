const { GoogleGenerativeAI } = require("@google/generative-ai");

// ⚠️ QUAN TRỌNG: Thay dòng này bằng API Key của bạn
const genAI = new GoogleGenerativeAI("AIzaSyAtnCBLjreYAG2zn-OP-SfVGI5O_mTpUPI");

exports.chatWithAI = async (req, res) => {
    const { message } = req.body;

    try {
        // Sử dụng model Gemini Pro (mạnh và nhanh)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Tạo ngữ cảnh (Prompt Engineering) để AI biết nó là ai
        const prompt = `
            Bạn là một hướng dẫn viên du lịch ảo chuyên về Việt Nam của trang web VietnamTravel,Bạn am hiểu về đất nước và tất cả các tỉnh thành của Việt Nam.
            Bạn am hiểu hết về lịch sử và con người văn hoá ẩm thực Việt Nam. 
            Tên bạn là "VinaBot".
            Phong cách trả lời: Thân thiện, ngắn gọn, súc tích dưới 100 từ,đúng chủ đề.
            Khi gặp những câu hỏi về du lịch ở Việt Nam, bạn sẽ tóm tắt và trả lời ngắn gọn.
            Nhiệm vụ: Chỉ trả lời các câu hỏi liên quan đến du lịch, địa điểm, ăn uống, văn hóa Việt Nam.
            Nếu ai đó hỏi vấn đề không liên quan (như code, toán học...), hãy từ chối khéo léo.
            Khách hỏi bằng tiếng nước gì thì bạn trả lời bằng tiếng đó.
            Giờ hãy trả lời Câu hỏi của khách dưới đây:
            Câu hỏi của khách: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Lỗi AI:", error);
        res.status(500).json({ reply: "Xin lỗi, hiện tại tôi đang bị quá tải. Bạn thử lại sau nhé!" });
    }
};
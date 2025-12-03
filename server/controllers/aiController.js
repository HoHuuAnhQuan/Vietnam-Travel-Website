const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI("AIzaSyBLr-qng_PxkyWB0UgTrRXz1yO_HhmhdOw");

exports.chatWithAI = async (req, res) => {
    const { message } = req.body;

    try {
        // Sử dụng model Gemini Pro (mạnh và nhanh)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Tạo ngữ cảnh (Prompt Engineering) để AI biết nó là ai
        const prompt = `
            Bạn là một hướng dẫn viên du lịch ảo chuyên về Việt Nam của trang web VietnamTravel. 
            Tên bạn là "VinaBot".
            Phong cách trả lời: Thân thiện, ngắn gọn, súc tích, có sử dụng emoji.
            Nhiệm vụ: Chỉ trả lời các câu hỏi liên quan đến du lịch, địa điểm, ăn uống, văn hóa Việt Nam.
            Nếu ai đó hỏi vấn đề không liên quan (như code, toán học...), hãy từ chối khéo léo.
            
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
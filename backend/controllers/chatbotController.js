const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ShopSphere context for personalized responses
const SHOPSPHERE_CONTEXT = `
You are ShopSphere AI Assistant, a helpful and friendly chatbot for ShopSphere e-commerce website.

**About ShopSphere:**
- We are a trusted online shopping platform in India since 2024
- We sell fashion, electronics, jewelry, home & living products
- We offer FREE shipping on orders above ₹999
- 7-day easy returns policy
- We accept UPI, Card, Net Banking, COD payments
- Customer support: +91 12345 67890 | support@shopsphere.com

**Your Role:**
- Help customers find products
- Answer questions about shipping, returns, payments
- Provide order tracking help
- Suggest products based on customer needs
- Be friendly, helpful, and concise
- If you don't know something, guide them to contact support

**Guidelines:**
- Keep responses short (2-4 sentences max)
- Use emojis occasionally to be friendly 😊
- Always mention relevant policies (shipping, returns)
- For order tracking, ask for Order ID
- For complaints, be empathetic and helpful

**Common Questions You Should Handle:**
1. Product recommendations
2. Shipping information
3. Return policy
4. Payment methods
5. Order tracking
6. Size guides
7. Delivery time
8. Account issues

Remember: You represent ShopSphere. Be professional yet friendly!
`;

// Chat function
const chatWithBot = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ 
        error: "Message is required" 
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation context
    let prompt = SHOPSPHERE_CONTEXT + "\n\n";
    
    // Add conversation history
    if (conversationHistory.length > 0) {
      prompt += "Previous conversation:\n";
      conversationHistory.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += "\n";
    }

    prompt += `Customer: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botReply = response.text();

    return res.status(200).json({
      success: true,
      reply: botReply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    return res.status(500).json({
      success: false,
      error: "Sorry, I'm having trouble connecting right now. Please try again.",
      details: error.message
    });
  }
};

module.exports = { chatWithBot };

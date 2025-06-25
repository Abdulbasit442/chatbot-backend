const express = require("express");
const cors = require("cors");
const OpenAI = require("openai"); // ✅ FIXED: CommonJS way

const app = express();
const PORT = 5000;

require('dotenv').config();

// ✅ Your actual API key goes here
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  console.log("📥 Received POST /api/chat");
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;
    console.log("✅ OpenAI reply:", reply);
    res.json({ reply }); // ✅ Matches frontend
  } catch (error) {
    console.error("❌ OpenAI error:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

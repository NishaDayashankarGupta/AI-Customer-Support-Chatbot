const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();

app.use(cors());
app.use(express.json());

// Safety check logs on startup
console.log("Checking Environment Variables...");
console.log("PORT:", process.env.PORT || "Not Defined (Will fallback to 5000)");
console.log("API KEY STATUS:", process.env.KEY ? "Valid Key Found ✅" : "Missing Key ❌");

const ai = new GoogleGenAI({ apiKey: process.env.KEY });

app.post('/ask', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Check if the message is actually arriving at the server
    console.log(`Received message request: "${message}"`);

    if (!message) {
      return res.status(400).json({ error: "Message field is missing in request body" });
    }

    // Initialize chat session
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash'
    });

    console.log("Sending request to Google Gemini API...");
    
    // Send message using the proper structured argument layout
    const response = await chat.sendMessage({ message: message });

    console.log("Response received from Gemini successfully!");

    // Send the final result back to your frontend
    res.send({
      _status: true,
      _message: 'Content Found...',
      finalData: response.text // response.text holds the string output
    });

  } catch (error) {
    console.error("Gemini API Error details:", error);
    res.status(500).json({ error: 'Failed to fetch response from Gemini', details: error.message });
  }
});

app.listen(process.env.PORT , () => {
    console.log(`Server successfully started on port ${process.env.PORT}`);
});
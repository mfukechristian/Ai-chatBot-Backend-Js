const express = require("express");
const cors = require("cors"); // Import the cors middleware
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const app = express();
const port = 3001;

const MODEL_NAME = "models/chat-bison-001";

// Replace with your actual API key or set it as an environment variable
const API_KEY = "AIzaSyC_ZAGMX6Rx8LC-asNeRFyQ5r73XimMLms";

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.use(express.json());

// Use the cors middleware with appropriate options
app.use(cors());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, server" });
});

app.post("/api/chat", async (req, res) => {
  const inputMessage = req.body.message;

  try {
    let messages = [{ content: inputMessage }];

    const result = await client.generateMessage({
      model: MODEL_NAME,
      prompt: { messages },
    });

    const response = result[0].candidates[0].content;

    messages.push({ content: response });

    // You can continue the conversation or generate more responses here if needed.

    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

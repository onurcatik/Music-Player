import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to get the API key
app.get('/api/key', (req, res) => {
  res.json({ apiKey: process.env.YOUTUBE_API_KEY });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

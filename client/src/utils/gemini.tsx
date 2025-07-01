
import axios from '@/api/axios';

export const GeminiAI = async (text: string) => {
  const api = "https://eurl-server.onrender.com/api/gemini";
  const res = await axios.post(api, {
    text,
  });
  return res.data
};

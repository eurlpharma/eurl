
import axios from '@/api/axios';

export const GeminiAI = async (text: string) => {
  const api = "https://pharma-api-e5sd.onrender.com/api/gemini";
  const res = await axios.post(api, {
    text,
  });
  return res.data
};


import axios from '@/api/axios';

export const GeminiAI = async (text: string) => {
  const api = "http://localhost:5000/api/gemini";
  const res = await axios.post(api, {
    text,
  });
  return res.data
};

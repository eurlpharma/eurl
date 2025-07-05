
import axios from '@/api/axios';

export const GeminiAI = async (text: string) => {
  const api = "http://192.168.1.11:5000/api/gemini";
  const res = await axios.post(api, {
    text,
  });
  return res.data
};

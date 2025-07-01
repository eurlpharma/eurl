import axios from "axios";

export const GeminiAI = async (text: string) => {
  const api = "http://192.168.1.2:5000/api/gemini";
  // const api = "/hacker"
  const res = await axios.post(api, {
    text,
  });
  return res.data
};

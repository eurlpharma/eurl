import axios from "axios";

const api = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

const tokenKey = "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";

export const createAIDescription = async (productName: string) => {
  try {
    const prompt = `Write a catchy product description for: ${productName} with emojis`;
    const res = await axios.post(
      api,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${tokenKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    
    const output = res.data[0]?.summary_text; 
    return output;
  } catch (err) {
    return null;
  }
};

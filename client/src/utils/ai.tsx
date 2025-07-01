import axios from "axios";

const api = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

// const api = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"

// const api = "https://api-inference.huggingface.co/models/google/flan-t5-xl"

// const api = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

// const api = "https://api-inference.huggingface.co/models/google/flan-t5-small";


const tokenKey = "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";

export const createAIDescription = async (productName: string) => {
  try {
    // const prompt = `Write a short product description for: ${productName}`;
    // const prompt = `اكتب وصفًا بالعربية لمنتج: ${productName}`;
    // const prompt = `اكتب وصفًا طويلا تسويقيًا جذابًا لمنتج "${productName}" باستخدام الإيموجي والتنسيق الإبداعي 🌟.`;
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
    console.error("Error generating description:", err);
    return null;
  }
};

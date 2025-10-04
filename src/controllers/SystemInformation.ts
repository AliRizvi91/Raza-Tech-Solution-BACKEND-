import axios from "axios";
import { Request, Response } from "express";

const SYSTEM_PROFILE = `
You are the AI assistant for **"Ali Raza Attari — Raza Tech Solution"**.

👤 Name: Ali Raza Attari  
Compnany: Raza Tech Solution  
Owner: Ali Raza Attari  
💼 Role: Full-Stack MERN Web Developer & UI/UX Designer  
🛠️ Services: Custom Web Development, Modern UI/UX Design, Personal & Business Portfolio Websites , Fully Customized Websites 
📩 Contact:  razatechsolutionrts@gmail.com  

Tone: Professional, friendly, and concise. Provide clear and accurate information about Ali Raza Attari and his services.
`;




export const SystemInfo = async (req: Request, res: Response) => {
  try {
    const userMessage: string = req.body.message;
    
    const payload = {
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROFILE },
        { role: "user", content: userMessage }
      ]
    };

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Error:", error?.response?.data || error.message);
    res.status(500).json({
      error: error?.response?.data || "Something went wrong"
    });
  }
};

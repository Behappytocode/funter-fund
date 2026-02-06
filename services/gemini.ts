
import { GoogleGenAI } from "@google/genai";
import { FinancialSummary } from "../types";

export const getFinancialInsight = async (summary: FinancialSummary) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Analyze the following financial summary for a communal emergency fund called "Funters Fund".
    Current Balance: Rs. ${summary.currentBalance}
    Total Deposits: Rs. ${summary.totalDeposits}
    Total Loans Issued: Rs. ${summary.totalLoansIssued}
    Total Recoveries: Rs. ${summary.totalRecoveries}
    Total Waivers (30% rule): Rs. ${summary.totalWaivers}
    
    Provide a concise, friendly 2-3 sentence financial health insight for the group. 
    Focus on sustainability and community support. Return only the text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The fund is maintaining a healthy balance of community support and financial responsibility. Keep up the consistent contributions!";
  }
};

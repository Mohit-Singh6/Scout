import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function analyzeErrorLog(statusCode: number, errorPayload: string) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY inside environment configuration parameters.");
    }

    // Request a chat completion chunk frame from Groq's high-speed inference engine
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an elite Site Reliability Engineer (SRE) assistant built into an uptime monitoring tool.
          Your task is to analyze raw web server network errors and trace root causes instantly.
          
          CRITICAL INSTRUCTIONS:
          1. Provide your diagnosis in EXACTLY ONE direct, clear, and professional sentence.
          2. Do NOT write any conversational intros or filler text (e.g., do NOT say "Sure, here is the error:").
          3. Strip away any raw HTML script boilerplate noise present in the log and target the underlying problem.
          4. Suggest the single most likely action item for the developer to fix it.`
        },
        {
          role: "user",
          content: `The monitored route threw a failure check. 
          HTTP Status Code: ${statusCode}
          Raw Error Input Payload Stack: 
          """
          ${errorPayload}
          """`
        }
      ],
      // Lower temperature makes the model strictly follow constraints and act less creative
      temperature: 0.1, 
      max_tokens: 100,
    });

    // Return the clean, single-sentence string response text
    return {
      analysis: chatCompletion.choices[0]?.message?.content || "Unable to parse error diagnostics."
    };

  } catch (error) {
    console.error("Groq AI Inference Failure:", error);
    return { error: "Failed to generate AI diagnostic report." };
  }
}
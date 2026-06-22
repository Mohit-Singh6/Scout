"use server";

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
          content: `You are an elite automated Site Reliability Engineer (SRE) alert system. 
      Your task is to translate raw HTTP error codes and logs into a single, ultra-concise, natural human sentence for a developer dashboard.
      
      STRICT FORMATTING RULE:
      1. Limit your response to a maximum of 20 words total.
      2. Write like a real developer diagnosing a problem, not a computer log. 
      3. Never use generic filler phrases like "This error indicates...", "Status code text", or "Wrapper configuration".
      4. State the precise issue immediately followed by a direct action item.
      
      Examples of BAD robotic output:
      - "Route returned client failure status code text. Verify API endpoint configuration."
      - "HTTP 500 error stack trace detected. Check server script parameters."
      
      Examples of GOOD human developer output:
      - 404 Not Found. Verify the route endpoint URL path is registered.
      - 401 Unauthorized. Access token is missing or expired. Check headers.
      - 500 Internal Error. Database connection failed. Restart your database instance.`
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

    console.log("Received ai summary: ", chatCompletion.choices[0]?.message?.content || "Unable to parse error diagnostics.")

    // Return the clean, single-sentence string response text
    return {
      analysis: chatCompletion.choices[0]?.message?.content || "Unable to parse error diagnostics."
    };

  } catch (error) {
    console.error("Groq AI Inference Failure:", error);
    return { error: "Failed to generate AI diagnostic report." };
  }
}
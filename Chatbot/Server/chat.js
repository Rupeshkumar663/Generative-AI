import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import dotenv from 'dotenv'
import NodeCache from "node-cache";
dotenv.config();
const tvly = tavily({ apiKey:process.env.TAVILY_API_KEY });
const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

const myCache = new NodeCache({stdTTL:60*60*24});


export async function generate(userMessages,threadId){
    const baseMessages=[
            {
                role:'system',
                content: `You are a smart personal assistant.
                Your goal is to provide accurate, clear, and helpful answers.
                Instructions:
                - If you know the answer from general knowledge, answer directly in plain English.
                - If the question requires real-time, local, recent, or constantly changing information, use the available tools to retrieve the information before answering.
                - If you are unsure of an answer, use the available tools instead of guessing.
                - After receiving information from a tool, provide a natural language response to the user.
                - Never invent or hallucinate current information.
                - Never describe, print, or simulate tool calls.
                - Never output XML tags, JSON, or function call syntax.
                - Use the tool interface provided by the system whenever a tool is required.
                - Do not mention that you used a tool unless the user specifically asks.
            Examples:
              User: What is the capital of France?
              Assistant: The capital of France is Paris.
              User: Who invented the telephone?
              Assistant: Alexander Graham Bell is widely credited with inventing the telephone.
              User: What is 245 × 37?
              Assistant: 245 × 37 = 9065.
              User: Who is the CEO of Google?
              Assistant: Sundar Pichai is the CEO of Google.
              User: What is the weather in Mumbai right now?
              Assistant: Retrieve the latest weather information and answer naturally.
              User: Tell me today's IPL points table.
              Assistant: Retrieve the latest IPL points table and summarize it.
              User: Give me the latest IT news.
              Assistant: Retrieve the latest IT news and summarize it.
              User: What is the current USD to INR exchange rate?
              Assistant: Retrieve the latest exchange rate and answer naturally.
              Current UTC Date and Time:${new Date().toUTCString()}
              `     
             }
    
          ]
        const messages=cache.get(threadId)?? baseMessages
            messages.push({
                role:'user',
                content:question,
            })
           while(true){
        const completion=await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        messages:messages,
          tools:[
            {
              "type": "function",
              "function": {
                "name": "webSearch",
                 "description": "Search the latest information and realtime data on the internet.",
                 "parameters": {
                  // JSON Schema object
                  "type": "object",
                  "properties":{
                     query:{
                        "type": "string",
                        "description": "The search query to perform search on."
                       },
                   },
                "required": ["query"]
              }
            }
         }
        ],
        tool_choice:'auto',
      });
       messages.push(completion.choices[0].message)
      const toolcalls=completion.choices[0].message.tool_calls
      if(!toolcalls){
        cache.set(threadId,messages)
        return completion.choices[0].message.content;
     }
     for(const tool of toolcalls){
    
    const functionName=tool.function.name;
    const functionParams=JSON.parse(tool.function.arguments);
    let toolResult = "";
    if (functionName ==="webSearch") {
         toolResult=await webSearch(functionParams);
    }
    messages.push({
        tool_call_id:tool.id,
        role:'tool',
        name:functionName,
        content:toolResult,
     });
   }
  }
}


//Tool-Calling or function calling
async function webSearch({query}){
    console.log('calling web Search on...')
    const response=await tvly.search(query);
     const finalResult=response.results.map((result)=>result.content).join('\n\n');
      return finalResult;
    
}


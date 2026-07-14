
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import dotenv from 'dotenv'
dotenv.config();
const tvly = tavily({ apiKey:process.env.TAVILY_API_KEY });
const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

export async function generate(question){
   
    const messages=[
            {
                role:'system',
                content:`you are a smart personal assistant who answers the questions.
                you have access to follwong tools:
                1.searchWeb({query}:{query:string})//search the latest information and realtime data on the internet.
                current datetime: ${new Date().toString()}
              `        
            }
    
          ]

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


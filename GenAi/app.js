/*
import Groq from "groq-sdk";

const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){//talk with llm-model,message-kya baat krna hai
    const completion=await groq.chat.completions.create({//chat is a Api.//completions-Answer generate krana.

        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:'user',
                content:'Hi'
            }
    ]})
    console.log(completion.choices[0].message.content)
}
main()
*/
/*
import Groq from "groq-sdk";

const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){
    const completion=await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:'system',
                content:'you are jarvis, a smart personal assistant'
            },
            {
                role:'user',
                content:'Hi'
            }
    ]})
    console.log(completion.choices)
}
main()
*/
/*
import Groq from "groq-sdk";

const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){
    const completion=await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:'system',
                content:`you are jarvis, your task is to analyse given review and return sentiment. 
                         Classify the review as positive, neutral or negative.
                         Output must be a single word.`
            },
            {
                role:'user',
                content:`Review:
                         These headphones arrived quickly and look great, but the left earcup stopped working after a week.`
            }
    ]})
    console.log(completion.choices[0])
}
main()

*/
/*
import Groq from "groq-sdk";

const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){
    const completion=await groq.chat.completions.create({
        //temperature:1,
        //top_p:0.2,
        //stop:'ga',//negative
        //max_completion_tokens:100,
        //frequency_penalty:1,
        //presence_penalty:1,
        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:'system',
                content:`you are jarvis, your task is to analyse given review and return sentiment. 
                         Classify the review as positive, neutral or negative.
                         Output must be a single word.`
            },
            {
                role:'user',
                content:`Review:
                         These headphones arrived quickly and look great, but the left earcup stopped working after a week.`
            }
    ]})
    console.log(completion.choices[0].message.content)
}
main()




*/
/*
 Classify the review as positive, neutral or negative.
Output must be a single word.

Review:
These headphones arrived quickly and look great,
but the left earcup stopped working after a week.

Sentiment:
*/

/*
import Groq from "groq-sdk";

const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){
    const completion=await groq.chat.completions.create({
        //temperature:1,
        //top_p:0.2,
        //stop:'ga',//negative
        //max_completion_tokens:100,
        //frequency_penalty:1,
        //presence_penalty:1,
        response_format:{"type":"json_object"},//it is a parameter which considered as an object
        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:'system',
                content:`you are jarvis, your task is to analyse given review and return sentiment.  Classify the review as positive, neutral or negative.you must return response in valid JSON structure.
                example:{"sentiment":"Positive"}
                `
            },
            {
                role:'user',
                content:`Review:
                         These headphones arrived quickly and look great, but the left earcup stopped working after a week.`
            }
    ]})
    console.log(JSON.parse(completion.choices[0].message.content))
}
main()



 */
/*
import Groq from "groq-sdk";

const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){
    const completion=await groq.chat.completions.create({
        //temperature:1,
        //top_p:0.2,
        //stop:'ga',//negative
        //max_completion_tokens:100,
        //frequency_penalty:1,
        //presence_penalty:1,
        response_format:{"type":"json_object"},//it is a parameter which considered as an object
        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:'system',
                content:`You are an interview grader assistant. Your task is to generate candidate evaluation score.
                         Output must be following JSON structure:

                       {
                          "confidence": number (1-10 scale),
                          "accuracy": number (1-10 scale),
                          "pass": boolean (true or false)
                       }

                   The response must:
                     1. Include ALL fields shown above
                     2. Use only the exact field names shown
                     3. Follow the exact data types specified
                     4. Contain ONLY the JSON object and nothing else
                        `
            },
            {
                role:'user',
                content:`Q: What does === do in JavaScript?
                        A: It checks strict equality—both value and type must match.

                        Q: How do you create a promise that resolves after 1 second?
                        A: const p = new Promise(r => setTimeout(r, 1000));

                        Q: What is hoisting?
                        A: JavaScript moves declarations (but not initializations) to the top of their scope before code runs.

                        Q: Why use let instead of var?
                        A: let is block-scoped, avoiding the function-scope quirks and re-declaration issues of var.`
            }
    ]})
    console.log(JSON.parse(completion.choices[0].message.content))
}
main()

 */
/*
import Groq from "groq-sdk";
const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){
    const completion=await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:'system',
                content:`you are a smart personal assistant
                `        
            },
            {
                role:'user',
                content:`when was Iphone 16 launched?.`
            }
          ],
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
    const toolcalls=completion.choices[0].message.tool_calls//is line se pta chalta hai ki LLm ne model use kiya hai ya nhi
    if(!toolcalls){
        console.log(`Assistant: ${completion.choices[0].message.content}`);
        return;
    }

   for(const tool of toolcalls){//toolsCalls:[t1,t2,t3,t4]
    console.log("Tool:",tool);
    const functionName=tool.function.name;//websearch
    const functionParams=JSON.parse(tool.function.arguments);
    if (functionName ==="webSearch") {
        const toolResult=await webSearch(functionParams);
        console.log("Tool Result:",toolResult);
    }
  }
   //console.log(JSON.stringify(completion.choices[0].message,null,2))

}
main()

//Tool-Calling or function calling
async function webSearch({query}){
    console.log('calling web Search on...')
    return `Iphone 16 was launched on 20 september 2024.`
}


*/
/*
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
const tvly = tavily({ apiKey:process.env.TAVILY_API_KEY });
const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){
    const completion1=await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        temperature:0,
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
    messages.push(completion1.choices[0].message)
    const toolcalls=completion1.choices[0].message.tool_calls//is line se pta chalta hai ki LLm ne model use kiya hai ya nhi
    if(!toolcalls){
        console.log(`Assistant: ${completion1.choices[0].message.content}`);
        return;
    }

   for(const tool of toolcalls){//toolsCalls:[t1,t2,t3,t4]
    console.log("Tool:",tool);
    const functionName=tool.function.name;//websearch
    const functionParams=JSON.parse(tool.function.arguments);
    let toolResult = "";
    if (functionName ==="webSearch") {
         toolResult=await webSearch(functionParams);
        console.log("Tool Result:",toolResult);
    }
    messages.push({
        tool_call_id:tool.id,
        role:'tool',
        name:functionName,
        content:toolResult,
    });
  }
    
}
main()

//Tool-Calling or function calling
async function webSearch({query}){
    console.log('calling web Search on...')
   const response = await tvly.search(query);
   console.log('Response',response)
   //const finalResult=response.results.map((result)=>result.content).join('\n\n');
   //console.log('finalResult:',finalResult)
}
*/

import readline from 'node:readline/promises'
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
const tvly = tavily({ apiKey:process.env.TAVILY_API_KEY });
const groq=new Groq({ apiKey:process.env.GROQ_API_KEY });

async function main(){
    const rl=readline.createInterface({input:process.stdin,output:process.stdout})
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
       while(true){
            const question=await rl.question('you: ')
            //bye
            if(question=== 'bye'){
                break;
            }
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
      const toolcalls=completion.choices[0].message.tool_calls//is line se pta chalta hai ki LLm ne model use kiya hai ya nhi
      if(!toolcalls){
        console.log(`Assistant: ${completion.choices[0].message.content}`);
        break;
     }

     for(const tool of toolcalls){//toolsCalls:[t1,t2,t3,t4]
    //console.log("Tool:",tool);
    const functionName=tool.function.name;//websearch
    const functionParams=JSON.parse(tool.function.arguments);
    let toolResult = "";
    if (functionName ==="webSearch") {
         toolResult=await webSearch(functionParams);
        //console.log("Tool Result:",toolResult);
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
    rl.close();
}
main()

//Tool-Calling or function calling
async function webSearch({query}){
    console.log('calling web Search on...')
    const response=await tvly.search(query);
     //console.log('Response',response)
     const finalResult=response.results.map((result)=>result.content).join('\n\n');
      return finalResult;
    
}


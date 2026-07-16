import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import { generate } from "./chat.js";

dotenv.config();
const app=express();
const PORT=process.env.PORT 
app.use(cors());
app.use(express.json());
app.post('/chat',async(req,res)=>{
        const {message,threadId}=req.body;
        
        const result=await generate(message,threadId)
        
})
app.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`);
})
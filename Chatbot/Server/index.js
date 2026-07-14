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
        const {message}=req.body;
        console.log('Message',message);
           const result=await generate(message)
        res.json({message:result})
})
app.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`);
})
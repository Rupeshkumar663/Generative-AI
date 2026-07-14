import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";

function App(){
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const chatRef=useRef(null);
  const textareaRef=useRef(null);
  useEffect(()=>{
    if(chatRef.current){
      chatRef.current.scrollTop=chatRef.current.scrollHeight;
    }
  },[messages,loading]);

  const handleResize=(e)=>{
    e.target.style.height="0px";
    const height=Math.min(e.target.scrollHeight,120);
    e.target.style.height=`${height}px`;
    e.target.style.overflowY=e.target.scrollHeight>120?"auto":"hidden";
  };

  const generate=async(text)=>{
  const updatedMessages=[...messages,
    {
      role:"user",
      content: text,
    },
  ];
  setMessages(updatedMessages);
  setInput("");

  if(textareaRef.current){
    textareaRef.current.style.height="24px";
    textareaRef.current.style.overflowY="hidden";
  }
  setLoading(true);
  try {
    const response=await fetch("http://localhost:3000/chat",{method: "POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message:text, }),
    });
    const result=await response.text();
    let data;
    try {
      data=JSON.parse(result);
    } catch {
      throw new Error(result);
    }
    if(!response.ok){
      throw new Error(data.message || "Server Error");
    }

    setMessages([
      ...updatedMessages,
      {
        role:"assistant",
        content:data.message,
      },
    ]);
  } catch(err){
    console.error(err);
    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content: err.message || "Something went wrong.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  const handleSend=()=>{
    const text=input.trim();
    if(!text || loading) 
      return;
    generate(text);
  };
  const handleEnter=(e)=>{
    if(e.key==="Enter" && !e.shiftKey){
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="h-screen bg-[#212121] text-white flex flex-col">
      {/* Chat */}
      <div ref={chatRef} className="flex-1 overflow-y-auto pb-40">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length===0?(
            <div className="flex h-[70vh] items-center justify-center">
              <h1 className="text-4xl font-semibold text-gray-400 text-center">What can I help with?</h1>
            </div>
          ):(
            <>
              {messages.map((msg,index)=>(
                <div key={index} className={`flex mb-5 ${msg.role === "user"? "justify-end": "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap break-words leading-7 ${ msg.role === "user" ? "bg-[#444654]": "bg-[#303030]"}`}>{msg.content}</div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#303030] rounded-2xl px-4 py-3 animate-pulse">Thinking...</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 w-full bg-[#212121] pb-5">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-3xl border border-neutral-700 bg-[#303030] px-4 py-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              placeholder="Ask Anything"
              onChange={(e) => setInput(e.target.value)}
              onInput={handleResize}
              onKeyDown={handleEnter}
              className="w-full resize-none bg-transparent outline-none text-white placeholder:text-gray-400"
              style={{minHeight:"24px",maxHeight:"120px"}}
            />
            <div className="flex justify-end mt-3">
              <button  onClick={handleSend}  disabled={loading} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-300 disabled:opacity-50">
                <IoSend size={18} />
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-3"> AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
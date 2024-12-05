import { createContext, useState } from "react";
import runChat from "../config/gemini";
export const Context = createContext();

const ContextProvider =(props) =>{

    const [input, setInput]=useState("");
    const [recentPromt, setRecentPromt]=useState("");
    const [prevPromts, setPrevPromts] = useState([]);
    const [showResult,setShowResult]=useState(false);
    const [loading, setLoading]=useState(false);
    const [resultData,setResultData]=useState("");

    const delayPara = (index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev => prev+nextWord)
        },75*index);
    }
    const newChat  = ()=>{
        setLoading(false);
        setShowResult(false);
    }
    const onSent = async (promt)=>{
        setResultData("");
        setLoading(true);
        setShowResult(true);
       
        let responce;
        if(promt !== undefined){
            responce = await runChat(promt);
            setRecentPromt(promt);
        }
        else{
            setPrevPromts(prev=>[...prev,input]);
            setRecentPromt(input);
            responce = await runChat(input);
        }
        
        let responceArray = responce.split("**");
        let newResponce="";
        for (let i = 0; i < responceArray.length; i++) {
          if (i == 0 || i % 2 !== 1) {
            newResponce += responceArray[i];
          } else {
            newResponce += "<b>" + responceArray[i] + "</b>";
          }
        }
        let newResponce2 = newResponce.split("*").join("</br>");
        let newResponceArray = newResponce2.split(" ");
        for(let i=0;i<newResponceArray.length;i++){
            const nextWord = newResponceArray[i];
            delayPara(i,nextWord+" ");
        }
        // setResultData(newResponce2);
        // setResultData(responce);
        setLoading(false);
        setInput("");
    }
    
    const contextValue = {
      prevPromts,
      setPrevPromts,
      onSent,
      setRecentPromt,
      recentPromt,
      showResult,
      loading,
      input,
      resultData,
      setInput,
      newChat
      
    };
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
import { Dispatch,SetStateAction } from "react";
import {type ApiMessageType } from "../models/ApiMessageType";
import {type MessageType } from "../models/MessageType";
import { ModelType } from "../models/ModelType";

type propsType = {
    GPTModel:ModelType,
    chatMessages:MessageType[],
    setMessages: Dispatch<SetStateAction<MessageType[]>>
    setTyping:(typing:boolean)=>void
}

const API_KEY = import.meta.env.VITE_API_KEY;

export async function processMessageToChatGPT({GPTModel,chatMessages,setMessages,setTyping}: propsType) {
    let apiMessages: ApiMessageType[] = chatMessages.map((messageObject) => {
      let role: "assistant" | "user" | "" = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });


    // const systemMessage: ApiMessageType = {
    //   role: "system",
    //   content: "odpowiadaj zawsze po polsku",
    // };

    const apiRequestBody = {
      model: GPTModel,
      messages: [...apiMessages],
      //messages: [systemMessage,...apiMessages]
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        
        setMessages((messages) => {
                  const gptMessage: MessageType = {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT",
                    direction: "incoming",
                    position: "normal",
                  };
                  const newMessages = [...messages, gptMessage];
                  return newMessages;
                });
    
        setTyping(false);
      });
  }


    // Here are some helpful rules of thumb for understanding tokens in terms of lengths:
    // 1 token ~= 4 chars in English
    // 1 token ~= ¾ words
    // 100 tokens ~= 75 words
    // Or
    // 1-2 sentence ~= 30 tokens
    // 1 paragraph ~= 100 tokens
    // 1,500 words ~= 2048 tokens
    // To get additional context on how tokens stack up, consider this:
    // Wayne Gretzky’s quote "You miss 100% of the shots you don't take" contains 11 tokens.
    // OpenAI’s charter contains 476 tokens.
    // The transcript of the US Declaration of Independence contains 1,695 tokens.

    // GPT-4o New
    // Our fastest and most affordable flagship model
    //  Text and image input, text output
    //  128k context length
    //  Input: $5 | Output: $15*

    // GPT-4 Turbo
    // Our previous high-intelligence model
    //  Text and image input, text output
    //  128k context length
    //  Input: $10 | Output: $30*

    // GPT-3.5 Turbo
    // Our fast, inexpensive model for simple tasks
    //  Text input, text output
    //  16k context length
    //  Input: $0.50 | Output: $1.50*

    // * prices per 1 million tokens

    
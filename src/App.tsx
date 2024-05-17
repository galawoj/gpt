import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "./App.css";
import { type MessageDirection } from "@chatscope/chat-ui-kit-react/src/types/unions";

type MessageType = {
  message: string;
  sender: "ChatGPT" | "user";
  direction: MessageDirection;
  position: "single" | "first" | "normal" | "last" | 0 | 1 | 2 | 3;
};

type ApiMessageType = {
  content: string;
  role: "assistant" | "user" | "system";
};

function App() {
  const [typing, setTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT",
      direction: "incoming",
      position: "first",
    },
  ]);
  const handleSend = async (message: string) => {
    const newMessage: MessageType = {
      message: message,
      sender: "user",
      direction: "outgoing",
      position: "normal",
    };

    const newMessages: MessageType[] = [...messages, newMessage];

    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages: MessageType[]) {
    let apiMessages: ApiMessageType[] = chatMessages.map((messageObject) => {
      let role: "assistant" | "user" | "" = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage: ApiMessageType = {
      role: "system",
      content: "odpowiadaj zawsze po polsku",
    };

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

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer ",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data.choices[0].message.content);
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

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                typing ? <TypingIndicator content="ChatGPT is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;

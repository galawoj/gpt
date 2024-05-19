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

import { type MessageType } from "./models/MessageType";
import { type ModelType } from "./models/ModelType";
import SelectSmall from "./components/SelectSmall";
import { processMessageToChatGPT } from "./utils/ProcessMessageToChatGPT";

function App() {
  const [GPTModel, setGPTModel] = useState<ModelType>("gpt-3.5-turbo");
  const [typing, setTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT",
      direction: "incoming",
      position: "first",
    },
  ]);

  function handleChangeModel(model: ModelType) {
    setGPTModel(model);
  }

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
    await processMessageToChatGPT({
      GPTModel,
      chatMessages: newMessages,
      setMessages,
      setTyping,
    });
  };

  return (
    <>
      <div style={{ position: "relative", height: "80vh", width: "700px" }}>
        <SelectSmall onChangeModel={handleChangeModel} />
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
    </>
  );
}

export default App;

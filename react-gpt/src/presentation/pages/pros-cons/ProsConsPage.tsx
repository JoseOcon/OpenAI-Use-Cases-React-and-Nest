import React, { useState } from "react";
import {
  ChatGptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import { prosConsDiscusserUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {
  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const { message } = await prosConsDiscusserUseCase(text);

    setMessages((prev) => [...prev, { text: message, isGpt: true }]);

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatGptMessage text="Hola, puedes escribir lo quieras que compare para darte mis puntos de vista." />

          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <ChatGptMessage key={index} text={text} />
            ) : (
              <MyMessage key={index} text={text} />
            )
          )}

          {isLaoding && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas comparar..."
        disableCorrections
      />
    </div>
  );
};

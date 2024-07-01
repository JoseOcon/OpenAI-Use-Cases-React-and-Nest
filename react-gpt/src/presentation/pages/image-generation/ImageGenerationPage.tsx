import React, { useState } from "react";
import {
  ChatGptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  ChatGptImageMessage,
} from "../../components";
import { imageGenerationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text);
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se pudo generar la imagen.", isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          alt: imageInfo.alt,
          imageUrl: imageInfo.url,
        },
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatGptMessage text="¿Qué imagen deseas generar hoy?" />

          {messages.map(({ text, isGpt, info }, index) =>
            isGpt ? (
              info ? (
                <ChatGptImageMessage
                  key={index}
                  imageUrl={info.imageUrl}
                  alt={info.alt}
                />
              ) : (
                <ChatGptMessage key={index} text={text} />
              )
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
        placeholder="Escribe aquí la imagen que deseas generar..."
        disableCorrections
      />
    </div>
  );
};

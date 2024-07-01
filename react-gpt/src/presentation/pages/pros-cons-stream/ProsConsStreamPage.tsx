import React, { useRef, useState } from "react";
import {
  ChatGptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import {
  prosConsDiscusserStreamGeneratorUseCase,
  // prosConsDiscusserStreamUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    if (isRunning) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    isRunning.current = true;
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const stream = prosConsDiscusserStreamGeneratorUseCase(
      text,
      abortController.current.signal
    );
    setIsLoading(false);

    setMessages((messages) => [...messages, { text: "", isGpt: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[messages.length - 1].text = text;
        return newMessages;
      });
    }

    isRunning.current = false;

    // const reader = await prosConsDiscusserStreamUseCase(text);
    // if (!reader) return alert("No se pudo generar el reader.");

    // const decoder = new TextDecoder();
    // let message = "";
    // setMessages((messages) => [...messages, { text: message, isGpt: true }]);

    // while (true) {
    //   const { done, value } = await reader.read();

    //   if (done) break;

    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   message += decodedChunk;

    //   setMessages((messages) => {
    //     const newMessages = [...messages];
    //     newMessages[messages.length - 1].text = message;
    //     return newMessages;
    //   });
    // }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatGptMessage text="¿Qué deseas comparar hoy?" />

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
        placeholder="Escribe aquí lo que deseas verificar..."
        disableCorrections
      />
    </div>
  );
};

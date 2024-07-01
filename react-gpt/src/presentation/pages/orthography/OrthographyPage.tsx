import React, { Fragment, useState } from "react";
import {
  ChatGptMessage,
  ChatGptOrthographyMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { orthographyUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  };
  isError?: boolean;
}

export const OrthographyPage = () => {
  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const { ok, errors, message, userScore } = await orthographyUseCase(text);

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "No se pudo realizar la correción.",
          isGpt: true,
          isError: true,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          isGpt: true,
          isError: false,
          info: {
            userScore,
            message,
            errors,
          },
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatGptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correciones." />

          {messages.map(({ text, isGpt, isError, info }, index) =>
            isGpt ? (
              <Fragment key={index}>
                {isError ? (
                  <ChatGptMessage text={text} />
                ) : (
                  <ChatGptOrthographyMessage {...info!} />
                )}
              </Fragment>
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

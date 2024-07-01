import React, { Fragment, useState } from "react";
import {
  ChatGptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
  ChatGptAudioMessage,
} from "../../components";
import { textToAudioyUseCase } from "../../../core/use-cases";

const disclaimer = `## ¿Qué audio deseas generar hoy?
_Ten en cuenta que todo el audio generado es por IA._
`;

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: "text";
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audioUrl: string;
  type: "audio";
}

type Message = TextMessage | AudioMessage;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
];

export const TextToAudioPage = () => {
  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, voice: string) => {
    if (text && voice) {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text, isGpt: false, type: "text" }]);

      const { ok, message, audioUrl } = await textToAudioyUseCase(text, voice);
      setIsLoading(false);

      if (!ok) {
        setMessages((prev) => [
          ...prev,
          { text: message, isGpt: true, type: "text" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: `# Voz: ${voices.find(( ({ id }) => id === voice ))!.text}\nMensaje: ${message}`,
            isGpt: true,
            audioUrl: audioUrl!,
            type: "audio",
          },
        ]);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatGptMessage text={disclaimer} />

          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === "audio" ? (
                <ChatGptAudioMessage key={index} {...message} />
              ) : (
                <ChatGptMessage key={index} {...message} />
              )
            ) : (
              <MyMessage key={index} {...message} />
            )
          )}

          {isLaoding && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        disableCorrections
        options={voices}
        placeholder="Escribe el texto que deseas escuchar aquí..."
        selectPlaceHolder="Seleeciona una voz"
      />
    </div>
  );
};

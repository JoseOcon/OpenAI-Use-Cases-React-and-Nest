import React, { useState } from "react";
import {
  ChatGptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxFile,
} from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {
  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const resp = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);

    if (!resp) {
      setMessages((prev) => [
        ...prev,
        { text: "No se pudo realizar la transcripción", isGpt: true },
      ]);
    } else {
      const gptMessage = `
# Transcripción 
__Duración:__ ${Math.round(resp.duration)} seg.\n
__*El texto es:*__\n
${resp.text}
`;
      setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);

      for (const segment of resp.segments) {
        const segmentText = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} seg:__\n
${segment.text}
`;
        setMessages((prev) => [...prev, { text: segmentText, isGpt: true }]);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatGptMessage text="Seleciona un archivo para realizar su transcripción y si así lo deseas puedes agregar especificaciones para la misma." />

          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <ChatGptMessage key={index} text={text} />
            ) : (
              <MyMessage key={index} text={text === '' ? 'Transcribe el audio' : text} />
            )
          )}

          {isLaoding && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBoxFile
        onSendMessage={handlePost}
        accept="audio/*"
        placeholder="Agrega especificaciones aquí..."
        isMessageRequired={false}
      />
    </div>
  );
};

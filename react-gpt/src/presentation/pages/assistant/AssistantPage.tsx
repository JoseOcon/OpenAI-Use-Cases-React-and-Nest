import React, { useEffect, useState } from "react";
import {
  ChatGptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import {
  creteThreadUseCase,
  postQuestionUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string>();

  // Obtener thread y/o crearlo
  useEffect(() => {
    const threadId = localStorage.getItem("threadId");

    if (threadId) {
      setThreadId(threadId);
    } else {
      creteThreadUseCase().then((id) => {
        setThreadId(id);
        localStorage.setItem("threadId", id);
      });
    }
  }, []);

  const handlePost = async (text: string) => {
    if (!threadId) return;
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const replies = await postQuestionUseCase(threadId, text);
    setIsLoading(false);

    for (const reply of replies) {
      for (const meessage of reply.content) {
        setMessages( (prev) => [
          ...prev,
          { text: meessage, isGpt: reply.role === "assistant", info: reply },
        ]);
      }
    }
  };

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [
        ...prev,
        { text: `ID del thread: _${threadId}_`, isGpt: true },
      ]);
    }
  }, [threadId]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatGptMessage text="Hola soy Sam tu asistente ¿En qué te puedo ayudar?" />

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
        placeholder="Escribe aquí tu consulta..."
        disableCorrections
      />
    </div>
  );
};

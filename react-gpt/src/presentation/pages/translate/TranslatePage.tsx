import React, { useEffect, useState } from "react";
import {
  ChatGptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
} from "../../components";
import { Language } from "../../../interfaces";
import { translateUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const TranslatePage = () => {
  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const getLanguages = async () => {
      const url =
        "https://api-b2b.backenster.com/b1/api/v3/getLanguages?platform=api&code=en_GB";
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `${import.meta.env.VITE_LANGUAGE_API_TOKEN}`,
        },
      };

      try {
        const response = await fetch(url, options);
        const data = (await response.json()).result as Language[];
        setLanguages(data);
      } catch (error) {
        console.error(error);
      }
    };

    getLanguages();
  }, []);

  const handlePost = async (text: string, lang: string) => {
    if (lang && text) {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text, isGpt: false }]);
  
      const { message } = await translateUseCase(text, lang);
      setMessages((prev) => [...prev, { text: message, isGpt: true }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatGptMessage text="Hola, ingresa el texto que deseas traducir así como el lenguaje al que desear traducir." />

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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        disableCorrections
        options={[
          ...languages
            .map((lang) => ({
              id: lang.englishName,
              text: lang.englishName,
            }))
            .filter((lang) => !lang.text.includes("Spanish")),
        ]}
        placeholder="Escribe el texto a traducir aquí..."
        selectPlaceHolder="Seleeciona el languaje al que deseas traducirlo"
      />
    </div>
  );
};

import React, { Fragment, useState } from "react";
import {
  ChatGptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  ChatGptImageMessage,
  ChatGptSelectableImageMessage,
} from "../../components";
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLaoding, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: "Imagen base",
      info: {
        alt: "Imagen base",
        imageUrl:
          "http://localhost:3000/gpt/image-generation/1719791039141.png",
      },
    },
  ]);

  const [originalAndMaskImage, setOriginalAndMaskImage] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);
    const resp = await imageVariationUseCase(originalAndMaskImage.original!);
    setIsLoading(false);

    if (!resp) return;

    setMessages((prev) => [
      ...prev,
      {
        text: "Variación",
        isGpt: true,
        info: {
          alt: resp.alt,
          imageUrl: resp.url,
        },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const { original, mask } = originalAndMaskImage;

    const imageInfo = await imageGenerationUseCase(text, original, mask);
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
    <Fragment>
      {originalAndMaskImage.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            className="border rounded-xl w-36 h-36 object-contain"
            src={originalAndMaskImage.mask ?? originalAndMaskImage.original}
            alt="Imagen Original"
          />
          <button className="btn-primary mt-2" onClick={handleVariation}>
            Generar variación
          </button>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenida */}
            <ChatGptMessage text="¿Qué imagen deseas generar hoy?" />

            {messages.map(({ text, isGpt, info }, index) =>
              isGpt ? (
                info ? (
                  <ChatGptSelectableImageMessage
                    onImageSelected={(maskUrl) =>
                      setOriginalAndMaskImage({
                        original: info.imageUrl,
                        mask: maskUrl,
                      })
                    }
                    key={index}
                    imageUrl={info.imageUrl}
                    alt={info.alt}
                  />
                ) : (
                  // <ChatGptImageMessage
                  //   onImageSelected={(url) =>
                  //     setOriginalAndMaskImage({
                  //       original: url,
                  //       mask: undefined,
                  //     })
                  //   }
                  //   key={index}
                  //   imageUrl={info.imageUrl}
                  //   alt={info.alt}
                  // />
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
    </Fragment>
  );
};

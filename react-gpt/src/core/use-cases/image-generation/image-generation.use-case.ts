import { ImageGenerationResponse } from "../../../interfaces";

interface Image {
  url: string;
  alt: string;
}

type GeneratedImage = Image | null;

export const imageGenerationUseCase = async (
  prompt: string,
  originalImage?: string,
  maskImage?: string
): Promise<GeneratedImage> => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-generation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, originalImage, maskImage }),
      }
    );

    if (!resp.ok) throw new Error("No se pudo generar la imagen.");

    const { url, revised_prompt } =
      (await resp.json()) as ImageGenerationResponse;

    return { url, alt: revised_prompt };
  } catch (error) {
    console.log(error);
    return null;
  }
};

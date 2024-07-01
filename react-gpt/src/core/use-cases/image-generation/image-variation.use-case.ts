import { ImageGenerationResponse } from "../../../interfaces";

interface Image {
  url: string;
  alt: string;
}

type GeneratedImage = Image | null;

export const imageVariationUseCase = async (
  originalImage: string
): Promise<GeneratedImage> => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-variation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ baseImage: originalImage }),
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

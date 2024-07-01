import { AssistantPostQuestionResponse } from "../../../interfaces";

export const postQuestionUseCase = async (threadId: string, question: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/user-question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId, question }),
      }
    );

    if (!resp.ok) throw new Error("Error al crear pregunta");

    const replies = (await resp.json()) as AssistantPostQuestionResponse[];

    return replies;
  } catch (error) {
    console.log(error);
    throw new Error("Error al crear pregunta");
  }
};

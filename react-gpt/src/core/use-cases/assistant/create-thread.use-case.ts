interface Response {
  id: string;
}

export const creteThreadUseCase = async () => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/create-thread`,
      {
        method: "POST",
      }
    );

    if (!resp.ok) throw new Error("Error al crear el thread.");

    const { id } = (await resp.json()) as Response;

    return id;
  } catch (error) {
    throw new Error("Error al crear el thread.");
  }
};

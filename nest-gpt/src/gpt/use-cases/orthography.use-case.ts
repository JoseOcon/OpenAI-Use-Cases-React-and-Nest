import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
        Las palabras usadas deben de existir en la Real Academia Española
        Debes responder en formato JSON,
        tu tarea es corregirlos y retornar información soluciones,
        también siempre debes de dar un porcentaje de acierto por el usuario,

        Si no hay erroes, debes de retornar un mensaje de felicitaciones.
        
        Ejemplo de salida:
        {
          userScore: number,
          errors: srting[], // ['error -> solución'],
          message: string, // Usa emojis y tecto para felicitar.
        }

        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 200,
    response_format: {
      type: 'json_object'
    }
  });

  const jsonResp = JSON.parse(completion.choices[0].message.content)

  return jsonResp;
};

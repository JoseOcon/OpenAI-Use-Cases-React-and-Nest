import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, lang } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Tendras que traducir el texto que el usuario te brinde al idioma ${lang}

        El content de la respuesta debe ser un markdown en donde das un mensaje similar al siguiente:
        La tradicción de: \n
        * aqui va el texto ingresado* \n
        Al idioma ${lang}  Es la siguiente: \n
        * aqui va el texto traducido *

        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 500,
    // response_format: {
    //   type: 'json_object',
    // },
  });

  const jsonResp = completion.choices[0].message;

  return jsonResp;
};

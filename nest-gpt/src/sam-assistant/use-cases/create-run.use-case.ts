import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = `${process.env.ASSISTANT_ID}` } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions: '', // WARNING! esto SOBREESCRIBE el asistente
  });

  return run

};

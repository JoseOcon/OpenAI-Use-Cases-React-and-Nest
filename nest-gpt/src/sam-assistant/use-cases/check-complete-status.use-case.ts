import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { runId, threadId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  if (runStatus.status === 'completed') {
    return runStatus;
  }

  // Eseperar un par de segundos antes de volcer a consultar

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return await checkCompleteStatusUseCase(openai, options);
};

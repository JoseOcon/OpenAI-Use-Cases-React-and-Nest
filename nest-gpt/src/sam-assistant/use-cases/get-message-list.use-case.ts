import OpenAI from 'openai';

interface Options {
  threadId: string;
}

export const getMessageLsitUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId } = options;

  const messageList = await openai.beta.threads.messages.list(threadId);

  const messages = messageList.data.map(({ role, content }) => ({
    role: role,
    content: content.map((content) => (content as any).text.value),
  }));

  return messages.reverse();
};

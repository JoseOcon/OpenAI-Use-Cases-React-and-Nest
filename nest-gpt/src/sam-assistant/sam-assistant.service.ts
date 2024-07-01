import { Injectable } from '@nestjs/common';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageLsitUseCase,
} from './use-cases';
import OpenAI from 'openai';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async createMessage(questionDto: QuestionDto) {
    const { question, threadId } = questionDto;
    await createMessageUseCase(this.openai, {
      question,
      threadId,
    });

    const run = await createRunUseCase(this.openai, { threadId });

    await checkCompleteStatusUseCase(this.openai, { threadId, runId: run.id });

    const messages = await getMessageLsitUseCase(this.openai, { threadId });

    return messages;
  }
}

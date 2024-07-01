import { AudioToTextDto } from './dtos/audio-to-text.dto';
import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  testToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck({ prompt }: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translate({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await testToAudioUseCase(this.openai, { prompt, voice });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );

    const fileExists = fs.existsSync(filePath);

    if (!fileExists) throw new NotFoundException(`File ${fileId} not found.`);

    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;
    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }

  async imageGeneration({
    prompt,
    maskImage,
    originalImage,
  }: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, {
      prompt,
      maskImage,
      originalImage,
    });
  }

  async imageGetter(imageId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/images/',
      `${imageId}${imageId.includes('.png') ? '' : '.png'}`,
    );

    const fileExists = fs.existsSync(filePath);

    if (!fileExists) throw new NotFoundException(`File ${imageId} not found.`);

    return filePath;
  }

  async imageVariation({ baseImage }: ImageVariationDto) {
    return await imageVariationUseCase(this.openai, { baseImage });
  }
}

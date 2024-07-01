export interface Language {
  full_code: string;
  code_alpha_1: string;
  englishName: string;
  codeName: string;
  flagPath: string;
  testWordForSyntezis: string;
  rtl: string;
  modes: Mode[];
}

export interface Mode {
  name: string;
  value: boolean;
}

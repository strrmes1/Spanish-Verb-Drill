
export enum View {
  MAIN = 'main',
  TYPES = 'types',
  SETT = 'sett'
}

export enum Tense {
  PRESENTE = 'Presente',
  PRETERITO = 'Pretérito Indefinido',
  FUTURO = 'Futuro'
}

export enum Pronoun {
  YO = 'Yo',
  TU = 'Tú',
  EL_ELLA = 'Él/Ella/Ud.',
  NOSOTROS = 'Nosotros',
  VOSOTROS = 'Vosotros',
  ELLOS_ELLAS = 'Ellos/Ellas/Uds.'
}

export interface ConjugationMap {
  [Pronoun.YO]: string;
  [Pronoun.TU]: string;
  [Pronoun.EL_ELLA]: string;
  [Pronoun.NOSOTROS]: string;
  [Pronoun.VOSOTROS]: string;
  [Pronoun.ELLOS_ELLAS]: string;
}

export interface Verb {
  id: string;
  infinitive: string;
  translation: string;
  isRegular: boolean;
  type: 'ar' | 'er' | 'ir';
  rules: string;
  conjugations: {
    [key in Tense]: ConjugationMap;
  };
}

export interface SessionStats {
  correct: number;
  incorrect: number;
  totalAnswered: number;
}

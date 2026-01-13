
import { Verb, Tense, Pronoun } from '../types';

// Utility to generate regular conjugations
const getRegularConjugations = (infinitive: string, type: 'ar' | 'er' | 'ir') => {
  const stem = infinitive.slice(0, -2);
  const endings = {
    ar: {
      [Tense.PRESENTE]: ['o', 'as', 'a', 'amos', 'áis', 'an'],
      [Tense.PRETERITO]: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
      [Tense.FUTURO]: ['aré', 'arás', 'ará', 'aremos', 'aréis', 'arán']
    },
    er: {
      [Tense.PRESENTE]: ['o', 'es', 'e', 'emos', 'éis', 'en'],
      [Tense.PRETERITO]: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
      [Tense.FUTURO]: ['eré', 'erás', 'erá', 'eremos', 'eréis', 'erán']
    },
    ir: {
      [Tense.PRESENTE]: ['o', 'es', 'e', 'imos', 'ís', 'en'],
      [Tense.PRETERITO]: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
      [Tense.FUTURO]: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán']
    }
  };

  const mapToPronouns = (endList: string[], inf: string, t: Tense) => {
    const isFuture = t === Tense.FUTURO;
    const base = isFuture ? inf : stem;
    const actualEndings = isFuture ? endings[type][Tense.FUTURO].map(e => e.substring(2)) : endList;
    
    return {
      [Pronoun.YO]: base + actualEndings[0],
      [Pronoun.TU]: base + actualEndings[1],
      [Pronoun.EL_ELLA]: base + actualEndings[2],
      [Pronoun.NOSOTROS]: base + actualEndings[3],
      [Pronoun.VOSOTROS]: base + actualEndings[4],
      [Pronoun.ELLOS_ELLAS]: base + actualEndings[5],
    };
  };

  return {
    [Tense.PRESENTE]: mapToPronouns(endings[type][Tense.PRESENTE], infinitive, Tense.PRESENTE),
    [Tense.PRETERITO]: mapToPronouns(endings[type][Tense.PRETERITO], infinitive, Tense.PRETERITO),
    [Tense.FUTURO]: mapToPronouns(endings[type][Tense.FUTURO], infinitive, Tense.FUTURO),
  };
};

const commonVerbsList = [
  { inf: 'Hablar', trans: 'To speak', type: 'ar', reg: true },
  { inf: 'Comer', trans: 'To eat', type: 'er', reg: true },
  { inf: 'Vivir', trans: 'To live', type: 'ir', reg: true },
  { inf: 'Caminar', trans: 'To walk', type: 'ar', reg: true },
  { inf: 'Correr', trans: 'To run', type: 'er', reg: true },
  { inf: 'Escribir', trans: 'To write', type: 'ir', reg: true },
  { inf: 'Bailar', trans: 'To dance', type: 'ar', reg: true },
  { inf: 'Beber', trans: 'To drink', type: 'er', reg: true },
  { inf: 'Abrir', trans: 'To open', type: 'ir', reg: true },
  { inf: 'Aprender', trans: 'To learn', type: 'er', reg: true },
  { inf: 'Cocinar', trans: 'To cook', type: 'ar', reg: true },
  { inf: 'Cantar', trans: 'To sing', type: 'ar', reg: true },
  { inf: 'Viajar', trans: 'To travel', type: 'ar', reg: true },
  { inf: 'Mirar', trans: 'To look', type: 'ar', reg: true },
  { inf: 'Escuchar', trans: 'To listen', type: 'ar', reg: true },
  { inf: 'Comprar', trans: 'To buy', type: 'ar', reg: true },
  { inf: 'Vender', trans: 'To sell', type: 'er', reg: true },
  { inf: 'Subir', trans: 'To go up', type: 'ir', reg: true },
  { inf: 'Bajar', trans: 'To go down', type: 'ar', reg: true },
  { inf: 'Entender', trans: 'To understand', type: 'er', reg: false },
  { inf: 'Perder', trans: 'To lose', type: 'er', reg: false },
  { inf: 'Ganar', trans: 'To win', type: 'ar', reg: true },
  { inf: 'Pagar', trans: 'To pay', type: 'ar', reg: true },
  { inf: 'Trabajar', trans: 'To work', type: 'ar', reg: true },
  { inf: 'Llamar', trans: 'To call', type: 'ar', reg: true },
  { inf: 'Llegar', trans: 'To arrive', type: 'ar', reg: true },
  { inf: 'Llevar', trans: 'To carry', type: 'ar', reg: true },
  { inf: 'Creer', trans: 'To believe', type: 'er', reg: true },
  { inf: 'Parecer', trans: 'To seem', type: 'er', reg: false },
  { inf: 'Esperar', trans: 'To wait', type: 'ar', reg: true },
  { inf: 'Quedar', trans: 'To stay', type: 'ar', reg: true },
  { inf: 'Pasar', trans: 'To pass', type: 'ar', reg: true },
  { inf: 'Deber', trans: 'To must', type: 'er', reg: true },
  { inf: 'Dejar', trans: 'To leave', type: 'ar', reg: true },
  { inf: 'Seguir', trans: 'To follow', type: 'ir', reg: false },
  { inf: 'Tomar', trans: 'To take', type: 'ar', reg: true },
  { inf: 'Pensar', trans: 'To think', type: 'ar', reg: false },
  { inf: 'Querer', trans: 'To want', type: 'er', reg: false },
  { inf: 'Sentir', trans: 'To feel', type: 'ir', reg: false },
  { inf: 'Preguntar', trans: 'To ask', type: 'ar', reg: true },
  { inf: 'Responder', trans: 'To answer', type: 'er', reg: true },
  { inf: 'Ayudar', trans: 'To help', type: 'ar', reg: true },
  { inf: 'Gustar', trans: 'To like', type: 'ar', reg: true },
  { inf: 'Necesitar', trans: 'To need', type: 'ar', reg: true },
  { inf: 'Olvidar', trans: 'To forget', type: 'ar', reg: true },
  { inf: 'Recordar', trans: 'To remember', type: 'ar', reg: false },
  { inf: 'Explicar', trans: 'To explain', type: 'ar', reg: true },
  { inf: 'Estudiar', trans: 'To study', type: 'ar', reg: true },
  { inf: 'Terminar', trans: 'To finish', type: 'ar', reg: true },
  { inf: 'Empezar', trans: 'To start', type: 'ar', reg: false },
];

export const VERBS: Verb[] = commonVerbsList.map((v, i) => ({
  id: `v-${i}`,
  infinitive: v.inf,
  translation: v.trans,
  isRegular: v.reg,
  type: v.type as 'ar' | 'er' | 'ir',
  rules: v.reg 
    ? `Standard ${v.type} conjugation: follow the classic endings pattern.`
    : `Irregular stem change occurs in this verb. Pay attention to the root.`,
  conjugations: getRegularConjugations(v.inf, v.type as 'ar' | 'er' | 'ir') as any
}));


export enum ProposalStep {
  GREETING = 0,
  INTEREST = 1,
  QUESTION = 2,
  SUCCESS = 3
}

export interface RomanticMessage {
  text: string;
  author: string;
}

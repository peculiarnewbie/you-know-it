export type Question = {
	id: string;
	question: string;
	answer: string;
};

export type Round = {
	round: number;
	questionId: string;
	Guesses: {
		player: number;
		answer: string;
		correctCount: number;
		knowIt?: { know: boolean; targetPlayer: number };
	}[];
};

export type Game = {
	id: string;
	players: { id: string; displayName: string; position: number; score: number }[];
	currentRound: number;
	rounds: Round[];
};

export const game1: Game = {
	id: '1',
	players: [
		{ id: '1', displayName: 'Bolt', position: 1, score: 0 },
		{ id: '2', displayName: 'Rif', position: 2, score: 0 },
		{ id: '3', displayName: 'Nor', position: 3, score: 0 },
		{ id: '4', displayName: 'Man', position: 4, score: 0 }
	],
	currentRound: 0,
	rounds: [
		{ round: 1, questionId: '1', Guesses: [] },
		{ round: 2, questionId: '2', Guesses: [] },
		{ round: 3, questionId: '3', Guesses: [] },
		{ round: 4, questionId: '4', Guesses: [] }
	]
};

export const questions1: Question[] = [{ id: '1', question: '', answer: '' }];

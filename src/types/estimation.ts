export type UserStory = {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  estimation?: string | number;
  estimations?: Record<string, string | number>;
};

export type EstimationScale = {
  name: string;
  values: (number | string)[];
};

export type EstimationStats = {
  mode: string | number;
  range: [string | number, string | number];
  average?: number;
  consensus: number;
};

export type Participant = {
  id: string;
  role: 'moderator' | 'participant';
  name: string;
};

export type Session = {
  id: string;
  name: string;
  createdAt: Date;
  moderatorId: string;
  stories: UserStory[];
  participants: Participant[];
  selectedScale: string;
  isRevealed: boolean;
};
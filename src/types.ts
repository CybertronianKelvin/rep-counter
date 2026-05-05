export interface Point {
  x: number;
  y: number;
  score?: number;
}

export interface Keypoint extends Point {
  name: string;
}

export interface Pose {
  keypoints: Keypoint[];
}

export type ExerciseType =
  | 'push-ups'
  | 'push-up'
  | 'incline push-up'
  | 'decline push-up'
  | 'squats'
  | 'squat'
  | 'jump squats'
  | 'jump squat'
  | 'pull-ups'
  | 'pull-up'
  | 'chin-up'
  | 'dips'
  | 'dip'
  | 'burpees'
  | 'burpee'
  | 'sit-ups'
  | 'sit-up'
  | 'lunges'
  | 'lunge'
  | 'mountain climbers'
  | 'jumping jacks'
  | 'jumping jack'
  | 'plank shoulder taps';

export type CountState =
  | 'WAITING'
  | 'DOWN'
  | 'UP'
  | 'TRANSITIONING'
  | 'STANDING'
  | 'PLANK';

export interface ExerciseConfig {
  type: 'angle_based' | 'vertical_movement' | 'complex_movement' | 'alternating_movement' | 'lateral_movement';
  keypoints: string[];
  fallbackKeypoints?: string[];
  downThreshold?: number;
  upThreshold?: number;
  downPosition?: string;
  upPosition?: string;
  requiresStraightBody?: boolean;
  detectJump?: boolean;
  reverseLogic?: boolean;
  alternating?: boolean;
  detectAlternation?: boolean;
  detectArmSpread?: boolean;
  detectLegSpread?: boolean;
  detectHandMovement?: boolean;
  stages?: string[];
}

export interface CountResult {
  repCount: number;
  state: CountState | string;
  feedback: string;
  angle?: number;
}
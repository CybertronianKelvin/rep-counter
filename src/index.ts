export { calculateAngle, getVerticalDistance, isBodyStraight } from './angle';
export { detectExerciseType, EXERCISE_CONFIGS } from './configs';
export { countReps, reset, getCount } from './stateMachine';
export type {
  Point,
  Keypoint,
  Pose,
  ExerciseType,
  ExerciseConfig,
  CountResult,
  CountState,
} from './types';
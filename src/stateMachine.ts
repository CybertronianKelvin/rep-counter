import { Pose, CountResult, ExerciseConfig, Keypoint } from './types';
import { EXERCISE_CONFIGS, detectExerciseType } from './configs';
import { calculateAngle, getVerticalDistance, isBodyStraight } from './angle';

interface ExerciseState {
  state: string;
  repCount: number;
  lastRepTime: number;
  leftLegState?: string;
  rightLegState?: string;
}

const stateStore = new Map<string, ExerciseState>();
const MIN_TIME_BETWEEN_REPS = 300;

function getOrCreateState(exerciseType: string): ExerciseState {
  if (!stateStore.has(exerciseType)) {
    stateStore.set(exerciseType, {
      state: 'WAITING',
      repCount: 0,
      lastRepTime: 0,
      leftLegState: 'WAITING',
      rightLegState: 'WAITING',
    });
  }
  return stateStore.get(exerciseType)!;
}

function getKeypoints(pose: Pose, keypointNames: string[]): (Keypoint | null)[] {
  return keypointNames.map(name => {
    const kp = pose.keypoints.find(k => k.name === name);
    return kp || null;
  });
}

function countAngleBased(
  pose: Pose,
  config: ExerciseConfig,
  state: ExerciseState
): CountResult {
  let keypoints = getKeypoints(pose, config.keypoints);

  if (
    (!keypoints[0] || !keypoints[1] || !keypoints[2]) &&
    config.fallbackKeypoints
  ) {
    keypoints = getKeypoints(pose, config.fallbackKeypoints);
  }

  const hasMinimumKeypoints = keypoints[0] && keypoints[1] && keypoints[2];
  if (!hasMinimumKeypoints) {
    return {
      repCount: state.repCount,
      state: state.state,
      feedback: 'Position yourself in frame',
    };
  }

  const angle = calculateAngle(keypoints[0]!, keypoints[1]!, keypoints[2]!);

  let formFeedback = 'Good form';
  if (config.requiresStraightBody && keypoints.length >= 5) {
    const isStraight = isBodyStraight(
      keypoints[0]!,
      keypoints[3]!,
      keypoints[4]!
    );
    if (!isStraight) {
      formFeedback = 'Keep body straight';
    }
  }

  const { downThreshold, upThreshold, reverseLogic } = config;
  const now = Date.now();
  const timeSinceLastRep = now - state.lastRepTime;

  if (reverseLogic) {
    if (state.state === 'WAITING' && angle > (downThreshold || 170)) {
      state.state = 'DOWN';
    } else if (
      state.state === 'DOWN' &&
      angle < (upThreshold || 90) &&
      timeSinceLastRep > MIN_TIME_BETWEEN_REPS
    ) {
      state.state = 'UP';
      state.repCount++;
      state.lastRepTime = now;
      formFeedback = `Rep ${state.repCount}!`;
    } else if (state.state === 'UP' && angle > (downThreshold || 170)) {
      state.state = 'DOWN';
    }
  } else {
    if (state.state === 'WAITING' && angle < (downThreshold || 90)) {
      state.state = 'DOWN';
    } else if (
      state.state === 'DOWN' &&
      angle > (upThreshold || 160) &&
      timeSinceLastRep > MIN_TIME_BETWEEN_REPS
    ) {
      state.state = 'UP';
      state.repCount++;
      state.lastRepTime = now;
      formFeedback = `Rep ${state.repCount}!`;
    } else if (state.state === 'UP' && angle < (downThreshold || 90)) {
      state.state = 'DOWN';
    }
  }

  return {
    repCount: state.repCount,
    state: state.state,
    feedback: formFeedback,
    angle: Math.round(angle),
  };
}

function countVerticalMovement(
  pose: Pose,
  config: ExerciseConfig,
  state: ExerciseState
): CountResult {
  const keypoints = getKeypoints(pose, config.keypoints);
  const [shoulder, elbow, wrist, nose] = keypoints;

  if (!shoulder || !elbow || !nose) {
    return {
      repCount: state.repCount,
      state: state.state,
      feedback: 'Show your upper body',
    };
  }

  const wristToNoseDistance = wrist
    ? getVerticalDistance(wrist, nose)
    : Infinity;
  const isUp = wristToNoseDistance < 0.15;

  const elbowAngle = calculateAngle(shoulder, elbow, wrist!);
  const isDown = elbowAngle > 160;

  const now = Date.now();
  const timeSinceLastRep = now - state.lastRepTime;

  if (state.state === 'WAITING' && isDown) {
    state.state = 'DOWN';
  } else if (
    state.state === 'DOWN' &&
    isUp &&
    timeSinceLastRep > MIN_TIME_BETWEEN_REPS
  ) {
    state.state = 'UP';
    state.repCount++;
    state.lastRepTime = now;
  } else if (state.state === 'UP' && isDown) {
    state.state = 'DOWN';
  }

  return {
    repCount: state.repCount,
    state: state.state,
    feedback: state.state === 'UP' ? `Rep ${state.repCount}!` : 'Pull up!',
  };
}

function countComplexMovement(
  pose: Pose,
  _config: ExerciseConfig,
  state: ExerciseState
): CountResult {
  const shoulder =
    pose.keypoints.find(k => k.name === 'left_shoulder') ||
    pose.keypoints.find(k => k.name === 'right_shoulder');
  const hip =
    pose.keypoints.find(k => k.name === 'left_hip') ||
    pose.keypoints.find(k => k.name === 'right_hip');

  if (!shoulder || !hip) {
    return {
      repCount: state.repCount,
      state: state.state,
      feedback: 'Show full body',
    };
  }

  const verticalGap = hip.y - shoulder.y;
  const isStanding = verticalGap > 0.2;
  const isDown = verticalGap < 0.08;

  const now = Date.now();
  const timeSinceLastRep = now - state.lastRepTime;

  if (state.state === 'WAITING' && isStanding) {
    state.state = 'STANDING';
  } else if (state.state === 'STANDING' && isDown) {
    state.state = 'PLANK';
  } else if (
    state.state === 'PLANK' &&
    isStanding &&
    timeSinceLastRep > 1000
  ) {
    state.repCount++;
    state.lastRepTime = now;
    state.state = 'STANDING';
  }

  const feedback =
    state.state === 'WAITING'
      ? 'Stand upright to begin'
      : state.state === 'STANDING'
      ? 'Drop to the floor!'
      : state.state === 'PLANK'
      ? 'Jump back up!'
      : `${state.repCount} rep${state.repCount !== 1 ? 's' : ''}!`;

  return { repCount: state.repCount, state: state.state, feedback };
}

function countAlternatingMovement(
  pose: Pose,
  _config: ExerciseConfig,
  state: ExerciseState
): CountResult {
  const leftKnee = pose.keypoints.find(k => k.name === 'left_knee');
  const rightKnee = pose.keypoints.find(k => k.name === 'right_knee');
  const leftHip = pose.keypoints.find(k => k.name === 'left_hip');
  const rightHip = pose.keypoints.find(k => k.name === 'right_hip');

  if (!leftKnee || !rightKnee || !leftHip || !rightHip) {
    return {
      repCount: state.repCount,
      state: state.state,
      feedback: 'Show full body in plank position',
    };
  }

  const leftDriving = leftHip.y - leftKnee.y > 0.08;
  const rightDriving = rightHip.y - rightKnee.y > 0.08;

  const now = Date.now();
  const timeSinceLastRep = now - state.lastRepTime;

  if (state.leftLegState === 'WAITING' && leftDriving) {
    state.leftLegState = 'UP';
  } else if (
    state.leftLegState === 'UP' &&
    !leftDriving &&
    timeSinceLastRep > MIN_TIME_BETWEEN_REPS
  ) {
    state.leftLegState = 'WAITING';
    state.repCount++;
    state.lastRepTime = now;
  }

  if (state.rightLegState === 'WAITING' && rightDriving) {
    state.rightLegState = 'UP';
  } else if (
    state.rightLegState === 'UP' &&
    !rightDriving &&
    timeSinceLastRep > MIN_TIME_BETWEEN_REPS
  ) {
    state.rightLegState = 'WAITING';
    state.repCount++;
    state.lastRepTime = now;
  }

  return {
    repCount: state.repCount,
    state: state.state,
    feedback:
      state.repCount > 0 ? `${state.repCount} reps!` : 'Drive knees to chest',
  };
}

function countLateralMovement(
  pose: Pose,
  _config: ExerciseConfig,
  state: ExerciseState
): CountResult {
  const leftWrist = pose.keypoints.find(k => k.name === 'left_wrist');
  const rightWrist = pose.keypoints.find(k => k.name === 'right_wrist');
  const leftShoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
  const rightShoulder = pose.keypoints.find(k => k.name === 'right_shoulder');

  if (!leftWrist || !rightWrist || !leftShoulder || !rightShoulder) {
    return {
      repCount: state.repCount,
      state: state.state,
      feedback: 'Show full body',
    };
  }

  const wristSpread = Math.abs(leftWrist.x - rightWrist.x);
  const shoulderSpread = Math.abs(leftShoulder.x - rightShoulder.x);
  const armsOut = wristSpread > shoulderSpread * 1.5;

  const now = Date.now();
  const timeSinceLastRep = now - state.lastRepTime;

  if (state.state === 'WAITING' && armsOut) {
    state.state = 'UP';
  } else if (
    state.state === 'UP' &&
    !armsOut &&
    timeSinceLastRep > MIN_TIME_BETWEEN_REPS
  ) {
    state.state = 'WAITING';
    state.repCount++;
    state.lastRepTime = now;
  }

  return {
    repCount: state.repCount,
    state: state.state,
    feedback:
      state.repCount > 0 ? `${state.repCount} reps!` : 'Jump — arms out and in',
  };
}

export function countReps(pose: Pose | null, exerciseName: string): CountResult {
  if (!pose || !pose.keypoints || pose.keypoints.length === 0) {
    return { repCount: 0, state: 'WAITING', feedback: 'No pose detected' };
  }

  const exerciseType = detectExerciseType(exerciseName);
  if (!exerciseType) {
    return {
      repCount: 0,
      state: 'WAITING',
      feedback: 'Exercise not supported',
    };
  }

  const config = EXERCISE_CONFIGS[exerciseType];
  if (!config) {
    return {
      repCount: 0,
      state: 'WAITING',
      feedback: 'Exercise not supported',
    };
  }

  const state = getOrCreateState(exerciseType);

  try {
    switch (config.type) {
      case 'angle_based':
        return countAngleBased(pose, config, state);
      case 'vertical_movement':
        return countVerticalMovement(pose, config, state);
      case 'complex_movement':
        return countComplexMovement(pose, config, state);
      case 'alternating_movement':
        return countAlternatingMovement(pose, config, state);
      case 'lateral_movement':
        return countLateralMovement(pose, config, state);
      default:
        return {
          repCount: state.repCount,
          state: state.state,
          feedback: 'Unknown exercise type',
        };
    }
  } catch (error) {
    console.error('[RepCounter] Error processing frame:', error);
    return {
      repCount: state.repCount,
      state: state.state,
      feedback: 'Processing error',
    };
  }
}

export function reset(exerciseName: string): void {
  const exerciseType = detectExerciseType(exerciseName);
  if (exerciseType && stateStore.has(exerciseType)) {
    stateStore.set(exerciseType, {
      state: 'WAITING',
      repCount: 0,
      lastRepTime: 0,
      leftLegState: 'WAITING',
      rightLegState: 'WAITING',
    });
  }
}

export function getCount(exerciseName: string): number {
  const exerciseType = detectExerciseType(exerciseName);
  if (exerciseType && stateStore.has(exerciseType)) {
    return stateStore.get(exerciseType)!.repCount;
  }
  return 0;
}
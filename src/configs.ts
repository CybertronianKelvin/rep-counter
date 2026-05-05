import { ExerciseConfig } from './types';

export const EXERCISE_CONFIGS: Record<string, ExerciseConfig> = {
  'push-ups': {
    type: 'angle_based',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip', 'left_knee'],
    downThreshold: 90,
    upThreshold: 160,
    requiresStraightBody: true,
  },
  'push-up': {
    type: 'angle_based',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip', 'left_knee'],
    downThreshold: 90,
    upThreshold: 160,
    requiresStraightBody: true,
  },
  'incline push-up': {
    type: 'angle_based',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist'],
    downThreshold: 100,
    upThreshold: 160,
  },
  'decline push-up': {
    type: 'angle_based',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist'],
    downThreshold: 80,
    upThreshold: 160,
  },
  squats: {
    type: 'angle_based',
    keypoints: ['left_hip', 'left_knee', 'left_ankle'],
    fallbackKeypoints: ['right_hip', 'right_knee', 'right_ankle'],
    downThreshold: 90,
    upThreshold: 160,
  },
  squat: {
    type: 'angle_based',
    keypoints: ['left_hip', 'left_knee', 'left_ankle'],
    fallbackKeypoints: ['right_hip', 'right_knee', 'right_ankle'],
    downThreshold: 90,
    upThreshold: 160,
  },
  'jump squats': {
    type: 'angle_based',
    keypoints: ['left_hip', 'left_knee', 'left_ankle'],
    fallbackKeypoints: ['right_hip', 'right_knee', 'right_ankle'],
    downThreshold: 90,
    upThreshold: 160,
    detectJump: true,
  },
  'jump squat': {
    type: 'angle_based',
    keypoints: ['left_hip', 'left_knee', 'left_ankle'],
    fallbackKeypoints: ['right_hip', 'right_knee', 'right_ankle'],
    downThreshold: 90,
    upThreshold: 160,
    detectJump: true,
  },
  'pull-ups': {
    type: 'vertical_movement',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'nose'],
    downPosition: 'arms_extended',
    upPosition: 'chin_above_bar',
  },
  'pull-up': {
    type: 'vertical_movement',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'nose'],
    downPosition: 'arms_extended',
    upPosition: 'chin_above_bar',
  },
  'chin-up': {
    type: 'vertical_movement',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'nose'],
    downPosition: 'arms_extended',
    upPosition: 'chin_above_bar',
  },
  dips: {
    type: 'angle_based',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist'],
    downThreshold: 90,
    upThreshold: 160,
  },
  dip: {
    type: 'angle_based',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist'],
    downThreshold: 90,
    upThreshold: 160,
  },
  burpees: {
    type: 'complex_movement',
    keypoints: ['left_shoulder', 'left_hip', 'left_knee', 'left_ankle'],
    stages: ['standing', 'plank', 'standing'],
  },
  burpee: {
    type: 'complex_movement',
    keypoints: ['left_shoulder', 'left_hip', 'left_knee', 'left_ankle'],
    stages: ['standing', 'plank', 'standing'],
  },
  'sit-ups': {
    type: 'angle_based',
    keypoints: ['left_shoulder', 'left_hip', 'left_knee'],
    downThreshold: 170,
    upThreshold: 90,
    reverseLogic: true,
  },
  'sit-up': {
    type: 'angle_based',
    keypoints: ['left_shoulder', 'left_hip', 'left_knee'],
    downThreshold: 170,
    upThreshold: 90,
    reverseLogic: true,
  },
  lunges: {
    type: 'angle_based',
    keypoints: ['left_hip', 'left_knee', 'left_ankle'],
    fallbackKeypoints: ['right_hip', 'right_knee', 'right_ankle'],
    downThreshold: 90,
    upThreshold: 160,
    alternating: true,
  },
  lunge: {
    type: 'angle_based',
    keypoints: ['left_hip', 'left_knee', 'left_ankle'],
    fallbackKeypoints: ['right_hip', 'right_knee', 'right_ankle'],
    downThreshold: 90,
    upThreshold: 160,
    alternating: true,
  },
  'mountain climbers': {
    type: 'alternating_movement',
    keypoints: ['left_hip', 'left_knee', 'right_hip', 'right_knee'],
    detectAlternation: true,
  },
  'jumping jacks': {
    type: 'lateral_movement',
    keypoints: [
      'left_shoulder',
      'left_hip',
      'left_ankle',
      'right_shoulder',
      'right_hip',
      'right_ankle',
    ],
    detectArmSpread: true,
    detectLegSpread: true,
  },
  'jumping jack': {
    type: 'lateral_movement',
    keypoints: [
      'left_shoulder',
      'left_hip',
      'left_ankle',
      'right_shoulder',
      'right_hip',
      'right_ankle',
    ],
    detectArmSpread: true,
    detectLegSpread: true,
  },
  'plank shoulder taps': {
    type: 'alternating_movement',
    keypoints: ['left_wrist', 'right_wrist', 'left_shoulder', 'right_shoulder'],
    detectHandMovement: true,
  },
};

export function detectExerciseType(exerciseName: string): string | null {
  const normalized = exerciseName.toLowerCase().trim();

  if (EXERCISE_CONFIGS[normalized]) {
    return normalized;
  }

  // Map singular to plural
  const singularMap: Record<string, string> = {
    'push-up': 'push-ups',
    'squat': 'squats',
    'jump squat': 'jump squats',
    'pull-up': 'pull-ups',
    'dip': 'dips',
    'burpee': 'burpees',
    'sit-up': 'sit-ups',
    'lunge': 'lunges',
    'jumping jack': 'jumping jacks',
  };

  if (singularMap[normalized]) {
    return singularMap[normalized];
  }

  // Fuzzy matching - try to find canonical name
  if (normalized.includes('push') && normalized.includes('up')) {
    if (normalized.includes('incline')) return 'incline push-up';
    if (normalized.includes('decline')) return 'decline push-up';
    return 'push-ups';
  }

  if (normalized.includes('squat')) {
    if (normalized.includes('jump')) return 'jump squats';
    return 'squats';
  }

  if (normalized.includes('pull') && normalized.includes('up')) {
    return 'pull-ups';
  }

  if (normalized.includes('chin') && normalized.includes('up')) {
    return 'chin-up';
  }

  if (normalized.includes('dip')) {
    return 'dips';
  }

  if (normalized.includes('burpee')) {
    return 'burpees';
  }

  if (normalized.includes('sit') && normalized.includes('up')) {
    return 'sit-ups';
  }

  if (normalized.includes('lunge')) {
    return 'lunges';
  }

  if (normalized.includes('mountain') && normalized.includes('climber')) {
    return 'mountain climbers';
  }

  if (normalized.includes('jumping') && normalized.includes('jack')) {
    return 'jumping jacks';
  }

  return null;
}
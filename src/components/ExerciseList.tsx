"use client"
import React from 'react';
import BreadCrumbExercise from './BreadCrumbExercise';
import { ExercisesByCategory } from './Types'

// 운동 카테고리 및 운동 리스트 타입 정의
// export type ExercisesByCategory = {
//   가슴: string[];
//   등: string[];
//   어깨: string[];
//   // ... 나머지 카테고리
// };

const exercisesByCategory: ExercisesByCategory = {
  가슴: ['벤치프레스', '덤벨 플라이'],
  등: ['풀업', '데드리프트'],
  어깨: ['숄더 프레스', '사이드 레터럴 레이즈'],
  // ... 나머지 운동
};

type Props = {
  category: keyof ExercisesByCategory | null;
  onBack?: () => void;
  onSelectExercise: (exercise: string) => void;
  goFirstStep: () => void;
  goSecondStep: () => void;
};

function ExerciseList({ category, onBack, onSelectExercise, goFirstStep, goSecondStep }: Props) {
  if (category == null) {
    return null;
  }
  const exercises = exercisesByCategory[category];

  return (
    <div>
      <ul>
        {exercises && exercises.map((exercise) => (
          <li key={exercise} onClick={() => onSelectExercise(exercise)}>
            {exercise}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseList;

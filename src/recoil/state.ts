import { atom } from 'recoil';
import { ExercisesByCategory } from '../components/Types';

// 선택된 날짜 상태
export const selectedDateState = atom({
  key: 'selectedDateState', // 고유한 키
  default: new Date(), // 기본값
});

// 선택된 운동 카테고리 상태
export const selectedCategoryState = atom<keyof ExercisesByCategory | null>({
  key: 'selectedCategoryState',
  default: null,
});

// 선택된 운동 상태
export const selectedExerciseState = atom<string | null>({
  key: 'selectedExerciseState',
  default: null,
});

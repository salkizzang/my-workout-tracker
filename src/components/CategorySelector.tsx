"use client"
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ExercisesByCategory } from './Types';

// 대분류 카테고리 데이터
const categories = ['가슴', '등', '어깨', '팔', '다리'];

type Props = {
  onSelect: (category: keyof ExercisesByCategory | null) => void;
  selectedCategory: string | null;
};

function CategorySelector({ onSelect, selectedCategory }: Props) {
  // const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      {/* <h2>운동 카테고리 선택</h2> */}
      <ul>
        {categories.map((category: string) => (
          <li key={category} onClick={() => onSelect(category as keyof ExercisesByCategory)}>
            {category}
          </li>
        ))}
      </ul>
      {selectedCategory && <p>선택된 카테고리: {selectedCategory}</p>}
    </div>
  );
}

export default CategorySelector;

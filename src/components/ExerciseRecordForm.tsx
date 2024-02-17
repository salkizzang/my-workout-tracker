"use client"
// ExerciseRecordForm.js
import React, { ChangeEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedCategoryState, selectedDateState } from '../recoil/state';
import { toLocalDateString } from '../services/DateSerivce';
import { supabase } from '../services/supabaseClient';

type Props = {
  selectedExercise: string | null;
  // selectedDate : Date;
  onRecordSubmit: (data: { exercise: string; sets: any[] }) => void;

};

type Set = {
  weight: number;
  reps: number;
};

function ExerciseRecordForm({ selectedExercise, onRecordSubmit }: Props) {

  const selectedDate = useRecoilValue(selectedDateState);
  const selectedCategory = useRecoilValue(selectedCategoryState);
  const [incrementAmount, setIncrementAmount] = useState(1);
  const [sets, setSets] = useState<Set[]>([{ weight: 0, reps: 0 }]);
  const addSet = () => {
    if (sets && sets.length > 0) {
      const lastSet = sets[0];
      setSets([{ weight: lastSet.weight, reps: lastSet.reps }, ...sets]);
    } else {
      setSets([{ weight: 0, reps: 0 }, ...sets]);
    }
  };
  const removeSet = (indexToRemove: number) => {
    setSets(sets.filter((_, index) => index !== indexToRemove));
  };
  const handleSubmit = async () => {
    if (selectedExercise) {
      const session = supabase.auth.getSession().then(async ({ data: { session } }) => {
        console.log(session);
        const { id, email } = session?.user!;
        console.log(id);
        const date = toLocalDateString(selectedDate);
        // Supabase에 기록을 저장
        const { error } = await supabase.from('record').insert(
          sets.map((set, index: number) => ({
            Depth1: selectedCategory,
            Depth2: selectedExercise,
            SetNumber: index,
            Weight: set.weight,
            Reps: set.reps,
            CustomerID: id, // 사용자 고유 키
            Date: date,
          }))
        );
        // 오류 처리
        if (error) {
          console.error('Error saving exercise record:', error);
        } else {
          setSets([]);
          // 기록 저장 후 처리
          onRecordSubmit({ exercise: selectedExercise, sets });
        }
      });

    }
  };

  const handleInputChange = (index: number, field: keyof Set, value: string) => {
    const newValue = parseFloat(value) || 0;
    const newSets = sets.map((set, i) => {
      if (i === index) {
        return { ...set, [field]: newValue };
      }
      return set;
    });
    setSets(newSets);
  };

  const incrementValue = (index: number, field: keyof Set) => {
    let num = 1;
    if (field === 'weight') num = incrementAmount;
    handleInputChange(index, field, String(sets[index][field] + num));
  };

  const decrementValue = (index: number, field: keyof Set) => {
    let num = 1;
    if (field === 'weight') num = incrementAmount;
    handleInputChange(index, field, String(Math.max(0, sets[index][field] - num)));
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-grow overflow-y-auto">
        <h3 className="text-lg font-semibold">{selectedExercise}</h3>
        <div className="flex flex-wrap justify-between items-center space-x-2 mb-4">
          {[1, 2.5, 5, 10, 20].map((amount) => (
            <button
              key={amount}
              className={`px-2 py-1 rounded-lg ${incrementAmount === amount ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setIncrementAmount(amount)}
            >
              {amount}kg
            </button>
          ))}
        </div>

        {sets.map((set, index) => (
          <div key={sets.length - index} className="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between items-center mb-4">
            <div className="text-sm font-medium flex items-center">
              세트 {sets.length - index}
              <button
                onClick={() => removeSet(index)}
                className="ml-2 bg-red-500 text-white px-2 py-1.5 rounded-md text-sm"
              >
                x
              </button>
            </div>

            <div className="flex flex-nowrap items-center space-x-2">
              <button
                type="button"
                onClick={() => decrementValue(index, 'weight')}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                value={set.weight}
                onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                className="w-14 text-sm text-center border border-gray-300 rounded-none"
                placeholder="무게"
              />
              <button
                type="button"
                onClick={() => incrementValue(index, 'weight')}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-r-md"
              >
                +
              </button>
              <span className="text-sm text-gray-500">kg</span>
              <button
                type="button"
                onClick={() => decrementValue(index, 'reps')}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                value={set.reps}
                onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
                className="w-14 text-sm text-center border border-gray-300 rounded-none"
                placeholder="횟수"
              />
              <button
                type="button"
                onClick={() => incrementValue(index, 'reps')}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-r-md"
              >
                +
              </button>
              <span className="text-sm text-gray-500">회</span>
            </div>

          </div>
        ))}
      </div>
      <div className="p-4">
        <button onClick={addSet} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mb-2">세트 추가</button>
        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-lg w-full">기록 저장</button>
      </div>
    </div>
  );
}

export default ExerciseRecordForm;

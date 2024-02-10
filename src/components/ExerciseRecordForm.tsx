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
    setSets([...sets, { weight: 0, reps: 0 }]);
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
        <h3>{selectedExercise}</h3>
        <div className="flex space-x-2 mb-4">
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
          <div key={index} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">세트 {index + 1}</label>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => decrementValue(index, 'weight')}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-l-lg">
                  -
              </button>
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                  className="bg-gray-50 h-10 text-center border border-gray-300"
                  placeholder="무게(kg)"
                />
                <button
                  type="button"
                  onClick={() => incrementValue(index, 'weight')}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-r-lg">
                  +
              </button>
              </div>
              <span className="text-xs text-gray-500">무게(kg)</span>
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => decrementValue(index, 'reps')}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-l-lg">
                  -
              </button>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
                  className="bg-gray-50 h-10 text-center border border-gray-300"
                  placeholder="횟수"
                />
                <button
                  type="button"
                  onClick={() => incrementValue(index, 'reps')}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-r-lg">
                  +
              </button>
              </div>
              <span className="text-xs text-gray-500">횟수</span>
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

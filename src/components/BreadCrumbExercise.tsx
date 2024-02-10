"use client"
import { useRecoilState } from "recoil";
import { selectedCategoryState, selectedExerciseState } from '../recoil/state'

interface BreadCrumbExerciseProps {
    onHomeClick: () => void;
    onCategoryClick: () => void; // 이 함수가 아무 인자도 받지 않고, 반환값도 없다고 가정할 때
}

function BreadCrumbExercise({ onHomeClick, onCategoryClick }: BreadCrumbExerciseProps) {
    const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryState);
    const [selectedExercise, setSelectedExercise] = useRecoilState(selectedExerciseState);



    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li>
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <a onClick={onHomeClick} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">처음</a>
                    </div>
                </li>
                {selectedCategory ? <li>
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <a onClick={onCategoryClick} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{selectedCategory}</a>
                    </div>
                </li> : <></>}
                {selectedExercise ? <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{selectedExercise}</span>
                    </div>
                </li> : <></>}

            </ol>
        </nav>
    )
}


export default BreadCrumbExercise;
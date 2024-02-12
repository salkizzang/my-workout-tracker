"use client"
import { Session } from '@supabase/gotrue-js';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CategorySelector from './CategorySelector';
import ExerciseList from './ExerciseList';
import ExerciseRecordForm from './ExerciseRecordForm';
import MyDatePicker from './MyDatePicker';
import { ExercisesByCategory } from './Types';
import { supabase } from '../services/supabaseClient';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { RecoilRoot, useRecoilState } from 'recoil';
import { selectedDateState, selectedCategoryState, selectedExerciseState } from '../recoil/state'
import ExerciseRecords from './ExerciseRecords';
import { Button } from 'flowbite-react';
import "./App.css";
import { Navbar } from 'flowbite-react';
import BreadCrumbExercise from './BreadCrumbExercise';


const TABS = {
  DATE_PICKER: 0,
  EXERCISE_INPUT: 1,
  EXERCISE_RECORDS: 2,
};

function App() {
  const [activeTab, setActiveTab] = useState(TABS.DATE_PICKER);

  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryState);
  const [selectedExercise, setSelectedExercise] = useRecoilState(selectedExerciseState);

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);


  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.DATE_PICKER:
        return <MyDatePicker selectedDate={selectedDate} onChange={handleDateChange} />;
      case TABS.EXERCISE_INPUT:
        return (
          <div>
            <h2>운동 기록: {selectedDate.toDateString()}</h2>
            {renderContent()}
            {selectedExercise && (
              <ExerciseRecordForm
                // selectedDate={selectedDate}
                selectedExercise={selectedExercise}
                onRecordSubmit={handleExerciseRecordSubmit}
              />
            )}
          </div>
        );
      case TABS.EXERCISE_RECORDS:
        return <><ExerciseRecords /></>;
      default:
        return <div>내용을 선택하세요.</div>;
    }
  };

  const handleDateChange = (value: any, start?: boolean) => {
    console.log(value);
    if (value && start) {
      setSelectedDate(value);
      setActiveTab(TABS.EXERCISE_RECORDS);
    }
    else if (value) {
      setSelectedDate(value.date);
      setActiveTab(TABS.EXERCISE_INPUT);
      setSelectedCategory(null);
      setSelectedExercise(null);
    }
  };
  const handleCategorySelect = (category: keyof ExercisesByCategory | null) => {
    setSelectedCategory(category);
    setSelectedExercise(null); // 카테고리 변경 시 운동 선택 초기화
  };
  const handleExerciseSelect = (exercise: string) => {
    if (exercise) setSelectedExercise(exercise);
  };

  const back = () => {
    setSelectedCategory(null);
    setSelectedExercise(null);
  };

  const handleExerciseRecordSubmit = (data: any) => {
    console.log(data);
    //저장 한 후 이벤트
    setSelectedExercise(null);

  };

  const logOut = () => {
    supabase.auth.signOut();
  }

  const goFirstStep = () => {
    setActiveTab(TABS.EXERCISE_INPUT);
    setSelectedCategory(null);
    setSelectedExercise(null);
  }

  const goSecondStep = () => {
    setActiveTab(TABS.EXERCISE_INPUT);
    setSelectedExercise(null);
  }

  function renderContent() {
    if (selectedCategory && selectedExercise) {
      return <BreadCrumbExercise onHomeClick={goFirstStep} onCategoryClick={goSecondStep} />;
    } else if (selectedCategory) {
      return (
        <>
          <BreadCrumbExercise onHomeClick={goFirstStep} onCategoryClick={goSecondStep} />
          <ExerciseList
            category={selectedCategory}
            onBack={back}
            onSelectExercise={handleExerciseSelect}
            goFirstStep={goFirstStep}
            goSecondStep={goSecondStep}
          />
        </>
      );
    } else {
      return <CategorySelector onSelect={handleCategorySelect} selectedCategory={selectedCategory} />;
    }
  }


  return (
    <>
      {!session ? <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']}
      /> :
        <div style={{ height: 'calc(100vh - 62px)' }}>
          <Navbar fluid rounded>
            <Navbar.Brand>
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">오운완</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
              <Button color="failure" pill onClick={logOut}>로그아웃</Button>
              <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
              <Navbar.Link
                active={activeTab === TABS.DATE_PICKER}
                onClick={() => setActiveTab(TABS.DATE_PICKER)}
              >
                날짜 선택
              </Navbar.Link>
              <Navbar.Link
                active={activeTab === TABS.EXERCISE_INPUT}
                onClick={() => setActiveTab(TABS.EXERCISE_INPUT)}
              >
                운동 입력
              </Navbar.Link>
              <Navbar.Link
                active={activeTab === TABS.EXERCISE_RECORDS}
                onClick={() => setActiveTab(TABS.EXERCISE_RECORDS)}
              >
                운동 기록
              </Navbar.Link>
            </Navbar.Collapse>

          </Navbar>


          <div className="tab-content">{renderTabContent()}</div>
        </div>
      }
    </>
  );
}

export default App;

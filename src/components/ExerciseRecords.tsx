"use client"
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedDateState } from "../recoil/state";
import { supabase } from "../services/supabaseClient";


function ExerciseRecords() {

  const selectedDate = useRecoilValue(selectedDateState);
  const [records, setRecords] = useState<any[]>([]);
  const [groupedRecords, setGroupedRecords] = useState<{ [key: string]: any[] }>({});


  function toLocalDateString(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  useEffect(() => {
    const fetchRecords = async () => {

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user = session.user;
        const userId = user?.id;
        const date = toLocalDateString(selectedDate);
        if (userId) {
          const { data, error } = await supabase
            .from('record')
            .select('*')
            .eq('Date', date)
            .eq('CustomerID', user.id);

          if (error) {
            console.error('Error fetching records: ', error);
          } else {
            const grouped = data.reduce((acc, record) => {
              (acc[record.Depth2] = acc[record.Depth2] || []).push(record);
              return acc;
            }, {});

            setGroupedRecords(grouped);
          }
        }
      }

    }
    fetchRecords();
  }, [selectedDate])

  return (
    <div>
      <h2>운동 기록: {selectedDate.toDateString()}</h2>
      {Object.entries(groupedRecords).map(([exercise, records]) => (
        <div key={exercise}>
          <h3>운동: {exercise}</h3>
          {records.map((record, index) => (
            <p key={index}>{record.SetNumber + 1}세트 {record.Weight}kg, {record.Reps}개</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ExerciseRecords;
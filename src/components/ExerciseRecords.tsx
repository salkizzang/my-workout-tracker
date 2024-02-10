"use client"
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedDateState } from "../recoil/state";
import { supabase } from "../services/supabaseClient";


function ExerciseRecords() {

  const selectedDate = useRecoilValue(selectedDateState);
  const [records, setRecords] = useState<any[]>([]);

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
            if (data) setRecords(data);
          }
        }
      }

    }
    fetchRecords();
  }, [selectedDate])

  return (
    <div>
      <h2>운동 기록: {selectedDate.toDateString()}</h2>
      {records.map((record: any, index) => (
        <div key={index}>
          {/* 운동 기록 표시 */}
          <p>운동: {record.Depth2}, 세트: {record.SetNumber}, 무게: {record.Weight}, 횟수: {record.Reps}</p>
        </div>
      ))}
    </div>
  );
}

export default ExerciseRecords;
"use client"
import React, { useEffect, useState } from 'react';
// import 'react-calendar/dist/Calendar.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { supabase } from "../services/supabaseClient";

type CalendarComponentProps = {
  selectedDate: Date;
  onChange: (data: any, start?: boolean) => void;
};

function MyDatePicker({ selectedDate, onChange }: CalendarComponentProps) {
  const [events, setEvents] = useState<{ title: string, date: string }[]>([]);

  const handleDatesSet = async (info: any) => {
    // 현재 달의 첫날과 마지막 날 계산
    const firstDayOfMonth = new Date(info.start.getFullYear(), info.start.getMonth(), 1);
    const lastDayOfMonth = new Date(info.start.getFullYear(), info.start.getMonth() + 1, 0);

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const userId = session.user?.id;

      if (userId) {
        const { data, error } = await supabase
          .from('record')
          .select('*')
          .gte('Date', firstDayOfMonth.toISOString().slice(0, 10))
          .lte('Date', lastDayOfMonth.toISOString().slice(0, 10))
          .eq('CustomerID', userId);

        if (error) {
          console.error('Error fetching records:', error);
        } else {
          console.log(data);
          const firstRecordsByDate = data?.reduce((acc, record) => {
            const date = record.Date.split('T')[0]; // YYYY-MM-DD 형식으로 날짜 추출
            if (!acc[date]) {
              acc[date] = record;
            }
            return acc;
          }, {});

          const formattedEvents = Object.values(firstRecordsByDate).map((record: any) => ({
            title: record.Depth1 !== null ? record.Depth1 : '',
            date: record.Date.split('T')[0]
          }));
          console.log(formattedEvents)
          setEvents(formattedEvents);
        }
      }
    }
  };

  const handleEventClick = (clickInfo: any) => {
    console.log(clickInfo);
    const clickedDate = new Date(clickInfo.event.start);
    onChange(clickedDate, true);
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      dateClick={onChange}
      events={events}
      datesSet={handleDatesSet} // 달력 뷰 변경 이벤트 핸들러 추가
      showNonCurrentDates={false}
      eventClick={handleEventClick}
      contentHeight="auto" // 또는 원하는 픽셀 값
      headerToolbar={
        {
          left: 'title',
          center: '',
          right: 'prev,next'
        }
      }
    />
  );
}

export default MyDatePicker;

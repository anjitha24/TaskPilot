import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

function TaskCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Get the auth token from where you stored it (e.g., localStorage)
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://localhost:8000/api/tasks/calendar', {
        headers: {
          // ✅ ADDED: Send the Authorization header with the token
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setEvents(data);
      })
      .catch(error => console.error('Error fetching tasks:', error));
    }
  }, []); // The empty array [] means this effect runs only once

  const handleEventClick = (clickInfo) => {
    // Now the alert can show the status from the 'extendedProps'
    alert(
      `Task: ${clickInfo.event.title}\nStatus: ${clickInfo.event.extendedProps.status}`
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      }}
      events={events}
      eventClick={handleEventClick}
      height="80vh"
    />
  );
}

export default TaskCalendar;
// src/components/CalendarComponent.jsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from 'react-bootstrap';
import EventModal from './EventModal';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import TodoList from './TodoList';

function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalEvent, setModalEvent] = useState({ type: 'Task', title: '', date: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);


  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      const formattedEvents = response.data.map(event => ({
        id: event._id,
        title: event.title,
        start: event.date,
        type: event.type,
        description: event.description,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDateClick = (info) => {
    setModalEvent({ type: 'Task', title: '', date: info.dateStr, description: '' });
    setShowModal(true);
    setIsEditing(false);
  };
  
  const handleEventClick = (info) => {
    const clickedEvent = events.find(event => event.id === info.event.id);
  
    // Format the date correctly before setting it
    setModalEvent(clickedEvent);
    setCurrentEventId(clickedEvent.id);
    setShowModal(true);
    setIsEditing(true);
  };
  

  const handleFormSubmit = async () => {
    if(!modalEvent.type || !modalEvent.title || !modalEvent.date || !modalEvent.description) {
      alert("Please fill all fields before submitting");
      return;
    }
    try {
      if (isEditing) {
        await updateEvent(currentEventId, modalEvent);
      } else {
        await createEvent(modalEvent);
      }
      setShowModal(false);
      setModalEvent({ type: '', title: '', date: '', description: '' });
      await fetchEvents(); // Refresh the events list after creation or update
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      await fetchEvents(); // Refresh the events list after deletion
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="calendar-container">
      <div className="left-panel">
        <Button variant="primary"
         onClick={() => {
          setModalEvent({ type: 'Task', title: '', date: '', description: '' }); // Reset values here
          setShowModal(true);
          setIsEditing(false);
        }}>Create Event</Button>
        <TodoList
          events={events}
          onEventUpdate={(event) => {
            setModalEvent(event);
            setCurrentEventId(event.id);
            setShowModal(true);
            setIsEditing(true);
          }}
          onEventDelete={handleEventDelete}
        />
      </div>
      <div className="right-panel">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
        />
      </div>

      <EventModal
        show={showModal}
        onHide={() => setShowModal(false)}
        event={modalEvent}
        setEvent={setModalEvent}
        onSubmit={handleFormSubmit}
        isEditing={isEditing}
      />
    </div>
  );
}

export default CalendarComponent;

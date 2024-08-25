// src/services/eventService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/events';

// Function to fetch all events from the backend
const getEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Function to create a new event
const createEvent = async (eventData) => {
  try {
    const response = await axios.post(API_URL, eventData);
    return response;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Function to update an existing event
const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/events/${id}`, eventData);
    return response;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Function to delete an event
const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:8000/events/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export { getEvents, createEvent, updateEvent, deleteEvent };

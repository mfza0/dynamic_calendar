// src/components/EventModal.jsx
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import './EventModal.css';  // Import the updated CSS

const EventModal = ({ show, onHide, event, setEvent, onSubmit, isEditing }) => {

  /*const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16); // Extract the "YYYY-MM-DDTHH:MM" portion
  };*/

  const formatDateTime = (date) => {
    if (!date) return ''; // Return an empty string if no date is provided
    const isoString = new Date(date).toISOString();
    return isoString.slice(0, 16); // Extract the 'yyyy-MM-ddThh:mm' part
  };
  

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="custom-modal-dialog"
      contentClassName="custom-modal-content"
    >
      <Modal.Header className="custom-modal-header"> 
        <Modal.Title>{isEditing ? 'Edit Event' : 'Create Event'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body'>
        <Form className='form-part'>
          <Form.Group className='form-element'>
            <Form.Label>Type</Form.Label>
            <Form.Control
              required={true}
              className='form-element'
              as="select"
              value={event.type}
              onChange={(e) => setEvent({ ...event, type: e.target.value })}
            >
              <option>Task</option>
              <option>Calling</option>
              <option>Meeting</option>
            </Form.Control>
          </Form.Group >
          <Form.Group className='form-element'>
            <Form.Label>Title</Form.Label>
            <Form.Control className='input-field'
              required={true}
              type="text"
              placeholder="Enter event title"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className='form-element'>
            <Form.Label>Date</Form.Label>
            <Form.Control
              className='input-field'
              required={true}
              type="datetime-local"
              value={ formatDateTime(event.date) }
              onChange={(e) => setEvent({ ...event, date: e.target.value })}
            />
          </Form.Group>
          <Form.Group className='form-element'>
            <Form.Label>Description</Form.Label>
            <Form.Control className='input-field'
              required={true}
              as="textarea"
              rows={2}
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className='modal-footer'>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={onSubmit}>{isEditing ? 'Update Event' : 'Create Event'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;

import React from 'react';
import { Accordion, Button } from 'react-bootstrap';

const TodoList = ({ events, onEventUpdate, onEventDelete }) => {
  const categorizedEvents = {
    Task: events.filter(event => event.type === 'Task'),
    Calling: events.filter(event => event.type === 'Calling'),
    Meeting: events.filter(event => event.type === 'Meeting'),
  };

  return (
    <div className="todo-list">
      <Accordion defaultActiveKey="0">
        {Object.keys(categorizedEvents).map((category, idx) => (
          <Accordion.Item eventKey={idx.toString()} key={category}>
            <Accordion.Header>{category}</Accordion.Header>
            <Accordion.Body>
              {categorizedEvents[category].length > 0 ? (
                categorizedEvents[category].map(event => (
                  <div key={event.id} className="event-item">
                    <strong>{event.title}</strong>
                    <p>{new Date(event.start).toLocaleString()}</p>
                    {/* Display event type here */}
                    <p>Type: {event.type}</p>
                    <Button variant="warning" onClick={() => onEventUpdate(event)}>Update</Button>
                    <Button variant="danger" onClick={() => onEventDelete(event.id)}>Delete</Button>
                  </div>
                ))
              ) : (
                <p className="text-muted">No events in this category.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default TodoList;


from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from pymongo import MongoClient
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId

app = FastAPI()

#configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000','*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Replace with your Atlas connection string
from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://mufeeza:hey12345@cluster0.3tkla0b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri)
db = client["eventdb"]
collection = db["events"]

class Event(BaseModel):
    type: str
    title: str = None  # Title is optional for non-Task events
    date: str
    description: str

def serialize(event):
    event['_id'] =str(event['_id'])  
    return event  

@app.post("/events")
async def create_event(event: Event):
    try:
        event_dict = event.model_dump()
        result = collection.insert_one(event_dict)
        return {"id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error saving event to database")

@app.get("/events")
async def get_events():
    try:
        events = list(collection.find())
        for event in events:
            event['_id'] =str(event['_id'])
        return events
    except Exception as e :
        raise HTTPException(status_code=500, detail= "Error fetching events from database")  
    
@app.delete("/events/{event_id}")
async def delete_event(event_id: str):
    try:
        object_id = ObjectId(event_id)
    except:
        raise HTTPException(status_code=400, detail=f"{event_id} is not a valid ObjectId")
    
    result = collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"detail": "Event deleted"}

# Define the model for updating events
class EventUpdate(BaseModel):
    title: Optional[str]
    date: str  # or date type
    description: Optional[str]

@app.put("/events/{event_id}")
async def update_event(event_id: str, event: EventUpdate):
    try:
        object_id = ObjectId(event_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    result = collection.update_one({"_id": object_id}, {"$set": event.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")

    return {"message": "Event updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
# sportly_event_recommender.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()
# middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Step 1: User Profile Setup
class UserProfile(BaseModel):
    user_id: str
    name: str
    location: str
    interests: List[str]
    origin_country: str
    preferred_group_type: str
    active_times: List[str]

# Step 2: Event Database Setup
class Event(BaseModel):
    event_id: str
    title: str
    sport: str
    tags: List[str]
    datetime: str
    venue: str
    type: str
    location: str
    popularity_score: float

EVENT_DB: List[Event] = [
    Event(
        event_id="ipl_nyc_001",
        title="IPL Watch Party - Midtown Bar",
        sport="Cricket",
        tags=["IPL", "Cricket", "Indian Community"],
        datetime="2025-05-06T18:00:00",
        venue="Midtown Sports Bar",
        type="in-person",
        location="New York, NY",
        popularity_score=4.7
    ),
    Event(
        event_id="nba_brooklyn_001",
        title="NBA Playoffs Watch - Brooklyn Arena",
        sport="Basketball",
        tags=["NBA", "Basketball", "Playoffs"],
        datetime="2025-05-07T20:00:00",
        venue="Brooklyn Arena Lounge",
        type="in-person",
        location="Brooklyn, NY",
        popularity_score=4.5
    ),
    Event(
        event_id="soccer_virtual_001",
        title="Virtual Champions League Hangout",
        sport="Soccer",
        tags=["Champions League", "Football", "Virtual"],
        datetime="2025-05-08T21:00:00",
        venue="Online Zoom Meetup",
        type="virtual",
        location="New York, NY",
        popularity_score=4.0
    ),
    Event(
        event_id="tennis_usopen_001",
        title="US Open Watch Party",
        sport="Tennis",
        tags=["Tennis", "US Open", "NYC Fans"],
        datetime="2025-05-09T15:00:00",
        venue="Queens Tennis Pub",
        type="in-person",
        location="Queens, NY",
        popularity_score=3.9
    ),
    Event(
        event_id="cricket_virtual_002",
        title="IPL Virtual Hangout - Semi Finals",
        sport="Cricket",
        tags=["IPL", "Cricket", "Indian Community", "Virtual"],
        datetime="2025-05-10T19:00:00",
        venue="Online Discord Server",
        type="virtual",
        location="New York, NY",
        popularity_score=4.3
    )
]

# Step 3: Scoring Algorithm
from datetime import datetime

def calculate_event_score(user: UserProfile, event: Event) -> float:
    score = 0
    
    # Normalize strings for case-insensitivity and removing spaces
    def normalize(s: str) -> str:
        if isinstance(s, str):
            return s.lower().replace(" ", "")
        return str(s).lower().replace(" ", "")

    user_interests_normalized = [normalize(interest) for interest in user.interests]
    event_tags_normalized = [normalize(tag) for tag in event.tags]

    # Match on sport
    if normalize(event.sport) in user_interests_normalized:
        score += 5

    # Match on general tags (only if the tag overlaps with user interests)
    if any(tag in user_interests_normalized for tag in event_tags_normalized):
        score += 3

    # Location match (city-level)
    if normalize(user.location) in normalize(event.location):
        score += 2

    # Popularity score (directly added)
    score += event.popularity_score

    # Time-of-day preference check
    event_time = datetime.fromisoformat(event.datetime)  # Convert string to datetime
    event_hour = event_time.hour  # Extract the hour of the event

    # Check against user active times
    time_of_day_boost = 0
    if "morning" in user.active_times and 6 <= event_hour < 12:
        time_of_day_boost += 2
    if "afternoon" in user.active_times and 12 <= event_hour < 18:
        time_of_day_boost += 2
    if "evening" in user.active_times and 18 <= event_hour < 24:
        time_of_day_boost += 2

    score += time_of_day_boost

    return score




# Step 4: Recommend Events
def recommend_events(user: UserProfile, events: List[Event]) -> List[Event]:
    normalize = lambda s: s.lower().replace(" ", "")
    user_interests_normalized = [normalize(interest) for interest in user.interests]
    scored_events = []
    for event in events:
        if normalize(event.sport) not in user_interests_normalized:
            continue
        score = calculate_event_score(user, event)
        scored_events.append((score, event))
    scored_events.sort(reverse=True, key=lambda x: x[0])
    return [e for s, e in scored_events if s > 5]


# Step 6: FastAPI Endpoints
@app.post("/events")
def add_event(event: Event):
    EVENT_DB.append(event)
    return {"message": "Event added successfully."}

@app.post("/recommendations")
def get_recommendations(user: UserProfile):
    if not EVENT_DB:
        raise HTTPException(status_code=404, detail="No events available")
    recommended = recommend_events(user, EVENT_DB)
    return {"recommended_events": recommended}

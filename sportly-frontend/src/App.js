import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        location: '',
        interests: '',
        origin_country: '',
        preferred_group_type: '',
        active_times: ''
    });

    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userPayload = {
            ...formData,
            interests: formData.interests.split(',').map(i => i.trim()),
            active_times: formData.active_times.split(',').map(t => t.trim())
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/recommendations', userPayload);
            setResults(response.data.recommended_events);
        } catch (error) {
            console.error("Error fetching recommendations", error);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Sportly Event Recommender</h2>
            <form onSubmit={handleSubmit}>
                <input name="user_id" placeholder="User ID" onChange={handleChange} /><br />
                <input name="name" placeholder="Name" onChange={handleChange} /><br />
                <input name="location" placeholder="Location" onChange={handleChange} /><br />
                <input name="interests" placeholder="Interests (comma separated)" onChange={handleChange} /><br />
                <input name="origin_country" placeholder="Origin Country" onChange={handleChange} /><br />
                <input name="preferred_group_type" placeholder="Preferred Group Type" onChange={handleChange} /><br />
                <input name="active_times" placeholder="Active Times (comma separated)" onChange={handleChange} /><br />
                <button type="submit">Get Recommendations</button>
            </form>

            <h3>Recommended Events</h3>
            {results.map(event => (
                <div key={event.event_id} style={{ border: '1px solid gray', margin: 10, padding: 10 }}>
                    <h4>{event.title}</h4>
                    <p><b>Sport:</b> {event.sport}</p>
                    <p><b>Date:</b> {event.datetime}</p>
                    <p><b>Type:</b> {event.type}</p>
                    <p><b>Location:</b> {event.location}</p>
                </div>
            ))}
        </div>
    );
}

export default App;

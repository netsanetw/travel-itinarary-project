import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Form = () => {
    const [title, setTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activities, setActivities] = useState(['']);
    const navigate = useNavigate();

    const handleActivityChange = (index, value) => {
        const newActivities = [...activities];
        newActivities[index] = value;
        setActivities(newActivities);
    };

    const addActivity = () => {
        setActivities([...activities, '']);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (new Date(startDate) >= new Date(endDate)) {
            alert('End date must be after start date.');
            return;
        }

        const itineraryData = { id: Date.now().toString(), title, destination, startDate, endDate, activities };

        let existingItineraries;
        try {
            const storedItineraries = localStorage.getItem('itineraries');
            existingItineraries = storedItineraries ? JSON.parse(storedItineraries) : [];
        } catch (error) {
            console.error('Error parsing itineraries from local storage:', error);
            existingItineraries = [];
        }

        existingItineraries.push(itineraryData);
        localStorage.setItem('itineraries', JSON.stringify(existingItineraries));

        setTitle('');
        setDestination('');
        setStartDate('');
        setEndDate('');
        setActivities(['']);

        navigate(`/itinerary/${itineraryData.id}`, { state: { itinerary: itineraryData, updated: true } });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New Itinerary</h2>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            <h3>Activities</h3>
            {activities.map((activity, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Activity ${index + 1}`}
                    value={activity}
                    onChange={(e) => handleActivityChange(index, e.target.value)}
                />
            ))}
            <button type="button" onClick={addActivity}>Add Activity</button>
            <button type="submit">Create Itinerary</button>
        </form>
    );
};

export default Form;
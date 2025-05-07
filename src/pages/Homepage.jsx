import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div>
            <h1>Welcome to Your Travel Itinerary App</h1>
            <Link to="/create">
                <button>Create New Itinerary</button>
            </Link>
            <Link to="/itinerary/:id">
                <button>View Itineraries</button>
            </Link>
        </div>
    );
};

export default Homepage;
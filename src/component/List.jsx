import React from 'react';
import { useNavigate } from 'react-router-dom';

const List = ({ itineraries }) => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Your Itineraries</h2>
            <ul>
                {itineraries.map((itinerary) => (
                    <li key={itinerary.id} onClick={() => navigate(`/itinerary/${itinerary.id}`)} style={{ cursor: 'pointer' }}>
                        {itinerary.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default List;

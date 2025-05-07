export const getItineraryById = (id) => {
    return fetch(`http://localhost:5011/api/itineraries/${id}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching itinerary:', error);
            return null;
        });
};

export const getAllItineraries = () => {
    return fetch(`http://localhost:5011/api/itineraries`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching all itineraries:', error);
            return [];
        });
};
const express = require('express');
const app = express();
const PORT = 5011;

app.use(express.json());

// Enable CORS to allow requests from the React app (http://localhost:3000)
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' })); // Install with: npm install cors in the server directory

// Sample itineraries data
const itineraries = [
    { id: '1', title: 'Trip to Hawaii', destination: 'Hawaii', startDate: '2023-06-01', endDate: '2023-06-10', activities: ['Surfing', 'Hiking'] },
    { id: '2', title: 'European Adventure', destination: 'Europe', startDate: '2023-07-15', endDate: '2023-08-01', activities: ['Sightseeing', 'Museum Visits', 'Culinary Tours'] },
];

// Endpoint for fetching all itineraries
app.get('/api/itineraries', (req, res) => {
    console.log('Fetching all itineraries'); // Debug log
    res.json(itineraries);
});

// Endpoint for fetching itinerary by ID
app.get('/api/itineraries/:id', (req, res) => {
    console.log(`Fetching itinerary with id: ${req.params.id}`); // Debug log
    const itinerary = itineraries.find(it => it.id === req.params.id);
    if (itinerary) {
        res.json(itinerary);
    } else {
        res.status(404).send('Itinerary not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getItineraryById, getAllItineraries } from '../Service/api'; // Correct path

export const Detail = () => {
    const { id } = useParams(); // Get the itinerary ID from URL
    const location = useLocation(); // Get the navigation state
    const [itinerary, setItinerary] = useState(null); // For single itinerary
    const [allItineraries, setAllItineraries] = useState([]); // For list view
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        console.log('Current ID:', id);
        console.log('Location State:', location.state);

        // Helper function to get itinerary from localStorage
        const getItineraryFromLocalStorage = (id) => {
            const storedItineraries = localStorage.getItem('itineraries');
            if (!storedItineraries) {
                console.log('No itineraries in localStorage');
                return null;
            }
            const itineraries = JSON.parse(storedItineraries);
            console.log('Local Itineraries:', itineraries);
            return itineraries.find(it => it.id === id);
        };

        // Helper function to get all itineraries from localStorage
        const getAllItinerariesFromLocalStorage = () => {
            const storedItineraries = localStorage.getItem('itineraries');
            if (!storedItineraries) {
                console.log('No itineraries in localStorage for list');
                return [];
            }
            const itineraries = JSON.parse(storedItineraries);
            console.log('Local Itineraries for list:', itineraries);
            return itineraries;
        };

        // Helper function to save itinerary to localStorage list
        const saveItineraryToLocalStorage = (newItinerary) => {
            const storedItineraries = localStorage.getItem('itineraries');
            let itineraries = storedItineraries ? JSON.parse(storedItineraries) : [];
            const existingIndex = itineraries.findIndex(it => it.id === newItinerary.id);
            if (existingIndex !== -1) {
                itineraries[existingIndex] = newItinerary; // Update existing
            } else {
                itineraries.push(newItinerary); // Add new
            }
            localStorage.setItem('itineraries', JSON.stringify(itineraries));
            setAllItineraries(itineraries);
            console.log('Updated Local Itineraries:', itineraries);
        };

        // Special case: If id is "all", display all itineraries
        if (id === 'all') {
            const localItineraries = getAllItinerariesFromLocalStorage();
            console.log('Attempting to fetch server itineraries from:', 'http://localhost:5011/api/itineraries');
            getAllItineraries()
                .then(serverItineraries => {
                    console.log('Raw Server Response:', serverItineraries);
                    if (!Array.isArray(serverItineraries)) {
                        console.error('Server response is not an array:', serverItineraries);
                        setError('Server returned invalid data.');
                        setAllItineraries(localItineraries);
                        setLoading(false);
                        return;
                    }
                    const combinedItineraries = [...serverItineraries];
                    localItineraries.forEach(localIt => {
                        if (!combinedItineraries.some(it => it.id === localIt.id)) {
                            combinedItineraries.push(localIt);
                        }
                    });
                    localStorage.setItem('itineraries', JSON.stringify(combinedItineraries));
                    setAllItineraries(combinedItineraries);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Fetch Error Details:', err.message);
                    setAllItineraries(localItineraries);
                    setError(`Failed to fetch server itineraries: ${err.message}. Showing local data.`);
                    setLoading(false);
                });
        } else {
            // Normal case: Display a single itinerary
            const passedItinerary = location.state?.itinerary;
            if (passedItinerary && passedItinerary.id === id) {
                console.log('Using passed itinerary:', passedItinerary);
                setItinerary(passedItinerary);
                saveItineraryToLocalStorage(passedItinerary);
                setLoading(false);
            } else {
                const cachedItinerary = getItineraryFromLocalStorage(id);
                if (cachedItinerary) {
                    console.log('Using cached itinerary:', cachedItinerary);
                    setItinerary(cachedItinerary);
                    setLoading(false);
                } else {
                    console.log('Fetching from server for id:', id, 'from:', `http://localhost:5011/api/itineraries/${id}`);
                    getItineraryById(id)
                        .then(fetchedItinerary => {
                            if (fetchedItinerary) {
                                setItinerary(fetchedItinerary);
                                saveItineraryToLocalStorage(fetchedItinerary);
                            } else {
                                setError('Itinerary not found on server.');
                            }
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Error fetching itinerary:', err);
                            setError(`Failed to fetch itinerary: ${err.message}. Check your connection or data.`);
                            setLoading(false);
                        });
                }
            }

            // Sync allItineraries with local and server data
            const localItineraries = getAllItinerariesFromLocalStorage();
            getAllItineraries()
                .then(serverItineraries => {
                    if (!Array.isArray(serverItineraries)) {
                        console.error('Server itineraries is not an array:', serverItineraries);
                        return;
                    }
                    const combinedItineraries = [...serverItineraries];
                    localItineraries.forEach(localIt => {
                        if (!combinedItineraries.some(it => it.id === localIt.id)) {
                            combinedItineraries.push(localIt);
                        }
                    });
                    setAllItineraries(combinedItineraries);
                })
                .catch(err => {
                    console.error('Error syncing all itineraries:', err);
                    setAllItineraries(localItineraries);
                });
        }
    }, [id, location.state]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Special case: Display list if id is "all"
    if (id === 'all') {
        return (
            <div>
                <h2>Available Itineraries</h2>
                {allItineraries.length > 0 ? (
                    <ul>
                        {allItineraries.map(it => (
                            <li key={it.id}>
                                <Link to={`/itinerary/${it.id}`}>
                                    <strong>{it.title}</strong> - {it.destination} ({it.startDate} to {it.endDate})
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No itineraries available.</p>
                )}
            </div>
        );
    }

    // Normal case: Display single itinerary
    if (!itinerary) return <div>Itinerary not found.</div>;

    return (
        <div>
            <h1>{itinerary.title}</h1>
            <p><strong>Destination:</strong> {itinerary.destination}</p>
            <p><strong>Travel Dates:</strong> {itinerary.startDate} to {itinerary.endDate}</p>
            <p><strong>Activities:</strong></p>
            <ul>
                {itinerary.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                ))}
            </ul>
        </div>
    );
};

export default Detail;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Homepage from './pages/Homepage.jsx';
import Itinerary from './pages/Itinerary.jsx';
import Form from './component/Form.jsx';
import './App.css';
import List from './component/List.jsx';

const App = () => {
    return (
        <Router>
            <main>
            <Routes>
                <Route path="/" element={<Homepage />} /> {/* Use element prop */}
                <Route path="/itinerary/:id" element={<Itinerary />} />
                <Route path="/create" element={<Form />} />
            </Routes>
            </main>
        </Router>
    );
};

export default App;
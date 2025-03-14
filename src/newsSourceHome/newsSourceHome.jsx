import React from 'react';
import './newsSourceHome.css';

export function NewsSourceHome(
  { selectedNewsSource, setSelectedNewsSource }) {
    const handleChange = (event) => {
      setSelectedNewsSource(event.target.value);
    };
    
  return (
    <main>
      <label className="Select-News-Source" for="options">Select your local news source</label>
      <select 
        style={{ marginTop: '8px' }} 
        id="options" 
        name="options" 
        onChange={handleChange}
      >
        <option value="New York Times">New York Times</option>
        <option value="Salt Lake Tribune">Salt Lake Tribune</option>
        <option value="Sam's News Source">Sam's News Source</option>
      </select>
    </main>
  );
}
import React, { useState } from 'react';
import './newsSourceHome.css';

export function NewsSourceHome({ selectedNewsSource, setSelectedNewsSource }) {
  const handleChange = (event) => {
    setSelectedNewsSource(event.target.value);
  };

  return (
    <main>
      <label className="Select-News-Source" htmlFor="options">Select your local news source</label>
      <select 
        style={{ marginTop: '8px' }} 
        id="options" 
        name="options" 
        onChange={handleChange}
      >
        <option value="the-wall-street-journal">Wall Street Journal</option>
        <option value="politico">Politico</option>
        <option value="Sam's News Source">Sam's News Source</option>
      </select>
    </main>
  );
}
import React, { useState, useEffect } from 'react';
import './newsSourceHome.css';

export function NewsSourceHome({ selectedNewsSource, setSelectedNewsSource }) {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const profile = await response.json();
          setSelectedNewsSource(profile.newsSource || '');
        } else {
          console.error('Failed to fetch profile:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [setSelectedNewsSource]);

  const handleChange = async (event) => {
    const newsSource = event.target.value;
    setSelectedNewsSource(newsSource);

    try {
      const response = await fetch('/api/user/news-source', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newsSource }),
      });

      if (!response.ok) {
        console.error('Failed to save news source:', await response.json());
      }
    } catch (error) {
      console.error('Error saving news source:', error);
    }
  };

  return (
    <main>
      <label className="Select-News-Source" htmlFor="options">Select your local news source</label>
      <select 
        style={{ marginTop: '8px' }} 
        id="options" 
        name="options" 
        onChange={handleChange}
        value={selectedNewsSource}
      >
        <option value="the-wall-street-journal">Wall Street Journal</option>
        <option value="politico">Politico</option>
        <option value="Sam's News Source">Sam's News Source</option>
      </select>
    </main>
  );
}
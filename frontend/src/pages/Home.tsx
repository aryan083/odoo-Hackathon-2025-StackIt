import React, { useState } from 'react';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <MainContent searchTerm={searchTerm} />
      {/* <h2>Home</h2>
      <p>Welcome to the StackIt home page!</p> */}
    </div>
  );
}

export default Home;
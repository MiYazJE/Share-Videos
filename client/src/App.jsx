/* eslint linebreak-style: ["error", "unix"] */
import React from 'react';
import SearchBar from './components/SearchBar';
import './app.scss';

const App = () => (
    <div id="mainContent">
        <header>
            <nav />
        </header>
        <main>
            <SearchBar />
        </main>
    </div>
);

export default App;

import React from 'react';
import Input from '@material-ui/core/TextField';
import './searchBar.scss';

const SearchBar = () => {
    const searchText = ({ target }) => {
        console.log(target.value);
    };

    return (
        <div id="wrapSearchBar">
            <Input onChange={searchText} id="search" placeholder="Busca un vídeo" />
        </div>
    );
};

export default SearchBar;

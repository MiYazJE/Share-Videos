import React from 'react';
import Input from '@material-ui/core/TextField';
import { searchYoutubeVideo } from '../../Http/api';
import './searchBar.scss';

const SearchBar = () => {
    const searchText = async ({ target }) => {
        const data = await searchYoutubeVideo(target.value);
        console.log(data);
    };

    return (
        <div id="wrapSearchBar">
            <Input onChange={searchText} id="search" placeholder="Busca un vídeo" />
        </div>
    );
};

export default SearchBar;

import React from 'react';
import Input from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { searchVideoSuggestions, searchYoutubeVideos } from '../../Http/api';
import './searchBar.scss';
import { useState } from 'react';

const Video = ({ title }) => (
    <div className="video">
        <div className="top">
            <span className="title">{title}</span>
        </div>
        <div className="bottom">

        </div>
    </div>
);

const SearchBar = () => {
    const [videosSuggested, setVideosSuggested] = useState([]);
    const [videos, setVideos] = useState([]);

    const searchAutoCompletation = async ({ target }) => {
        if (!target.value) {
            setVideosSuggested([]);
            return;
        };
        const data = await searchVideoSuggestions(target.value);
        setVideosSuggested([...data]);
    };

    const getVideos = async (searched) => {
        const videos = await searchYoutubeVideos(searched);
        setVideos(videos);
    }

    return (
        <div id="wrapSearchBar">
            <Autocomplete
                onChange={(_, searched) => getVideos(searched)}
                style={{ width: 300 }}
                options={videosSuggested}
                renderInput={(params) => (
                    <Input {...params} onChange={searchAutoCompletation} id="search" placeholder="Busca un vídeo" />
                )}
            />
            <div className="videosContainer">
                {videos.map(video => <Video {...video} />)}
            </div>
        </div>
    );
};

export default SearchBar;

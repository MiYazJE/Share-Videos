import React from 'react';
import Input from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { searchVideoSuggestions, searchYoutubeVideos } from '../../Http/api';
import ReactPlayer from 'react-player';
import './searchBar.scss';
import { useState } from 'react';

const INITIAL_URL_VIDEO = 'https://www.youtube.com/watch?v=A1xEete-zHM';

const Video = ({ title, urlThumbnail, url, changeVideo }) => (
    <div className="video">
        <div className="top">
            <img onClick={() => changeVideo(`https://youtube.com/${url}`)} src={urlThumbnail}/>
        </div>
        <div className="bottom">
            <p className="title">{title}</p>
        </div>
    </div>
);

const SearchBar = () => {
    const [urlVideo, setUrlVideo] = useState('')
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

    const changeVideo = (url) => {
        setUrlVideo(url);
    }

    return (
        <div id="wrapVideoPlayer">
            <Autocomplete
                onChange={(_, searched) => getVideos(searched)}
                style={{ width: '70%', maxWidth: 350 }}
                options={videosSuggested}
                renderInput={(params) => (
                    <Input {...params} onChange={searchAutoCompletation} id="search" placeholder="Search a video" />
                )}
                noOptionsText="No results"
            />
            <div className="reactPlayer">
                <ReactPlayer width="100%" height="100%" controls={true} url={urlVideo} />
            </div>
            <div className="videosContainer">
                {videos.map(video => <Video key={video.url} changeVideo={changeVideo} {...video} />)}
            </div>
        </div>
    );
};

export default SearchBar;

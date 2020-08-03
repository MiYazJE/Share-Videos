import React, { useState } from 'react';
import Input from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { searchVideoSuggestions, searchYoutubeVideos } from '../../Http/api';
import ReactPlayer from 'react-player';
import './searchBar.scss';
import { useRef } from 'react';

const INITIAL_URL_VIDEO = 'https://www.youtube.com/watch?v=A1xEete-zHM';

const Video = ({ title, urlThumbnail, url, changeVideo }) => (
    <div className="video">
        <div className="top">
            <img onClick={() => changeVideo(`https://youtube.com${url}`)} src={urlThumbnail}/>
        </div>
        <div className="bottom">
            <p className="title">{title}</p>
        </div>
    </div>
);

const SearchBar = () => {
    const [loading, setLoading] = useState(false);
    const [urlVideo, setUrlVideo] = useState(INITIAL_URL_VIDEO)
    const [videosSuggested, setVideosSuggested] = useState([]);
    const [videos, setVideos] = useState([]);

    const refResultVideos = useRef();

    const searchAutoCompletation = async (value) => {
        if (!value) {
            setVideosSuggested([]);
            return;
        };
        const data = await searchVideoSuggestions(value);
        setVideosSuggested([...data]);
    };

    const getVideos = async (searched) => {
        setLoading(true);
        searchAutoCompletation(searched);
        const videos = await searchYoutubeVideos(searched);
        setVideos(videos);
        setLoading(false);
        scroll(refResultVideos);
    }

    const changeVideo = (url) => {
        setUrlVideo(url);
    }

    const scroll = (ref) => ref.current.scrollIntoView({ behavior: 'smooth' });

    return (
        <div id="wrapVideoPlayer">
            <div className="wrapSearchBar">
                <Autocomplete
                    onChange={(_, searched) => getVideos(searched)}
                    style={{ width: '70%', maxWidth: 350 }}
                    options={videosSuggested}
                    renderInput={(params) => (
                        <Input {...params} onChange={({ target }) => searchAutoCompletation(target.value)} id="search" placeholder="Search a video" />
                    )}
                    noOptionsText="No results"
                />
                {loading ? <CircularProgress style={{marginLeft: '30px'}} size={30} /> : null}
            </div>
            <div className="reactPlayer">
                <ReactPlayer width="100%" height="100%" controls={true} url={urlVideo} />
            </div>
            <div ref={refResultVideos} className="videosContainer">
                {videos.map(video => <Video key={video.url} changeVideo={changeVideo} {...video} />)}
            </div>
        </div>
    );
};

export default SearchBar;

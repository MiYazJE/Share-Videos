import React, { useRef, useEffect } from 'react';
import Input from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { setUrlVideo, getSuggestedVideos, getVideos } from '../../actions/userActions';
import { readLoadingVideos, readUrlVideo, readSuggestedVideos, readVideos } from '../../reducers/userReducer';
import './room.scss';

const Video = ({ title, urlThumbnail, url, changeVideo }) => (
    <div className="video">
        <div className="top">
            <img 
                alt="Thumbnail" 
                onClick={() => changeVideo(`https://youtube.com${url}`)} 
                src={urlThumbnail}
            />
        </div>
        <div className="bottom">
            <p className="title">{title}</p>
        </div>
    </div>
);

const Room = ({ 
    loading, 
    urlVideo, 
    videosSuggested, 
    videos, 
    getVideos, 
    getSuggestedVideos, 
    setUrlVideo 
}) => {

    const refResultVideos = useRef();

    const scrollTo = (ref) => ref.current.scrollIntoView({ behavior: 'smooth' });

    return (
        <div id="wrapVideoPlayer">
            <div className="wrapSearchBar">
                <Autocomplete
                    onChange={(_, searched) => getVideos(searched, () => scrollTo(refResultVideos))}
                    style={{ width: '70%', maxWidth: 350 }}
                    options={videosSuggested}
                    renderInput={(params) => (
                        <Input 
                            {...params} 
                            onChange={({ target }) => getSuggestedVideos(target.value)} 
                            id="search" 
                            placeholder="Search a video" 
                        />
                    )}
                    noOptionsText="No results"
                />
                {loading ? <CircularProgress style={{marginLeft: '30px'}} size={30} /> : null}
            </div>
            <div className="reactPlayer">
                <ReactPlayer width="100%" height="100%" controls={true} url={urlVideo} />
            </div>
            <div ref={refResultVideos} className="videosContainer">
                {videos.map(video => <Video key={video.url} changeVideo={setUrlVideo} {...video} />)}
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    urlVideo: readUrlVideo(state),
    loading: readLoadingVideos(state),
    videosSuggested: readSuggestedVideos(state),
    videos: readVideos(state),
});

const mapDispatchToProps = dispatch => ({
    setUrlVideo: (url) => dispatch(setUrlVideo(url)),
    getVideos: (query, callback) => dispatch(getVideos(query, callback)),
    getSuggestedVideos: (query) => dispatch(getSuggestedVideos(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

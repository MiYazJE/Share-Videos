import React, { useRef, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Input from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { setUrlVideo, getSuggestedVideos, getVideos, joinRoom, setName } from '../../actions/userActions';
import { readLoadingVideos, readUrlVideo, readSuggestedVideos, readVideos, readName } from '../../reducers/userReducer';
import { readRoomName, readUsers, readIsLoading } from '../../reducers/roomReducer';
import DialogName from './DialogName';
import { isValidRoom } from '../../actions/roomActions';
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
    setUrlVideo,
    roomName,
    users,
    isValidRoom,
    isLoading,
    checkIsValidRoom,
    joinRoom,
    name,
    setName
}) => {
    const [openDialog, setOpenDialog] = useState(false);

    const refResultVideos = useRef();
    const history = useHistory();
    const { id } = useParams();

    // If the room is not valid it will redirect the user to the homepage
    useEffect(() => {
        (async () => {
            checkIsValidRoom(id, () => history.push('/'));
        })();
    }, [history, id, checkIsValidRoom, name]);
    
    // If the user does not have a name it will ask for it
    useEffect(() => {
        setOpenDialog(id && !name);
        if (id && name) joinRoom({ id, name });
    }, [id, name, joinRoom]);

    const scrollTo = (ref) => ref.current.scrollIntoView({ behavior: 'smooth' });

    const onCancelDialog = () => history.push('/');

    const onAcceptDialog = (nickname) => {
        if (nickname) {
            setName(nickname);
            setOpenDialog(false);
        }
    }

    return (
        <main>
            {isLoading 
                ? <CircularProgress style={{ position: 'absolute', top: '50%' }} /> 
                : (
                    <div id="wrapVideoPlayer">
                        {openDialog 
                            ? <DialogName 
                                    open={openDialog} 
                                    onCancel={onCancelDialog} 
                                    onAccept={onAcceptDialog}
                                /> 
                            : null 
                        }
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
                )}
        </main>
    );
};

const mapStateToProps = state => ({
    urlVideo: readUrlVideo(state),
    loading: readLoadingVideos(state),
    videosSuggested: readSuggestedVideos(state),
    videos: readVideos(state),
    users: readUsers(state),
    roomName: readRoomName(state),
    isLoading: readIsLoading(state),
    name: readName(state),
});

const mapDispatchToProps = dispatch => ({
    setUrlVideo: (url) => dispatch(setUrlVideo(url)),
    getVideos: (query, callback) => dispatch(getVideos(query, callback)),
    getSuggestedVideos: (query) => dispatch(getSuggestedVideos(query)),
    checkIsValidRoom: (id, redirect) => dispatch(isValidRoom(id, redirect)),
    joinRoom: (payload) => dispatch(joinRoom(payload)),
    setName: (name) => dispatch(setName(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

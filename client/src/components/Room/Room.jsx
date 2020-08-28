import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';

// IMPORT COMPONENTS
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPlayer from 'react-player';

// CUSTOM COMPONENTS
import DialogName from './DialogName';
import CustomTabs from '../Tabs';
import NavBar from '../NavBar';
import ResultVideos from '../ResultVideos';

// REDUX
import { connect } from 'react-redux';
import { setName } from '../../actions/userActions';
import { readName } from '../../reducers/userReducer';
import { 
    readRoomName, 
    readIsLoading, 
    readUrlVideo, 
    readIsPlaying, 
    readHost, 
    readSeekVideo, 
    readProgress,
    readActualVideoId,
    readTitle
} from '../../reducers/roomReducer';
import { 
    isValidRoom, 
    joinRoom, 
    sendPlayerState, 
    sendProgress,
    setSeekVideo,
    removeVideo
} from '../../actions/roomActions';

import './room.scss';

const Room = ({ 
    urlVideo, 
    host,
    name,
    idRoom,
    isLoading,
    joinRoom,
    isPlaying,
    setName,
    checkIsValidRoom,
    sendPlayerState,
    sendProgress,
    progressVideo,
    seekVideo,
    setSeekVideo,
    removeVideo,
    actualVideoId,
    title
}) => {
    const [playerHeight, setPlayerHeight] = useState(window.innerWidth < 700 ? '35vh' : '70vh');
    const [openDialog, setOpenDialog] = useState(false);

    const refVideoResults = useRef();
    const refPlayer = useRef();
    const history = useHistory();
    const { id } = useParams();

    // If the room is not valid it will redirect the user to the homepage
    useEffect(() => {
        checkIsValidRoom(id, () => history.push('/'));
    }, [history, id, checkIsValidRoom]);
    
    // If the user does not have a name it will ask for it
    useEffect(() => {
        setOpenDialog(id && !name);
        if (id && name) joinRoom({ id, name });
    }, [id, name, joinRoom]);
    
    useEffect(() => {
        if (seekVideo) {
            refPlayer.current.seekTo(progressVideo);
            setSeekVideo(false);
        }
    }, [seekVideo, progressVideo, setSeekVideo]);

    useEffect(() => {
        window.addEventListener('resize', () => {
            console.log(window.innerWidth);
            setPlayerHeight(window.innerWidth < 700 ? '35vh' : '70vh');
        });
    }, []);

    const scrollTo = () => {
        refVideoResults.current.scrollIntoView({ behavior: 'smooth' });
    }

    const onCancelDialog = () => history.push('/');

    const onAcceptDialog = (nickname) => {
        if (nickname) {
            setName(nickname);
            setOpenDialog(false);
        } 
    }

    const handleSendProgress = (progress) => {
        if (name === host) {
            sendProgress({ progress: refPlayer.current.getCurrentTime(), idRoom, name });
        }
    }
    
    const handleOnPlay = () => {
        if (Math.abs(refPlayer.current.getCurrentTime() - progressVideo) > 0.2) {
            sendProgress({ progress: refPlayer.current.getCurrentTime(), idRoom, seekVideo: true, name });
        }
        sendPlayerState({ state: 'play', idRoom, name });
    }
    
    const handleOnPause = () => {
        sendPlayerState({ state: 'pause', idRoom, name });
    }

    const handleOnEnded = () => {
        removeVideo({ idVideo: actualVideoId, idRoom });
    }

    return (
        <main>
            {isLoading 
                ? <CircularProgress style={{ position: 'absolute', top: '50%' }} /> 
                : (
                    <div id="wrapVideoPlayer">
                        <NavBar scrollTo={scrollTo} />
                        <div className="reactPlayer">
                            <div className="player">
                                <ReactPlayer 
                                    ref={refPlayer}
                                    playing={isPlaying}
                                    onPlay={handleOnPlay}
                                    onPause={handleOnPause}
                                    onProgress={handleSendProgress}
                                    onEnded={handleOnEnded}
                                    width="100%" 
                                    height={playerHeight} 
                                    controls={true} 
                                    url={urlVideo} 
                                />
                                {window.innerWidth > 1300 
                                    ? <span style={{ marginTop: '10px' }}>{title}</span>
                                    : null
                                }
                            </div>
                            <div className="tabs">
                                <CustomTabs />
                            </div>
                        </div>
                        <ResultVideos refVideoResults={refVideoResults} />
                        {openDialog && <DialogName open={openDialog} onCancel={onCancelDialog} onAccept={onAcceptDialog} />}
                    </div>
                )}
        </main>
    );
};

const mapStateToProps = state => ({
    urlVideo: readUrlVideo(state),
    idRoom: readRoomName(state),
    isLoading: readIsLoading(state),
    name: readName(state),
    isPlaying: readIsPlaying(state),
    host: readHost(state),
    seekVideo: readSeekVideo(state),
    progressVideo: readProgress(state),
    actualVideoId: readActualVideoId(state),
    title: readTitle(state) 
});

const mapDispatchToProps = dispatch => ({
    checkIsValidRoom: (id, redirect) => dispatch(isValidRoom(id, redirect)),
    joinRoom: (payload) => dispatch(joinRoom(payload)),
    setName: (name) => dispatch(setName(name)),
    sendPlayerState: (payload) => dispatch(sendPlayerState(payload)),
    sendProgress: (payload) => dispatch(sendProgress(payload)),
    setSeekVideo: (seekVideo) => dispatch(setSeekVideo(seekVideo)),
    removeVideo: (idVideo, idRoom) => dispatch(removeVideo(idVideo, idRoom))
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
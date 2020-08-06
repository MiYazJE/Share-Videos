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
    readProgress 
} from '../../reducers/roomReducer';
import { 
    isValidRoom, 
    joinRoom, 
    sendPlayerState, 
    sendProgress,
    setSeekVideo,
    setIsPlaying, 
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
    setSeekVideo
}) => {
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
    }, [seekVideo]);

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
    
    const handleSendPlayerState = (state) => {
        if (Math.abs(refPlayer.current.getCurrentTime() - progressVideo) > 0.8) {
            console.log(Math.abs(refPlayer.current.getCurrentTime() - progressVideo));
            sendProgress({ progress: refPlayer.current.getCurrentTime(), idRoom, seekVideo: true, name });
        }
        console.log(name, state, seekVideo, isPlaying);
        setIsPlaying(true);
        sendPlayerState({ state, idRoom, name });
    }

    return (
        <main>
            {isLoading 
                ? <CircularProgress style={{ position: 'absolute', top: '50%' }} /> 
                : (
                    <div id="wrapVideoPlayer">
                        <NavBar scrollTo={scrollTo} />
                        <div className="reactPlayer">
                            <ReactPlayer 
                                ref={refPlayer}
                                playing={isPlaying}
                                onPlay={() => handleSendPlayerState('play')}
                                onPause={() => handleSendPlayerState('pause')}
                                onProgress={handleSendProgress}
                                width="100%" 
                                height="100%" 
                                controls={true} 
                                url={urlVideo} 
                            />
                        </div>
                        <CustomTabs />
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
    progressVideo: readProgress(state)
});

const mapDispatchToProps = dispatch => ({
    checkIsValidRoom: (id, redirect) => dispatch(isValidRoom(id, redirect)),
    joinRoom: (payload) => dispatch(joinRoom(payload)),
    setName: (name) => dispatch(setName(name)),
    sendPlayerState: (payload) => dispatch(sendPlayerState(payload)),
    sendProgress: (payload) => dispatch(sendProgress(payload)),
    setSeekVideo: (seekVideo) => dispatch(setSeekVideo(seekVideo))
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
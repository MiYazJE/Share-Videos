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
import { setName, whoAmI } from '../../actions/userActions';
import { readName } from '../../reducers/userReducer';
import {
    readRoomName,
    readIsLoading,
    readUrlVideo,
    readIsPlaying,
    readHost,
    readSeekVideo,
    readProgress,
    readCurrentVideoId
} from '../../reducers/roomReducer';
import {
    isValidRoom,
    joinRoom,
    sendPlayerState,
    sendProgress,
    setSeekVideo,
    removeVideo
} from '../../actions/roomActions';

import Scroller from '../Scroller/Scroller';
import './room.scss';
import MetaVideoInfo from './MetaVideoInfo';

const WIDTH_TO_RESIZE = 1300;

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
    currentVideoId,
}) => {
    const [playerHeight, setPlayerHeight] = useState(window.innerWidth < 700 ? '35vh' : '70vh');
    const [openDialog, setOpenDialog] = useState(false);
    const [floatPlayer, setFLoatPlayer] = useState(false);

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
        function onResize() {
            setPlayerHeight(window.innerWidth < 700 ? '35vh' : '70vh');
        }
        function onScroll() {
            setFLoatPlayer(window.innerWidth < WIDTH_TO_RESIZE && this.scrollY > 900);
        }

        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
        }
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

    const handleSendProgress = () => {
        if (name === host) {
            sendProgress({ progress: refPlayer.current.getCurrentTime(), idRoom, name });
        }
    }

    const handleOnPlay = () => {
        if (Math.abs(refPlayer.current.getCurrentTime() - progressVideo) > 1) {
            sendProgress({ progress: refPlayer.current.getCurrentTime(), idRoom, seekVideo: true, name });
        }
        sendPlayerState({ state: 'play', idRoom, name });
    }

    const handleOnPause = () => {
        sendPlayerState({ state: 'pause', idRoom, name });
    }

    const handleOnEnded = () => {
        removeVideo({ idVideo: currentVideoId, idRoom });
    }

    return (
        <main>
            {isLoading
                ? <CircularProgress style={{ position: 'absolute', top: '50%' }} />
                : (
                    <div id="wrapVideoPlayer">
                        <NavBar scrollTo={scrollTo} />
                        <div className="reactPlayer">
                            <div
                                style={{
                                    height: playerHeight,
                                    width: '100%',
                                    display: floatPlayer ? 'block' : 'none'
                                }}
                            />
                            <div
                                className={`player ${floatPlayer ? 'floatPlayer' : ''}`}
                            >
                                <ReactPlayer
                                    ref={refPlayer}
                                    playing={isPlaying}
                                    onPlay={handleOnPlay}
                                    onPause={handleOnPause}
                                    onProgress={handleSendProgress}
                                    onEnded={handleOnEnded}
                                    width="100%"
                                    height={floatPlayer ? null : playerHeight}
                                    controls={true}
                                    url={urlVideo}
                                />
                                {window.innerWidth > WIDTH_TO_RESIZE
                                    ? (
                                        <MetaVideoInfo />
                                    ) : null
                                }
                            </div>
                            <div className="tabs">
                                <CustomTabs />
                            </div>
                        </div>
                        <ResultVideos refVideoResults={refVideoResults} />
                        {openDialog && <DialogName open={openDialog} onCancel={onCancelDialog} onAccept={onAcceptDialog} />}
                        <Scroller />
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
    currentVideoId: readCurrentVideoId(state)
});

const mapDispatchToProps = dispatch => ({
    checkIsValidRoom: (id, redirect) => dispatch(isValidRoom(id, redirect)),
    joinRoom: (payload) => dispatch(joinRoom(payload)),
    setName: (name) => dispatch(setName(name)),
    sendPlayerState: (payload) => dispatch(sendPlayerState(payload)),
    sendProgress: (payload) => dispatch(sendProgress(payload)),
    setSeekVideo: (seekVideo) => dispatch(setSeekVideo(seekVideo)),
    removeVideo: (idVideo, idRoom) => dispatch(removeVideo(idVideo, idRoom)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
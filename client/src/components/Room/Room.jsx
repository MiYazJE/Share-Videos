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
import { readRoomName, readIsLoading, readUrlVideo, readIsPlaying } from '../../reducers/roomReducer';
import { isValidRoom, joinRoom, sendPlayerState } from '../../actions/roomActions';

import './room.scss';

const Room = ({ 
    urlVideo, 
    roomName,
    isLoading,
    checkIsValidRoom,
    joinRoom,
    name,
    setName,
    isPlaying,
    sendPlayerState
}) => {
    const [openDialog, setOpenDialog] = useState(false);

    const refVideoResults = useRef();
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

    const handleSendPlayerState = (state) => {
        sendPlayerState({ state, idRoom: roomName });
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
                                playing={isPlaying}
                                onPlay={() => handleSendPlayerState('play')}
                                onPause={() => handleSendPlayerState('pause')}
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
    roomName: readRoomName(state),
    isLoading: readIsLoading(state),
    name: readName(state),
    isPlaying: readIsPlaying(state),
});

const mapDispatchToProps = dispatch => ({
    checkIsValidRoom: (id, redirect) => dispatch(isValidRoom(id, redirect)),
    joinRoom: (payload) => dispatch(joinRoom(payload)),
    setName: (name) => dispatch(setName(name)),
    sendPlayerState: (payload) => dispatch(sendPlayerState(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
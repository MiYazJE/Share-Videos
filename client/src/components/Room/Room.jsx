import React, { useRef, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { setName } from '../../actions/userActions';
import { readName } from '../../reducers/userReducer';
import { readRoomName, readIsLoading, readVideos, readUrlVideo } from '../../reducers/roomReducer';
import { isValidRoom, joinRoom, enqueueVideo } from '../../actions/roomActions';
import DialogName from './DialogName';
import UsersGrid from '../UsersGrid';
import VideosGrid from '../VideosGrid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { FaUsers, FaPhotoVideo } from 'react-icons/fa';
import { AppBar } from '@material-ui/core';
import NavBar from '../NavBar/';
import './room.scss';

const Video = ({ title, urlThumbnail, url, addVideo }) => (
    <div className="video">
        <div className="top">
            <img 
                alt="Thumbnail" 
                onClick={() => addVideo({
                    title,
                    urlThumbnail,
                    url: `https://youtube.com${url}`,
                })} 
                src={urlThumbnail}
            />
        </div>
        <div className="bottom">
            <p className="title">{title}</p>
        </div>
    </div>
);

const TabPanel = ({ children, value, index, ...other }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`nav-tabpanel-${index}`}
        aria-labelledby={`nav-tab-${index}`}
        {...other}
    >
        {value === index && (
            <Box p={3}>
                <Typography>{children}</Typography>
            </Box>
        )}
    </div>
);

const Room = ({ 
    urlVideo, 
    videos, 
    roomName,
    isLoading,
    checkIsValidRoom,
    joinRoom,
    name,
    setName,
    enqueueVideo
}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);

    const refResultVideos = useRef();
    const history = useHistory();
    const { id } = useParams();

    // If the room is not valid it will redirect the user to the homepage
    useEffect(() => {
        (async () => {
            checkIsValidRoom(id, () => history.push('/'));
        })();
    }, [history, id, checkIsValidRoom]);
    
    // If the user does not have a name it will ask for it
    useEffect(() => {
        setOpenDialog(id && !name);
        if (id && name) joinRoom({ id, name });
    }, [id, name, joinRoom]);

    const scrollTo = (ref) => refResultVideos.current.scrollIntoView({ behavior: 'smooth' });

    const onCancelDialog = () => history.push('/');

    const onAcceptDialog = (nickname) => {
        if (nickname) {
            setName(nickname);
            setOpenDialog(false);
        }
    }

    const handleAddVideo = (video) => {
        console.log('adding video', video);
        enqueueVideo({ video, id });
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
                        <NavBar scrollTo={scrollTo} />
                        <div className="reactPlayer">
                            <ReactPlayer width="100%" height="100%" controls={true} url={urlVideo} />
                        </div>
                        <div className="tabs">
                            <AppBar position="static">
                                <Tabs 
                                    value={selectedTab}
                                    onChange={(e, newValue) => setSelectedTab(newValue)}
                                    variant="fullWidth"
                                    >
                                    <Tab icon={<FaUsers />} label="users" />
                                    <Tab icon={<FaPhotoVideo />} label="videos" />
                                </Tabs>
                            </AppBar>
                            <TabPanel value={selectedTab} index={0}>
                                <UsersGrid />
                            </TabPanel>
                            <TabPanel value={selectedTab} index={1}>
                                <VideosGrid />
                            </TabPanel>
                        </div>
                        <div ref={refResultVideos} className="videosContainer">
                            {videos.map(video => <Video key={video.url} addVideo={handleAddVideo} {...video} />)}
                        </div>
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
    videos: readVideos(state)
});

const mapDispatchToProps = dispatch => ({
    checkIsValidRoom: (id, redirect) => dispatch(isValidRoom(id, redirect)),
    joinRoom: (payload) => dispatch(joinRoom(payload)),
    enqueueVideo: (payload) => dispatch(enqueueVideo(payload)),
    setName: (name) => dispatch(setName(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
import React, { useRef, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Input from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { setName } from '../../actions/userActions';
import { readName } from '../../reducers/userReducer';
import { readRoomName, readUsers, readIsLoading, readSuggestedVideos, readUrlVideo, readLoadingVideos, readVideos } from '../../reducers/roomReducer';
import { isValidRoom, setUrlVideo, getVideos, getSuggestedVideos, joinRoom, enqueueVideo } from '../../actions/roomActions';
import DialogName from './DialogName';
import UsersGrid from '../UsersGrid';
import VideosGrid from '../VideosGrid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { FaUsers, FaPhotoVideo } from 'react-icons/fa';
import { AppBar } from '@material-ui/core';
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
    videosSuggested, 
    videos, 
    getVideos, 
    getSuggestedVideos, 
    setUrlVideo,
    roomName,
    users,
    isLoading,
    loadingVideos,
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

    const scrollTo = (ref) => ref.current.scrollIntoView({ behavior: 'smooth' });

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
                            {loadingVideos ? <CircularProgress style={{marginLeft: '30px'}} size={30} /> : null}
                        </div>
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
    videosSuggested: readSuggestedVideos(state),
    videos: readVideos(state),
    users: readUsers(state),
    roomName: readRoomName(state),
    isLoading: readIsLoading(state),
    loadingVideos: readLoadingVideos(state),
    name: readName(state),
});

const mapDispatchToProps = dispatch => ({
    getVideos: (query, callback) => dispatch(getVideos(query, callback)),
    getSuggestedVideos: (query) => dispatch(getSuggestedVideos(query)),
    checkIsValidRoom: (id, redirect) => dispatch(isValidRoom(id, redirect)),
    joinRoom: (payload) => dispatch(joinRoom(payload)),
    enqueueVideo: (payload) => dispatch(enqueueVideo(payload)),
    setUrlVideo,
    setName,
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);

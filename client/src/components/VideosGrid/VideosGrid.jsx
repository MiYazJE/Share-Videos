import React from 'react';
import FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { readQueue, readRoomName, readActualVideoId } from '../../reducers/roomReducer';
import { readName } from '../../reducers/userReducer';
import { removeVideo, viewVideo } from '../../actions/roomActions';
import { FaPlay } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';
import './videosGrid.scss';

const VideosGrid = ({ videos, removeVideo, idRoom, viewVideo, currentVideoId, name }) => {

    const handleRemoveVideo = (idVideo) => {
        removeVideo({ idVideo, idRoom, name });
    }

    const handleViewVideo = (idVideo) => {
        viewVideo({ idVideo, idRoom });
    }

    return (
        <FlipMove
            staggerDurationBy="30"
            duration={600}
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
            typeName="div"
            className="wrapVideosGrid"
        >
            {!videos.length 
                ? (<div className="no-videos">
                        <h2>No videos enqueued</h2>
                    </div>)
                : (videos.map((video, index) => (
                    <div key={video.id} className={`wrapVideo ${video.id === currentVideoId ? 'current' : null}`}>
                        <div className="img">
                            <img src={video.urlThumbnail} alt="thumbnail" />
                        </div>
                        <div className="meta">
                            <span className="title">{video.title}</span>
                            <div className="icons">
                                <FaPlay className="play" onClick={() => handleViewVideo(video.id)} />
                                <FiDelete className="remove" onClick={() => handleRemoveVideo(video.id)} />
                            </div>
                        </div>
                    </div>
                )))}
        </FlipMove>
    );

}

const mapStateToProps = (state) => ({
    videos: readQueue(state),
    idRoom: readRoomName(state),
    currentVideoId: readActualVideoId(state),
    name: readName(state)
});

const mapDispatchToProps = (dispatch) => ({
    removeVideo: (payload) => dispatch(removeVideo(payload)),
    viewVideo: (payload) => dispatch(viewVideo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosGrid);
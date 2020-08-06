import React from 'react';
import FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { readQueue, readRoomName, readActualVideoId } from '../../reducers/roomReducer';
import { removeVideo, viewVideo } from '../../actions/roomActions';
import './videosGrid.scss';

const VideosGrid = ({ videos, removeVideo, idRoom, viewVideo, actualVideoId }) => {

    const handleRemoveVideo = (idToRemove) => {
        removeVideo({ idToRemove, idRoom });
    }

    const handleViewVideo = (idVideo) => {
        viewVideo({ idVideo, idRoom });
    }

    return (
        <FlipMove
            staggerDurationBy="30"
            duration={100}
            enterAnimation="fade"
            leaveAnimation="fade"
            typeName="div"
            className="wrapVideosGrid"
        >
            {videos.map((video, index) => (
                <div key={video.id} className={`wrapVideo ${video.id === actualVideoId ? 'current' : null}`}>
                    <div className="img">
                        <img src={video.urlThumbnail} alt="thumbnail" />
                    </div>
                    <div className="meta">
                        <span className="title">{video.title}</span>
                        <button onClick={() => handleRemoveVideo(video.id)}>remove</button>
                        <button onClick={() => handleViewVideo(video.id)}>play</button>
                    </div>
                </div>
            ))}
        </FlipMove>
    );

}

const mapStateToProps = (state) => ({
    videos: readQueue(state),
    idRoom: readRoomName(state),
    actualVideoId: readActualVideoId(state)
});

const mapDispatchToProps = (dispatch) => ({
    removeVideo: (payload) => dispatch(removeVideo(payload)),
    viewVideo: (payload) => dispatch(viewVideo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosGrid);
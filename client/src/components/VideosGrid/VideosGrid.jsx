import React from 'react';
import FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { readQueue, readRoomName, readActualVideoId } from '../../reducers/roomReducer';
import { removeVideo, viewVideo } from '../../actions/roomActions';
import { FaPlay } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';
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
            duration={600}
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
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
                        <div className="icons">
                            <FaPlay className="play" onClick={() => handleViewVideo(video.id)} />
                            <FiDelete className="remove" onClick={() => handleRemoveVideo(video.id)} />
                        </div>
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
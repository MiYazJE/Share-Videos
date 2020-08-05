import React from 'react';
import FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { readQueue, readRoomName } from '../../reducers/roomReducer';
import { removeVideo } from '../../actions/roomActions';
import './videosGrid.scss';

const VideosGrid = ({ videos, removeVideo, idRoom }) => {

    const handleRemoveVideo = (idToRemove) => {
        removeVideo({ idToRemove, idRoom });
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
                <div key={video.id} className="wrapVideo">
                    <div className="img">
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                            <img src={video.urlThumbnail} alt="thumbnail" />
                        </a>
                    </div>
                    <div className="meta">
                        <span className="title">{video.title}</span>
                        <button onClick={() => handleRemoveVideo(video.id)}>remove</button>
                    </div>
                </div>
            ))}
        </FlipMove>
    );

}

const mapStateToProps = (state) => ({
    videos: readQueue(state),
    idRoom: readRoomName(state)
});

const mapDispatchToProps = (dispatch) => ({
    removeVideo: (payload) => dispatch(removeVideo(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosGrid);
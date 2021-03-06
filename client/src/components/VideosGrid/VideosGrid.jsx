import React from 'react';
import FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { readQueue, readRoomName, readCurrentVideoId } from '../../reducers/roomReducer';
import { readName } from '../../reducers/userReducer';
import { removeVideo, viewVideo } from '../../actions/roomActions';
import { FaPlay } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';
import useTitle from '../../hooks/useTitle';
import './videosGrid.scss';

const VideosGrid = ({ videos, removeVideo, idRoom, viewVideo, currentVideoId, name }) => {

    const formatTitle = useTitle();

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
                ? <div className="no-videos">
                    <h2>No videos enqueued</h2>
                  </div>
                : videos.map(({ id, urlThumbnail, title }) => (
                    <div key={id} className={`wrapVideo ${id === currentVideoId ? 'current' : null}`}>
                        <div className="img">
                            <img src={urlThumbnail} alt="thumbnail" />
                        </div>
                        <div className="meta">
                            <span className="title" title={title}>{formatTitle(title)}</span>
                            <div className="icons">
                                <FaPlay className="play" onClick={() => handleViewVideo(id)} />
                                <FiDelete className="remove" onClick={() => handleRemoveVideo(id)} />
                            </div>
                        </div>
                    </div>))
            }
        </FlipMove>
    );
}

const mapStateToProps = (state) => ({
    videos: readQueue(state),
    idRoom: readRoomName(state),
    currentVideoId: readCurrentVideoId(state),
    name: readName(state)
});

const mapDispatchToProps = (dispatch) => ({
    removeVideo: (payload) => dispatch(removeVideo(payload)),
    viewVideo: (payload) => dispatch(viewVideo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosGrid);
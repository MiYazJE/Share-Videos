import React from 'react';
import FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { readQueue } from '../../reducers/roomReducer';
import './videosGrid.scss';

const VideosGrid = ({ videos, removeVideo }) => {
    return (
        <FlipMove
            staggerDurationBy="30"
            duration={500}
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
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
                        <button onClick={() => removeVideo(video.id)}>remove</button>
                    </div>
                </div>
            ))}
        </FlipMove>
    );

}

const mapStateToProps = (state) => ({
    videos: readQueue(state)
});

export default connect(mapStateToProps, {})(VideosGrid);
import React from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { readVideos } from '../../reducers/roomReducer';
import { readName } from '../../reducers/userReducer';
import { enqueueVideo } from '../../actions/roomActions';

const Video = ({ title, urlThumbnail, url, addVideo }) => (
    <div className="video">
        <div className="top">
            <img 
                alt="Thumbnail" 
                onClick={() => addVideo({
                    title,
                    urlThumbnail,
                    url: `https://youtube.com${url}`
                })} 
                src={urlThumbnail}
            />
        </div>
        <div className="bottom">
            <p className="title">{title}</p>
        </div>
    </div>
);

const ResultVideos = ({ enqueueVideo, videos, refVideoResults, name }) => {
    const { id } = useParams();

    const handleAddVideo = (video) => {
        enqueueVideo({ video, id, name });
    }

    return (
        videos.length
            ? (
                <div ref={refVideoResults} className="videosContainer">
                    {videos.map(video => <Video key={video.url} addVideo={handleAddVideo} {...video} />)}
                </div>)
            : null
    );
};

const mapStateToProps = state => ({
    videos: readVideos(state),
    name: readName(state)
});

const mapDispatchToProps = dispatch => ({
    enqueueVideo: (payload) => dispatch(enqueueVideo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultVideos);
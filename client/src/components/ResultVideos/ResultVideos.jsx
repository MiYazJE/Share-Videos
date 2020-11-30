import React from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { readVideos } from '../../reducers/roomReducer';
import { readName } from '../../reducers/userReducer';
import { enqueueVideo } from '../../actions/roomActions';
import useText from '../../hooks/useText';
import useViews from '../../hooks/useViews';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import './resultVideos.scss';

const useStylesTooltip = makeStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.black,
    },
  }));

const Video = ({ title, urlThumbnail, url, addVideo, duration, views, uploadedAt }) => (
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
            <div className="duration">{duration}</div>
        </div>
        <Tooltip title={title} placement="right-start" classes={useStylesTooltip()}>
            <div className="bottom">
                <p className="title">{useText(title)}</p>
                <div className="metaInfo">
                    <p>{`${useViews(views)} views ${uploadedAt ? `| ${uploadedAt}` : ''}`}</p>
                </div>
            </div>
        </Tooltip>
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
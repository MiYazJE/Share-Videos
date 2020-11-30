import React from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { readVideos, readLoadingVideos } from '../../reducers/roomReducer';
import { readName } from '../../reducers/userReducer';
import { enqueueVideo } from '../../actions/roomActions';
import useTitle from '../../hooks/useTitle';
import useViews from '../../hooks/useViews';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import './resultVideos.scss';

const getSekeletonVideos = () => {
    return Array(20).fill().map((_, i) => (
        <div key={i} style={{ width: '250px', margin: '10px' }}>
            <Skeleton variant="rect" width="100%">
                <div style={{ paddingTop: '50%' }} />
            </Skeleton>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box width="100%">
                    <Skeleton width="100%">
                        <Typography>.</Typography>
                    </Skeleton>
                </Box>
                <Box width="100%">
                    <Skeleton width="100%">
                        <Typography>.</Typography>
                    </Skeleton>
                </Box>
            </Box>
        </div>
    ));
}

const Video = ({ title, urlThumbnail, url, addVideo, duration, views, uploadedAt }) => (
    <div className="video">
        <div className="top" title="Add video">
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
        <div className="bottom" title={title}>
            <p className="title">{useTitle()(title)}</p>
            <div className="metaInfo">
                <p>{`${useViews(views)} views ${uploadedAt ? `| ${uploadedAt}` : ''}`}</p>
            </div>
        </div>
    </div>
);

const ResultVideos = ({ enqueueVideo, videos, refVideoResults, name, loadingVideos }) => {
    const { id } = useParams();

    const handleAddVideo = (video) => {
        enqueueVideo({ video, id, name });
    }

    return (
        <div ref={refVideoResults} className="videosContainer">
            {videos.length && !loadingVideos
                ? videos.map(video => <Video key={video.url} addVideo={handleAddVideo} {...video} />)
                : loadingVideos ? getSekeletonVideos() : null
            } 
        </div>
    );
};

const mapStateToProps = state => ({
    videos: readVideos(state),
    name: readName(state),
    loadingVideos: readLoadingVideos(state)
});

const mapDispatchToProps = dispatch => ({
    enqueueVideo: (payload) => dispatch(enqueueVideo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultVideos);
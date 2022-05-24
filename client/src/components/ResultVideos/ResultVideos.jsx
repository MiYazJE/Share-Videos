import React from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { readVideos, readLoadingVideos } from '../../reducers/roomReducer';
import { readName } from '../../reducers/userReducer';
import { enqueueVideo } from '../../actions/roomActions';
import useTitle from '../../hooks/useTitle';
import useVideoMetadata from '../../hooks/useVideoMetadata';
import './resultVideos.scss';

const getSekeletonVideos = () => Array(20).fill().map((_, i) => (
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

function Video({ video, addVideo }) {
  const {
    title,
    urlThumbnail,
    duration,
    views,
    uploadedAt,
  } = video;

  return (
    <div className="video">
      <div className="top" title="Add video">
        <img
          alt="Thumbnail"
          onClick={() => addVideo(video)}
          src={urlThumbnail}
        />
        <div className="duration">{duration}</div>
      </div>
      <div className="bottom" title={title}>
        <p className="title">{useTitle()(title)}</p>
        <div className="metaInfo">
          <p>{`${useVideoMetadata()(views)} ${uploadedAt ? `| ${uploadedAt}` : ''}`}</p>
        </div>
      </div>
    </div>
  );
}

function ResultVideos({
  enqueueVideo, videos, refVideoResults, name, loadingVideos,
}) {
  const { id } = useParams();

  const handleAddVideo = (video) => {
    enqueueVideo({ video, id, name });
  };

  return (
    <div ref={refVideoResults} className="videosContainer">
      {loadingVideos ? getSekeletonVideos() : null}
      {videos.length && !loadingVideos
        ? videos.map((video) => <Video key={video.url} addVideo={handleAddVideo} video={video} />)
        : null}
    </div>
  );
}

const mapStateToProps = (state) => ({
  videos: readVideos(state),
  name: readName(state),
  loadingVideos: readLoadingVideos(state),
});

const mapDispatchToProps = (dispatch) => ({
  enqueueVideo: (payload) => dispatch(enqueueVideo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultVideos);

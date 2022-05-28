import { useParams } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import { stringFormat } from 'src/utils';
import { useSocketEvents } from 'src/context/socketEvents';

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

const readSelector = ({ room, user, loading }) => ({
  name: user.name,
  videos: room.videos,
  loadingVideos: loading.effects.room.getVideos,
});

function Video({ video, onClick }) {
  const {
    title,
    urlThumbnail,
    duration,
    views,
    uploadedAt,
  } = video;

  const metaInfoString = `${stringFormat.formatViews(views)} ${uploadedAt ? `| ${uploadedAt}` : ''}`;

  return (
    <div className="video">
      <div className="top" title="Add video">
        <img
          alt="Thumbnail"
          onClick={() => onClick(video)}
          src={urlThumbnail}
        />
        <div className="duration">{duration}</div>
      </div>
      <div className="bottom" title={title}>
        <p className="title">{stringFormat.truncateText(title)}</p>
        <div className="metaInfo">
          <p>{metaInfoString}</p>
        </div>
      </div>
    </div>
  );
}

function ResultVideos({ refVideoResults }) {
  const {
    name,
    loadingVideos,
    videos,
  } = useSelector(readSelector);

  const { id } = useParams();
  const socketEvents = useSocketEvents();

  const handleAddVideo = (video) => {
    socketEvents.enqueueVideo({
      video,
      id,
      name,
    });
  };

  return (
    <div ref={refVideoResults} className="videosContainer">
      {loadingVideos ? getSekeletonVideos() : null}
      {videos.length && !loadingVideos
        ? (
          videos
            .map((video) => (
              <Video
                key={video.url}
                video={video}
                onClick={handleAddVideo}
              />
            ))
        ) : null}
    </div>
  );
}

export default ResultVideos;

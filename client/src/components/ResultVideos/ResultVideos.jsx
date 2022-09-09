import { useSelector } from 'react-redux';
import { Grid, HStack } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { useSocketEvents } from 'src/context/SocketEventsContextProvider';
import Scroller from 'src/components/Scroller';
import Pagination from '../Pagination';
import VideoCard from '../VideoCard';
import { getSekeletonVideos } from '../VideoCard/VideoCard';

const readSelector = ({ room, user, loading }) => ({
  name: user.name,
  videos: room.videos,
  isLastPage: room.isLastPage,
  loadingVideos: loading.effects.room.getVideos,
  roomId: room.id,
});

const ResultVideos = forwardRef((props, ref) => {
  const {
    getNextPage,
    getPreviousPage,
    page,
  } = props;

  const {
    name,
    loadingVideos,
    videos,
    isLastPage,
    roomId,
  } = useSelector(readSelector);
  const socketEvents = useSocketEvents();

  const handleAddVideo = (video) => {
    socketEvents.enqueueVideo({
      video,
      id: roomId,
      name,
    });
  };

  const handleNextPage = () => {
    getNextPage();
    ref.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    getPreviousPage();
    ref.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderVideos = videos.length && !loadingVideos;

  return (
    <>
      <Grid
        position="relative"
        gridTemplateRows="repeat(auto-fill, 1fr)"
        gap={6}
      >
        {loadingVideos ? getSekeletonVideos(20) : null}
        {renderVideos
          ? (
            videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onAddPlaylist={handleAddVideo}
                onPause={() => socketEvents.pauseVideo(roomId)}
                onPlay={() => socketEvents.viewVideo({ roomId, video })}
                showRemoveBtn={false}
                inline={false}
              />
            ))
          ) : null}
        <Scroller ref={ref} />
      </Grid>
      {videos.length ? (
        <HStack justifyContent="center" p={5}>
          <Pagination
            disabled={loadingVideos}
            showNextPage={!isLastPage}
            getNextPage={handleNextPage}
            getPreviousPage={handlePrevPage}
            page={page}
          />
        </HStack>
      ) : null}
    </>
  );
});

export default ResultVideos;

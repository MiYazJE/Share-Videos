import {
  Grid, HStack, Text, VisuallyHidden,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { useSocketEvents } from 'src/context/SocketEventsContextProvider';
import { useRoomState } from 'src/context/SocketEventsContextProvider';
import { useSession } from 'src/context/SessionContextProvider';
import Scroller from 'src/components/Scroller';
import Pagination from '../Pagination';
import VideoCard from '../VideoCard';
import { getSekeletonVideos } from '../VideoCard/VideoCard';

const ResultVideos = forwardRef((props, ref) => {
  const {
    getNextPage,
    getPreviousPage,
    hasSearch,
    isLastPage,
    loading,
    page,
    videos,
  } = props;
  const { id: roomId } = useRoomState();
  const { name } = useSession();
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

  const renderVideos = videos.length && !loading;

  return (
    <>
      <Grid
        position="relative"
        gridTemplateRows="repeat(auto-fill, 1fr)"
        gap={6}
      >
        {loading ? <VisuallyHidden role="status">Loading videos.</VisuallyHidden> : null}
        {loading ? getSekeletonVideos(10) : null}
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
      {hasSearch && !loading && !videos.length ? <Text py={6} textAlign="center">No videos found.</Text> : null}
      {videos.length ? (
        <HStack justifyContent="center" p={5}>
          <Pagination
            disabled={loading}
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

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  IconButton,
  Image,
  Stack,
  Text,
  Tooltip,
  VStack,
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { MdPlaylistAdd } from 'react-icons/md';
import { forwardRef, useCallback } from 'react';

import { stringFormat } from 'src/utils';
import { useSocketEvents } from 'src/context/SocketEventsContextProvider';
import Scroller from 'src/components/Scroller';
import { WrapAddButon, WrapDuration } from './ResultVideos.styles';
import Pagination from '../Pagination';

const readSelector = ({ room, user, loading }) => ({
  name: user.name,
  videos: room.videos,
  isLastPage: room.isLastPage,
  loadingVideos: loading.effects.room.getVideos,
});

const getSekeletonVideos = (many = 20) => Array(many).fill().map((_, i) => (
  <Box key={i}>
    <Grid height="100%" gridTemplateRows="150px 80px">
      <Stack position="relative">
        <Skeleton height="100%" />
      </Stack>
      <VStack height="100%" p={3} justifyContent="space-between" alignItems="flex-start">
        <Skeleton height="30px" width="100%" />
        <Skeleton height="10px" width="50%" />
      </VStack>
    </Grid>
  </Box>
));

function Video({ video, onClick }) {
  const {
    title,
    urlThumbnail,
    duration,
    views,
    uploadedAt,
  } = video;

  const metaInfoString = `${stringFormat.formatViews(views)} ${uploadedAt ? `• ${uploadedAt}` : ''}`;

  return (
    <Box position="relative" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Grid height="100%" gridTemplateRows="1fr 1fr">
        <Stack position="relative">
          <Image
            alt="Thumbnail"
            src={urlThumbnail}
            objectFit="cover"
            width="100%"
          />
          <WrapDuration>
            <Text fontSize="xs" letterSpacing="1px" color="white">
              {duration}
            </Text>
          </WrapDuration>
          <WrapAddButon>
            <Tooltip label="Add to playlist">
              <IconButton
                fontSize="2xl"
                display="flex"
                alignItems="center"
                variant="unstyled"
                color="white"
                background="rgba(0, 0, 0, 0.8)"
                onClick={() => onClick(video)}
                icon={<MdPlaylistAdd />}
              />
            </Tooltip>
          </WrapAddButon>
        </Stack>
        <VStack height="100%" p={3} justifyContent="space-between" alignItems="flex-start">
          <Text fontSize="md" fontWeight="bold">{title}</Text>
          <Text fontSize="xs">{metaInfoString}</Text>
        </VStack>
      </Grid>
    </Box>
  );
}

const ResultVideos = forwardRef((props, ref) => {
  const {
    loadingWithPagination,
    getNextPage,
    getPreviousPage,
    page,
  } = props;

  const {
    name,
    loadingVideos,
    videos,
    isLastPage,
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

  const handleNextPage = () => {
    getNextPage();
    ref.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    getPreviousPage();
    ref.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Grid position="relative" gridTemplateColumns="1fr 1fr" gridAutoRows="300px" gap={6}>
        {(loadingVideos && !loadingWithPagination) ? getSekeletonVideos(20) : null}
        {(videos.length && (!loadingVideos || loadingWithPagination))
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
        {(loadingWithPagination && !loadingVideos) ? getSekeletonVideos(8) : null}
        <Scroller ref={ref} />
      </Grid>
      {videos.length ? (
        <HStack justifyContent="center" p={5}>
          <Pagination
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

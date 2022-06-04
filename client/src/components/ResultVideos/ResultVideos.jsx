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
} from '@chakra-ui/react';
import { MdPlaylistAdd } from 'react-icons/md';
import { forwardRef } from 'react';

import { stringFormat } from 'src/utils';
import { useSocketEvents } from 'src/context/SocketEventsContextProvider';
import Scroller from 'src/components/Scroller';
import { WrapAddButon, WrapDuration } from './ResultVideos.styles';

const readSelector = ({ room, user, loading }) => ({
  name: user.name,
  videos: room.videos,
  loadingVideos: loading.effects.room.getVideos,
});

const getSekeletonVideos = () => Array(20).fill().map((_, i) => (
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

const ResultVideos = forwardRef((_, ref) => {
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
    <Grid position="relative" gridTemplateColumns="1fr 1fr" gridAutoRows="300px" gap={6}>
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
      <Scroller ref={ref} />
    </Grid>
  );
});

export default ResultVideos;

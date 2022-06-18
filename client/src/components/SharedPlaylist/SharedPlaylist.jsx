import {
  Box,
  Button,
  Grid,
  Image,
  Stack,
  Text,
  VStack,
  CloseButton,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { useSocketEvents } from 'src/context/SocketEventsContextProvider';
import { stringFormat } from 'src/utils';
import { WrapDuration } from 'src/components/ResultVideos/ResultVideos.styles';

const getPlaylist = ({ room, user }) => ({
  playlist: room.queue,
  currentVideo: room.currentVideo,
  isPlaying: room.isPlaying,
  idRoom: room.id,
  name: user.name,
});

function SharedPlaylist() {
  const {
    playlist,
    currentVideo,
    isPlaying,
    idRoom,
    name,
  } = useSelector(getPlaylist);
  const socketEvents = useSocketEvents();

  return (
    <Grid position="relative" gridTemplateColumns="1fr" gap={6}>
      {playlist
        .map((video) => {
          const isVideoPlaying = currentVideo.id === video.id && isPlaying;
          const formattedViews = `${stringFormat.formatViews(video.views)} ${video.uploadedAt ? `• ${video.uploadedAt}` : ''}`;
          return (
            <Box
              position="relative"
              borderWidth="1px"
              borderColor={isVideoPlaying ? 'green' : ''}
              borderRadius="lg"
              overflow="hidden"
              key={video.url}
            >
              <Grid height="100%" gridTemplateColumns="1fr 1fr">
                <Stack position="relative">
                  <Image
                    alt="Thumbnail"
                    src={video.urlThumbnail}
                    objectFit="cover"
                    width="100%"
                  />
                  <WrapDuration>
                    <Text fontSize="xs" letterSpacing="1px" color="white">
                      {video.duration}
                    </Text>
                  </WrapDuration>
                </Stack>
                <VStack
                  height="100%"
                  p={3}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Text fontSize="md" fontWeight="bold">{video.title}</Text>
                  <Button
                    variant="solid"
                    colorScheme={isVideoPlaying ? 'green' : 'facebook'}
                    onClick={() => (
                      isVideoPlaying
                        ? socketEvents.pauseVideo(idRoom)
                        : socketEvents.viewVideo({ idRoom, idVideo: video.id })
                    )}
                  >
                    {isVideoPlaying ? 'Playing' : 'Play'}
                  </Button>
                  <Box
                    css={{
                      position: 'absolute',
                      right: '3px',
                      top: '-5px',
                    }}
                  >
                    <CloseButton
                      onClick={() => socketEvents.removeVideo({ idVideo: video.id, idRoom, name })}
                    />
                  </Box>
                  <Text fontSize="xs">{formattedViews}</Text>
                </VStack>
              </Grid>
            </Box>
          );
        })}
    </Grid>
  );
}

export default SharedPlaylist;

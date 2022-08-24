import {
  Box,
  Grid,
  IconButton,
  Image,
  Stack,
  Text,
  Tooltip,
  VStack,
  HStack,
  Avatar,
  Skeleton,
  CloseButton,
} from '@chakra-ui/react';
import { MdPlaylistAdd } from 'react-icons/md';

import { stringFormat } from 'src/utils';
import useIsVideoPlaying from 'src/hooks/useIsVideoPlaying';
import PlayButton from 'src/components/PlayButton';
import { WrapAddButon, WrapDuration } from './videoCard.styles';

export const getSekeletonVideos = (many = 20) => Array(many).fill().map((_, i) => (
  <Box key={i}>
    <Grid h="100%" gridTemplateRows="150px 1fr" borderWidth="1px" borderRadius="lg">
      <Stack position="relative">
        <Skeleton h="100%" />
      </Stack>
      <VStack h="100%" gap={3} p={3} justifyContent="space-between" alignItems="flex-start">
        <VStack gap={1} w="100%" alignItems="start">
          <Skeleton h="10px" w="90%" />
          <Skeleton h="10px" w="70%" />
          <Skeleton h="10px" w="80%" />
        </VStack>
        <HStack gap={2} w="100%">
          <Skeleton borderRadius="50%" h="30px" w="30px" />
          <Skeleton h="10px" w="100px" />
        </HStack>
        <Skeleton h="10px" w="50%" />
        <Skeleton h="35px" w="100%" />
      </VStack>
    </Grid>
  </Box>
));

function VideoCard({
  video,
  onAddPlaylist,
  onPlay,
  onPause,
  onRemoveVideo,
  showPlaylistBtn = true,
  showRemoveBtn = false,
}) {
  const {
    title,
    urlThumbnail,
    duration,
    views,
    uploadedAt,
    channel,
    id,
  } = video;

  const isPlaying = useIsVideoPlaying(id);
  const metaInfoString = `${stringFormat.formatViews(views)} ${uploadedAt ? `• ${uploadedAt}` : ''}`;

  return (
    <Box
      position="relative"
      borderColor={isPlaying ? 'green' : ''}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Grid
        height="100%"
        gridTemplateRows={{
          base: '1fr 1fr',
          sm: '1fr',
        }}
        gridTemplateColumns={{
          base: '1fr',
          sm: '1fr 1fr',
        }}
      >

        <Stack position="relative">
          <Image
            alt="Thumbnail"
            src={urlThumbnail}
            objectFit="cover"
            h="100%"
          />
          <WrapDuration>
            <Text fontSize="xs" letterSpacing="1px" color="white">
              {duration}
            </Text>
          </WrapDuration>
          {showPlaylistBtn ? (
            <WrapAddButon>
              <Tooltip label="Add to playlist">
                <IconButton
                  fontSize="2xl"
                  display="flex"
                  alignItems="center"
                  variant="unstyled"
                  color="white"
                  background="rgba(0, 0, 0, 0.8)"
                  onClick={() => onAddPlaylist(video)}
                  icon={<MdPlaylistAdd />}
                />
              </Tooltip>
            </WrapAddButon>
          ) : null}
        </Stack>

        {showRemoveBtn ? (
          <Box
            right="-3px"
            top="-5px"
            transform="translate(-5px, 5px)"
            position="absolute"
          >
            <CloseButton onClick={onRemoveVideo} />
          </Box>

        ) : null}

        <VStack height="100%" p={4} gap={2} justifyContent="space-between" alignItems="flex-start">
          <Text fontSize="md" fontWeight="bold">{title}</Text>
          <Tooltip label={`Go to ${channel.name} channel`} fontSize="md">
            <HStack as="a" href={channel.url} target="_blank">
              <Avatar name={channel.name} size="xs" src={channel.iconUrl} />
              <Text>{channel.name}</Text>
            </HStack>
          </Tooltip>
          <Text fontSize="xs">{metaInfoString}</Text>
          <HStack w="100%">
            <PlayButton
              w="100%"
              variant="outline"
              isPlaying={isPlaying}
              onClick={isPlaying ? onPause : onPlay}
            />
          </HStack>
        </VStack>

      </Grid>
    </Box>
  );
}

export default VideoCard;

import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Reorder } from 'framer-motion';
import {
  MdDelete,
  MdDragHandle,
  MdPause,
  MdPlayArrow,
} from 'react-icons/md';

import { useRoomState, useSocketEvents } from 'src/context/SocketEventsContextProvider';
import { useSession } from 'src/context/SessionContextProvider';
import useIsVideoPlaying from 'src/hooks/useIsVideoPlaying';

function PlaylistItem({ video, onPause, onPlay, onRemove }) {
  const isPlaying = useIsVideoPlaying(video.url);
  const hoverBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.100');

  return (
    <HStack
      width="100%"
      minW={0}
      spacing={3}
      p={2}
      borderRadius="xl"
      transition="background 160ms ease"
      _hover={{ background: hoverBackground }}
    >
      <Box color="gray.400" cursor="grab" flexShrink={0} aria-hidden="true">
        <MdDragHandle size={20} />
      </Box>
      <Box position="relative" width="6rem" aspectRatio={16 / 9} flexShrink={0} overflow="hidden" borderRadius="lg">
        <Image
          src={video.urlThumbnail}
          alt=""
          width="100%"
          height="100%"
          objectFit="cover"
        />
        {video.duration ? (
          <Badge position="absolute" right={1} bottom={1} colorScheme="blackAlpha" fontSize="0.6rem">
            {video.duration}
          </Badge>
        ) : null}
      </Box>
      <Text
        minW={0}
        flex={1}
        fontSize="sm"
        fontWeight="700"
        noOfLines={2}
        title={video.title}
      >
        {video.title}
      </Text>
      <HStack spacing={1} flexShrink={0}>
        <Tooltip label={isPlaying ? 'Pause video' : 'Play video'}>
          <IconButton
            aria-label={isPlaying ? `Pause ${video.title}` : `Play ${video.title}`}
            size="sm"
            variant="ghost"
            colorScheme={isPlaying ? 'green' : 'blue'}
            onClick={isPlaying ? onPause : onPlay}
            icon={isPlaying ? <MdPause /> : <MdPlayArrow />}
          />
        </Tooltip>
        <Tooltip label="Remove from playlist">
          <IconButton
            aria-label={`Remove ${video.title} from playlist`}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={onRemove}
            icon={<MdDelete />}
          />
        </Tooltip>
      </HStack>
    </HStack>
  );
}

function SharedPlaylist({ onAddVideos }) {
  const { queue: playlist, id: roomId } = useRoomState();
  const { name } = useSession();
  const socketEvents = useSocketEvents();

  const handleReorderPlaylist = (nextPlaylist) => {
    socketEvents.reorderPlaylist({ playlist: nextPlaylist, roomId });
  };

  if (!playlist?.length) {
    return (
      <VStack alignItems="center" justifyContent="center" minH="12rem" textAlign="center">
        <Text fontSize="lg" fontWeight="bold">Nothing queued yet</Text>
        <Text color="gray.500" fontSize="sm">Search for a video and add it to the shared playlist.</Text>
        <Button onClick={onAddVideos} colorScheme="facebook" size="sm">
          Find videos
        </Button>
      </VStack>
    );
  }

  return (
    <Reorder.Group as="div" axis="y" values={playlist} onReorder={handleReorderPlaylist}>
      <VStack spacing={1} align="stretch">
        {playlist.map((video) => (
          <Reorder.Item as="div" key={video.id} value={video}>
            <PlaylistItem
              video={video}
              onPlay={() => socketEvents.viewVideo({ roomId, video })}
              onPause={() => socketEvents.pauseVideo(roomId)}
              onRemove={() => socketEvents.removeVideo({ idVideo: video.id, roomId, name })}
            />
          </Reorder.Item>
        ))}
      </VStack>
    </Reorder.Group>
  );
}

export default SharedPlaylist;

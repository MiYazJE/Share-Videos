import {
  Button,
  Grid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';

import { useSocketEvents } from 'src/context/SocketEventsContextProvider';
import { ROOM_MODALS } from 'src/enums';

import VideoCard from 'src/components/VideoCard';

const getPlaylist = ({ room, user }) => ({
  playlist: room.queue,
  currentVideo: room.currentVideo,
  isPlaying: room.isPlaying,
  roomId: room.id,
  name: user.name,
});

function SharedPlaylist() {
  const {
    playlist,
    roomId,
    name,
  } = useSelector(getPlaylist);
  const dispatch = useDispatch();
  const socketEvents = useSocketEvents();

  const handleAddVideos = () => {
    dispatch.room.SET_PROP({
      activeModal: ROOM_MODALS.SEARCH,
    });
  };

  return (
    <Grid position="relative" gridTemplateColumns="1fr" gap={6}>
      {!playlist?.length ? (
        <VStack alignItems="center" justifyContent="center" height="100%">
          <Text fontSize="lg" fontWeight="bold">
            No videos in playlist yet 😴
          </Text>
          <Button onClick={handleAddVideos}>
            Add videos
          </Button>
        </VStack>
      ) : null}
      {playlist?.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          showPlaylistBtn={false}
          onPlay={() => socketEvents.viewVideo({ roomId, video })}
          onPause={() => socketEvents.pauseVideo(roomId)}
          onRemoveVideo={() => socketEvents.removeVideo({ idVideo: video.id, roomId, name })}
          showRemoveBtn
          inline
        />
      ))}
    </Grid>
  );
}

export default SharedPlaylist;

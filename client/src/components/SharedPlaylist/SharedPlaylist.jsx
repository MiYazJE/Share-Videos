import {
  Button,
  Grid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { Reorder } from 'framer-motion';

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

  const handleReorderPlaylist = (playlist) => {
    socketEvents.reorderPlaylist({ playlist, roomId });
  };

  return (
    <Grid>
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

      <Reorder.Group as="div" axis="y" values={playlist} onReorder={handleReorderPlaylist}>
        <Grid
          position="relative"
          gridTemplateColumns="repeat(auto-fill, 1fr)"
          gap={6}
        >
          {playlist?.map((video) => (
            <Reorder.Item as="span" key={video.id} value={video}>
              <VideoCard
                video={video}
                showPlaylistBtn={false}
                onPlay={() => socketEvents.viewVideo({ roomId, video })}
                onPause={() => socketEvents.pauseVideo(roomId)}
                onRemoveVideo={() => socketEvents.removeVideo({ idVideo: video.id, roomId, name })}
                showRemoveBtn
                inline
              />
            </Reorder.Item>
          ))}
        </Grid>
      </Reorder.Group>

    </Grid>
  );
}

export default SharedPlaylist;

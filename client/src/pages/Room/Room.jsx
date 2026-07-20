import {
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Alert,
  AlertIcon,
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Spinner,
  VStack,
} from '@chakra-ui/react';

import MetaVideoInfo from 'src/components/Room/MetaVideoInfo';
import useRoom from 'src/hooks/useRoom';
import { useRoomState, useSocketEvents } from 'src/context/SocketEventsContextProvider';
import { useSession } from 'src/context/SessionContextProvider';
import RoomActionsBar from 'src/components/Room/RoomActionsBar';
import RoomPanel from 'src/components/Room/RoomPanel';
import SearchVideos from 'src/components/Room/SearchVideos';
import SharedPlaylist from 'src/components/SharedPlaylist';
import Chat from 'src/components/Chat';
import { VIDEOS } from 'src/enums';
import { RoomCanvas, WrapPlayer } from './Room.styles';
import RoomModals from './modals';

function Room() {
  const [showNameModal, setShowNameModal] = useState(false);

  const room = useRoomState();
  const {
    id: roomId,
    isPlaying,
    progressVideo,
    seekVideo,
    currentVideo,
  } = room;
  const { name, user, setGuestName } = useSession();
  const { isLogged } = user;
  const urlVideo = currentVideo.url;
  const currentVideoId = currentVideo.id;

  const socketEvents = useSocketEvents();
  const refPlayer = useRef();
  const searchSectionRef = useRef();
  const history = useHistory();
  const { id } = useParams();
  const roomValidation = useRoom({ id });
  const { isValidRoom } = roomValidation;

  useEffect(() => {
    if (roomValidation.isSuccess && !isValidRoom) history.push(`/room-not-found/${id}`);
  }, [isValidRoom, history, id, roomValidation.isSuccess]);

  useEffect(() => {
    if (!isValidRoom) return;
    if (!name) {
      return setShowNameModal(true);
    }
    socketEvents.joinRoom({ roomId: id, name, isLogged });
    setShowNameModal(false);
  }, [id, name, isLogged, socketEvents, isValidRoom]);

  useEffect(() => {
    if (seekVideo) {
      refPlayer.current.seekTo(progressVideo);
      socketEvents.markSeekHandled();
    }
  }, [seekVideo, progressVideo, socketEvents]);

  useEffect(() => socketEvents.leaveRoom, [socketEvents]);

  const onCancelDialog = () => history.push('/');

  const onAcceptDialog = (nickname) => {
    if (nickname) {
      setGuestName(nickname);
      setShowNameModal(false);
    }
  };

  const focusSection = useCallback((sectionRef, focusSelector) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      sectionRef.current?.querySelector(focusSelector)?.focus({ preventScroll: true });
    }, 400);
  }, []);

  if (roomValidation.isPending) {
    return <Center minH="60vh"><Spinner size="xl" aria-label="Validating room" /></Center>;
  }

  if (roomValidation.isError) {
    return (
      <Center minH="60vh">
        <VStack>
          <Alert status="error"><AlertIcon />Unable to validate this room.</Alert>
          <Button onClick={() => roomValidation.refetch()}>Retry</Button>
        </VStack>
      </Center>
    );
  }

  const handleSendProgress = () => {
    socketEvents.sendProgress({
      progress: refPlayer.current.getCurrentTime(),
      roomId,
      name,
    });
  };

  const handleOnPlay = () => {
    const seekVideo = Math.abs(
      refPlayer.current.getCurrentTime() - progressVideo,
    ) > VIDEOS.MAXIMUM_TIME_GAP_TO_SEEK;

    if (seekVideo) {
      socketEvents.sendProgress({
        progress: refPlayer.current.getCurrentTime(),
        roomId,
        seekVideo: true,
        name,
      });
    }

    socketEvents.sendPlayerState({
      state: VIDEOS.STATE.PLAY,
      roomId,
      name,
    });
  };

  const handleOnPause = () => {
    socketEvents.sendPlayerState({
      state: VIDEOS.STATE.PAUSE,
      roomId,
      name,
    });
  };

  const handleOnEnded = () => {
    socketEvents.removeVideo({
      idVideo: currentVideoId,
      roomId,
    });
  };

  return (
    <RoomCanvas width="100%">
      <Container maxW="1800px" px={{ base: 3, md: 6, xl: 8 }} py={{ base: 4, md: 6 }}>
        <RoomActionsBar />

        <Grid
          as="main"
          data-test-id="room-workspace"
          mt={{ base: 5, md: 7 }}
          gap={{ base: 4, md: 6 }}
          templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1.65fr) minmax(20rem, 0.75fr)' }}
          templateAreas={{
            base: '"player" "search" "playlist" "chat"',
            lg: '"player chat" "search playlist"',
          }}
          alignItems="start"
        >
          <Box gridArea="player" minW={0}>
            <WrapPlayer data-test-id="room-player">
              <AspectRatio ratio={16 / 9}>
                <ReactPlayer
                  ref={refPlayer}
                  playing={isPlaying}
                  onPlay={handleOnPlay}
                  onPause={handleOnPause}
                  onProgress={handleSendProgress}
                  onEnded={handleOnEnded}
                  width="100%"
                  height="100%"
                  controls
                  url={urlVideo}
                />
              </AspectRatio>
            </WrapPlayer>
            <MetaVideoInfo />
          </Box>

          <RoomPanel
            id="room-search"
            ref={searchSectionRef}
            gridArea="search"
            overflow="visible"
            position="relative"
            zIndex={2}
            eyebrow="Discover"
            title="Find the next video"
          >
            <SearchVideos />
          </RoomPanel>

          <RoomPanel
            id="room-playlist"
            gridArea="playlist"
            eyebrow="Up next"
            title="Shared playlist"
            contentProps={{ maxH: { base: 'none', lg: '34rem' }, overflowY: { base: 'visible', lg: 'auto' } }}
          >
            <SharedPlaylist onAddVideos={() => focusSection(searchSectionRef, '#searchVideo')} />
          </RoomPanel>

          <RoomPanel
            id="room-chat"
            gridArea="chat"
            eyebrow="Conversation"
            title="Room chat"
            contentProps={{ height: { base: '25rem', lg: '32rem' } }}
          >
            <Chat />
          </RoomPanel>

        </Grid>

        <RoomModals
          showNameModal={showNameModal}
          onCloseNameModal={onCancelDialog}
          onAcceptNameModal={onAcceptDialog}
        />
      </Container>
    </RoomCanvas>
  );
}
export default Room;

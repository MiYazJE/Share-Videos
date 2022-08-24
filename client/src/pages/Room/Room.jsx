import { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { Container, HStack, VStack } from '@chakra-ui/react';

import MetaVideoInfo from 'src/components/Room/MetaVideoInfo';
import useRoom from 'src/hooks/useRoom';
import { useSocketEvents } from 'src/context/SocketEventsContextProvider';
import RoomActionsBar from 'src/components/Room/RoomActionsBar';
import { VIDEOS } from 'src/enums';
import { WrapPlayer } from './Room.styles';
import RoomModals from './modals';

const readSelector = ({ room, user, loading }) => ({
  urlVideo: room.currentVideo.url,
  roomId: room.id,
  isLoading: room.loadingRoom,
  name: user.name,
  isPlaying: room.isPlaying,
  host: room.host,
  seekVideo: room.seekVideo,
  progressVideo: room.progressVideo,
  currentVideoId: room.currentVideo.id,
  isLogged: user.isLogged,
  isLoadingUser: loading.effects.user.whoAmI,
});

function Room() {
  const [showNameModal, setShowNameModal] = useState(false);

  const {
    urlVideo,
    name,
    roomId,
    isPlaying,
    progressVideo,
    seekVideo,
    currentVideoId,
    isLogged,
    isLoadingUser,
  } = useSelector(readSelector);

  const socketEvents = useSocketEvents();
  const dispatch = useDispatch();
  const refPlayer = useRef();
  const history = useHistory();
  const { id } = useParams();
  const { isValidRoom } = useRoom({ id });

  useEffect(() => {
    if (!isValidRoom) history.push('/');
  }, [isValidRoom, history]);

  useEffect(() => {
    if (!name && isLoadingUser) return;
    if (!name) {
      return setShowNameModal(true);
    }
    socketEvents.joinRoom({ id, name, isLogged });
    setShowNameModal(false);
  }, [id, name, isLogged, socketEvents, isLoadingUser]);

  useEffect(() => {
    if (seekVideo) {
      refPlayer.current.seekTo(progressVideo);
      dispatch.room.SET_PROP({ seekVideo: false });
    }
  }, [seekVideo, progressVideo, dispatch]);

  const onCancelDialog = () => history.push('/');

  const onAcceptDialog = (nickname) => {
    if (nickname) {
      dispatch.user.SET_NAME(nickname);
      setShowNameModal(false);
    }
  };

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
    <HStack height="100vh" width="100%" justifyContent="center">

      <VStack height="100%" width="100%" maxW="2000px" maxH="1000px" justifyContent="space-between" p={5}>

        <Container maxW="100%" width="100%" p={0}>
          <WrapPlayer alignItems="flex-start">
            <ReactPlayer
              ref={refPlayer}
              playing={isPlaying}
              onPlay={handleOnPlay}
              onPause={handleOnPause}
              onProgress={handleSendProgress}
              onEnded={handleOnEnded}
              width="100%"
              height="700px"
              controls
              url={urlVideo}
            />
            <MetaVideoInfo />
          </WrapPlayer>
        </Container>
        <RoomActionsBar />
        <RoomModals
          showNameModal={showNameModal}
          onCloseNameModal={onCancelDialog}
          onAcceptNameModal={onAcceptDialog}
        />
      </VStack>

    </HStack>
  );
}
export default Room;

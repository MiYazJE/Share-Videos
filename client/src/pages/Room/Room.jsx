import { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { Container, VStack } from '@chakra-ui/react';

import RoomNameModal from 'src/components/Room/RoomNameModal';
import CustomTabs from 'src/components/Tabs';
import Scroller from 'src/components/Scroller/Scroller';
import MetaVideoInfo from 'src/components/Room/MetaVideoInfo';

import useRoom from 'src/hooks/useRoom';

import { useSocketEvents } from 'src/context/SocketEventsContextProvider';
import RoomActionsBar from 'src/components/Room/RoomActionsBar';
import { WrapPlayer } from './Room.styles';
import RoomModals from './modals';

const readSelector = ({ room, user }) => ({
  urlVideo: room.currentVideo.url,
  idRoom: room.id,
  isLoading: room.loadingRoom,
  name: user.name,
  isPlaying: room.isPlaying,
  host: room.host,
  seekVideo: room.seekVideo,
  progressVideo: room.progressVideo,
  currentVideoId: room.currentVideo.id,
});

function Room() {
  const [showNameModal, setShowNameModal] = useState(false);

  const {
    urlVideo,
    host,
    name,
    idRoom,
    isLoading,
    isPlaying,
    progressVideo,
    seekVideo,
    currentVideoId,
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
    if (id && !name) {
      setShowNameModal(true);
    } else {
      socketEvents.joinRoom({ id, name });
    }
  }, [id, name, socketEvents]);

  useEffect(() => {
    if (seekVideo) {
      refPlayer.current.seekTo(progressVideo);
      socketEvents.setSeekVideo(false);
    }
  }, [seekVideo, progressVideo, socketEvents]);

  const onCancelDialog = () => history.push('/');

  const onAcceptDialog = (nickname) => {
    if (nickname) {
      dispatch.user.SET_NAME(nickname);
      setShowNameModal(false);
    }
  };

  const handleSendProgress = () => {
    if (name === host) {
      socketEvents.sendProgress({
        progress: refPlayer.current.getCurrentTime(),
        idRoom,
        name,
      });
    }
  };

  const handleOnPlay = () => {
    if (Math.abs(refPlayer.current.getCurrentTime() - progressVideo) > 1) {
      socketEvents.sendProgress({
        progress: refPlayer.current.getCurrentTime(),
        idRoom,
        seekVideo: true,
        name,
      });
    }
    socketEvents.sendPlayerState({
      state: 'play',
      idRoom,
      name,
    });
  };

  const handleOnPause = () => {
    socketEvents.sendPlayerState({
      state: 'pause',
      idRoom,
      name,
    });
  };

  const handleOnEnded = () => {
    socketEvents.removeVideo({
      idVideo: currentVideoId,
      idRoom,
    });
  };

  return (
    <VStack height="100vh" justifyContent="space-between" p={5}>
      {isLoading
        ? <CircularProgress style={{ position: 'absolute', top: '50%' }} />
        : null}

      <Container width="100%" maxW="100%" p={0}>
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
  );
}
export default Room;

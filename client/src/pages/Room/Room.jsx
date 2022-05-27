import { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';

import DialogName from 'src/components/Room/DialogName';
import CustomTabs from 'src/components/Tabs';
import NavBar from 'src/components/NavBar';
import ResultVideos from 'src/components/ResultVideos';
import Scroller from 'src/components/Scroller/Scroller';
import MetaVideoInfo from 'src/components/Room/MetaVideoInfo';

import useRoom from 'src/hooks/useRoom';

import './room.scss';

const WIDTH_TO_RESIZE = 1300;

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
  const [playerHeight, setPlayerHeight] = useState(window.innerWidth < 700 ? '35vh' : '70vh');
  const [openDialog, setOpenDialog] = useState(false);
  const [floatPlayer, setFLoatPlayer] = useState(false);

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

  const dispatch = useDispatch();
  const refVideoResults = useRef();
  const refPlayer = useRef();
  const history = useHistory();
  const { id } = useParams();
  const { isValidRoom } = useRoom({ id });

  useEffect(() => {
    if (!isValidRoom) history.push('/');
  }, [isValidRoom, history]);

  useEffect(() => {
    if (id && !name) {
      setOpenDialog(true);
    } else {
      dispatch.room.joinRoom({ id, name });
    }
  }, [id, name, dispatch]);

  useEffect(() => {
    if (seekVideo) {
      refPlayer.current.seekTo(progressVideo);
      dispatch.room.setSeekVideo(false);
    }
  }, [seekVideo, progressVideo, dispatch]);

  useEffect(() => {
    function onResize() {
      setPlayerHeight(window.innerWidth < 700 ? '35vh' : '70vh');
    }
    function onScroll() {
      setFLoatPlayer(window.innerWidth < WIDTH_TO_RESIZE && this.scrollY > 900);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollTo = () => {
    refVideoResults.current.scrollIntoView({ behavior: 'smooth' });
  };

  const onCancelDialog = () => history.push('/');

  const onAcceptDialog = (nickname) => {
    if (nickname) {
      dispatch.user.SET_NAME({ name: nickname });
      setOpenDialog(false);
    }
  };

  const handleSendProgress = () => {
    if (name === host) {
      dispatch.room.sendProgress({
        progress: refPlayer.current.getCurrentTime(),
        idRoom,
        name,
      });
    }
  };

  const handleOnPlay = () => {
    if (Math.abs(refPlayer.current.getCurrentTime() - progressVideo) > 1) {
      dispatch.room.sendProgress({
        progress: refPlayer.current.getCurrentTime(),
        idRoom,
        seekVideo: true,
        name,
      });
    }
    dispatch.room.sendPlayerState({
      state: 'play',
      idRoom,
      name,
    });
  };

  const handleOnPause = () => {
    dispatch.room.sendPlayerState({
      state: 'pause',
      idRoom,
      name,
    });
  };

  const handleOnEnded = () => {
    dispatch.room.removeVideo({
      idVideo: currentVideoId,
      idRoom,
    });
  };

  return (
    <main>
      {isLoading
        ? <CircularProgress style={{ position: 'absolute', top: '50%' }} />
        : (
          <div id="wrapVideoPlayer">
            <NavBar scrollTo={scrollTo} />
            <div className="reactPlayer">
              <div
                style={{
                  height: playerHeight,
                  width: '100%',
                  display: floatPlayer ? 'block' : 'none',
                }}
              />
              <div
                className={`player ${floatPlayer ? 'floatPlayer' : ''}`}
              >
                <ReactPlayer
                  ref={refPlayer}
                  playing={isPlaying}
                  onPlay={handleOnPlay}
                  onPause={handleOnPause}
                  onProgress={handleSendProgress}
                  onEnded={handleOnEnded}
                  width="100%"
                  height={floatPlayer ? null : playerHeight}
                  controls
                  url={urlVideo}
                />
                {window.innerWidth > WIDTH_TO_RESIZE
                  ? (
                    <MetaVideoInfo />
                  ) : null}
              </div>
              <div className="tabs">
                <CustomTabs />
              </div>
            </div>
            <ResultVideos refVideoResults={refVideoResults} />
            {openDialog
              ? <DialogName open={openDialog} onCancel={onCancelDialog} onAccept={onAcceptDialog} />
              : null}
            <Scroller />
          </div>
        )}
    </main>
  );
}
export default Room;

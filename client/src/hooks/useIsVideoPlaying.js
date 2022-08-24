import { useSelector } from 'react-redux';

const getCurrentVideo = ({ room }) => ({
  currentVideo: room.currentVideo,
  isPlaying: room.isPlaying,
});

const useIsVideoPlaying = (videoId) => {
  const {
    currentVideo,
    isPlaying,
  } = useSelector(getCurrentVideo);

  return isPlaying && currentVideo.id === videoId;
};

export default useIsVideoPlaying;

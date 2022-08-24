import { useSelector } from 'react-redux';

const getCurrentVideo = ({ room }) => ({
  currentVideo: room.currentVideo,
  isPlaying: room.isPlaying,
});

const useIsVideoPlaying = (videoUrl) => {
  const {
    currentVideo,
    isPlaying,
  } = useSelector(getCurrentVideo);

  return isPlaying && currentVideo.url === videoUrl;
};

export default useIsVideoPlaying;

import { useRoomState } from 'src/context/SocketEventsContextProvider';

const useIsVideoPlaying = (videoUrl) => {
  const { currentVideo, isPlaying } = useRoomState();

  return isPlaying && currentVideo.url === videoUrl;
};

export default useIsVideoPlaying;

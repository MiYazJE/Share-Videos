import { useEffect, useCallback, useState } from 'react';

import { stringFormat } from 'src/utils';
import { useRoomState } from 'src/context/SocketEventsContextProvider';

const useVideoMetadata = () => {
  const { currentVideo } = useRoomState();
  const [viewsFormatted, setViewsFormatted] = useState('');

  const formatViews = useCallback(() => {
    const views = currentVideo?.views || 0;
    setViewsFormatted(
      stringFormat.formatViews(views),
    );
  }, [currentVideo]);

  useEffect(() => {
    formatViews();
  }, [formatViews]);

  return {
    currentVideo,
    viewsFormatted,
  };
};

export default useVideoMetadata;

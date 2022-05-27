import { useSelector } from 'react-redux';
import { useEffect, useCallback, useState } from 'react';

import { stringFormat } from 'src/utils';

const readCurrentVideo = ({ room }) => room.currentVideo;

const useVideoMetadata = () => {
  const currentVideo = useSelector(readCurrentVideo);
  const [viewsFormatted, setViewsFormatted] = useState('');

  const formatViews = useCallback(() => {
    if (!currentVideo?.views === null
      || currentVideo?.views === undefined
    ) {
      return;
    }

    setViewsFormatted(
      stringFormat.formatViews(currentVideo.views),
    );
  }, [currentVideo]);

  useEffect(() => {
    setViewsFormatted();
  }, [formatViews]);

  return {
    currentVideo,
    viewsFormatted,
  };
};

export default useVideoMetadata;

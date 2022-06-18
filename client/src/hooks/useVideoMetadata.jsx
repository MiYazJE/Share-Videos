import { useSelector } from 'react-redux';
import { useEffect, useCallback, useState } from 'react';

import { stringFormat } from 'src/utils';

const readCurrentVideo = ({ room }) => room.currentVideo;

const useVideoMetadata = () => {
  const currentVideo = useSelector(readCurrentVideo);
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

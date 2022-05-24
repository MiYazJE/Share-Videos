import { useSelector } from 'react-redux';
import { useEffect, useCallback, useState } from 'react';

import { readCurrentVideo } from '../reducers/roomReducer';

const ONE_MILLION = 1000000;

const useVideoMetadata = () => {
  const currentVideo = useSelector(readCurrentVideo);
  const [viewsFormatted, setViewsFormatted] = useState('');
  const formatNumber = (views) => views.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  const formatViews = useCallback(() => {
    const formatted = currentVideo.views < ONE_MILLION
      ? `${formatNumber(currentVideo.views)} views`
      : `${(currentVideo.views / ONE_MILLION).toFixed(1)} M views`;
    setViewsFormatted(formatted);
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

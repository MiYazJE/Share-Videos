import FlipMove from 'react-flip-move';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlay } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';

import { stringFormat } from 'src/utils';

import './videosGrid.scss';

const readSelector = ({ room, user }) => ({
  videos: room.queue,
  idRoom: room.id,
  currentVideoId: room.currentVideo.id,
  name: user.name,
});

function VideosGrid() {
  const {
    videos,
    idRoom,
    currentVideoId,
    name,
  } = useSelector(readSelector);

  const dispatch = useDispatch();

  const handleRemoveVideo = (idVideo) => {
    dispatch.room.removeVideo({
      idVideo,
      idRoom,
      name,
    });
  };

  const handleViewVideo = (idVideo) => {
    dispatch.room.viewVideo({
      idVideo,
      idRoom,
    });
  };

  return (
    <FlipMove
      staggerDurationBy="30"
      duration={600}
      enterAnimation="accordionVertical"
      leaveAnimation="accordionVertical"
      typeName="div"
      className="wrapVideosGrid"
    >
      {!videos.length
        ? (
          <div className="no-videos">
            <h2>No videos enqueued</h2>
          </div>
        )
        : videos.map(({ id, urlThumbnail, title }) => (
          <div key={id} className={`wrapVideo ${id === currentVideoId ? 'current' : null}`}>
            <div className="img">
              <img src={urlThumbnail} alt="thumbnail" />
            </div>
            <div className="meta">
              <span className="title">{stringFormat.truncateText(title)}</span>
              <div className="icons">
                <FaPlay className="play" onClick={() => handleViewVideo(id)} />
                <FiDelete className="remove" onClick={() => handleRemoveVideo(id)} />
              </div>
            </div>
          </div>
        ))}
    </FlipMove>
  );
}

export default VideosGrid;

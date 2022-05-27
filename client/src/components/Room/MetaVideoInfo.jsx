import useVideoMetadata from 'src/hooks/useVideoMetadata';

function MetaVideoInfo() {
  const {
    formattedViews,
    currentVideo: { views, uploadedAt, title },
  } = useVideoMetadata();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {title ? <span style={{ marginTop: '10px', fontSize: '25px', fontWeight: 'bold' }}>{title}</span> : null}
      <span style={{ fontSize: '12px' }}>{`${views ? `${formattedViews}` : ''} ${uploadedAt ? ` | ${uploadedAt}` : ''}`}</span>
    </div>
  );
}

export default MetaVideoInfo;

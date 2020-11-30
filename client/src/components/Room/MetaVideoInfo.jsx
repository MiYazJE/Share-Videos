import React from 'react';
import useViews from './../../hooks/useViews';
import { connect } from 'react-redux';
import { readCurrentVideo } from '../../reducers/roomReducer';

const MetaVideoInfo = ({ currentVideo: { views, uploadedAt, title } }) => {
    
    const formatViews = useViews();

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {title ? <span style={{ marginTop: '10px', fontSize: '25px', fontWeight: 'bold' }}>{title}</span> : null}
            <span style={{fontSize: '12px'}}>{`${views ? `${formatViews(views)}` : ''} ${uploadedAt ? ` | ${uploadedAt}` : ''}`}</span>
        </div>
    );
}

const mapStateToProps = (state) => ({
    currentVideo: readCurrentVideo(state)
})

export default connect(mapStateToProps, null)(MetaVideoInfo);
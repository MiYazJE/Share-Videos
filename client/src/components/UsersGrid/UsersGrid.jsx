import React from 'react';
import FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { readUsers } from '../../reducers/roomReducer';
import './usersGrid.scss';

const UsersGrid = ({ users }) => {
    return (
        <FlipMove
            staggerDurationBy="30"
            duration={500}
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
            typeName="div"
            className="wrapUsersGrid"
        >
            {users.map(user => (
                <div key={user} className="wrapUser">
                    <span className="name">{user}</span>
                </div>
            ))}
        </FlipMove>
    );

}

const mapStateToProps = (state) => ({
    users: readUsers(state)
});

export default connect(mapStateToProps, {})(UsersGrid);
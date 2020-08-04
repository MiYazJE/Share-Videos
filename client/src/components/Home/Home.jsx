import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { setName } from '../../actions/userActions';
import { createRoom } from '../../actions/roomActions';
import { readName } from '../../reducers/userReducer';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import './home.scss';

const Home = ({ createRoom, name, setName }) => {
    const [errorNoNickname, setErrorNoNickname] = useState(false);
    const history = useHistory();    

    const handleCreateRoom = () => {
        if (name) {
            createRoom(name, (id) => history.push(`/room/${id}`));
        } 
        else {
            setErrorNoNickname(true);
        }
    }

    return (
        <div id="home">
            <div className="wrap">
                <FormControl error={errorNoNickname}>
                    <TextField value={name} onChange={({target}) => setName(target.value)} style={{width: '80%'}} placeholder="Enter your name" />
                    <FormHelperText id="component-error-text">Your nickname is empty!</FormHelperText>
                </FormControl>
                <div className="buttons">
                    <Button onClick={handleCreateRoom} variant="contained" color="primary">
                        Create room
                    </Button>
                    <Button variant="contained" color="secondary">
                        Join Room
                    </Button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    name: readName(state)
});

const mapDispatchToProps = (dispatch) => ({
    createRoom: (name, cb) => dispatch(createRoom(name, cb)),
    setName: (name) => dispatch(setName(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

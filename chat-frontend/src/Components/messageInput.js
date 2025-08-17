import React, { useState } from 'react';
// import styled from 'styled-components';
// import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

const MessageInput = () => {
    const {inputValues,setInputValue} = useState('');
    
    const handleInputChange = (event) =>{
        setInputValue(event.target.value)
    }

    const handleSendMessage=() => {
        console.log("Message send")
    }

    return (
        <div className='message-input'>
            <textarea 
                placeholder='Type your message'
                value={inputValues}
                onChange={handleInputChange}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

MessageInput.propTypes = propTypes;
MessageInput.defaultProps = defaultProps;
// #endregion

export default MessageInput;
import React from 'react';
// import styled from 'styled-components';
// import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

function message({ text, sent }) {
    return <div className={`messages ${sent ? 'sent' : 'received'}`}>
        <div className='message-bubble'>{text}</div>
    </div>;
}

message.propTypes = propTypes;
message.defaultProps = defaultProps;
// #endregion

export default message;
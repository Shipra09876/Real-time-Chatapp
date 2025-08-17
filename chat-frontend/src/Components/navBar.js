import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">{props.title}</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <li style={listItemStyle}>
                        <Link to="/profile" target="_self" style={linkStyle}>Profile</Link>
                    </li>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/chat" target="_self" style={linkStyle}>Home</Link>
                        </li>
                    </ul>
                    <li style={listItemStyle}>
                        <Link to="/blocked-list" target="_self" style={linkStyle}>Block list</Link>
                    </li>

                    <li style={listItemStyle}>
                        <Link to="/friends-requests" target="_self" style={linkStyle}>Friend request</Link>
                    </li>
                    <li style={listItemStyle}>
                        <Link to="/login" target="_self" style={linkStyle}>Login</Link>
                    </li>
                    <li style={listItemStyle}>
                        <Link to="/signup" target="_self" style={linkStyle}>Signup</Link>
                    </li>


                </div>
            </div>
        </nav>
    )
}

const listItemStyle = {
    margin: '0 10px',
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
};


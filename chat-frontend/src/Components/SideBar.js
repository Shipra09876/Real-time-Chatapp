import React from 'react';
import { Link } from 'react-router-dom';

const propTypes = {};

const defaultProps = {};

const SideBar = () => {
    return <div className='sidebar'>Inbox
        <div>
            <li>
                <Link to="/find-friend">Find Friend</Link><br/>
                <Link to="/friends">Friends</Link><br/>
                <Link to="/friends-requests">Friend Requests</Link>
            </li>
        </div>
    </div>;
}


export default SideBar;
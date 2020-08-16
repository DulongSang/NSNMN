import React, { useState, useEffect } from "react";

import UserItem from "./UserItem";

function UserList(props) {
    const [userList, setUserList] = useState([]);

    // componentDidMount, setup socket event handlers
    useEffect(() => {
        props.socket.on("userList", userList => setUserList(userList));
    }, [props.socket]);

    return (
        <ul style={{ flex: 2, padding: 0 }}>
            {userList.map(user => 
                <UserItem user={user} key={user.username} />
            )}
        </ul>
    )
}

export default UserList;
import React from 'react';
import MessageCard from './Cards/MessageCard';
const UserList = ({ users }) => {
    return (
        <div className="user-list">
            {users.map((user, index) => (
                <MessageCard
                    key={index}
                    message={{
                        senderImage: user.avatar,
                        sender: user.name,
                        message: user.latestMessage,
                        dateTime: user.dateTime,
                        isRead: user.isRead
                    }}
                />
            ))}
        </div>
    );
};

export default UserList;
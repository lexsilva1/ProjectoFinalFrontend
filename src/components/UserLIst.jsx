import React from 'react';
import MessageCard from './Cards/MessageCard';

const UserList = ({ users }) => {



    return (
        <div className="user-list">
            {users.map((message, index) => (
                <MessageCard
                    key={index}
                    
                    message={{
                        id:message.sender.id,
                        senderImage: message.sender.image,
                        sender: message.sender.firstName + ' ' + message.sender.lastName,
                        message: message.message,
                        dateTime: message.time,
                        isRead: message.isRead
                    }
                }
                />
            ))}
        </div>
    );
};

export default UserList;
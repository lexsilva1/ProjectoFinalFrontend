import React from 'react';
import MessageCard from './Cards/MessageCard/MessageCard';
import userStore from '../stores/userStore';

/* UserList component is responsible for rendering the list of users in the messages page.*/
const UserList = () => {
const userList = userStore((state) => state.userList);

    return (
        <div className="user-list">
            {userList.map((message, index) => (
                console.log(message),
                <MessageCard
                    key={index}
                    
                    message={{
                        id:message.sender.id,
                        senderImage: message.sender.image,
                        sender: message.sender.firstName + ' ' + message.sender.lastName,
                        message: message.message,
                        dateTime: message.time,
                        isRead: message.read
                    }
                }
                />
            ))}
        </div>
    );
};

export default UserList;
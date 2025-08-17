# A Real-time Chat application 

##  Description 
This Real-Time Chat Application is a full-stack messaging platform that allows users to communicate instantly with friends, manage their contacts, and maintain their chat history in a secure and interactive environment. The application is built to provide smooth user experiences with real-time message delivery and essential user account functionalities. The system has been thoughtfully designed with layered functionalities and clear user roles.


Here is some functionality :
- User registration system 
- Friend management system
- Chat management system
- monitoring and profiles management
- Chat With AI 


## Features
### 1. User management system 
- User Registration  
- User Login
- User Profile 
- User logout 
- Forgot password
- Reset password 


### 2. Contact/ Friendship management system
- Send Friend Request 
- Find friend 
- Friend - request - view
- Friend - request - respond 
- View friends 
- Remove friend 
- Block User 
- Block user list 
- add Friend 

### 3. Chat management system
- Room creation 
- One to one chat 
- One to group 

### 4. Monitoring , logging and history : 
- History message and logs save into database

### 5 Chat With AI
- Chat
- Token Balance 
- AI Chat History

## Tech stack 
### Frontend : 
- HTML , CSS , JavaScript and React Js

### Backend : 
- Django + Django Rest Framework , JWT Authentication , EMail (SMTP)

### Websocket : 
- Django Channels 

### Databse : 
- Sqlite3 

## Installation

### Prerequisites:
- Python (>= 3.9)
- Node.js (>= 14.x)
- PostgreSQL (or your preferred DB)
- npm (comes with Node.js)
- Git
- Redis (for Django Channels, if used)
- Virtual Environment Tool (venv or virtualenv)


### Backend Installation Step:
#### Step 1: Navigate to backend folder
cd backend

#### Step 2: Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

#### Step 3: Install required packages
pip install -r requirements.txt

#### Step 4: Configure your sqlite3 
 database in settings.py or .env file

#### Step 5: Apply migrations
python manage.py migrate

#### Step 6: Create superuser (optional but useful)
python manage.py createsuperuser

#### Step 7: Run the development server
python manage.py runserver

### Frontend Installation Step:
#### Step 1: Navigate to frontend folder
cd ../frontend

#### Step 2: Install dependencies
npm install

#### Step 3: Start frontend dev server
npm start  

#### Step 4: Start the application 

## Working :

- User Register the application 
- User login process
- User profile 
- User logout 

- User can send the request anyone who is register in the application
- User find the friend
- Receiver can access friend request
- Receiver respond by accept and reject the request
- Login users can access their friend list
- Login users can remove the friend from their friendlist
- Login user can block the friends
- User can access their block users list
- Add friend into friendlist 
- User can create room
- Friends can chat with each other
- Group Chat
- History message and logs save into database
- Chat with AI 
- History Chat AI
- Token Balance 

## API endpoints
### Register :
```bash
    POST http://localhost:8000/api/account/register/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`    | 'String' | **Required** |
| `first name`    | 'String' | **Required** |
| `last name`    | 'String' | **Required** |
| `email`    | 'email' | **Required** |
| `password`    | 'number' | **Required** |
| `password2`    | 'number' | **Required** |
| `tc`    | 'Boolen' | **Required** |


### Login :
```bash
    http://localhost:8000/api/account/login/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`    | 'email' | **Required** |
| `password`    | 'number' | **Required** |


### Logout :
```bash
    POST http://localhost:8000/api/account/logout/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `refresh token`    | 'Token' | **Required** |

### Profile :
```bash
    GET http://localhost:8000/api/account/logout/
```

### Forgot password :
```bash
    POST http://localhost:8000/api/account/change_password/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `password`    | 'number' | **Required** |
| `password2`    | 'number' | **Required** |

### Send friend request:
```bash
    POST http://127.0.0.1:8000/api/contact/friend-request/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `receiver_id`    | 'number' | **Required** |

### View friend request: 
```bash
    GET http://127.0.0.1:8000/api/contact/friend-request/view/
```

### Respond request:
```bash
   POST http://127.0.0.1:8000/api/contact/friend-requests/respond<id>
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `action`    | 'string' | **Required** |

### View friend list :
```bash
    GET http://127.0.0.1:8000/api/contact/friends/
```

### Remove friend:
```bash
   DELETE http://127.0.0.1:8000/api/contact/friends/<login user id>/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `friend_id`    | 'id' | **Required** |

### Block User :
```bash
    POST http://127.0.0.1:8000/api/contact/block-user/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `block_user_id`    | 'id' | **Required** |


### Block User List:  
```bash
    GET http://127.0.0.1:8000/api/contact/blocked-users/
```

### Block user response:
```bash
    POST http://127.0.0.1:8000/api/contact/block-requests/respond/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user_id`    | 'id' | **Required** |
| `action`    | 'string' | **Required** |

### Find friend:
```bash
    GET http://127.0.0.1:8000/api/contact/find-friend/?
    query=shreshth
```

### Add friend:
```bash
    POST http://127.0.0.1:8000/api/contact/find-friend/?query=shreshth
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `receiver_id`    | 'number' | **Required** |

### Private Chat:
```bash
    POST http://127.0.0.1:8000/api/contact/chat-room/private/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user2_id`    | 'number' | **Required** |

### Group Chat:
```bash
    POST http://127.0.0.1:8000/api/contact/chat-room/group/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`    | 'string' | **Required** |

### Group Chat Invite :
```bash
    POST http://127.0.0.1:8000/api/contact/chat-room/group/invite/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `group_id`    | 'id' | **Required** |
| `user_id`    | 'id' | **Required** |

###  Fetching message: 
```bash
   GET http://127.0.0.1:8000/api/contact/chat-room/message/<login user id>/
```

### Chat With AI:
```bash
   POST http://127.0.0.1:8000/api/contact/chat_ai/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `message`    | 'String' | **Required** |

### Token Balance:

```bash
   GET http://127.0.0.1:8000/api/contact/token_balance/
```

### Chat AI History:

```bash
   GET http://127.0.0.1:8000/api/contact/chat_ai_history/
```

## How it works
### 1. Real-Time Messaging (WebSockets via Django Channels)
- When a user logs in and opens a chat, the frontend opens a WebSocket connection to the backend server.

- This connection stays open, allowing live two-way communication between client and server.

- When a message is sent, it is immediately broadcast to the recipient or the group using Channels.

- The receiver’s frontend gets the new message instantly without refreshing.

### 2. Creating or Joining Chat Rooms
- Users can: Create a new chat room (for group chats) Or automatically join a one-to-one private chat when messaging a friend.

- The backend identifies rooms using unique room names or IDs.

- When a user selects a chat, they are subscribed to that room's channel via WebSocket.


### 3. Sending and Receiving Messages
- When a user types and sends a message:

- It is sent through the WebSocket connection to the backend.

- The backend processes the message, saves it to the database, and broadcasts it to the correct chat room.

- All participants in that chat room receive the message in real time.


### 4. Message Storage and History
- Every message is stored in a PostgreSQL database with metadata (sender, timestamp, room).

- When a user opens a chat, the app fetches previous messages via REST API (or GraphQL) to show chat history.

- Older messages remain available unless deleted or cleared by users.


## Screenshot 
## Deployment 
## Feedback

If you have any feedback, please reach out to us at shipragupta09876@gmail.com


# Hi, I'm Shipra Gupta! 👋


## 🚀 About Me
I'm a python software developer...


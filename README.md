# Spotify Stats

## Table of contents 
- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [Data Models](#data-models)
- [Credits](#credits)


## Overview
This project is a web-based music social media app that allows users to login through Spotify and sync their Spotify data. Users can create customizable profiles that include their favorite songs and artists, interact with other users via forums and messaging, and view their Spotify liked songs, top songs, and top artists.

### Key Features

- **Liked Songs Page**: Displays user’s liked songs with album pictures. Clicking on the song opens the song on Spotify.
	- Status: Complete
- **User’s Top Artists Page**: Displays the user’s top artists for the last 4 weeks, the last 6 months, and the last twelve months. Clicking on an artist's picture opens the artist's profile on Spotify.
	- Status: Complete
- **User’s Top Songs Page:**: Displays the user’s top songs for the last 4 weeks, the last 6 months, and the last twelve months. Clicking on the album picture opens the album on Spotify. 
    - Status: Complete
- **User Profile Page:** Allows users to view and edit their profile. They can choose to display artists and songs from their Top/Liked pages. They can also make their profile private (different from their Spotify profile). 
    - Status: Complete
- **Discover Page:**: Allows searching for users in the database with links to view their profiles, and displays recently searched users.
    - Status: Complete
- **Forums Page:**: Displays all discussion boards, which users can click on to access the posts. Forums can also be public or private, have moderators, and allow users to reply and react to posts.
    - Status: Not functional
- **Inbox Page**: Displays chats with other users on the website and allows users to send messages.
	- Status: Functional with a few bugs 


## Setup Instructions
### Prerequisites
- Node.js
- npm
- A Firebase project setup for database management
- A Spotify for Developers account (since this is a testing product)

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/Quole0812/week2project
```
2. **Install dependencies**

Using npm, install the project's dependencies in both the backend and frontend:
```bash
cd back
npm install
```
```bash
cd front
npm install
```

3. **Spotify Develop Account Creation**

- To run this project, you must have access to a set of credentials from Spotify for developers. To get these credentials, start by navigating to Spotify for developers and either logging in with your Spotify account or making a new account to log in with. After that, go to the developer dashboard and create a project. In the project settings, you should be able to find a client ID and a client secret. 
- Create a .env file in the backend directory of your project under the names  client_id
and client_secret. 
- Finally, navigate to the user management section of settings and add your name and the email associated with your spotify account, as well as the emails and names of any other users you would like to be able to log in.  
4. **Firebase Configuration**
- Navigate to the Firebase console and set up a new project if you haven't already.
- Register your app with Firebase and obtain your project's Firebase configuration object. Save this file as permissions.js in your backend directory. 
5. **Start the development server**

Open two different terminals. In the first, run the following commands:
```bash
cd back
npx nodemon app.js
```

In the second terminal, run the following commands:
```bash
cd front
npm run dev
```
The backend server should now be running on port 3001, and the development server should be running on port 5173.


## Data Models
### chats
```javascript
{
  messages:[
    "Example1",
    "Example2",
    "Example3",
  ],
  members: [
    "ExampleId1",
    "ExampleId2",
  ]
}
```
### messages
```javascript
{
  content: "ExampleContent",
  userId: “ExampleId”,
}
```
### post
```javascript
{
  useriD: "/users/reference1",
  title: "ExampleSubject",
  content: "ExampleMessage",
  upvotes: 0,
}
```

### users
```javascript
{
  name:  "ExampleName",
  displayedArtists:[
    "ExampleArtist1",
    "ExampleArtist2",
    "ExampleArtist3",
  ],
  displayedSongs:[
    "ExampleSong1",
    "ExampleSong2",
    "ExampleSong3",
  ],
  email: “ExampleEmail”,
  bio: “Example Bio”,
  profile_picture: “ExampleLink”
}
```


## Credits 
-Jackson  https://github.com/Quole0812 
-Jacob https://github.com/jacobhuynh  
-Ben https://github.com/BenjaminVC 
-Vy https://github.com/svytran 
-Joyce https://github.com/jo-hya 



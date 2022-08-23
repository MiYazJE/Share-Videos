<h1 align="center">Share Video</h1>
<p align="left">
    Share Video is a website to view youtube videos in real time with friends. 
</p>

## Table of contents
- [How It Works](#howitworks)
- [Install](#install)

## How it Works
A user create a room and shares a link or a room code with others to join. When someone seek or play/pause a video he emits an event to everyone who's connected in the same room, same happens when someone adds a video to the playlist.

All of this its made with Web Sockets (socket.io) and node.js (express.js).

## Install backend

Go to `/server` folder.

- With docker-compose:
    ```
    docker-compose build
    docker-compose up -d
    ```
- Otherwise you will need mongoDB and node js in order to run:
    ```
    npm run dev
    ```
    
## Install frontend

Go to `/client` folder and run `npm run start`.

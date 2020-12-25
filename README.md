<h1 align="center">Share Video</h1>
<p align="center">
    Share Video is a website to view youtube videos in real time with friends. 
</p>

## Table of contents
- [How It Works](#howitworks)
- [Install](#install)
- [Known Problems](#problems)

## How it Works
This application is very simple to understanding how does it works. A user 'x' create a room and shares a link or a room code with others to join him. When someone seek the video or play/pause he emits an event to everyone who's connected in the same room, same happens when someone adds a video to the playlist.

All of this is made with Web Sockets (socket.io) and node.js (express.js).

## Install
This project uses [node](http://nodejs-org), so you must have installed it.

- <strong>Development mode</strong>: 
    ```
    npm run client
    npm run server
    ```

## Problems
- If the application has less than 1300px the chat does weird things with the scroll. 

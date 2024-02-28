const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

// Store paddle positions and velocity in an array
let paddlePositions = [
  { x: 20, y: 0 },
  { x: 20, y: 0 },
]; // Left, Right paddle positions

// socket.current.emit('movePaddle', {
//   paddle: 'left',
//   y: leftPaddlePosition.y - paddleSpeed,
// });

// Ball variables (example for reference)
let ballPosition = { x: 0, y: 0 };
let ballVelocity = { x: 5, y: 5 }; // Example initial velocity

const leftPaddleWidth = 20; // Width of the left paddle
const leftPaddleHeight = 120; // Height of the left paddle
const rightPaddleHeight = 120; // Height of the right paddle
const ballDiameter = 20; // Diameter of the ball

io.on('connection', (socket) => {
  console.log('A user connected');

  // // Listen for paddle movement updates from the client
  // socket.on('movePaddle', (data) => {
  //   console.log(data.y);
  //   if (data.paddle === 'left') {
  //     // Update left paddle position in the array
  //     paddlePositions[0].y = data.y;
  //     console.log(paddlePositions);
  //     // console.log(paddlePositions);
  //   } else if (data.paddle === 'right') {
  //     // Update right paddle position in the array
  //     paddlePositions[1].y = data.position;
  //   }

  //   // Broadcast updated paddle positions to all clients
  //   io.emit('updatePaddlePositions', {
  //     left: paddlePositions[0],
  //     right: paddlePositions[1],
  //   });
  // });

  socket.on('movePaddle', (data) => {
    console.log(data.y);
    if (data.paddle === 'left') {
      paddlePositions[0].y +=
        data.direction === 'up' ? -paddleSpeed : paddleSpeed;
    } else if (data.paddle === 'right') {
      paddlePositions[1].y +=
        data.direction === 'up' ? -paddleSpeed : paddleSpeed;
    }

    // Check for boundaries and handle collisions (if necessary)

    // Broadcast updated paddle positions to all clients
    io.emit('updatePaddlePositions', {
      left: paddlePositions[0],
      right: paddlePositions[1],
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// // Function to update ball position and handle collisions (example)
// function updateBallPosition() {
//   // Update ball position based on velocity
//   ballPosition.x += ballVelocity.x;
//   ballPosition.y += ballVelocity.y;

//   // Handle collisions with walls (top and bottom)
//   // ... (same as before)

//   // Handle collisions with paddles (example logic)
//   // ... (same as before)

//   // Broadcast updated ball position to all clients
//   io.emit('updateBallPosition', ballPosition);

//   // Schedule the next update
//   setTimeout(updateBallPosition, 16); // Update at approximately 60 frames per second
// }

// // Start updating ball position
// updateBallPosition();

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

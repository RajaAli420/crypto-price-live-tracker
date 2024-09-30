# Crypto Live Price Tracker

This is a personal project for exploring Websocket on Nest.js. It communicates with Binance Web Streams to fetch live price data. On the frontend I have used React.js and used socket client to connect to my backend to get real time updates. Currently it only fetches values for three predefined cypto pairs i.e:

- solusdt
- avaxusdt
- pepeusdt

## Features

- Real-time cryptocurrency price tracking (e.g., SOL, AVAX, PEPE)
- Backend using Nest.js to interact with Binance streams
- Frontend using React.js to display live data

## Run Locally

Clone the project

```bash
  git clone https://github.com/RajaAli420/crypto-price-live-tracker
```

Go to the project directory

For the Backend

```bash
  cd backend
```

For the Frontend

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

To Start the server

```bash
  npm run start:dev
```

To Start the frontend

```bash
  npm run start
```

## Project Structure/root-directory

```
├── /backend   # Nest.js API for Binance WebSocket streams
├── /frontend  # React.js frontend for live price display
└── README.md  # Project documentation
```

## Prerequisites

- Node.js (v14.x or later)
- npm

## Usage

- Make sure the backend is running on http://localhost:3000 before starting the frontend to avoid connection issues.
- Once both are running, visit http://localhost:3001 in your browser to see live crypto price updates.

## Troubleshooting

- Backend not responding: Check if the Binance WebSocket stream is reachable and ensure that npm run start:dev has started successfully.
- Frontend not connecting to the backend: Ensure that both the frontend and backend are running, and verify that the WebSocket URL in your frontend matches the backend URL (http://localhost:3000).

## License

This project is for personal learning and exploration. Feel free to use and modify as per your needs.

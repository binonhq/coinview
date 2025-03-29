# CoinView - User Guide

## Overview
The Cryptocurrency Price Tracker is a simple web application that allows users to check the current price of various cryptocurrencies. Users can enter a cryptocurrency symbol (e.g., BTC, ETH) to retrieve the latest price data. The application fetches real-time prices from a public API and displays them in an easy-to-read format.

## Application URL
Access the application here: [CoinView App](https://coinview-client.vercel.app/)


## Features

- Search for the current price of a cryptocurrency by entering its symbol.

- Real-time data fetched from a public cryptocurrency API.

- Optional price history tracking.

- User-friendly interface with a responsive design.

## Technical Details

### Back-end

- Developed using Node.js with Express.

- Fetches cryptocurrency infomation, prices from CoinGecko.

- Exposes a RESTful API endpoint to retrieve data.

### Front-end

- Built with React.

- Calls the back-end API to fetch cryptocurrency data.

- Displays current price information dynamically.

### Deployment
- Deployment on Vercel

### Running Locally

#### Prerequisites

- Node.js installed

- NPM or Yarn installed

- Clone the repostory: [Link repo](https://github.com/binonhq/coinview)

1. Setup Api server:
   ```
   cd api
   cp .env.example .env
   npm install
   npm start
   # This will start the server on http://localhost:3001/.
   ```

2. Setup Client:
   ```
   cd app
   cp .env.example .env
   npm install
   npm start
   # This will start the server on http://localhost:5173/.
   ```

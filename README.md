# 🎮 Somnia Streams Hub API

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

**A robust REST API for real-time blockchain data streaming on Somnia Dream Network**

[Features](#-features) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Examples](#-examples) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Usage Examples](#-usage-examples)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🌟 Overview

**Somnia Streams Hub** is a production-ready Express.js backend that provides a seamless interface for publishing and retrieving player data on the Somnia Dream blockchain network. Built with the [@somnia-chain/streams](https://www.npmjs.com/package/@somnia-chain/streams) SDK, this API enables real-time data streaming with on-chain verification.

### What This API Does

- **Publish Player Data**: Store player scores and playtime on-chain with cryptographic verification
- **Retrieve Leaderboards**: Fetch and rank player data with automatic deduplication
- **Schema Management**: Handle blockchain schema registration and validation
- **Health Monitoring**: Check wallet balance, network status, and schema initialization

### Use Cases

- 🎯 **Gaming Leaderboards**: Track player scores with tamper-proof on-chain storage
- 📊 **Analytics Dashboards**: Real-time player statistics and engagement metrics
- 🏆 **Tournament Systems**: Verifiable competition results and rankings
- 🔐 **Decentralized Identity**: Player achievement tracking across games

---

## ✨ Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| 🔒 **Blockchain Integration** | Direct integration with Somnia Dream Network for immutable data storage |
| ⚡ **Real-time Streaming** | Publish and retrieve data with minimal latency |
| 🛡️ **Schema Validation** | Type-safe data encoding with Solidity schema definitions |
| 🔄 **CORS Enabled** | Cross-origin support for web and mobile applications |
| 📈 **Auto Leaderboards** | Automatic ranking with duplicate elimination |
| 💾 **Data Persistence** | On-chain storage with infinite retention |
| 🔍 **Query Capabilities** | Filter and retrieve data by publisher and schema |
| ⚙️ **Health Checks** | Built-in endpoints for monitoring and diagnostics |

### Technical Features

- **Asynchronous Processing**: Non-blocking I/O for high throughput
- **Error Handling**: Comprehensive error messages with actionable feedback
- **Environment Configuration**: Secure credential management via `.env`
- **Gas Optimization**: Efficient transaction encoding to minimize fees
- **Schema Caching**: In-memory schema ID caching for performance

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Client Apps   │
│  (Web/Mobile)   │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌─────────────────┐
│  Express API    │
│  (This Service) │
├─────────────────┤
│ • /api/publish  │
│ • /api/data     │
│ • /api/schema   │
│ • /api/health   │
└────────┬────────┘
         │ Viem + SDK
         ▼
┌─────────────────┐
│ Somnia Dream    │
│   Blockchain    │
├─────────────────┤
│ • Smart Contract│
│ • Event Streams │
│ • Data Storage  │
└─────────────────┘
```

### Data Flow

1. **Client Request** → API validates input and authenticates
2. **Data Encoding** → SchemaEncoder converts data to Solidity types
3. **Transaction** → SDK signs and broadcasts to blockchain
4. **Confirmation** → Transaction hash returned to client
5. **Retrieval** → SDK queries on-chain data and decodes response

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `v18.0.0` or higher ([Download](https://nodejs.org/))
- **npm** `v9.0.0` or higher (comes with Node.js)
- **Git** (for cloning the repository)
- **Somnia Wallet** with STT tokens ([Get Testnet Tokens](https://somnia.network))

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 2 GB | 4+ GB |
| Storage | 500 MB | 1+ GB |
| Network | 10 Mbps | 50+ Mbps |

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Arya4546/somnia_streams_hub.git
cd somnia_streams_hub
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `@somnia-chain/streams` - Somnia SDK
- `viem` - Ethereum library
- `dotenv` - Environment variable management
- `cors` - Cross-origin resource sharing

### Step 3: Verify Installation

```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following configuration:

```env
# Publisher wallet address (receives on-chain data)
PUBLISHER_WALLET=0xYourPublisherWalletAddress

# Private key for signing transactions (keep this secret!)
PRIVATE_KEY=0xYourPrivateKeyHere

# Server port (default: 3000)
PORT=3000

# Optional: API key for protected endpoints
SECRET_API_KEY=your_secret_api_key_here
```

### Configuration Parameters

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PUBLISHER_WALLET` | ✅ Yes | Ethereum address that publishes data | `0xce73c...` |
| `PRIVATE_KEY` | ✅ Yes | Private key for transaction signing | `0x229ec...` |
| `PORT` | ❌ No | Server listening port (default: 3000) | `3000` |
| `SECRET_API_KEY` | ❌ No | Authentication key for secured routes | `sk_live_...` |

### Security Best Practices

⚠️ **NEVER commit your `.env` file to version control!**

```bash
echo ".env" >> .gitignore
```

- Use different private keys for development and production
- Rotate API keys regularly
- Use environment-specific `.env` files (`.env.development`, `.env.production`)
- Enable HTTPS in production environments

---

## 🔌 API Reference

### Base URL

**Local Development:**
```
http://localhost:3000/api
```

**Production:**
```
https://your-deployment-url.vercel.app/api
```

---

### 🏥 Health Check

Check API status, wallet balance, and schema initialization.

#### `GET /api/health`

**Response:**

```json
{
  "status": "ok",
  "wallet": "0x107f08b9fEb4b8550414131770BD341E4c274EAa",
  "balance": "1500000000000000000",
  "balanceSTT": "1.5000",
  "schemaId": "0xa54144e82f3260eb71cbf83275160556808d499bf285a8b5f440b77f244881f6",
  "network": "Somnia Dream",
  "rpc": "https://dream-rpc.somnia.network"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Service health status |
| `wallet` | string | Publisher wallet address |
| `balance` | string | Raw balance in wei |
| `balanceSTT` | string | Formatted balance in STT |
| `schemaId` | string | Computed schema identifier |
| `network` | string | Connected blockchain network |
| `rpc` | string | RPC endpoint URL |

**Use Case:** Monitor service health and verify wallet funding before publishing.

---

### 🔑 Get Schema ID

Retrieve the computed schema identifier for the current data structure.

#### `GET /api/schema`

**Response:**

```json
{
  "schemaId": "0xa54144e82f3260eb71cbf83275160556808d499bf285a8b5f440b77f244881f6"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schemaId` | string | Keccak256 hash of schema definition |

**Use Case:** Verify schema consistency across different environments.

---

### 📤 Publish Player Data

Store player score and playtime data on the blockchain.

#### `POST /api/publish`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "player": "0xA24d7ECD79B25CE6C66f1Db9e06b66Bd11632E00",
  "score": 9850,
  "playTime": 3600
}
```

**Request Parameters:**

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `player` | string | ✅ Yes | Ethereum address (EIP-55 checksummed) | Valid address format |
| `score` | number | ✅ Yes | Player score value | Integer, 0 to 2^256-1 |
| `playTime` | number | ✅ Yes | Playtime in seconds | Integer, 0 to 2^256-1 |

**Success Response (200):**

```json
{
  "success": true,
  "txHash": "0x742d35cc6634c0532925a3b844bc454e4438f44e1234567890abcdef"
}
```

**Error Response (400):**

```json
{
  "error": "Missing player, score, or playTime"
}
```

**Error Response (500 - Insufficient Funds):**

```json
{
  "error": "Insufficient funds: Publisher wallet has zero STT balance",
  "wallet": "0x107f08b9fEb4b8550414131770BD341E4c274EAa",
  "message": "Please fund this wallet with STT tokens on Somnia Dream network"
}
```

**Use Case:** Submit player achievements after game completion or milestone.

---

### 📥 Retrieve Leaderboard Data

Fetch all published player data with automatic ranking and deduplication.

#### `GET /api/data`

**Response:**

```json
{
  "totalPlayers": 3,
  "leaderboard": [
    {
      "rank": 1,
      "player": "0xA24d7ECD79B25CE6C66f1Db9e06b66Bd11632E00",
      "score": "9850",
      "playTime": "3600"
    },
    {
      "rank": 2,
      "player": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "score": "8500",
      "playTime": "2400"
    },
    {
      "rank": 3,
      "player": "0x1234567890ABCDEFabcdef1234567890ABCDEF12",
      "score": "7200",
      "playTime": "1800"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `totalPlayers` | number | Count of unique players |
| `leaderboard` | array | Sorted array of player records |
| `rank` | number | Player's position (1-indexed) |
| `player` | string | Ethereum address |
| `score` | string | Highest score for this player |
| `playTime` | string | Total playtime in seconds |

**Ranking Logic:**

1. **Deduplication**: Only highest score per player is kept
2. **Sorting**: Descending order by score
3. **Ranking**: Sequential rank assignment

**Use Case:** Display real-time leaderboards, tournament standings, or player statistics.

---

## 💡 Usage Examples

### Example 1: Publishing Data (cURL)

**Windows CMD:**

```bash
curl -X POST "http://localhost:3000/api/publish" ^
  -H "Content-Type: application/json" ^
  -d "{\"player\":\"0xA24d7ECD79B25CE6C66f1Db9e06b66Bd11632E00\",\"score\":9850,\"playTime\":3600}"
```

**PowerShell:**

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/publish' `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"player":"0xA24d7ECD79B25CE6C66f1Db9e06b66Bd11632E00","score":9850,"playTime":3600}'
```

**Linux/Mac:**

```bash
curl -X POST "http://localhost:3000/api/publish" \
  -H "Content-Type: application/json" \
  -d '{"player":"0xA24d7ECD79B25CE6C66f1Db9e06b66Bd11632E00","score":9850,"playTime":3600}'
```

---

### Example 2: JavaScript/TypeScript (Fetch API)

```javascript
async function publishPlayerScore(playerAddress, score, playTime) {
  try {
    const response = await fetch('http://localhost:3000/api/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player: playerAddress,
        score: score,
        playTime: playTime
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Transaction Hash:', data.txHash);
      return data.txHash;
    } else {
      console.error('Error:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Failed to publish:', error);
    throw error;
  }
}

publishPlayerScore('0xA24d7ECD79B25CE6C66f1Db9e06b66Bd11632E00', 9850, 3600);
```

---

### Example 3: Node.js (Axios)

```javascript
const axios = require('axios');

async function getLeaderboard() {
  try {
    const response = await axios.get('http://localhost:3000/api/data');
    const { totalPlayers, leaderboard } = response.data;

    console.log(`Total Players: ${totalPlayers}`);
    console.log('\nTop 10 Players:');
    
    leaderboard.slice(0, 10).forEach(player => {
      console.log(`${player.rank}. ${player.player} - Score: ${player.score} (${player.playTime}s)`);
    });

    return leaderboard;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error.message);
    throw error;
  }
}

getLeaderboard();
```

---

### Example 4: Python (Requests)

```python
import requests
import json

def publish_score(player_address, score, play_time):
    url = 'http://localhost:3000/api/publish'
    headers = {'Content-Type': 'application/json'}
    payload = {
        'player': player_address,
        'score': score,
        'playTime': play_time
    }
    
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    
    if response.status_code == 200 and data.get('success'):
        print(f"Success! Transaction Hash: {data['txHash']}")
        return data['txHash']
    else:
        print(f"Error: {data.get('error', 'Unknown error')}")
        return None

publish_score('0xA24d7ECD79B25CE6C66f1Db9e06b66Bd11632E00', 9850, 3600)
```

---

### Example 5: React Component

```jsx
import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/data');
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="leaderboard">
      <h2>Top Players</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Play Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(player => (
            <tr key={player.player}>
              <td>{player.rank}</td>
              <td>{player.player.slice(0, 8)}...</td>
              <td>{player.score}</td>
              <td>{player.playTime}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
```

---

## 🎬 Scripts

### Development Mode

Start the server with hot-reloading (requires nodemon):

```bash
npm run dev
```

### Production Mode

Start the server in production:

```bash
npm start
```

### Manual Testing

Test publisher script (publishes data every 5 seconds):

```bash
node publisher.js
```

Test subscriber script (listens for new data every 3 seconds):

```bash
node subscriber.js
```

---

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Configure `vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app.js"
    }
  ],
  "env": {
    "PUBLISHER_WALLET": "@publisher_wallet",
    "PRIVATE_KEY": "@private_key",
    "PORT": "3000"
  }
}
```

3. **Add Environment Variables:**

```bash
vercel env add PUBLISHER_WALLET
vercel env add PRIVATE_KEY
```

4. **Deploy:**

```bash
vercel --prod
```

### Heroku Deployment

1. **Create Heroku App:**

```bash
heroku create somnia-streams-hub
```

2. **Set Environment Variables:**

```bash
heroku config:set PUBLISHER_WALLET=0xYourWalletAddress
heroku config:set PRIVATE_KEY=0xYourPrivateKey
```

3. **Deploy:**

```bash
git push heroku main
```

### Railway Deployment

1. **Install Railway CLI:**

```bash
npm install -g @railway/cli
```

2. **Initialize:**

```bash
railway init
```

3. **Deploy:**

```bash
railway up
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

**Build and Run:**

```bash
docker build -t somnia-streams-hub .
docker run -p 3000:3000 --env-file .env somnia-streams-hub
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Account does not exist" Error

**Problem:** Publisher wallet has no STT balance.

**Solution:**
```bash
# Check wallet balance
curl http://localhost:3000/api/health

# Fund wallet at: https://somnia.network/faucet
```

#### 2. "Invalid address" Error

**Problem:** Player address is not EIP-55 checksummed.

**Solution:**
```javascript
// Use ethers.js to checksum address
const { getAddress } = require('ethers');
const checksummed = getAddress('0xaabbccdd...'); // Returns checksummed address
```

#### 3. "Schema registration failed"

**Problem:** Schema already registered with different parameters.

**Solution:**
- Ensure schema definition matches: `address player, uint256 score, uint256 playTime`
- Check `PUBLISHER_WALLET` environment variable is correct

#### 4. CORS Errors

**Problem:** Cross-origin requests blocked.

**Solution:**
- API already has CORS enabled for all origins
- For production, restrict origins in `app.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],
  methods: ['GET', 'POST']
}));
```

#### 5. Port Already in Use

**Problem:** Port 3000 is occupied.

**Solution:**
```bash
# Change port in .env
PORT=3001

# Or kill process using port
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

---

## 📊 Performance Optimization

### Best Practices

1. **Batch Publishing**: Publish multiple records in one transaction
2. **Rate Limiting**: Implement rate limits to prevent abuse
3. **Caching**: Cache leaderboard data with Redis
4. **Indexing**: Use off-chain indexing for faster queries
5. **Load Balancing**: Deploy multiple instances behind a load balancer

### Monitoring

- **Health Checks**: Monitor `/api/health` endpoint
- **Transaction Tracking**: Log all transaction hashes
- **Error Tracking**: Use Sentry or similar service
- **Metrics**: Track API response times and success rates

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use ES6+ syntax
- Follow existing code formatting
- Add comments for complex logic
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the ISC License.

---

## 🔗 Resources

- [Somnia Documentation](https://docs.somnia.network)
- [Somnia Chain Streams SDK](https://www.npmjs.com/package/@somnia-chain/streams)
- [Viem Documentation](https://viem.sh)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

## 📞 Support

For issues, questions, or feature requests:

- **GitHub Issues**: [Create an issue](https://github.com/Arya4546/somnia_streams_hub/issues)
- **Documentation**: See troubleshooting section above
- **Community**: Join Somnia Discord

---

<div align="center">

Made with ❤️ for the Somnia Ecosystem

**[⬆ Back to Top](#-somnia-streams-hub-api)**

</div>

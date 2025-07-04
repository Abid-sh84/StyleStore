# QuickBite Food Delivery Application

This is a full-stack food delivery application with a Node.js/Express backend, MongoDB database, and a React/Vite frontend.

## Project Structure
```
project/
├── backend/        # Node.js/Express API with MongoDB
├── frontend/       # React/Vite application
```

## Features

- User authentication (register, login, profile)
- Food menu with advanced filters (category, price, cuisine type)
- Shopping cart
- Checkout process
- Order management for food delivery
- Restaurant management
- MongoDB database integration
- API endpoints for all functionality

## Database Integration

The application uses MongoDB for persistent data storage. Key features include:

- Food items stored and retrieved from MongoDB
- API routes for fetching all dishes, popular dishes, and individual dish details
- Advanced filtering capabilities by category, cuisine, price, and search terms
- Food seeding script for easy database initialization
- Fallback to dummy data in frontend when database connection fails

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Ensure your `.env.prod` file has the necessary variables:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```

4. Test the database connection:
   ```
   npm run test:db
   ```

5. Import sample product data (optional):
   ```
   npm run data:import
   ```

6. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env.prod` and update the values:
     ```
     cp .env.example .env.prod
     ```
   - Add your PayPal client ID to the `.env.prod` file

4. Start the development server:
   ```
   npm run dev
   ```

### Quick Start Using Scripts

For convenience, you can use the provided scripts to start both frontend and backend simultaneously:

#### Windows:
```
.\start.ps1
```

#### macOS/Linux:
```
chmod +x ./start.sh
./start.sh
```

These scripts will:
1. Check if your MongoDB connection is configured
2. Ask if you want to seed the database with sample products
3. Start both the frontend and backend servers

## Connecting Frontend to Backend

The frontend is configured to communicate with the backend API through the following:

1. **Development**: A proxy is set up in `vite.config.ts` to forward API requests to the backend server:
   - All requests to `/api/*` will be proxied to `http://localhost:5000`

2. **API Service**: The `api.js` utility provides a configured Axios instance that:
   - Adds the base URL prefix
   - Handles authentication tokens
   - Manages cookies for sessions
   - Provides error handling

3. **Environment Variables**:
   - Backend: The `.env.prod` file contains MongoDB URI, JWT secrets, etc.
  - Frontend: The `.env` file specifies API URLs, PayPal client ID, and other config. Example:
     ```
     VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
     ```

## Running in Production

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```
   cd ../backend
   npm start
   ```

The backend is configured to serve the frontend build files in production mode.

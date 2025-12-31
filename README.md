# ShopSphere - E-Commerce Application

ShopSphere is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It features a modern, responsive user interface and robust backend functionality for managing products, users, and orders.

## Key Features

- **User Authentication**: Secure login and signup functionality for users and admins.
- **Product Browsing**: View products with advanced filtering, sorting, and search capabilities.
- **Search & Discovery**:
  - Real-time search suggestions.
  - Voice search functionality.
  - Trending and recent search history.
- **Shopping Cart & Wishlist**: 
  - Add items to cart or wishlist.
  - Manage cart quantities and view price summaries.
- **Admin Dashboard**: Special access for admins to manage the platform.
- **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
- **Modern UI**: Clean and attractive interface styled with custom CSS and smooth animations.

## Tech Stack

### Frontend
- **React.js**: Library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **React Router**: For seamless navigation between pages.
- **CSS**: Custom styling with variables for a consistent design system.
- **Context API**: State management for Auth, Cart, and Wishlist.

### Backend
- **Node.js & Express**: Server-side runtime and framework.
- **MongoDB**: NoSQL database for storing user and product data.
- **Mongoose**: ODM library for MongoDB connection and modeling.
- **JWT (JSON Web Tokens)**: For secure user authentication.

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js installed.
- MongoDB installed locally or a MongoDB Atlas connection string.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mernproject
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Running the App
- Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).
- The backend API will be running at `http://localhost:5000`.

## Project Structure

- **frontend/**: Contains the React application code.
- **backend/**: Contains the Node.js/Express server and database logic.

---

*Enjoy shopping with ShopSphere!*

# E-Commerce Platform for Fans and Air Conditioners

A full-stack e-commerce platform built with React, Node.js, Express, and Firebase.

## Features

- User authentication with Google Sign-in
- Product catalog with color and size variants
- Shopping cart functionality
- Admin dashboard for order management
- Rider PWA for order deliveries
- Responsive design with Tailwind CSS

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utility functions
├── server/                # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
├── admin/                # Admin dashboard
└── rider/               # Rider PWA
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install

   # Install admin dashboard dependencies
   cd ../admin
   npm install

   # Install rider app dependencies
   cd ../rider
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in server, client, admin, and rider directories
   - Add necessary Firebase configuration
   - Add other environment variables as needed

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend
   cd ../client
   npm start

   # Start admin dashboard
   cd ../admin
   npm start

   # Start rider app
   cd ../rider
   npm start
   ```

## Technologies Used

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Authentication: Firebase
- Admin Panel: Custom React Dashboard
- Rider App: React PWA
- Database: MongoDB
- State Management: React Context API
- API Documentation: Swagger

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details # Ecommerce
# Ecommerce
# Ecommerce
# Ecommerce

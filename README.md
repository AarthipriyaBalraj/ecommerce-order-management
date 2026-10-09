# E-Commerce Order Management API

A backend REST API for managing users, products, inventory, and customer orders.

## Technologies Used

* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* JWT Authentication
* bcryptjs
* Swagger UI

## Features

* User registration and login
* JWT authentication
* Role-Based Access Control (RBAC)
* Product management
* Order creation and order history
* Stock availability validation
* Inventory updates when orders are created
* Order status management
* Swagger API documentation

## Project Structure

```text
ecommerce-order-management/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── app.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── swagger.js
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/AarthipriyaBalraj/ecommerce-order-management.git
cd ecommerce-order-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure your PostgreSQL credentials and JWT secret.

**Never upload your `.env` file or expose passwords and secrets.**

### 4. Start the server

```bash
npm run dev
```

The API runs at:

`http://localhost:5000`

## API Documentation

Open Swagger UI after starting the server:

`http://localhost:5000/api-docs`

## Main API Endpoints

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | `/api/users/register`    | Register a user     |
| POST   | `/api/users/login`       | Login               |
| GET    | `/api/users/profile`     | View user profile   |
| GET    | `/api/products`          | View products       |
| POST   | `/api/products`          | Create a product    |
| PUT    | `/api/products/:id`      | Update a product    |
| DELETE | `/api/products/:id`      | Delete a product    |
| POST   | `/api/orders`            | Create an order     |
| GET    | `/api/orders`            | View my orders      |
| GET    | `/api/orders/:id`        | View an order       |
| PUT    | `/api/orders/:id/status` | Update order status |

## Author

**Aarthipriya Balraj**

GitHub: https://github.com/AarthipriyaBalraj/ecommerce-order-management

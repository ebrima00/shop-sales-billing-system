# Shop Sales and Billing System

## Project Overview

The Shop Sales and Billing System is a RESTful API developed to help manage shop operations, including product management, sales transactions, and inventory tracking.

The system allows users to create, retrieve, update, and delete products and sales records while keeping track of available stock.

## Technologies Used

- Node.js
- Express.js
- Prisma ORM
- Database (configured through Prisma)
- JavaScript
- REST API

## Project Features

### 1. Product Management
- Retrieve all products.
- Retrieve a single product.
- Create new products.
- Update product information.
- Partially update product information.
- Delete products.

### 2. Sales Management
- Create sales transactions.
- Retrieve all sales.
- Retrieve a single sale.
- Update existing sales.
- Partially update sales.
- Delete sales.

### 3. Inventory Management
- Track product quantities.
- Check available product stock.
- Connect sales transactions with products.

## API Endpoints

Base URL:

`http://localhost:3000`

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| PATCH | `/api/products/:id` | Partially update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Sales

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sales` | Get all sales |
| GET | `/api/sales/:id` | Get one sale |
| POST | `/api/sales` | Create a sale |
| PUT | `/api/sales/:id` | Update a sale |
| PATCH | `/api/sales/:id` | Update sale quantity |
| DELETE | `/api/sales/:id` | Delete a sale |

## Example Requests

### Create a Product

POST `/api/products`

```json
{
  "name": "Sugar",
  "price": 850,
  "quantity": 40
}
```

### Create a Sale

POST `/api/sales`

```json
{
  "productId": 2,
  "quantity": 2
}
```

**Note:** The product ID must belong to an existing product.

## Installation and Setup

1. Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/shop-sales-billing-system.git
```

2. Navigate into the project directory:

```bash
cd shop-sales-billing-system
```

3. Install dependencies:

```bash
npm install
```

4. Configure your environment variables in a `.env` file.

5. Generate the Prisma Client:

```bash
npx prisma generate
```

6. Start the development server using the appropriate script configured in `package.json`.

## Testing

API endpoints can be tested using the REST Client extension in Visual Studio Code.

Example:

```http
@baseURL = http://localhost:3000

### Get all products
GET {{baseURL}}/api/products

### Get all sales
GET {{baseURL}}/api/sales
```

## Author

**Ebrima Saine**

Computer Science Student | Aspiring Software Developer

## Project Status

Development in progress.
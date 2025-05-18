# Blog Posts API

This is a simple RESTful API built with Node.js and Express.js. It allows you to create, read, update, and delete blog posts. The application connects to a PostgreSQL database and includes middleware for authentication and rate limiting.

## Features

- **Authentication**: Protects all routes using JWT (JSON Web Tokens).
- **Rate Limiting**: Protects the API from being overwhelmed by too many requests.
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on blog posts.

## Prerequisites

- Node.js
- Express.js
- PostgreSQL database
- Postman or any other API testing tool
- pg-promise
- dotenv
- body-parser
- JWT Authentication
- Rate Limiting

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root of your project with the following variables:
    ```env
    DB_HOST=your-database-host
    DB_PORT=your-database-port
    DB_USER=your-database-username
    DB_PASSWORD=your-database-password
    DB_NAME=your-database-name
    ```

4. Start the server:
    ```bash
    npm start
    ```

    The API will be accessible at `http://localhost:3000`.

## Sample Endpoints

### 1. **GET /posts**
Retrieve all blog posts.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:**
- Status: `200 OK`
- Body: JSON array of blog posts.

### 2. **GET /posts/:id**
Retrieve a specific blog post by ID.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:**
- Status: `200 OK`
- Body: JSON object of the blog post.

### 3. **POST /posts**
Create a new blog post.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Body (JSON):**
```json
{
    "title": "Post Title",
    "date": "2023-05-18",
    "tags": ["tag1", "tag2"],
    "text": "This is the content of the blog post.",
    "author": "Author Name"
}

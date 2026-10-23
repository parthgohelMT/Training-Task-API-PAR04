# Node.js Task Management CRUD API (TypeScript & MySQL)

A robust, type-safe RESTful CRUD API built with Express, Sequelize ORM, MySQL, and HTTP Basic Authentication. Converted to strict TypeScript with comprehensive type safety, input validation, and centralized error handling.

---

## 1. Technology Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript (strict mode enabled)
- **Web Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM**: Sequelize v6
- **Development Server**: `ts-node-dev`
- **Authentication**: HTTP Basic Authentication middleware (timing-safe via `crypto.timingSafeEqual`)
- **Environment Management**: `dotenv`

---

## 2. Project Structure

```text
Training-Task-API-PAR-04/
├── config/
│   └── database.ts          # Sequelize database connection & configuration
├── controllers/
│   └── taskController.ts    # Typed CRUD handlers & input validation
├── middleware/
│   └── basicAuth.ts         # Constant-time Basic Auth middleware
├── models/
│   └── Task.ts              # Typed Sequelize Task model & attributes
├── routes/
│   └── taskRoutes.ts        # Express router mounted at /api/tasks
├── app.ts                   # Express application setup & startup sequence
├── dist/                    # Compiled JavaScript build output (git-ignored)
├── tsconfig.json            # TypeScript compiler configuration (strict)
├── .env                     # Local environment secrets (git-ignored)
├── .env.example             # Template for required environment variables
├── .gitignore               # Git ignore rules (node_modules, dist, .env)
├── package.json             # NPM package configuration and scripts
└── README.md                # Project documentation & API guide
```

---

## 3. Environment Configuration

Ensure a `.env` file exists in the root directory (refer to `.env.example`):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_task_api_par_04
DB_USER=root
DB_PASSWORD=root
BASIC_AUTH_USERNAME=admin
BASIC_AUTH_PASSWORD=admin123
```

> **Security Note**: Never commit `.env` to version control. Passwords and credentials are never logged or exposed in API error responses.

---

## 4. Installation & Scripts

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Mode
Runs the TypeScript server directly with automatic reload on changes:
```bash
npm run dev
```

### 3. Build for Production
Compiles TypeScript files into the `dist/` directory with strict type checking:
```bash
npm run build
```

### 4. Production Mode
Runs the compiled application from `dist/app.js`:
```bash
npm start
```

Upon startup, the application verifies database connectivity, synchronizes the `Task` model with MySQL, and listens on the configured port:
```text
Database connection has been established successfully.
Task model synchronized successfully.
Server is running on port 3000
```

---

## 5. Basic Authentication

All routes under `/api/tasks` are protected with HTTP Basic Authentication.

### Credentials
- **Username**: `admin` (or `BASIC_AUTH_USERNAME`)
- **Password**: `admin123` (or `BASIC_AUTH_PASSWORD`)

### Header Format
```http
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

### Unauthorized Response (`401 Unauthorized`)
When credentials are missing, malformed, or incorrect:
- **Header**: `WWW-Authenticate: Basic realm="Task API"`
- **Body**:
  ```json
  {
    "error": "Unauthorized: Missing Authorization header"
  }
  ```

---

## 6. API Endpoints

### 1. Create Task
- **Endpoint**: `POST /api/tasks`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Basic YWRtaW46YWRtaW4xMjM=`
- **Request Body**:
  ```json
  {
    "title": "Learn TypeScript",
    "description": "Convert the Node.js API to TypeScript"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": 1,
    "title": "Learn TypeScript",
    "description": "Convert the Node.js API to TypeScript",
    "completed": false,
    "createdAt": "2026-10-23T08:25:00.000Z",
    "updatedAt": "2026-10-23T08:25:00.000Z"
  }
  ```

---

### 2. Get All Tasks
- **Endpoint**: `GET /api/tasks`
- **Headers**:
  - `Authorization: Basic YWRtaW46YWRtaW4xMjM=`
- **Response** (`200 OK`):
  ```json
  [
    {
      "id": 1,
      "title": "Learn TypeScript",
      "description": "Convert the Node.js API to TypeScript",
      "completed": false,
      "createdAt": "2026-10-23T08:25:00.000Z",
      "updatedAt": "2026-10-23T08:25:00.000Z"
    }
  ]
  ```

---

### 3. Get Task by ID
- **Endpoint**: `GET /api/tasks/:id`
- **Headers**:
  - `Authorization: Basic YWRtaW46YWRtaW4xMjM=`
- **Example**: `GET /api/tasks/1`
- **Response** (`200 OK`):
  ```json
  {
    "id": 1,
    "title": "Learn TypeScript",
    "description": "Convert the Node.js API to TypeScript",
    "completed": false,
    "createdAt": "2026-10-23T08:25:00.000Z",
    "updatedAt": "2026-10-23T08:25:00.000Z"
  }
  ```
- **Error Responses**:
  - Malformed ID (`GET /api/tasks/abc`): `400 Bad Request`
    ```json
    {
      "error": "Invalid task ID. ID must be a positive integer."
    }
    ```
  - Not Found (`GET /api/tasks/999`): `404 Not Found`
    ```json
    {
      "error": "Task not found"
    }
    ```

---

### 4. Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Basic YWRtaW46YWRtaW4xMjM=`
- **Example**: `PUT /api/tasks/1`
- **Request Body**:
  ```json
  {
    "title": "Master TypeScript",
    "description": "Converted the Node.js API to strict TypeScript",
    "completed": true
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "id": 1,
    "title": "Master TypeScript",
    "description": "Converted the Node.js API to strict TypeScript",
    "completed": true,
    "createdAt": "2026-10-23T08:25:00.000Z",
    "updatedAt": "2026-10-23T08:30:00.000Z"
  }
  ```
- **Error Responses**:
  - Malformed ID: `400 Bad Request`
  - Empty Title (`"title": ""`): `400 Bad Request`
  - Invalid Boolean: `400 Bad Request`
  - Nonexistent Task: `404 Not Found`

---

### 5. Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Headers**:
  - `Authorization: Basic YWRtaW46YWRtaW4xMjM=`
- **Example**: `DELETE /api/tasks/1`
- **Response** (`200 OK`):
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```
- **Error Responses**:
  - Malformed ID: `400 Bad Request`
  - Nonexistent Task: `404 Not Found`

---

## 7. Error Handling & Security

- **Centralized Error Handling**: Captures synchronous and asynchronous errors safely.
- **Data Protection**: Stack traces and internal database error details are never exposed in responses.
- **Fail-Safe Startup**: If MySQL is unreachable, the application logs a safe error and exits immediately with code `1`.

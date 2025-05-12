# CRUD API Project

This project is a Node.js application implementing a CRUD (Create, Read, Update, Delete) API for managing user data. It supports running in both single-instance mode and a multi-threaded mode utilizing the Node.js Cluster API with a load balancer.

This project was developed as part of the RS School Node.js course.


## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/meta-panic/node-simple-crud.git
    ```

2.  Install dependencies:
    ```bash
    npm i
    ```

## Configuration

1.  Create a `.env` file in the root of the project by copying the example file or creating it from scratch:
    ```
    # .env
    MAIN_PORT=4000
    DB_PORT=1234
    ```

2.  Key environment variables:
    *   `MAIN_PORT`: The base port for the application. In single mode, the application listens on this port. In multi-mode, the load balancer listens on this port.
    *   `DB_PORT` (Example): If your database (or mock database service) runs as a separate process, specify its port here. Workers will need to connect to this.

## Running the Application

### Single Instance Mode

*   **Development (with Nodemon for auto-restarts):**
    ```bash
    npm run start:dev:single
    ```
    The application will run on the `PORT` specified in your `.env` file.

*   **Production:**
    ```bash
    npm run start:prod:single
    ```

### Multi-threaded Mode (with Load Balancer)

This mode starts multiple worker instances and a load balancer.

*   **Development (with Nodemon for auto-restarts):**
    ```bash
    npm run start:dev:multi
    ```
    The load balancer will listen on `PORT` (e.g., 4000).
    Worker processes will be started on `PORT + n` (e.g., 4001, 4002, ...). The number of workers will be `(number of CPU cores - 1)`.

*   **Production:**
    ```bash
    npm run start:prod:multi
    ```

## Running Tests

End-to-End tests are configured using Jest and Supertest.

```bash
npm run test:e2e
```

## API Endpoints

The following endpoints are available under the `/api/users` path:

*   **`GET /api/users`**: Get all users.
*   **`GET /api/users/{userId}`**: Get a specific user by their ID.
*   **`POST /api/users`**: Create a new user.
    *   Request Body: `{ "username": "string", "age": "number", "hobbies": ["string"] }`
*   **`PUT /api/users/{userId}`**: Update an existing user by their ID.
    *   Request Body: `{ "username": "string", "age": "number", "hobbies": ["string"] }`
*   **`DELETE /api/users/{userId}`**: Delete a user by their ID.

Refer to the assignment specifications for details on expected status codes and error responses.


## API Usage Examples (cURL)


### 1. Get All Users

```bash
curl --request GET \
  --url http://localhost:4000/api/users \
  --header 'User-Agent: insomnia/11.1.0'
```

### 2. Create a New User

```bash
curl --request POST \
  --url http://localhost:4000/api/users \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.1.0' \
  --data '{
	"username": "Jean Doe",
	"age": 33,
	"hobbies": ["knitting", "fighting with Joe"]
}
'
```


### 3. Get user by id

```bash
curl --request GET \
  --url http://localhost:4000/api/users/be77989e-9c21-4ed0-8d80-570e92dfb3fa \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.1.0'
```

### 4. Delete user by id

```bash
curl --request DELETE \
  --url http://localhost:4000/api/users/973085e9-f934-4a95-b08c-2f730fde3bb3 \
  --header 'User-Agent: insomnia/11.1.0'
```

### 5. Replace user by id

```bash
curl --request PUT \
  --url http://localhost:4000/api/users/cb0856a9-d112-4e7c-a1a6-f7825df75534 \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.1.0' \
  --data '{
	"username": "Joe Doe",
	"age": 30,
	"hobbies": ["video games", "football"]
}
'
```
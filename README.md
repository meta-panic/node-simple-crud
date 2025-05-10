# CRUD API Project (crud)

This project is the 4th homework for rs-school, implementing a basic CRUD (Create, Read, Update, Delete) API.

## Prerequisites

Before you begin, ensure you have met the following requirements:
*   You have installed [Node.js](https://nodejs.org/) (which includes npm). It's recommended to use a recent LTS version.
*   You can also use [Yarn](https://yarnpkg.com/) as an alternative to npm if you prefer.

## Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd crud
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
    or if you use Yarn:
    ```bash
    yarn install
    ```

## Environment Variables

This project uses environment variables for configuration.
1.  Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Modify the `.env` file with your specific configuration values (e.g., `MAIN_PORT`).

## Running the Application

### Development Mode

To run the application in development mode with automatic reloading on file changes (using `nodemon` and `ts-node`):
```bash
npm run start:dev:single
```
The server will typically start on the port specified by `MAIN_PORT` in your `.env` file (defaulting to the value in `.env.example` if not set).

### Production Mode

To build the application and run it in production mode:
1.  Build the TypeScript code:
    ```bash
    npm run build
    ```
    This will compile the TypeScript files from `src/` into JavaScript files in the `dist/` directory.

2.  Start the server:
    ```bash
    npm run start:prod:single
    ```
    This command first runs the build script and then starts the server using the compiled JavaScript from the `dist/` directory.

## Available Scripts

In the `package.json` file, the following scripts are available:

*   `npm run start:dev:single`: Starts the application in development mode with `nodemon`.
*   `npm run start:prod:single`: Builds the application and then starts it in production mode.
*   `npm run build`: Compiles TypeScript to JavaScript.
*   `npm test`: (Currently echoes an error message - to be implemented)

## Project Structure (Simplified)

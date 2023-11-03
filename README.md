## Building and Starting the Backend

### Prerequisites
- Node.js (>= 10.x)
- yarn (>= 1.x)

### Step 1: Clone the Repository
If you haven't already, clone the repository to your local machine.

### Step 2: Install Dependencies
Navigate to the project directory and run the following command to install all the required dependencies:

```bash
yarn install
```

### Step 3: Build the Backend
To build the backend, run the following command:

```bash
yarn build
```

This will compile the TypeScript code in the `src` directory and output the transpiled JavaScript files into the `dist` directory. Source maps will also be generated for easier debugging.

### Step 4: Configure Environment Variables
Before starting the backend, you need to set up your environment variables. Create a `.env.production.local` file in the root of your project and fill in the necessary variables. You can use the provided `.env.example.local` file as a reference.

### Step 5: Start local DB
To start the local DB, run the following command:

```bash
docker run -it --rm -d -p 27017:27017 mongo
```

### Step 6: Start the Backend in Development Mode
Before starting the backend, you need to set up your environment variables. Create a .env.development.local file in the root of your project and fill in the necessary variables. You can use the provided .env.example.local file as a reference.

During development, you can use the following command to run the backend with auto-reloading enabled:

```bash
yarn dev
```

The development mode allows you to make changes to the source code and see the updates without manually restarting the server.

### Step 7: Start the Backend in Production Mode
To run the backend in production mode, use the following command:

```bash
yarn start
```

This command will build the backend again and start the server using Node.js in production mode.

### Docker Compose
To run the backend in a Docker container, use the following command:

```bash
docker-compose up
```

### Additional Scripts
- `yarn test`: Run tests using Jest.
- `yarn lint`: Lint the source code using ESLint.
- `yarn lint:fix`: Automatically fix linting issues.


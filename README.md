# Workout APP

## Initialize



**Server**

add .env file to server root

```sh
touch server/.env
```

fill in the required environment variables

```sh
DATABASE_URL="postgresql://halvor@localhost:5432/halvor"

JWT_SECRET=some_random_string
REFRESH_TOKEN_SECRET=another_random_string

# Allowed Origins for CORS (comma-separated)
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5173

# Application Port
PORT=3001

# Application Environment
NODE_ENV=development
```

```sh
cd server
npm i 
npm run dev
```

**Client**
```sh
cd client
npm i 
npm run dev
```

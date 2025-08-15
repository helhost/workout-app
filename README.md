# Workout APP

## SETUP

```sh
touch .env
```

*Fill in the required environment variables*
```C
POSTGRES_USER=<some_user>
POSTGRES_PASSWORD=<Sufficiently_strong_password>
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
VITE_API_URL=http://localhost:8080
```

## RUN

1. First time:
```sh
docker-compose up -d --build
```

2. Any other time:
```sh
docker-compose up -d
```

3. Shutdown:
```sh
docker-compose down
```

4. Shutdown and clear DB
```sh
docker-compose down -v
```

## Project structure

workout-app
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── tests.yml
├── client/
│   ├── Dockerfile
│   ├── index.html
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── api/
│   │   │   ├── index.ts
│   │   │   ├── users.ts
│   │   │   └── workouts.ts
│   │   ├── http-client/
│   │   │   ├── index.ts
│   │   │   └── errors.ts
│   │   └── ws-client/
│   │       ├── index.ts
│   │       └── ws.ts
│   └── tests/
│       ├── api/
│       │   ├── users.test.ts
│       │   └── workouts.test.ts
│       └── ws/
│           ├── users-ws.test.ts
│           └── workouts-ws.test.ts
└── server/
    ├── app/
    │   ├── Dockerfile
    │   ├── main.py
    │   ├── database.py
    │   ├── api/
    │   │   ├── users.py
    │   │   └── workouts.py
    │   ├── models/
    │   │   ├── users.py
    │   │   └── workouts.py
    │   ├── schemas/
    │   │   ├── users.py
    │   │   └── workouts.py
    │   ├── ws_manager/
    │   │   └── websocket_manager.py
    │   └── tests/
    │       ├── test_users.py
    │       ├── test_workouts.py
    │       └── test_websockets.py
    └── db/
        └── init/

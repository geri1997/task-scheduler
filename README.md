# Requirements

- NodeJs version >= 18
- Docker (optional, for containerized startup)

# Configuration

Set environment parameters similar to this example .env:

    PORT = 3000
    MONGODB_URI = <mongodb_uri>
    JWT_SECRET = <jwt_secret>
    JWT_EXPIRATION_TIME = <expiration_time>

# Build & Run locally

    npm install
    npm run start

# Build & Run using Docker

## Dockerfile

In the root directory run:

    docker build -t task-scheduler .
    docker run -it -p 3000:3000 task-scheduler

# How to use

When running locally or with Docker, the server starts at port `3000`. To send requests you can use a tool like Postman or use Swagger by going to `/api`.
Or you can look at an example deployment [here](https://d2-chvg.onrender.com/api). You might need to wait around 1 minute for the instance to spin up.

# Project Architecture

The project is comprised of one dockerized NestJs service in front of a mongoDb instance. The frontend is not implemented in this project but you can take a look at Swagger to explore the API endpoints.

# ProjectifyWeb

## Description
Develop a fully functional web application for project management, enabling users to create, edit, and delete projects along with tasks within these projects. The application includes both client-side and server-side components.

**Technology Stack:**
- Frontend: React.js, Tailwind CSS
- Backend: Nest.js/Express, MongoDB
- Authentication: JWT
- Documentation: Swagger

## Basic Level:

**Client-Side:**
- Create a main page displaying a list of projects with sorting and search capabilities.
- Implement the ability to add a new project with form validation.
- Ensure responsive design using Tailwind CSS.  

**Server-Side:**
- Set up Nest.js/Express.js server and connect to MongoDB.
- Implement CRUD operations for the Project model.

# Backend (server-side)

```bash
$ cd backend
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.  
[Nest Documentation](https://docs.nestjs.com/)

## Installation

```bash
$ npm install
```

## Before Running the Server (dotenv)

1. Copy the `.env-example` file and rename it to `.env`.

2. Modify the configurations in the `.env` file to suit your environment settings. Ensure the server connects to the database and other necessary configurations.

    Example `.env` file:
    ```dotenv
    # The port on which the server is running
    PORT=4000

    # your connection string to MongoDB
    MONGO_LINK=`mongodb+srv://<username>:<password>@<cluster-domain>/?dbName=<database-name>&retryWrites=true&w=majority`
    ```

3. Save the changes made in the `.env` file.


## Running the server app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<!-- ## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
``` -->

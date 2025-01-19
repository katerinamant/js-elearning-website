# LearningHub

A web application that allows users to browse educational content, add items to a cart, and manage their purchases with authentication.

## Setup Instructions

1. Clone the repository to your local machine.

2. Start the backend server:

```bash
cd server

npm install

npm start
```

3. Run the frontend:

- Open `public/index.html` in a browser.

## MongoDB Usage

When the enviroment variable `USE_MONGO` is set to `"true"`,
the server uses a MongoDB database.

Create a MongoDB cluster and fill the `MONGO_URI` and `MONGO_DB_NAME` variables in `.env`, to have its full functionality.

## Sample Users

The following users are available for testing:

| **Username** | **Password** |
|-------------|-------------|
| `admin`     | `admin`     |
| `katerina`  | `katerina`  |
| `alex`      | `alex`      |

## Persistence & Assumptions

When the usage of MongoDB is disabled:

- Users, carts and sessions are managed using a DAO structure.
- Carts are stored in memory and will be lost when the server restarts.

When the server uses MongoDB:

- Carts are stored in the database and are preserved, even when the server restarts.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Handlebars, React.
- **Backend**: Node.js, Express.js, MongoDB.
- **Authentication**: Session-based using UUIDs.

Made with ❤️ by Alex Papadopoulos and Katerina Mantaraki for 🎓

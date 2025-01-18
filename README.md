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


## Sample Users

The following users are available for testing:

| **Username** | **Password** |
|-------------|-------------|
| `admin`     | `admin`     |
| `katerina`  | `katerina`  |
| `alex`      | `alex`      |


## Persistence & Assumptions
- Carts are stored in memory and will be lost when the server restarts.
- Users and carts are managed using a DAO structure.


## Technologies Used
- **Frontend**: HTML, CSS, JavaScript, Handlebars, React.
- **Backend**: Node.js, Express.js.
- **Authentication**: Session-based using UUIDs.


Made with ❤️ by Alex Papadopoulos and Katerina Mantaraki for 🎓

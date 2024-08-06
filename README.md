# TaskMaster
![image](https://github.com/imshawan/task-master/blob/main/docs/sign-in.png)
TaskMaster is a task management application built with Node.js, Express, MongoDB, React, and Material-UI (MUI). The application allows users to manage their tasks efficiently with a clean and responsive user interface.

## Features

### Task Management
- **Create Tasks**: Users can create new tasks with a title, description, and status (e.g., "To Do," "In Progress," "Done").
- **Update Tasks**: Users can update the details of existing tasks.
- **Delete Tasks**: Users can delete no longer needed tasks.
- **View Tasks**: Users can view a list of all their tasks.
- **Filter Tasks**: Users can filter tasks by status (e.g., "All", "To Do", "In Progress", "Done", "Discarded").
- **Sort and Search Tasks**: Users can sort tasks by different criteria and search for tasks by keywords.

### Additional Features
- **User Authentication and Authorization**: Secure access to the application with user authentication. Only authorized users can access and manage their tasks.
- **Task Due Dates**: Ability to set due dates for tasks and track them on the go.
- **User Profiles**: Users can have profiles with avatars. It also shows brief statistics about the tasks
- **Responsive Design**: The application is fully responsive and works well on all devices.

### Security
- Implemented basic security measures such as Input validations, Authorization, CORS, Logging, and Rate limiting to protect the application from common vulnerabilities.
- Server-side validation to ensure that task data is valid before saving it to the database.

## Components

### Task Form
A form to create a new task with fields for title, description, and status. This component ensures that all necessary information is provided before a task is created.

### Task List
A list of tasks displaying the title, description, and status of each task. Users can update the status or delete a task directly from the list.

### Task Filter
A dropdown to filter tasks by their status. Options include "All", "To Do", "In Progress", "Discarded" and "Done."

### User Profile
Displays user information, avatar, and brief statistics of their tasks and allows users to update their profile name.

## Technologies Used

### Front-End
- **React**: A JavaScript library for building user interfaces.
- **Material-UI (MUI)**: A popular React UI framework for designing responsive and modern interfaces.
- **tss-react**: Used for styling components.

### Back-End
- **Node.js**: A JavaScript runtime for server-side development.
- **Express**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for storing task data.

### Authentication
- **JWT**: JSON Web Tokens for secure authentication and authorization.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imshawan/task-master.git
   ```

2. **Install server dependencies:**
   ```bash
   cd task-master
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ./client
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the server directory with the following variables:
   ```env
   PORT=3001
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
   - In the client directory
   ```env
   PORT=4000
   REACT_APP_HOST=http://localhost:3001
   ```

5. **Start the server: (in dir: task-master)**
   ```bash
   npm start
   ```

6. **Start the client:**
   ```bash
   cd ./client
   npm start
   ```

## Screenshots
![image](https://github.com/imshawan/task-master/blob/main/docs/profile.png)
![image](https://github.com/imshawan/task-master/blob/main/docs/about.png)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


---

Thank you for using TaskMaster! We hope it helps you stay organized and productive.

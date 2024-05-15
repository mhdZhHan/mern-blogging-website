# Inkspire Blogging Platform

Welcome to the inkspire Blogging Platform repository! inkspire is a full-stack blogging platform built using the MERN (`MongoDB`, `Express.js`, `React.js`, `Node.js`) stack. It provides users with the ability to read and write blog posts, comment on posts, and interact with other users.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Demo

Check out the live demo of the inkspire platform [here](https://inkspire.mohammedsh.xyz).

## Features

- **User Authentication:** Allow users to sign up, log in, and log out securely.
- **Blog Management:** Enable users to create, edit, and delete their blog posts.
- **Comment System:** Implement a comment system for users to engage with blog posts.
- **Notifications:** Notify users about likes, comments, and replies on their blog posts, as well as other relevant activity.
- **Reporting System:** Allow users to report inappropriate content or spam.
- **Admin Panel:** Provide administrators with tools to manage users, blog posts, and reported content.
- **Responsive Design:** Ensure a seamless user experience across devices of all screen sizes.

## Technologies Used

- **Frontend:**
  - **React.js:** JavaScript library for building user interfaces.
  - **React Context API:** State management solution for managing application state.
  - **Axios:** Promise-based HTTP client for making requests to the backend API.
  - **Tailwind CSS:** Utility-first CSS framework for rapidly building custom designs.
  - **Vercel:** Frontend deployment platform for hosting the React application.

- **Backend:**
  - **Node.js:** JavaScript runtime environment for running server-side code.
  - **Express.js:** Web application framework for building APIs and handling HTTP requests.
  - **MongoDB:** NoSQL database for storing blog posts, user information, and other data.
  - **Mongoose:** MongoDB object modeling tool for Node.js to simplify database operations.
  - **AWS EC2:** Cloud computing service for hosting the backend server.

- **Deployment:**
  - **AWS S3:** Cloud-based storage service for storing media files (e.g., images) associated with blog posts.
  - **Vercel:** Frontend deployment platform for hosting the React application.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/mhdZhHan/mern-blogging-website.git
```
   
2. Navigate to the project directory:

```bash
cd mern-blogging-website
```

3. Install dependencies for both the client and server:
 
```bash
# Navigate to the server directory
cd server
 
# Install server dependencies
yarn install
 
# Navigate back to the root directory
cd ..
 
# Navigate to the client directory
cd client
 
# Install client dependencies
yarn install
```

4. Set up environment variables:

Create a .env file in the root directory of the server (server directory) and add the following environment variables:

```bash
DB_LOCATION=<your_mongodb_uri>
SECRET_ACCESS_KEY=<your_jwt_secret_key>
AWS_ACCESS_KEY=<your_aws_access_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=true
```

Replace `<your_mongodb_uri>`, `<your_jwt_secret_key>`, `<your_aws_access_key>`, and `<your_aws_secret_access_key>` with your actual values.

5. Start the development server:

```bash
# Start the server
cd ../server
yarn start

# Open a new terminal tab/window
# Navigate to the client directory
cd ../client

# Start the client
yarn start
```

6. Open your browser and navigate to http://localhost:3000 to view the Inkspire Blogging Platform.

## Usage

Now you're ready to explore and interact with the Inkspire platform locally on your machine!

- Register for an account or log in if you already have one.
- Create, edit, and delete your own blog posts.
- Comment on blog posts and engage with other users.
- Receive notifications about likes, comments, and replies on your blog posts, as well as other relevant activity.
- Report inappropriate content or spam.
- Admins can manage users, blog posts, and reported content from the admin panel.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/mhdZhHan/mern-blogging-website/blob/main/LICENSE) file for details.

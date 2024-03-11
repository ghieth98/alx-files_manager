# Project Name: File Management Platform

## Overview

This project serves as a summary of the back-end trimester, focusing on various aspects such as authentication, NodeJS,
MongoDB, Redis, pagination, and background processing. The objective is to develop a simple platform for uploading and
viewing files, incorporating user authentication via token, file listing, uploading new files, changing file
permissions, viewing files, and generating thumbnails for images.

## Features

- User authentication via token
- Listing all files
- Uploading new files
- Changing permissions of files
- Viewing files
- Generating thumbnails for images

## Getting Started

To begin, ensure that you have the following prerequisites installed:

- NodeJS
- MongoDB
- Redis

Next, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies by running `npm install`.
4. Configure environment variables as necessary.
5. Start the server by running `npm start`.

## Project Structure

The project structure is designed to promote modularity and maintainability. Key directories and files include:

- `src`: Contains the source code for the project.
    - `controllers`: Handles HTTP request handling and business logic.
    - `models`: Defines MongoDB schemas and models.
    - `services`: Implements various services such as file upload, authentication, etc.
    - `middlewares`: Houses middleware functions for request processing.
    - `utils`: Stores utility functions used throughout the project.
    - `config`: Manages configuration settings.
    - `routes.js`: Defines the application routes.
    - `app.js`: Entry point for the application.
- `tests`: Contains test suites for different components of the application.
- `README.md`: Provides instructions and information about the project.

## Contributing

Contributions to the project are welcome! If you have any suggestions for improvements or would like to add new
features, please feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).


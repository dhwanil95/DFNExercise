# DFNExercise
This project involves building a front-end application using Vue3 for a music database application.

# music-service-frontend

## Introduction
This project involves building a front-end application using Vue3 for a music database application. The purpose of this application is to fetch and display data related to Artists, Albums, and Songs from the provided REST services. The application allows sorting and pagination of data and requires authentication for all REST service calls.

## Dependencies
- Docker Desktop (Backend)
- VSCode or similar Text Editor
- Node.js
- Vue CLI

## Getting Started
Clone the repository: Use the following command to clone the repository to your local machine.

git clone https://github.com/dhwanil95/DFNAssessment.git

Run the back end 'music-service' 
1. Start the server:
    $ cd music-service
    $ docker-compose up
2. To stop service:
    $ CTRL-C
    $ docker-compose down

NOTE: the music-service has 3 endpoints and runs on port 5000:
http://localhost:5000/albums
http://localhost:5000/artists
http://localhost:5000/songs

Run the Application front end: Start the application using the following command.

cd music-service-frontend

## Project setup
npm install

### Compiles and hot-reloads for development
npm run serve

## Usage
After running the backend After running the application , open your browser and navigate to http://localhost:8080 (or the port specified in your terminal). The application should load and display the Artists, Albums, and Songs data. 
Screenshots are attached in "screenshots" folder.

![Screenshot (84)](https://github.com/dhwanil95/DFNExercise/assets/25331245/e74a0a08-1602-4c5f-926c-3a99![Screenshot (85)](https://github.com/dhwanil95/DFNExercise/assets/25331245/7584f5fb-5aa1-4e0e-af2e-88e17718b2dc)
b690e12e)
![Screenshot (86)](https://github.com/dhwanil95/DFNExercise/assets/25331245/9d36f41d-793f-4039-9633-aac615ea405e)
![Screenshot (87)](https://github.com/dhwanil95/DFNExercise/assets/25331245/9aa7b4ef-9534-463f-9ef4-87d1fa0d5deb)![Screenshot (88)](https://github.com/dhwanil95/DFNExercise/assets/25331245/54460e65-019b-4a06-b320-fb93803fa5c0)



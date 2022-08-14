# Citybike List App (backend)

## General info

I created this project (with Node.js + Express + MongoDB) to serve as the backend for Solita's Dev Academy challenge 2022.

There exist RESTful endpoints for most CRUD operations, for both citybike stations and trips to and from the stations.

When first running the app, the station and trip data is read into a local MongoDB instance from four .csv files that 
are included with the project.

The frontend version of the project (dl link in the next section) calls the endpoints to display the trips and stations, 
as well as some statistics about them.

## Installation & running

The project is run locally on your own computer.

1. Download and install the local Node.js driver for MongoDB (google the instructions for PC or Mac).
To ensure functionality, choose the default options for the installation. 

2. Download the project as a zip file or run 'git clone' on it with your terminal shell of choice.

3. Download the following four .csv files (Github wouldn't let me store them in the project folder due to file size limit):

[Stations,](https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv)
[Trips-1,](https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv)
[Trips-2,](https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv)
[Trips-3.](https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv)

4. Put the files in the folder 'csv' that is included with the project.

5. Make sure you have Node Package Manager ('npm') installed on your computer (refer to Google for the instructions).
6. In the project folder, run the terminal command 'npm install'.
7. Then, run the command 'npm start'.
8. This should start the server; the app is ready to receive web requests from the frontend.

9. In order to view the data and operate on it, be sure to install and run the frontend part of the project 
as well: [citybike-list-frontend.](https://github.com/villeloh/citybike-list-frontend)

## About the project

### Tech choices

I went with Node.js and plain JS because time was of the essence and they're the most familiar backend tools to me.
Also, Node.js tends to work well for small projects like this, being very lean by default.

Minimal libraries were used in order to avoid any potential issues with them. I thought about using Mongoose with MongoDB, 
but decided against it as there were only two kinds of stored objects, with clearly named fields whose types can (hopefully) 
be easily deduced.

MongoDB is one of the only databases that I have extensive experience with, and I like how everything is an object in it.

### Other choices

I split the project into two different git repos, as typically the frontend and backend are not included in the same repo; 
for me it would lead to a confusing and error-prone workflow.

Since this is such a small project, I committed everything straight to the master branch (I'd never do it in a work project).

Early on in the project, I chose which requirements I wanted to fulfill; I'm pleased to say that in the end 
I finished almost all of them (with some rough edges). The server endpoints for adding and deleting stations 
and trips do exist; there is just no UI to access them.

I thought about doing a remote version, but in the end decided against it. Heroku or AWS Amplify + S3 would've 
worked fine for it in theory, but I didn't want to risk losing time to the obscure issues that sometimes crop up with them.

Time pressure and inexperience are also the reasons why there are no tests of any kind for either part of the project.
I've fiddled with unit tests in Java Spring and JS, but never really learned a framework top-to-bottom.

### Final words (for now)

It was a fun little project, although I was in a tremendous hurry. There is a lot of room for improvement; 
in particular, the database query for getting station info is very slow. More requirements could easily 
be fultilled as well.
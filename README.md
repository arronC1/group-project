# Group 11 - Project Central

This project is managed using gitflow. Please only create feature branches off of develop branch.

# Git global setup

$ git config --global user.name "Your Name"
$ git config --global user.email "email@cardiff.ac.uk"

# Clone Repo
Make sure you have set up your SSH key in GitLab

$ git clone git@gitlab.cs.cf.ac.uk:c1702957/group_11_project_central.git
$ cd group_11_project_central

# Download all of the required packages
Note: you only have to do this once - or if npm complains that packages are missing

$ npm install

# Database
Make sure you have access to an empty MariaDB SQL database called Project_Central with username and password below (will be changed to PostgreSQL when we start developing). Demo App will create database tables

database: 'Project_Central'
username: 'express'
password: 'expressPassword'

If you have a problem of a refused connection when setting up try: GRANT ALL PRIVILEGES ON *.* TO 'express'@'localhost' IDENTIFIED BY 'expressPassword' WITH GRANT OPTION;

# Start NodeJS server with Demo

$ npm start

# Browser to 

http://127.0.0.1:3000


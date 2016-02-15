# MyAchievements
MyAchievements developed by:
Angular2, Express, Mongodb, node.js,  jade, scss, bootstrap.js ,webpack, 

##Build

1. Run `npm install` to install the dependencies for the frontend.
2. `cd backend` Go to the directory `backend` Run `npm install` again to install the dependencies for the backend.
3. develop mode: `cd ..` come back to the root directory Run `npm start` and visit `http://localhost:8080` (make sure port 8080 and 3000 are not taken, because the nodejs will run in port 3000 and the webpack server will run in port 8888)
4. product mode: `cd ..` come back to the root directory Run `npm run deploy` and then `cd backend` go to the directory `backend` run `npm start` and then visit `http://localhost:3000` (make sure port 3000 is not taken) *Ps*: the product mode, for some resons, when I compress the scripts which will lead to the angular2 can not provide the service providers correctly. So it need to add the source map to solve, which will cause the size of file `bundle.js` more than 15M. 


##Test
You can run `mocha`(the directory is `backend`) to test the blog-backend.(I use the mocha and chai to test)


##Configuration
In the `backend` directory, the file `config.js` contain the configuration about the backend server. Also you can set up the *Manager* (account, password, email, name) for the system.  

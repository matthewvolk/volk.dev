---
title: Build your own user authentication REST API using Node and MongoDB
description:
  A tutorial demonstrating how you can create your very own user authentication REST API using
  Node.js and MongoDB.
published: Apr 07, 2018
updated: Jun 20, 2020
---

## Project Introduction

Chris Anderson from Microsoft once described Javascript as the "English of Programming Languages" -
a lot of people can speak at least a little bit of it, even it it's bad. It's not a perfect
language, but it's a language which is relatively easy to learn for a lot of people.

In this tutorial, I'll show you how to build a simple REST API using Node.js, Express, MongoDB, and
Mongoose.

## MongoDB

For this project, I'm going to be using a cloud-hosted, free version of MongoDB called
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Go ahead and click the link, sign up for an
account, and follow [this guide](https://docs.atlas.mongodb.com/getting-started/). You should end up
with a connection string that looks similar to:

```shell
mongodb+srv://<dbusername>:<password>@dev-nycjj.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Copy that string to your clipboard and head into the next step.

## Folder Structure & Initial Routes

Open up your terminal and navigate to the directory you'd like to create your project folder in.
Copy and paste the following line into your terminal

```shell
mkdir PROJECT_NAME && cd PROJECT_NAME && npm init
```

Walk through each step of the <kbd>npm init</kbd> script (our entry point is going to be

<kbd>index.js</kbd>).

When you are done, create a <kbd>.env</kbd> file in the root of your project directory.

Open the <kbd>.env</kbd> file in your text editor and enter:

```
MONGODB_URI=URL_YOU_COPIED_FROM_EARLIER
```

Save that file, and head back to your terminal. Run the following:

```shell
npm install express mongoose bcryptjs cors dotenv jsonwebtoken body-parser passport-jwt passport
```

Once installed, create an <kbd>index.js</kbd> file in the root directory of your project to serve as
your main entry point file. You'll want to import all of the modules you need for this file, found
below:

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
```

Below your imports, initialize your app variable:

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);

const app = express();
```

Right under that, create a variable for my port number so that it is easily accessible and can be
modified from one location in your file:

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const app = express();

const port = 3000;
```

Then go ahead and use <kbd>app.listen</kbd> to tell your app which port to listen for:

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
```

You should have enough code to successfully run your server to check if you've run into any bugs at
this point.

Now we want to install [Nodemon](https://nodemon.io/) globally, so that we don't need to stop and
start our node server everytime we make a change to a file.

<kbd>npm install -g nodemon</kbd>

Once installed, run <kbd>nodemon</kbd> in your terminal from within your application directory and
wait for your <kbd>Server running at: ...</kbd> message to let you know your app is running on the
port you specified earlier.

Next, we'll go ahead and install our CORS middleware, so that we can make requests to this API from
a different domain name. If you'd like to learn more about CORS and what it does, the MDN docs have
[a great article](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) I recommend reading.

Since we installed the CORS npm module in the beginning of this project, integrating the CORS
middleware is as simple as adding:

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
```

The module basically does us the favor of injecting different headers within our application using

<kbd>res.header</kbd>, but you can read some more on that
[here](https://enable-cors.org/server_expressjs.html). We'll be using this
module with another module we installed called <kbd>body-parser</kbd>, which parses
incoming request bodies. For example, when you receive a form submission, body-parser
will help you parse the form input data. When you receive a <kbd>GET</kbd> request
with a string query, body-parser will help you parse that URL parameter for validation.

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
```

Next, let's make use of the Express router so that we can encapsulate all of the user routes in
another file without cluttering our main entry file. Go ahead and create a new constant called

<kbd>users</kbd> and have it require the file where we will store our routes. We
also need to mount another piece of middleware on the <kbd>app</kbd> variable to
add the <kbd>/users</kbd> prefix to all the routes in the file we create below.

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const app = express();
const port = 3000;
const users = require("./routes/users");

app.use(cors());
app.use(bodyParser.json());
app.use("/users", users);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
```

If you look at nodemon, you'll notice that your app crashed, because it couldn't find the file

<kbd>./routes/users</kbd> Create a new directory in your project to match that route
we required just now, call it 'routes' and save it. Next, create a new file in that
directory called 'users.js' and require the following modules:

```js
const express = require("express");
const router = express.Router();

module.exports = router;
```

Nodemon should be back up and running.

Next, we'll create the three routes that users should have the ability to interact with; a
registration route, an authentication route, and a profile route (which we will eventually protect
via the JWT tokenization).

```js
const express = require("express");
const router = express.Router();

router.post("/register", (req, res, next) => {
  res.send("REGISTER");
});

router.post("/authenticate", (req, res, next) => {
  res.send("AUTHENTICATE");
});

router.get("/profile", (req, res, next) => {
  res.send("PROFILE");
});

module.exports = router;
```

Of course, the parameters being passed into the .send methods are just placeholders, we'll go ahead
and fill those out in just a minute.

To test that everything works so far, navigate to <kbd>localhost:3000/users/authenticate</kbd>, and
you should see <kbd>AUTHENTICATE</kbd> on the screen.

To connect to the database, Mongoose exposes a pretty straightforward 'connect' function that you
add to your entry file which will run as soon as your start your application to open the port to
your database.

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const app = express();
const port = 3000;
const users = require("./routes/users");

app.use(cors());
app.use(bodyParser.json());
app.use("/users", users);

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => console.error(error));

mongoose.connection.on("error", (err) => {
  console.error("Connection to MongoDB interrupted, attempting to reconnect");
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
```

Save that file, and nodemon should have refreshed with a new console log letting you know you're
connected to the database found in your config file.

If you are curious as to why there are two types of error methods that Mongo needs, it's because
there are two classes of errors that can occur with a Mongoose connection.

- Error on initial connection. If initial connection fails, Mongoose will not attempt to reconnect,
  it will emit an <kbd>error</kbd> event, and the promise <kbd>mongoose.connect()</kbd> returns will
  reject.
- Error after initial connection was established. Mongoose will attempt to reconnect, and it will
  emit an <kbd>error</kbd> event.

## Part 4 - User Model

Next we'll be creating our user model file to handle data such as name, password, email, and
username. We'll also have our functions that interact with the database in that file.

Create a directory called <kbd>models</kbd> and require the following modules inside a file called

<kbd>user.js</kbd>:

```js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
```

Now let's create the user schema:

```js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
```

## Part 5 - The 'REGISTER' Path

Back in the root directory of your file navigate to <kbd>routes/users.js</kbd> and require the
schema we created in part 4 to the top of the file:

```js
const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/register", (req, res, next) => {
  res.send("REGISTER");
});

router.post("/authenticate", (req, res, next) => {
  res.send("AUTHENTICATE");
});

router.get("/profile", (req, res, next) => {
  res.send("PROFILE");
});

module.exports = router;
```

Navigate down to the <kbd>router.post</kbd> request for the <kbd>/register</kbd> path and change the
callback function body to:

```js
const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/register", (req, res, next) => {
  /**
   * Note, there is nothing in this code to stop someone from registering
   * the same email twice. This is just an example application to explain
   * high level concepts, but if I were building this to be deployed into
   * production, I would add a function to search the database
   * for a user with the email in the request right here.
   */
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) throw new Error("User did not save");
    console.log("User saved", newUser);
    res.status(201).send("User created!");
  });
});

router.post("/authenticate", (req, res, next) => {
  res.send("AUTHENTICATE");
});

router.get("/profile", (req, res, next) => {
  res.send("PROFILE");
});

module.exports = router;
```

Head back to <kbd>models/user.js</kbd> and add the <kbd>pre</kbd>
[middleware function](https://mongoosejs.com/docs/middleware.html#pre) that we're using above at the
bottom of the <kbd>user.js</kbd> model file:

```js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(5, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
```

## Part 6 - Try it Out

At this point, we can go ahead and make a POST request to our application's <kbd>register</kbd>
endpoint with some user data in the POST body to ensure that the application properly saves it.

I'll be using Postman, but feel free to user any other utility that is capable of sending HTTP
requests like <kbd>curl</kbd> or [HTTPie](https://httpie.org/).

Make your POST request to <kbd>http://localhost:3000/users/register</kbd> and then for your post
body, go ahead and pass a JSON object that looks like:

```json
{
  "name": "John Doe",
  "email": "jdoe@gmail.com",
  "username": "john",
  "password": "123456"
}
```

You should receive a response body that looks like:

```
User created!
```

You can then log into your MongoDB Atlas account, find your cluster, click the button that says
"Collections" and you should be able to view the information you just saved

\*_Note: You can refactor the response on the <kbd>/register</kbd> <kbd>POST</kbd> method to keep
the user logged in after registering, because right now this endpoint just creates the user and the
user would be expected to manually log in after creating their account. I suggest waiting until
finishing the next section, Part 7 - Authentication before doing that._

## Part 7 - Authentication

In this part, we will set up Passport.js with a JWT strategy to authenticate users and receive
tokens.

In our <kbd>index.js</kbd> file, add the following lines of code:

```js
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const app = express();
const port = 3000;
const users = require("./routes/users");

app.use(cors());
app.use(bodyParser.json());
app.use("/users", users);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => console.error(error));

mongoose.connection.on("error", (err) => {
  console.error("Connection to MongoDB interrupted, attempting to reconnect");
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
```

Now, we are going to configure a strategy we'd like to use for the Passport tokenization.

Create a folder in the root of your project directory called <kbd>config</kbd>, then inside it
create a file called <kbd>passport.js</kbd>.  
At the top of that file, require the following:

```js
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
```

Then, export the following at the bottom of the file:

```js
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = "secret";

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.getUserById(jwt_payload._id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }),
  );
};
```

You'll want to make sure you include the export above inside of your index.js file.

```js
require("dotenv").config();
const passport = require("passport");
require("./config/passport")(passport);
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const app = express();
const port = 3000;
const users = require("./routes/users");

app.use(cors());
app.use(bodyParser.json());
app.use("/users", users);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => console.error(error));

mongoose.connection.on("error", (err) => {
  console.error("Connection to MongoDB interrupted, attempting to reconnect");
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
```

We should also import Passport.js and the JSON web token module into our <kbd>routes/users.js</kbd>
file:

```js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user");

router.post("/register", (req, res, next) => {
  res.send("REGISTER");
});

router.post("/authenticate", (req, res, next) => {
  res.send("AUTHENTICATE");
});

router.get("/profile", (req, res, next) => {
  res.send("PROFILE");
});

module.exports = router;
```

Now, you should save the files we were just editing and go check nodemon to go make sure that
nodemon isn't breaking. Once you've squashed any possible bugs, we are now going to our

<kbd>routes</kbd> directory into the <kbd>users.js</kbd> file.

```js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user");

router.post("/register", (req, res, next) => {
  /**
   * Note, there is nothing in this code to stop someone from registering
   * the same email twice. This is just an example application to explain
   * high level concepts, but if I were building this to be deployed into
   * production, I would add a function to search the database
   * for a user with the email in the request right here.
   */
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) throw new Error("User did not save");
    console.log("User saved", newUser);
    res.status(201).send("User created!");
  });
});

router.post("/authenticate", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User not found!" });
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ user }, "secret", {
          expiresIn: 604800, // 1 week in seconds
        });

        res.json({
          success: true,
          token: "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        return res.json({ success: false, msg: "Wrong password!" });
      }
    });
  });
});

router.get("/profile", (req, res, next) => {
  res.send("PROFILE");
});

module.exports = router;
```

Quick explanation of the code above; first we're going to check if the email supplied with the
client-side request exists. If the email does exist, then we are going to take the password and try
to match it to the password associated with the user associated with the email in the database. If
the passwords match, we are going to assign the client an authentication token that expires in a
week, and then return some JSON containing a JSON Web Token ID to the request origin. If the
password does not match, the user is not authenticated and will have to re-enter their password.

We also created a function we have not yet defined, called <kbd>User.comparePassword()</kbd>. Let's
go ahead and create this function in our User model, as to uphold the separation of concerns between
files we have stayed true to throughout this project and make sure everything is encapsulated
properly.

At the bottom of the <kbd>models/user.js</kbd> file:

```js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(5, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
```

Alright, we should be okay now. That was quite a bit of code we just wrote, but let's go ahead and
try to see if it still works.

Open Postman, open a new tab and start drafting a new <kbd>POST</kbd> request. the address is going
to be <kbd>http://localhost:3000/users/authenticate</kbd>. For the body of the request:

```json
{
  "username": "john",
  "password": "123456"
}
```

If all goes well, you should see something that looks like:

```json
{
  "success": true,
  "token": "JWT eyJHFJDKVjfkFHJKLEHVJKVnjkVNjkd39057JKDLFjkl7FJKDFLHJkhJkhfjekidvnrinuvdsjkl7853JHIELHuinjkfelnvuincivnsjkLuiHUGLnjKVLDNJNEIFLNVJDKn49329JKELNGiNJEKGRNnkef7FnjKVLn9FNJEK3klJdnJKGLRGLNGJKgNJkg7GjnklgrnjKLgejnkl",
  "user": {
    "id": "58a345a628f6455ab2912b2",
    "name": "John Doe",
    "username": "john",
    "email": "jdoe@gmail.com"
  }
}
```

##### Aside: Why is the end point called <kbd>/authenticate</kbd> and not <kbd>/login</kbd>?

At the moment, all the <kbd>/authenticate</kbd> endpoint does is return a JSON object with the JWT
token. In order to make the token useful so that the user's login session persists from request to
request, you'll need to tell the client to save that token in their auth headers with each request.
Alternatively, and more efficiently, you can store the token into either a cookie, or the
localStorage object. More on that
[here](https://stackoverflow.com/questions/39163413/node-js-passport-jwt-how-to-send-token-in-a-cookie).

## Conclusion

All in all, I really enjoyed this little project. I was so extremely frustrated after getting stuck
on this issue: https://github.com/matthewvolk/user-auth-node-app/issues/1 for a few days, only to
realize I had forgotten to import the actual passport module on a dependency file.

I'm not sure when I'll be finishing this project, as I have recently discovered the joys of Python.
I'm hoping to pick this back up sometime during the Summer of 2018.

Until then, stay RESTed ;)
# doclite

Minimal docsite generator.

## What does this do?

It turns your code into a website version, where comments are displayed nicely, and modules link to one another.

Basically, it turns this:

```js
import express from 'express';

// Create the app
const app = express();

/* Set up the initial route */
app.get('/', function (req, res) {
  res.send('Hello World');
});

/* Start the server! */
app.listen(3000);
```

into this:

![Above source code, with light syntax highlighting, and links](https://imgur.com/VwVYkxz.png)

## Getting started

```bash
npm install doclite
```


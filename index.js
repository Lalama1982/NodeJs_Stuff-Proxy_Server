const express = require('express');
//const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configuration
const PORT = 6000;
const HOST = "localhost";
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";

// Info GET endpoint :: localhost:6000/json_placeholder_proxy/info
app.get('/json_placeholder_proxy/info', (req, res, next) => {
    res.status(200).send({
        location: "proxy-server/index.js",
        Message: "This is a proxy service running on Node/Express for 'jsonplaceholder'"
      });     
    //res.send('This is a proxy service which proxies to Billing and Account APIs.'); // prettier-ignore
 });

// Checking whether the Header "Connection" is in the request object
app.use('', (req, res, next) => {
    if (req.headers.connection) {
        next();
    } else {
        res.status(403).send({
            location: "proxy-server/index.js",
            message: "ERROR :: Header 'Connection' is not available in the Request Object"
          });        
    }
 });

// Proxy endpoints
app.use('/json_placeholder_proxy', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/json_placeholder_proxy`]: '',
    },
 }));

/**
 * URL Mapping ::
 * localhost:6000/json_placeholder_proxy/posts/1            >>>>    https://jsonplaceholder.typicode.com/posts/1
 * localhost:6000/json_placeholder_proxy/posts              >>>>    https://jsonplaceholder.typicode.com/posts
 * localhost:6000/json_placeholder_proxy/posts/19/comments  >>>>    https://jsonplaceholder.typicode.com/posts/19/comments
 * localhost:6000/json_placeholder_proxy/comments?postId=41 >>>>    https://jsonplaceholder.typicode.com/comments?postId=41
 */

// Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });
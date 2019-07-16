var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
http = require('http');

var index = require('./routes/index');
var usersRouter = require('./routes/users');
var service = require('./routes/api/v1.0/services');
var mensajeRouter = require('./routes/mensaje');


var app = express();


//Chat
app.use('/users', usersRouter);
app.use('/mensaje', mensajeRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1.0/', service);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//chat
/*var server = http.createServer(app);
var io = require('socket.io').listen(server);
var chatIoMethods = require('./routes/chat');
io.on('connection', chatIoMethods);*/

//chat server




module.exports = app;
var port = 9000;
app.listen(port, () => {
  console.log("server running in " + port);
});


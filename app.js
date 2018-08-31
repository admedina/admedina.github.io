import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import routes from './routes';

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.use(logger('combined'));
app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  const isDevelopment = 'env' === 'development';
  res.render('error', {
    message: err.message,
    error: app.get(isDevelopment ? err : {}),
  });
  next();
});

app.use('/', routes);

export default app;

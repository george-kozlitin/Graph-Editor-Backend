import {config} from 'dotenv';
import routes from './routes';
import db from "./model";
import localStrategy from "./authentication/local-strategy";
import {allowedHost} from "./constants/server";
import express = require('express');
import cookieSession = require('cookie-session');

const cors = require('cors');
const passport = require('passport');

config();
const app = express();

app.use(cors({
    origin: allowedHost.split(','),
    optionsSuccessStatus: 200,
    credentials: true
}));
app.options('*', cors());

app.disable('x-powered-by');

app.use(cookieSession({
    name: 'session',
    keys: ['KGUK%EW#o`+z1`gb<@o^3_j!K.W38X?+'],
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    // @ts-ignore
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    // @ts-ignore
    db.user.findByPk(id).then((user) => {
        done(null, user);
    });
});
passport.use(localStrategy);

app.use(express.json());

routes(app);

export default app;

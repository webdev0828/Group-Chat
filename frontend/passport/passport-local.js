"use strict";

const passport = require("passport");
//const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const axios = require("axios");
var jwt = require("jsonwebtoken");

passport.serializeUser((user, done) => {
	user.id = user._id;
	done(null, user.id);
	// done(null, user);
});

passport.deserializeUser((userId, done) => {
	// User.findById(id, (err, user) => {
	// 	done(err, user);
	// });
	console.log(userId);
	axios
		.post(global.REST_API + "/get_user", { id: userId })
		.then(response => {
			console.log(response);
			if (response.data.user) {
				done(null, response.data.user);
			} else {
				return done(null, false, { message: "error" });
			}
		})
		.catch(error => {
			console.log("error: " + error);
			return done(null, false, { message: error });
		});
});

passport.use(
	"local.signup",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true
		},
		(req, email, password, done) => {
			axios
				.post(global.REST_API + "/user_management", { data: req.body })
				.then(response => {
					// response.data.user[0].token = response.data.token;
					console.log(response.data.token);
					// localStorage.setItem("token", response.data.token);
					axios
						.post(global.REST_API + "/user_register", {
							data: req.body,
							authorization: response.data.token
						})
						.then(res => {
							if (res.data.user != null) {
								return done(null, res.data.user);
							} else {
								return done(null, false, { message: res.data.error });
							}
						})
						.catch(error => {
							return done(null, false, { message: error });
						});
				})
				.catch(error => {
					console.log("error: " + error);
					return done(null, false, { message: error });
				});
		}
	)
);

passport.use(
	"local.login",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true
		},
		(req, email, password, done) => {
			axios
				.post(global.REST_API + "/user_login", { data: req.body })
				.then(response => {
					// response.data.user[0].token = response.data.token;
					axios
						.post(global.REST_API + "/user_register", {
							data: req.body,
							authorization: response.data.token
						})
						.then(res => {
							if (res.data.user != null) {
								return done(null, res.data.user);
							} else {
								return done(null, false, { message: res.data.error });
							}
						})
						.catch(error => {
							return done(null, false, { message: error });
						});
				})
				.catch(error => {
					console.log("error: " + error);
					return done(null, false, { message: error });
				});
		}
	)
);

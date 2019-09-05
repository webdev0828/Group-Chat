"use strict";

const Users = require("../models/user");
var jwt = require("jsonwebtoken");

module.exports = function(_, User) {
	return {
		SetRouting: function(router) {
			router.post("/user_management", function(req, res, next) {
				//console.log(req.body);

				var email = req.body.data.email;
				Users.findOne({ email: email }, (err, user) => {
					if (err) {
						return done(err);
					}

					if (user) {
						// return done(null, false, req.flash("error", "User with email already exist"));
						res.send({ error: "User with email already exist" });
					}

					const newUser = new Users();
					newUser.username = req.body.data.username;
					newUser.fullname = req.body.data.username;
					newUser.email = req.body.data.email;
					newUser.password = newUser.encryptPassword(req.body.data.password);
					//console.log(newUser);

					newUser.save(err => {
						var token = jwt.sign({ id: newUser._id }, "worldisfullofdevelopers", {
							expiresIn: 86400 // expires in 24 hours
						});
						res.send({ user: newUser, token: token });
					});
				});
			});

			router.post("/get_user", function(req, res, next) {
				console.log(req.body.id);

				var id = req.body.id;
				Users.findOne({ _id: id }, (err, user) => {
					if (err) {
						return done(err);
					}
					console.log(user);
					if (user) {
						res.send({ user: user });
					}
				});
			});

			router.post("/user_register", function(req, res, next) {
				//console.log(req.body);

				var email = req.body.data.email;
				console.log(email);
				Users.findOne({ email: email }, (err, user) => {
					if (err) {
						return res.send({ error: "user error" });
					}
					else {
						jwt.verify(req.body.authorization, "worldisfullofdevelopers", function(err, decoded) {
							console.log(err);
							if (err) return res.send({ error: "Invalid Token" });
							res.send({ user: user });
						});
					}

					
				});
			});

			router.post("/user_login", function(req, res, next) {
				//console.log(req.body);

				var email = req.body.data.email;
				var password = req.body.data.password;

				Users.findOne({ email: email }, (err, user) => {
					if (err) {
						return res.send({ error: "user error" });
					}

					const messages = [];
					if (!user || !user.validUserPassword(password)) {
						// messages.push("Email Does Not Exist or Password is Invalid");
						// return done(null, false, req.flash("error", messages));
						res.send({ error: "No User with email exists" });
					}
					else {
						// return done(null, user);
						var token = jwt.sign({ id: user._id }, "worldisfullofdevelopers", {
							expiresIn: 86400 // expires in 24 hours
						});
						res.send({ user: user, token: token });
					}

					
					// res.send({ user: user });
				});
			});

			router.post("/user_register_fb", function(req, res, next) {
				//console.log(req.body);

				Users.findOne({ facebook: profile.id }, (err, user) => {
					if (err) {
						return res.send({ error: "user error" });
					}

					if (user) {
						return res.send({ error: "user error" });
					} else {
						const newUser = new User();
						newUser.facebook = profile.id;
						newUser.fullname = profile.displayName;
						newUser.username = profile.displayName;
						newUser.email = profile._json.email;
						newUser.userImage = "https://graph.facebook.com/" + profile.id + "/picture?type=large";
						newUser.fbTokens.push({ token: token });

						newUser.save(err => {
							res.send({ user: newUser });
						});
					}
				});
			});

			router.post("/user_register_gg", function(req, res, next) {
				//console.log(req.body);

				Users.findOne({ google: profile.id }, (err, user) => {
					if (err) {
						return res.send({ error: "user error" });
					}

					if (user) {
						return res.send({ error: "user error" });
					} else {
						const newUser = new User();
						newUser.google = profile.id;
						newUser.fullname = profile.displayName;
						newUser.username = profile.displayName;
						newUser.email = profile.emails[0].value;
						newUser.userImage = profile._json.image.url;

						newUser.save(err => {
							if (err) {
								return res.send({ error: "user error" });
							}
							res.send({ user: newUser });
						});
					}
				});
			});
			router.get("/", this.indexPage);
			router.get("/signup", this.getSignUp);

		},

		indexPage: function(req, res) {
			const errors = req.flash("error");
			res.send({ title: "Footballkk | Login", messages: errors, hasErrors: errors.length > 0 });
			// return res.render("index", { title: "Footballkk | Login", messages: errors, hasErrors: errors.length > 0 });
		},


		getSignUp: function(req, res) {
			const errors = req.flash("error");
			res.send({
				title: "Footballkk | SignUp",
				messages: errors,
				hasErrors: errors.length > 0
			});
			// return res.render("signup", {
			// 	title: "Footballkk | SignUp",
			// 	messages: errors,
			// 	hasErrors: errors.length > 0
			// });
		},

	};
};

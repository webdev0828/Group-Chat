"use strict";
const axios = require("axios");

module.exports = function(_, passport, User) {
	return {
		SetRouting: function(router) {
			router.get("/", function(req, res, next) {
				// axios
				// 	.get(global.REST_API)
				// 	.then(response => {
				// 		var title = response.data.title;
				// 		var messages = response.data.messages;
				// 		var hasErrors = response.data.hasErrors;
				// 		return res.render("index", { title: title, messages: messages, hasErrors: hasErrors });
				// 	})
				// 	.catch(error => {
				// 		console.log(error);
				// 	});
				//const errors = req.flash("error");
				//console.log(errors);
				return res.render("index", {
					title: "Footballkk | Login",
					messages: "no error",
					hasErrors: false
				});
			});
			router.get("/signup", function(req, res, next) {
				//const errors = req.flash("error");
				// console.log(errors);
				// if (errors) {
				res.render("signup", {
					title: "Footballkk | SignUp",
					messages: "no error",
					hasErrors: false
				});
				// } else {
				// 	axios
				// 		.get(global.REST_API + "/signup")
				// 		.then(response => {
				// 			res.render("signup", {
				// 				title: response.data.title,
				// 				messages: response.data.messages,
				// 				hasErrors: response.data.hasErrors
				// 			});
				// 		})
				// 		.catch(error => {
				// 			console.log(error);
				// 		});
				// }
			});
			router.get("/auth/facebook", this.getFacebookLogin);
			router.get("/auth/facebook/callback", this.facebookLogin);
			router.get("/auth/google", this.getGoogleLogin);
			router.get("/auth/google/callback", this.googleLogin);

			router.post("/", User.LoginValidation, this.postLogin);
			router.post("/signup", User.SignUpValidation, this.postSignUp);
		},

		indexPage: function(req, res) {
			const errors = req.flash("error");
			res.send({ title: "Footballkk | Login", messages: errors, hasErrors: errors.length > 0 });
			// return res.render("index", { title: "Footballkk | Login", messages: errors, hasErrors: errors.length > 0 });
		},

		postLogin: passport.authenticate("local.login", {
			successRedirect: "/home",
			failureRedirect: "/",
			failureFlash: true
		}),

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

		postSignUp: passport.authenticate("local.signup", {
			successRedirect: "/home",
			failureRedirect: "/signup",
			failureFlash: true
		}),

		getFacebookLogin: passport.authenticate("facebook", {
			scope: "email"
		}),

		getGoogleLogin: passport.authenticate("google", {
			scope: [
				"https://www.googleapis.com/auth/plus.login",
				"https://www.googleapis.com/auth/plus.profile.emails.read"
			]
		}),

		googleLogin: passport.authenticate("google", {
			successRedirect: "/home",
			failureRedirect: "/signup",
			failureFlash: true
		}),

		facebookLogin: passport.authenticate("facebook", {
			successRedirect: "/home",
			failureRedirect: "/signup",
			failureFlash: true
		})
	};
};

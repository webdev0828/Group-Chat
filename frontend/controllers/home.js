const axios = require("axios");

module.exports = function() {
	return {
		SetRouting: function(router) {
			router.get("/home", this.homePage);
			router.post("/home", this.postHomePage);

			router.get("/logout", this.logout);
		},

		homePage: function(req, res) {
			axios
				.get(global.REST_API+"/home", { params: { user: req.user } })
				.then(response => {
					return res.render("home", {
						title: response.data.title,
						user: response.data.user,
						chunks: response.data.chunks,
						country: response.data.country,
						data: response.data.data,
						chat: response.data.chat
					});
					// response.data.user[0].token = response.data.token;
					// done(null, response.data);
				})
				.catch(error => {
					console.log("error: " + error);
					// done(null, false, { message: error });
				});
		},

		postHomePage: function(req, res) {
			axios
				.post(global.REST_API+"/home", { user: req.user })
				.then(response => {
					return res.render("home", {
						title: response.data.title,
						user: response.data.user,
						chunks: response.data.chunks,
						country: response.data.country,
						data: response.data.data,
						chat: response.data.chat
					});
					// response.data.user[0].token = response.data.token;
					// done(null, response.data);
				})
				.catch(error => {
					res.redirect("/home");
					console.log("error: " + error);
					// done(null, false, { message: error });
				});
		},

		logout: function(req, res) {
			req.logout();
			req.session.destroy(err => {
				res.redirect("/");
			});
		}
	};
};

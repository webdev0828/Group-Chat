const axios = require("axios");

module.exports = function() {
	return {
		SetRouting: function(router) {
			router.get("/dashboard", this.adminPage);

			router.post("/uploadFile", this.uploadFile);
			router.post("/dashboard", this.adminPostPage);
		},

		adminPage: function(req, res) {
			res.render("admin/dashboard");
		},

		adminPostPage: function(req, res) {
			axios
				.post(global.REST_API + "/dashboard", req.body)
				.then(response => {
					res.render("admin/dashboard");
				})
				.catch(error => {
					console.log("error: " + error);
				});
		},

		uploadFile: function(req, res) {
			axios
				.post(global.REST_API + "/uploadFile", req)
				.then(response => {})
				.catch(error => {
					console.log("error: " + error);
				});
		}
	};
};

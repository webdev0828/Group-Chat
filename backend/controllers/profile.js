module.exports = function(async, Users, Message, aws, formidable, FriendResult) {
	return {
		SetRouting: function(router) {
			router.get("/settings/profile", this.getProfilePage);

			router.post("/userupload", aws.Upload.any(), this.userUpload);
			router.post("/settings/profile", this.postProfilePage);

			router.get("/profile/:name", this.overviewPage);
			router.post("/profile/:name", this.overviewPostPage);
		},

		getProfilePage: function(req, res) {
			var user = JSON.parse(req.query.user);
			async.parallel(
				[
					function(callback) {
						Users.findOne({ username: user.username })
							.populate("request.userId")
							.exec((err, result) => {
								callback(err, result);
							});
					},

					function(callback) {
						const nameRegex = new RegExp("^" + user.username.toLowerCase(), "i");
						Message.aggregate(
							[
								{ $match: { $or: [{ senderName: nameRegex }, { receiverName: nameRegex }] } },
								{ $sort: { createdAt: -1 } },
								{
									$group: {
										_id: {
											last_message_between: {
												$cond: [
													{
														$gt: [
															{ $substr: ["$senderName", 0, 1] },
															{ $substr: ["$receiverName", 0, 1] }
														]
													},
													{ $concat: ["$senderName", " and ", "$receiverName"] },
													{ $concat: ["$receiverName", " and ", "$senderName"] }
												]
											}
										},
										body: { $first: "$$ROOT" }
									}
								}
							],
							function(err, newResult) {
								const arr = [
									{ path: "body.sender", model: "User" },
									{ path: "body.receiver", model: "User" }
								];

								Message.populate(newResult, arr, (err, newResult1) => {
									callback(err, newResult1);
								});
							}
						);
					}
				],
				(err, results) => {
					const result1 = results[0];
					const result2 = results[1];

					// res.render("user/profile", {
					// 	title: "Footballkik - Profile",
					// 	user: req.user,
					// 	data: result1,
					// 	chat: result2
					// });
					res.send({
						title: "Footballkik - Profile",
						user: user,
						result1: result1,
						result2: result2
					});
				}
			);
		},

		postProfilePage: function(req, res) {
			FriendResult.PostRequest(req, res, "/settings/profile");

			async.waterfall([
				function(callback) {
					Users.findOne({ _id: req.body.user._id }, (err, result) => {
						callback(err, result);
					});
				},

				function(result, callback) {
					if (req.body.data.upload === null || req.body.data.upload === "") {
						Users.update(
							{
								_id: req.body.user._id
							},
							{
								username: req.body.data.username,
								fullname: req.body.data.fullname,
								mantra: req.body.data.mantra,
								gender: req.body.data.gender,
								country: req.body.data.country,
								userImage: result.userImage
							},
							{
								upsert: true
							},
							(err, result) => {
								//res.redirect("/settings/profile");
							}
						);
					} else if (req.body.data.upload !== null || req.body.data.upload !== "") {
						Users.update(
							{
								_id: req.body.user._id
							},
							{
								username: req.body.data.username,
								fullname: req.body.data.fullname,
								mantra: req.body.data.mantra,
								gender: req.body.data.gender,
								country: req.body.data.country,
								userImage: req.body.data.upload
							},
							{
								upsert: true
							},
							(err, result) => {
								//res.redirect("/settings/profile");
							}
						);
					}
				}
			]);
		},

		userUpload: function(req, res) {
			const form = new formidable.IncomingForm();

			form.on("file", (field, file) => {});

			form.on("error", err => {});

			form.on("end", () => {});

			form.parse(req);
		},

		overviewPage: function(req, res) {
			console.log("8888888888888888888888888888");
			var user = JSON.parse(req.query.user);
			async.parallel(
				[
					function(callback) {
						Users.findOne({ username: req.params.name })
							.populate("request.userId")
							.exec((err, result) => {
								callback(err, result);
							});
					},

					function(callback) {
						const nameRegex = new RegExp("^" + user.username.toLowerCase(), "i");
						Message.aggregate(
							[
								{ $match: { $or: [{ senderName: nameRegex }, { receiverName: nameRegex }] } },
								{ $sort: { createdAt: -1 } },
								{
									$group: {
										_id: {
											last_message_between: {
												$cond: [
													{
														$gt: [
															{ $substr: ["$senderName", 0, 1] },
															{ $substr: ["$receiverName", 0, 1] }
														]
													},
													{ $concat: ["$senderName", " and ", "$receiverName"] },
													{ $concat: ["$receiverName", " and ", "$senderName"] }
												]
											}
										},
										body: { $first: "$$ROOT" }
									}
								}
							],
							function(err, newResult) {
								const arr = [
									{ path: "body.sender", model: "User" },
									{ path: "body.receiver", model: "User" }
								];

								Message.populate(newResult, arr, (err, newResult1) => {
									callback(err, newResult1);
								});
							}
						);
					}
				],
				(err, results) => {
					const result1 = results[0];
					const result2 = results[1];

					res.send({
						title: "Footballkik - Overview",
						user: user,
						data: result1,
						chat: result2
					});
				}
			);
		},

		overviewPostPage: function(req, res) {
			FriendResult.PostRequest(req, res, "/profile/" + req.params.name);
		}
	};
};

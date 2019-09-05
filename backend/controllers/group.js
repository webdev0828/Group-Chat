module.exports = function(Users, async, Message, FriendResult, Group) {
	return {
		SetRouting: function(router) {
			router.get("/group/:name", this.groupPage);
			router.post("/group/:name", this.groupPostPage);

			router.get("/logout", this.logout);
		},

		groupPage: function(req, res) {
			const name = req.params.name;
			console.log("9999999999999999999", typeof(req.query.user));
			console.log("8888888888", req.query);
			var user = JSON.parse(req.query.user);
			//console.log(user);
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
					},

					function(callback) {
						Group.find({})
							.populate("sender")
							.exec((err, result) => {
								callback(err, result);
							});
					}
				],
				(err, results) => {
					const result1 = results[0];
					const result2 = results[1];
					const result3 = results[2];

					res.send({
						title: "Footballkik - Group",
						user: user,
						groupName: name,
						data: result1,
						chat: result2,
						groupMsg: result3
					});
				}
			);
		},

		groupPostPage: function(req, res) {
			console.log("ttttttttttttttt", req.body.data);
			console.log("vvvvvvvvvvvvvvvvvvvvv", req.body.user);
			FriendResult.PostRequest(req, res, "/group/" + req.params.name);

			async.parallel(
				[
					function(callback) {
						if (req.body.data.message) {
							const group = new Group();
							group.sender = req.body.user._id;
							group.body = req.body.data.message;
							group.name = req.body.data.groupName;
							group.createdAt = new Date();

							group.save((err, msg) => {
								callback(err, msg);
								
							});
						}
					}
				],
				(err, results) => {
					// res.redirect("/group/" + req.params.name, { params: { user: req.body.user }});
					// res.send({
					// 	data: req.params.name
					// })
				}
			);
		},

		logout: function(req, res) {
			req.logout();
			req.session.destroy(err => {
				res.redirect("/");
			});
		}
	};
};

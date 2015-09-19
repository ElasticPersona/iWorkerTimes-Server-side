var mongo = require('mongodb');
var mongoose = require('mongoose');
//Schema定義を読み込む
var worksCollection = require('../models/works').worksCollection;

// DB接続
mongoose.connect('mongodb://localhost:27017/workdb',
	function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("connection success!");
        	console.log("Connected to 'workdb' database");
		}
	}
);

// 1桁の数字を0埋め2桁にする関数
var toDoubleDigits = function(num) {
    num += "";
    if (num.length === 1) {
	num = "0" + num;
    }
  return num;
};

//全件取得
exports.findAll = function(req, res) {
	worksCollection.find({}, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log(data);
			res.send({"results": data});
		}
	});
};

//ユーザ名指定全件取得（日時降順）
exports.findByName = function(req, res){
    var userName = req.body.userName;
	worksCollection.find({ "userName": userName }, {}, { sort:{ workIn: -1 }}, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log(data);
			res.send({"results": data});
		}
	});
};

//ユーザ名指定で今日の打刻を取得
exports.findTodayByName = function(req, res){
    
    //ユーザ名を取得
    var userName = req.body.userName;

    //今日の日付を取得
    var today = new Date();
    var year = today.getFullYear();
    var month = toDoubleDigits(today.getMonth() + 1);
    var day = toDoubleDigits(today.getDate());

    //Node上のmongoDBで日付検索するために整形
    var firstTime = new Date(year + "-" + month + "-" + day + "T00:00:00.000Z");
    var lastTime  = new Date(year + "-" + month + "-" + day + "T23:59:59.000Z");

	worksCollection.find({ "userName": userName, "workIn": { "$gte": firstTime, "$lte": lastTime }}, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			res.send({"results": data});
		}
	});
};

//打刻更新
exports.addWork = function(req, res){

	//ユーザ名指定で現在の打刻状況を取得したうえで打刻更新処理を行う
    //ユーザ名を取得
    var userName = req.body.userName;
	var comment = req.body.comment;

    //今日の日付を取得
    var today = new Date();
    var year = today.getFullYear();
    var month = toDoubleDigits(today.getMonth() + 1);
    var day = toDoubleDigits(today.getDate());

    //Node上のmongoDBで日付検索するために整形
    var firstTime = new Date(year + "-" + month + "-" + day + "T00:00:00.000Z");
    var lastTime  = new Date(year + "-" + month + "-" + day + "T23:59:59.000Z");
	var results = "";

    // 現在時刻で登録する
    var punched = new Date()
    // 日本時間（+9時間）にして現在時刻で登録する
   	//	punched.setHours(punched.getHours()+9);

	worksCollection.findOne({ "userName": userName, "workIn": { "$gte": firstTime, "$lte": lastTime }}, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			if (data == null) {
				//出社打刻
				var works = new worksCollection();
					works.userName = userName;
					works.workIn   = punched;
					works.workInComment = comment;

				console.log(works);

				//保存処理
				works.save(function(err) {
					if (err) {
						console.log(err);
					}
				});
			} else if (data != null && data.workIn != null && data.workOut == null) {
				//退勤打刻
    			var params = {
    			  "workOut"			: punched,
    			  "workOutComment"  : comment
				}
				//保存処理
				worksCollection.update(
							{ "userName": userName, "workIn": { "$gte": firstTime, "$lte": lastTime }},
							{ $set : params }, 
							{ upsert: false, multi: true }, function(err) {
								if (err) {
									console.log(err);
								}
				});
			} else if (data != null && data.workIn != null && data.workOut != null) {
				//終業
				console.log("終業済み");
			}
		}
	});
}


var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('workdb', server);

db.open(function(err, db){
    if(!err){
        console.log("Connected to 'workdb' database");
        db.collection('works', {strict:true}, function(err, collection){
            if(err){
                console.log("The 'works' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

// 1桁の数字を0埋め2桁にする
var toDoubleDigits = function(num) {
    num += "";
    if (num.length === 1) {
	num = "0" + num;
    }
  return num;
};

//スタッフ全件検索
exports.findAll = function(req, res){
    db.collection('works', function(err, collection){
        collection.find().toArray(function(err, items){
	    console.log(items);
            res.send({"results":items});
        });
    });
};

//ユーザ名指定で今日の打刻を検索
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

    db.collection('works', function(err, collection){
      if (err) {
        console.log("db.collection.error");
      }else{
        collection.find({ "userName": userName, "workIn": { "$gte": firstTime, "$lte": lastTime }}).toArray(function(err, items){
            console.log(items);
            res.send({"results":items});
        });
      }
    });
};

//ユーザ名指定検索
exports.findByName = function(req, res){
    var id = req.params.id;
    console.log('Retrieving work: ' + id);
    db.collection('works', function(err, collection){
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item){
            res.send(items);
        });
    });
};

//打刻更新
exports.addWork = function(req, res){
console.log(req.body);
    var work = req.body;
    //console.log('Adding work: ' + JSON.stringify(work));
    
    // 日本時間（+9時間）にして現在時刻で登録する
    var punched = new Date()
        punched.setHours(punched.getHours()+9);

    var params = {
      "userName" : work.userName,
      "workIn"   : punched,
      "workOut"  : punched,
      "comment"  : work.comment
    }

    db.collection('works', function(err, collection){
        collection.insert(params, {safe:true}, function(err, result){
            if(err){
                res.send({'error':'An error has occurred'});
            }else{
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}


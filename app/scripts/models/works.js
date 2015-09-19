var mongoose = require('mongoose');

// Default Schemaを取得
var Schema = mongoose.Schema;

// Schema定義
var worksSchema = new Schema({
		userName		: { type: String, required: true },
		workIn			: { type: Date },
		workOut			: { type: Date },
		workInComment	: { type: String },
		workOutComment	: { type: String}	
	},{
		collection : 'works'
	}
);

var worksCollection = mongoose.model('worksModel', worksSchema);

module.exports = {
	worksCollection: worksCollection
}

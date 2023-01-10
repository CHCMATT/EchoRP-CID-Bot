const { Schema, model, models } = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const reqNum = {
	type: Number,
	required: true,
};

const cidInfoSchema = new Schema({
	uniqueName: reqString,
	value: reqNum,
	msgId: String
});

module.exports = models['cidInfo'] || model('cidInfo', cidInfoSchema);
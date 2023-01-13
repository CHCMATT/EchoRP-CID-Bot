const cidInfo = require('./schemas/cidInfo');

module.exports.readValue = async (uniqueName) => {
	const result = await cidInfo.findOne({ uniqueName }, { value: 1, _id: 0 })
	if (result !== null) {
		return result.value;
	}
	else {
		return `Value not found for ${uniqueName}.`;
	}
};

module.exports.addOne = async (uniqueName) => {
	await cidInfo.findOneAndUpdate({ uniqueName: uniqueName }, { $inc: { value: 1 } })
};

module.exports.addValue = async (uniqueName, addValue) => {
	await cidInfo.findOneAndUpdate({ uniqueName: uniqueName }, { $inc: { value: addValue } })
};

module.exports.subtractOne = async (uniqueName) => {
	await cidInfo.findOneAndUpdate({ uniqueName: uniqueName }, { $inc: { value: -1 } })
};

module.exports.subtractValue = async (uniqueName, subtractValue) => {
	await cidInfo.findOneAndUpdate({ uniqueName: uniqueName }, { $inc: { value: -Math.abs(subtractValue) } })
};

module.exports.setValue = async (uniqueName, newValue) => {
	await cidInfo.findOneAndUpdate({ uniqueName: uniqueName }, { value: newValue }, { upsert: true })
};

module.exports.resetValue = async (uniqueName) => {
	await cidInfo.findOneAndUpdate({ uniqueName: uniqueName }, { value: 0 }, { upsert: true })
};



module.exports.setMsgId = async (uniqueName, newValue) => {
	await cidInfo.findOneAndUpdate({ uniqueName: uniqueName }, { msgId: newValue }, { upsert: true })
};

module.exports.readMsgId = async (uniqueName) => {
	const result = await cidInfo.findOne({ uniqueName }, { msgId: 1, _id: 0 })
	if (result !== null) {
		return result.msgId;
	}
	else {
		return `Value not found for ${uniqueName}.`;
	}
};
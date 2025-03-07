function beforeRegister({
	userRecord,
	clientInfo
} = {}) {
	if(!userRecord.nickname) {
		userRecord.nickname = '用户' + Math.random().toString(36).substring(3,9)
	}
	return userRecord
}

module.exports = {
	beforeRegister
}
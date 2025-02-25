'use strict';

var llrp = require('./index.js');

var reader = new llrp({
	ipaddress: '192.168.52.223',
	log: true
});

reader.on('timeout', function () {
	console.log('timeout');
});

reader.on('disconnect', function () {
	console.log('disconnect');
});

reader.on('error', function (error) {
	console.log('error: ' + JSON.stringify(error));
});

reader.on('tagRead', function (tag) {
	//console.log('TAG:', tag);
});

process.on("SIGINT", async () => {
    await reader.sendMessage("STOP_ROSPEC", { ROSpecID: 1 });
	await reader.sendMessage("CLOSE_CONNECTION");
});

async function main() {
	reader.connect();
	await reader.sendMessage("DELETE_ROSPEC", { ROSpecID: 0 });
	await reader.sendMessage("SET_READER_CONFIG", { ResetToFactoryDefaults: 1 });
	await reader.sendMessage("CUSTOM_MESSAGE", { vendorId: 25882, subType: 21, data: [{ value: 0, bits: 32 }] });
	await reader.sendMessage("ADD_ROSPEC", { ROSpecID: 1, Priority: 0, CurrentState: 0, Session: 0, TagPopulation: 1, TransitTime: 0, Power: 1, SearchMode: 1, ModeIndex: 0, Filter: "301AAFC343370DC062F24087" });
	await reader.sendMessage("ENABLE_ROSPEC", { ROSpecID: 1 });
	await reader.sendMessage("START_ROSPEC", { ROSpecID: 1 });
	//await reader.sendMessage("STOP_ROSPEC", { ROSpecID: 0 });
}

main();
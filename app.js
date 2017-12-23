const net = require("net");
const config = require("config.json")("./config.json");
const request = require("request-json");

const api = request.createClient("http://miner.dox.ovh");

const interval = 30000;

let retrieveDatas = () => {
	let client = new net.Socket();

	client.connect(config.claymore.port, config.claymore.ip, () => {
		console.log("Connected !");

		let data = {
			"id":0,
			"jsonrpc":"2.0",
			"method":"miner_getstat1"
		};

		client.write(JSON.stringify(data));
	});

	client.on('data', data => {
		let response = JSON.parse(data.toString('utf8'));

		if (response.error == null){
			let result = response.result;
			let body = {};

			body.name = config.name;
			body.runningTime = result[1];

			let rigHash = result[2].split(';');
			body.hashrate = rigHash[0];
			body.shares = rigHash[1];
			body.rejectedShares = rigHash[2];

			let gpuHashETH = result[3].split(';');

			let gpusHealth = result[6].split(';');
			body.gpus = [];

			let flag = 0;
			let index = 0;
			for (let value of gpusHealth){
				if (flag == 0){
					body.gpus[index] = {
						num: index,
						hashrate: gpuHashETH[index],
						temp: value,
						fan: 0
					}

					flag = 1;
				} else if (flag == 1) {
					body.gpus[index].fan = value;
					flag = 0;
					index++;
				}
			}

			body.pools = result[7].split(';');

			api.post("/api/update.php?apikey=" + config.apiKey, body, (err, resp, body) => {
				console.log(body);
				console.log("Monitor updated.");

				if (body.action != null){
					sendAction(body.action);
				}
			});
		}
	});

	client.on('close', () => {
		console.log('Connection closed.');
	});
}

let sendAction = action => {
	console.log("Sending action : " + action);
	let client = new net.Socket();

	client.connect(config.claymore.port, config.claymore.ip, () => {
		console.log("Connected !");

		let data = {
			"id":0,
			"jsonrpc":"2.0",
			"method":action
		};

		client.write(JSON.stringify(data));
	});

	client.on('close', () => {
		console.log('Connection closed.');
	});
}

retrieveDatas();
setInterval(retrieveDatas, interval);
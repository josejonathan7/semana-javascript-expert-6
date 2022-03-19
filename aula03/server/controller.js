import Service from "./service.js";
import {logger} from "./util.js";

export default class Controller {

	constructor() {
		this.service = new Service();
	}

	async getFileStream(fileName){
		return this.service.getFileStream(fileName);
	}

	async handleCommand({ command }){
		logger.info(`Command received ${command}`);
		const cmd = command.toLowerCase();

		const result = {
			result: "ok"
		};

		if(cmd.includes("start")){
			this.service.startStreamming();
			return result;
		}

		if(cmd.includes("stop")){
			this.service.stopStreamming();
			return result;
		}

		const chosenFx = await this.service.readFxByName(cmd);
		logger.info(`added fx to service ${chosenFx}`);
		this.service.appendFxStream(chosenFx);
		return result;

	}

	createClientStream( ){
		const { id, clientStream } = this.service.createClientStream();

		const onClose = () => {
			logger.info(`closing connection of ${id}`);
			this.service.removeClientStream(id);
		};

		return {
			stream: clientStream,
			onClose
		};
	}
}

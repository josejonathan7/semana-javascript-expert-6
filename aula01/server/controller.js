import Service from "./service.js";


export default class Controller {

	constructor() {
		this.service = new Service();
	}

	async getFileStream(fileName){
		return this.service.getFileStream(fileName);
	}

}

import fs from "fs";
import { extname, join } from "path";
import fsPromises from "fs/promises";
import config from "./config.js";

const {
	dir: {
		publicDirectory
	}
}= config;

export default class Service {

	createFileStream(fileName) {
		//conforme os dados vão chegando e ele vai lendo ele vai retornando esses dados ao invés de esperar ler tudo
		return fs.createReadStream(fileName);
	}

	async getFileInfo(file) {
		// file = home/index.html
		const fullFilePath = join(publicDirectory, file);
		//valida se existe, caso não exista estoura um erro
		await fsPromises.access(fullFilePath);
		//retorna o nome da extensão do arquivo
		const fileType = extname(fullFilePath);

		return {
			type: fileType,
			name: fullFilePath
		};
	}

	//normalmente preicsa voltar varios dados além do arquivo e por isso foi deixado o processamento dos dados em outro método em quanto esse retorna o arquivo com dados adicionais que são necessários
	async getFileStream(file) {
		const { name, type } = await this.getFileInfo(file);

		return {
			stream: this.createFileStream(name),
			type
		};
	}
}

import fs from "fs";
import { extname, join } from "path";
import fsPromises from "fs/promises";
import { randomUUID } from "crypto";
import { PassThrough, Writable } from "stream";
import streamPromises from "stream/promises";
import Throttle from "throttle";
//esse modulo serve pra chamar comandos do sistema operacional
import  childProcess  from "child_process";
import config from "./config.js";
import {logger} from "./util.js";
import { once } from "events";

const {
	dir: {
		publicDirectory
	},
	constants: {
		fallBackBitRate,
		englishConversation,
		bitRateDivisor
	}
}= config;

export default class Service {

	constructor() {
		this.clientStreams = new Map();
		this.currentSong = englishConversation;
		this.currentBiteRate = 0;
		this.throttleTransform = {};
		this.currentReadable = {};

	}

	createClientStream(){
		const id = randomUUID();
		const clientStream = new PassThrough();

		this.clientStreams.set(id, clientStream);

		return {
			id,
			clientStream
		};
	}

	removeClientStream(id){
		this.clientStreams.delete(id);
	}

	broadCast() {
		return new Writable({
			write:(chunk, enc, cb) => {
				for(const [id, stream] of this.clientStreams) {
					//se o cliente desconectou não devemos mandar mais dados
					if(stream.writableEnded){
						this.clientStreams.delete(id);
						continue;
					}

					stream.write(chunk);
				}

				cb();
			}
		});
	}

	async startStreamming(){
		logger.info(`Starting with ${this.currentSong}`);

		const bitRate = this.currentBiteRate = (await this.getBitRate(this.currentSong)) / bitRateDivisor;
		const throttleTransform = this.throttleTransform = new Throttle(bitRate);
		const songReadable = this.currentReadable = this.createFileStream(this.currentSong);

		return streamPromises.pipeline(
			songReadable,
			throttleTransform,
			this.broadCast()
		);

	}

	stopStreamming(){
		this.throttleTransform?.end?.();
	}

	_executeSoxCommand(args){
		return childProcess.spawn("sox", args);
	}

	async getBitRate(song){
		try {
			const args = [
				"--i", //info
				"-B", //bitrage
				song
			];

			const {
				stderr, //tudo que é erro
				//stdin, //enviar dados como stream
				stdout //tudo que é log
			} = this._executeSoxCommand(args);

			await Promise.all([
				once(stderr, "readable"),
				once(stdout, "readable")
			]);

			const [ sucess, error ] = [stdout, stderr].map(stream => stream.read());

			if(error) await Promise.reject(error);

			return sucess.toString().trim().replace(/k/, "000");

		} catch (error) {
			logger.error(`Deu ruim no bitRage: ${error}`);
			return fallBackBitRate;
		}
	}

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

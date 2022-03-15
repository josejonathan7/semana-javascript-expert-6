import { describe, it, expect } from "@jest/globals";
import { join } from "path";
import { Readable } from "stream";
import config from "../../../server/config";
import Service from "../../../server/service";


const {
	dir: {
		publicDirectory
	},
	pages: {
		homeHTML
	}
} = config;

describe("#Service", () => {
	const service = new Service();

	it("->Should create file Stream", () => {
		const fullFilePath = join(publicDirectory, homeHTML);
		const response = service.createFileStream(fullFilePath);

		expect(response).toBeInstanceOf(Readable);
	});

	it("->Should get file infos", async () => {
		const response = await service.getFileInfo(homeHTML);
		const fullFilePath = join(publicDirectory, homeHTML);

		expect(response.type).toEqual(".html");
		expect(response.name).toEqual(fullFilePath);

	});

	it("->Should get file stream", async() => {
		const response = await service.getFileStream(homeHTML);

		expect(response.type).toEqual(".html");
		expect(response.stream).toBeInstanceOf(Readable);
	});
});

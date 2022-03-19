import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { randomUUID } from "crypto";
import Controller from "../../../server/controller";
import Service from "../../../server/service.js";
import TestUtil from "../util/testUtil";
import config from "../../../server/config.js";
import { PassThrough } from "stream";

const {
	pages: {
		homeHTML
	}
} = config;

describe("#Controller", () => {


	beforeEach(() => {
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	it("->Should return stream in getFileStream method", async () => {
		const controller = new Controller();
		const mockFileStream = TestUtil.generateReadableStream(["data"]);
		const fileName = homeHTML;

		jest.spyOn(
			Service.prototype,
			Service.prototype.getFileStream.name
		).mockResolvedValue({
			stream: mockFileStream,
			type: ".html"
		});

		const result = await controller.getFileStream(fileName);

		expect(Service.prototype.getFileStream).toBeCalledWith(fileName);
		expect(result.stream).toBe(mockFileStream);
		expect(result.type).toBe(".html");
	});

	it("->Should test create client stream method", () => {
		const controller = new Controller();

		jest.spyOn(
			Service.prototype,
			Service.prototype.createClientStream.name
		).mockReturnValue({
			id: randomUUID(),
			clientStream: new PassThrough()
		});

		const result = controller.createClientStream();

		expect(Service.prototype.createClientStream).toHaveBeenCalled();
		expect(result.stream).toBeInstanceOf(PassThrough);
		expect(result.onClose).toBeInstanceOf(Function);

	});

	it("->Should test handle command method includ start command", async () => {
		const controller = new Controller();

		jest.spyOn(
			Service.prototype,
			Service.prototype.startStreamming.name
		).mockResolvedValueOnce();

		const response = await controller.handleCommand({ command: "start" });

		expect(response).toHaveProperty("result", "ok");
	});

	it("->Should test handle command method includ stop command", async () => {
		const controller = new Controller();

		jest.spyOn(
			Service.prototype,
			Service.prototype.stopStreamming.name
		).mockResolvedValueOnce();

		const response = await controller.handleCommand({ command: "stop" });

		expect(response).toHaveProperty("result", "ok");
	});
});

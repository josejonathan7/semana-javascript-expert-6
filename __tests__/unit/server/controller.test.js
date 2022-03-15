import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import Controller from "../../../server/controller";
import Service from "../../../server/service.js";
import TestUtil from "../util/testUtil";
import config from "../../../server/config.js";

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

});

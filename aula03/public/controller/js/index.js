import Controller from "./controller.js";
import View from "./view.js";
import Service from "./service.js";

// eslint-disable-next-line no-undef
const url = `${window.location.origin}/controller`;

Controller.initialize({
	view: new View(),
	service: new Service({ url })
});

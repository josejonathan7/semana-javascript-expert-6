/* eslint-disable no-undef */


export default class View {

	constructor(){
		this.btnStart = document.getElementById("start");
		this.btnStop = document.getElementById("stop");
		this.buttons = () => Array.from(document.querySelectorAll("button"));

		this.ignoreButtons = new Set(["unassigned"]);

		async function onBtnClick () {}
		this.onBtnClick = onBtnClick;

		this.DISABLE_BTN_TIMEOUT = 500;
	}

	onLoad() {
		this.changeCommandBtnsVisibility();
		this.btnStart.onclick = this.onStartCLicked.bind(this);
	}

	changeCommandBtnsVisibility(hide = true) {
		// eslint-disable-next-line no-undef
		Array.from(document.querySelectorAll("[name=command]"))
			.forEach(btn => {
				const fn = hide ? "add" : "remove";
				btn.classList[fn]("unassigned");

				function onClickReset(){}

				btn.onclick = onClickReset;

			});
	}

	configureOnBtnClick(fn){
		this.onBtnClick = fn;
	}

	async onStartCLicked({
		srcElement: {
			innerText
		}
	}) {
		const btnText = innerText;

		await this.onBtnClick(btnText);
		this.toggleBtnStart();
		this.changeCommandBtnsVisibility(false);

		this.buttons()
			.filter(btn => this.notIsUnassignedButton(btn))
			.forEach(this.setupBtnAction.bind(this));
	}

	toggleBtnStart(active = true) {

		if(active){
			this.btnStart.classList.add("hidden");
			this.btnStop.classList.remove("hidden");
			return;
		} else {
			this.btnStart.classList.remove("hidden");
			this.btnStop.classList.add("hidden");
			return;
		}

	}

	notIsUnassignedButton(btn) {
		const classes = Array.from(btn.classList);

		//se o método (has) tiver o item especificado(nome da classe) o find para o processo e retorna true e se ele não achar ninguém ele retorna null, tem um esquema de transforma isso em booleano que eu não entendo direito
		// eslint-disable-next-line no-extra-boolean-cast
		return !(!!classes.find(item => this.ignoreButtons.has(item)));
	}


	onStopBtn({
		srcElement: {
			innerText
		}
	}){
		this.toggleBtnStart(false);
		this.changeCommandBtnsVisibility(true);

		return this.onBtnClick(innerText);
	}

	setupBtnAction(btn) {
		const text = btn.innerText.toLowerCase();
		if(text.includes("start")) return;

		if(text.includes("stop")) {
			btn.onclick = this.onStopBtn.bind(this);
			return;
		}

		btn.onclick = this.onCommandClick.bind(this);
	}

	async onCommandClick(btn){
		const {
			srcElement: {
				classList,
				innerText
			}
		} = btn;

		this.toggleDisableCommandBtn(classList);
		await this.onBtnClick(innerText);

		setTimeout(() => this.toggleDisableCommandBtn(classList), this.DISABLE_BTN_TIMEOUT);
	}

	toggleDisableCommandBtn(classList) {
		if(!classList.contains("active")){
			classList.add("active");
			return;
		}

		classList.remove("active");
	}
}

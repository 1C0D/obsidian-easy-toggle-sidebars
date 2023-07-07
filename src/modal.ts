import { App, Modal } from "obsidian";
import EasytoggleSidebar from "./main";

export class NewVersion extends Modal {
	plugin: EasytoggleSidebar;
	constructor(app: App, plugin: EasytoggleSidebar) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h1", { text: "Easy toggle sidebars" });
		contentEl.createEl("h4", { text: "What's new:" });
		const content = `
        <ul>
            <li>A button ←→ to switch autoHide from the ribbon bar</li>
        </ul>
        `;
		contentEl.createDiv("", (el: HTMLDivElement) => {
			el.innerHTML = content;
		});
		contentEl.createEl("h4", { text: "last update:" });
		const content1 = `
        <ul>
			<li>When in canvas, you can do vertical! moves(up/down) and double clic in the ribbon bar</li>
            <li>AutoHide when clicking in the editor</li>
			<li>hide sidebars under a minimal editor WIDTH</li>
        </ul>
        `;
		contentEl.createDiv("", (el: HTMLDivElement) => {
			el.innerHTML = content1;
		});
	}

	async onClose() {
		const { contentEl } = this;
		contentEl.empty();
		this.plugin.settings.savedVersion = this.plugin.manifest.version;
		await this.plugin.saveSettings();
	}
}

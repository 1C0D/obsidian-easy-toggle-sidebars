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
            <li>New feature to work with canvas: detection of vertical moves to toggle sidebars from the ribbon bar.
                <ul>
                    <li>Up: toggle left sidebar</li>
                    <li>Down: toggle right sidebar</li>
                    <li>Double click to toggle both sidebars</li>
                </ul>
            <li>Minimal editor width: option to automatically hide sidebar(s) on window resize</li>
        </ul>
        `;
		contentEl.createDiv("", (el: HTMLDivElement) => {
			el.innerHTML = content;
		});
		contentEl.createEl("h4", { text: "last update:" });
		const content1 = `
        <ul>
            <li>AutoHide: option to automatically hide opened sidebars when clicking on the editor</li>
        </ul>
        `;
		contentEl.createDiv("", (el: HTMLDivElement) => {
			el.innerHTML = content1;
		});
	}

	async onClose() {
		const { contentEl } = this;
		contentEl.empty();
		// this.plugin.settings.showInfo = false;
		this.plugin.settings.savedVersion = this.plugin.manifest.version;
		await this.plugin.saveSettings();
	}
}

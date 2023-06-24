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
            <li>Fix (kind of new feature): AutoHide will only work clicking on text content/body
                <ul>
                    <li>Not work on canvas or graph view...</li>
                    <li>don't interfer with tags still opening the left sidebar when clicking on it</li>
                </ul>
        </ul>
        `;
		contentEl.createDiv("", (el: HTMLDivElement) => {
			el.innerHTML = content;
		});
		contentEl.createEl("h4", { text: "last update:" });
		const content1 = `
        <ul>
			<li>works with canvas: detection of vertical moves to toggle sidebars from the ribbon bar</li>
			<li>Auto hide when resizing after a minimal editor width</li>
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

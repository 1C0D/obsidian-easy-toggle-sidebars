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
		contentEl.createDiv({text:"Autohide on window resize Evolves. If the editor width become too small, sidebars will be reduced to their minimal width (200px). If it is still too small, sidebars will be hidden. Little bug on ribbon color fixed."});
	}

	async onClose() {
		const { contentEl } = this;
		contentEl.empty();
		this.plugin.settings.savedVersion = this.plugin.manifest.version;
		await this.plugin.saveSettings();
	}
}

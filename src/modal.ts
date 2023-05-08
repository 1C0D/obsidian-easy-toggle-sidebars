import { App, Modal } from "obsidian";
import EasytoggleSidebar from "./main";

export class NewVersion extends Modal {
    plugin: EasytoggleSidebar;
    constructor(app: App, plugin: EasytoggleSidebar) {
        super(app);
        this.plugin = plugin
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h1", { text: "Easy toggle sidebars" });
        contentEl.createEl("h4", { text: "What's new:" });
        const content = `<ul><li>You can activate autoHide to automatically hide opened sidebars when clicking on the editor</li>
                </ul>`;
        contentEl.createDiv("", (el: HTMLDivElement) => {
            el.innerHTML = content;
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
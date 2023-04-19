import { App, PluginSettingTab, Setting } from "obsidian";
import EasytoggleSidebar from "./main";

export class ETSSettingTab extends PluginSettingTab {
    plugin: EasytoggleSidebar;

    constructor(app: App, plugin: EasytoggleSidebar) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h1", { text: "Easy Toggle Sidebar" });
        const content = `<br>With RightMouseButton or MiddleMouseButton :<br>
		<ul><li>double click to toggle both sidebars </li>
			<li>click and move toward the sideBar you want to toggle</li>
		</ul>
		N.B: when using rightMouse and move, try to stay in the editor.		
		<br>
		<hr>
		To "toggle both sidebars", you can add your own shortcut to this command.
        <br><br>`;

        containerEl.createDiv("", (el: HTMLDivElement) => {
            el.innerHTML = content;
        });

        new Setting(containerEl)
            .setName("Right Mouse")
            .setDesc("Activates Right Mouse to trigger operations")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.useRightMouse)
                    .onChange((value) => {
                        this.plugin.settings.useRightMouse = value;
                        this.plugin.saveSettings();
                    });
            });
        new Setting(containerEl)
            .setName("Middle Mouse")
            .setDesc("Activates Right Mouse to trigger operations")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.useMiddleMouse)
                    .onChange((value) => {
                        this.plugin.settings.useMiddleMouse = value;
                        this.plugin.saveSettings();
                    });
            });
        // new Setting(containerEl)
        new Setting(containerEl)
            .setName("Move threshold in px. (default 150)")
            .setDesc("modify it only if needed")
            .addSlider((slider) => {
                slider
                    .setLimits(50, 500, 10)
                    .setValue(this.plugin.settings.moveThreshold)
                    .setDynamicTooltip()
                    .onChange((value) => {
                        this.plugin.settings.moveThreshold = value;
                        this.plugin.saveSettings();
                    });
            })

    }
}
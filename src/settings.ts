import { App, PluginSettingTab, Setting } from "obsidian";
import EasytoggleSidebar, { DEFAULT_SETTINGS } from "./main";

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
            <li><strong>New</strong>: You can activate autoHide to automatically hidding opened sidebars when clicking on the editor </li>
		</ul>
		A command "toggle both sidebars" is created so you can add your own shortcut to it.	
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
                    .onChange(async (value) => {
                        this.plugin.settings.useMiddleMouse = value;
                        await this.plugin.saveSettings();
                    });
            });
        new Setting(containerEl)
            .setName("Move threshold in px. (default 150)")
            .setDesc("modify it only if needed")
            .addSlider((slider) => {
                slider
                    .setLimits(50, 500, 10)
                    .setValue(this.plugin.settings.moveThreshold)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.moveThreshold = value;
                        await this.plugin.saveSettings();
                    });
            })
            .addExtraButton(btn => {
                btn
                    .setIcon("reset")
                    .setTooltip("Reset to default")
                    .onClick(async () => {
                        this.plugin.settings.moveThreshold = DEFAULT_SETTINGS.moveThreshold;
                        console.log("this.plugin.settings.moveThreshold", this.plugin.settings.moveThreshold)
                        await this.plugin.saveSettings();
                        this.display()
                    });
            });
        new Setting(containerEl)
            .setName("Auto hide")
            .setDesc("Auto hide panels when clicking on the editor")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.autoHide)
                    .onChange(async (value) => {
                        this.plugin.settings.autoHide = value;
                        await this.plugin.saveSettings();
                        if (this.plugin.settings.autoHide) {
                            this.plugin.registerDomEvent(
                                document,
                                'click',
                                this.plugin.autoHide
                            );
                        } else { document.removeEventListener("click", this.plugin.autoHide) }

                    });
            });

    }
}
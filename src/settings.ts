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
		<ul>
            <li>double click to toggle both sidebars </li>
			<li>click and move toward the sideBar you want to toggle</li>
            <li>you can do previous operations from the ribbon bar but using vertical moves</li>
            <li>autoHide to automatically hide opened sidebars when clicking on the editor </li>
            <li>autohide sidebars after reaching a Minimal editor width</li>
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
            .setName("Move threshold(px)")
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
        new Setting(containerEl)
			.setName("Minimal editor width")
			.setDesc(
				"Hide panel(s) if the proportion of the editor is less than X (threshold below) times the window size"
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.autoMinRootWidth)
					.onChange(async (value) => {
						this.plugin.settings.autoMinRootWidth = value;
						await this.plugin.saveSettings();
					});
			});
        new Setting(containerEl)
            .setName("Min width threshold (default 0.4)")
            .setDesc("modify it only if needed")
            .addSlider((slider) => {
                slider
                    .setLimits(200, 800, 10)
                    .setValue(this.plugin.settings.minRootWidth)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.minRootWidth = value;
                        await this.plugin.saveSettings();
                    });
            })
            .addExtraButton(btn => {
                btn
                    .setIcon("reset")
                    .setTooltip("Reset to default")
                    .onClick(async () => {
                        this.plugin.settings.minRootWidth = DEFAULT_SETTINGS.minRootWidth;
                        await this.plugin.saveSettings();
                        this.display()
                    });
            });


    }
}
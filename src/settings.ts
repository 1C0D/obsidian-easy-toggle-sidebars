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
            <li>you can do previous operations from the ribbon bar using double clic and vertical moves (up/down). this is useful when in canvas</li>
            <li>autoHide to automatically hide sidebars when clicking on the editor</li>
            <li>ribbon bar autoHide button switcher</li>
            <li>hide sidebars under a minimal editor WIDTH</li>
		</ul>
		Command "toggle both sidebars" added.	
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
            .setName("Ribbon Button for autoHide")
            .setDesc("Ribbon icon to switch autoHide")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.autoHideRibbon)
                    .onChange(async (value) => {
                        this.plugin.settings.autoHideRibbon = value;
                        await this.plugin.saveSettings();
                        if (this.plugin.settings.autoHideRibbon) {
                            this.plugin.autoHideON()
                            await this.plugin.saveSettings();
                        } else {
                            this.plugin.ribbonIconEl?.remove()
                            this.plugin.ribbonIconEl = null;
                        }
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
                        this.plugin.toggleAutoHideEvent()
                        this.plugin.toggleColor()
                        await this.plugin.saveSettings();
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
            .setName("Min width threshold")
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


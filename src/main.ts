import {
	App,
	Modal,
	Plugin,
	PluginSettingTab,
	WorkspaceSidedock,
} from "obsidian";

interface ETSSettings {
	// showInfo: boolean;
	savedVersion: string
}

const DEFAULT_SETTINGS: ETSSettings = {
	// showInfo: true,
	savedVersion: "0.0.0",
};

export default class EasytoggleSidebar extends Plugin {
	leftSplit: WorkspaceSidedock;
	rightSplit: WorkspaceSidedock;
	isContextMenuPrevented = false;
	settings: ETSSettings;

	async onload() {
		await this.loadSettings();
		await this.saveSettings();
		if (
			this.manifest.version.split(".").map(Number) <= [1, 2, 0] &&
			this.settings.savedVersion !== this.manifest.version // is reinstall false
		) {
			new NewVersion(this.app, this).open();
		};

		this.app.workspace.onLayoutReady(() => {
			let startX = 0;
			let threshold = 80;

			this.registerDomEvent(document, "mousedown", (evt: any) => {
				if (evt.button === 0) {
					return;
				} else {
					startX = evt.clientX;
				}
			});

			this.registerDomEvent(document, "mouseup", (evt: any) => {
				if (evt.button !== 0 && evt.detail === 1) {
					let endX = evt.clientX;
					let distance = Math.sqrt(Math.pow(endX - startX, 2));
					if (distance > threshold) {
						this.isContextMenuPrevented = true;
						document.addEventListener(
							"contextmenu",
							this.contextMenuHandler
						);
						if (endX < startX) {
							this.toggle(this.getLeftSplit());
						} else {
							this.toggle(this.getRightSplit());
						}
					}
				}
				if (evt.button !== 0 && evt.detail === 2) {
					this.isContextMenuPrevented = true;
					document.addEventListener(
						"contextmenu",
						this.contextMenuHandler
					);
					this.toggleBothSidebars();
				}
			});

			this.addCommand({
				id: "toggle-both-sidebars",
				name: "Toggle both sidebars",
				callback: () => {
					this.toggleBothSidebars();
				},
			});
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	contextMenuHandler = (evt: MouseEvent) => {
		if (this.isContextMenuPrevented) {
			evt.preventDefault();
			this.isContextMenuPrevented = false;
			document.removeEventListener(
				"contextmenu",
				this.contextMenuHandler
			);
		}
	};

	toggleBothSidebars() {
		const isLeftOpen = this.isOpen(this.getLeftSplit());
		const isRightOpen = this.isOpen(this.getRightSplit());
		if (isLeftOpen && !isRightOpen) {
			this.toggle(this.getLeftSplit());
		} else if (isRightOpen && !isLeftOpen) {
			this.toggle(this.getRightSplit());
		} else {
			this.toggle(this.getLeftSplit());
			this.toggle(this.getRightSplit());
		}
	}

	getLeftSplit(): WorkspaceSidedock {
		return this.app.workspace.leftSplit;
	}

	getRightSplit(): WorkspaceSidedock {
		return this.app.workspace.rightSplit;
	}

	toggle(side: WorkspaceSidedock) {
		if (this.isOpen(side)) {
			side.collapse();
		} else {
			side.expand();
		}
	}

	isOpen(side: WorkspaceSidedock) {
		if (side.collapsed == true) return false;
		else return true;
	}
}

class NewVersion extends Modal {
	plugin: EasytoggleSidebar;
	constructor(app: App, plugin: EasytoggleSidebar) {
		super(app);
		this.plugin= plugin
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h1", { text: "Easy toggle sidebars" });
		contentEl.createEl("h4", { text: "About this new version:" });
		const content = `<ul><li>You can now use rightMouseButton or midleMouseButton</li>
				<li>There is also a command "Toggle both sidebars"</li></ul>`;
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


class ETSSettingTab extends PluginSettingTab {
	plugin: EasytoggleSidebar;

	constructor(app: App, plugin: EasytoggleSidebar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h1", { text: "Easy Toggle Sidebar" });
		const content = `<br>RightMouseButton or MiddleMouseButton :<br>
		<ul><li>double click to toggle both sidebars </li>
			<li>click and move toward the sideBar you want to toggle</li>
		</ul>
		N.B: when using rightMouse and move, try to stay in the editor.		
		<br>
		<hr>
		To "toggle both sidebars", you can add your own shortcut to this command.`;

		containerEl.createDiv("", (el: HTMLDivElement) => {
			el.innerHTML = content;
		});
	}
}

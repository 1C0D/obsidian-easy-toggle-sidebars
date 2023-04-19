import {
	Plugin,
	WorkspaceSidedock,
} from "obsidian";
import { NewVersion } from "./modal";
import { ETSSettingTab } from "src/settings";

interface ETSSettings {
	// showInfo: boolean;
	savedVersion: string
	useRightMouse: boolean
	useMiddleMouse: boolean
	moveThreshold: number
}

const DEFAULT_SETTINGS: ETSSettings = {
	// showInfo: true,
	savedVersion: "0.0.0",
	useRightMouse: true,
	useMiddleMouse: true,
	moveThreshold: 150
};

export default class EasytoggleSidebar extends Plugin {
	leftSplit: WorkspaceSidedock;
	rightSplit: WorkspaceSidedock;
	isContextMenuPrevented = false;
	settings: ETSSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ETSSettingTab(this.app, this));
		await this.saveSettings();
		if (
			this.manifest.version.split(".").map(Number) <= [1, 3, 0] &&
			this.settings.savedVersion !== this.manifest.version // is reinstall false
		) {
			new NewVersion(this.app, this).open();
		};

		this.app.workspace.onLayoutReady(() => {
			let startX = 0;
			

			this.registerDomEvent(document, "mousedown", (evt: any) => {
				const RMB = this.settings.useRightMouse
				const MMB = this.settings.useMiddleMouse
				if (evt.button === 0) {
					return;
				} else if (MMB && evt.button === 1 || RMB && evt.button === 2){
					startX = evt.clientX;
				}
			});

			this.registerDomEvent(document, "mouseup", (evt: any) => {
				const RMB = this.settings.useRightMouse
				const MMB = this.settings.useMiddleMouse
				if ((MMB && evt.button === 1 || RMB && evt.button === 2) && evt.detail === 1) {
					let endX = evt.clientX;
					let distance = Math.sqrt(Math.pow(endX - startX, 2));
					if (distance > this.settings.moveThreshold) {
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
				if ((MMB && evt.button === 1 || RMB && evt.button === 2) && evt.detail === 2) {
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




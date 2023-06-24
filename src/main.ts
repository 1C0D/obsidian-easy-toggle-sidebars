import { Plugin, WorkspaceSidedock } from "obsidian";
import { NewVersion } from "./modal";
import { ETSSettingTab } from "src/settings";

interface ETSSettings {
	savedVersion: string;
	useRightMouse: boolean;
	useMiddleMouse: boolean;
	moveThreshold: number;
	autoHide: boolean;
	autoMinRootWidth: boolean;
	minRootWidth: number;
}

export const DEFAULT_SETTINGS: ETSSettings = {
	savedVersion: "0.0.0",
	useRightMouse: true,
	useMiddleMouse: true,
	moveThreshold: 150,
	autoHide: false,
	autoMinRootWidth: false,
	minRootWidth: 300,
};

export default class EasytoggleSidebar extends Plugin {
	isContextMenuPrevented = false;
	settings: ETSSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ETSSettingTab(this.app, this));
		if (
			this.settings.savedVersion !== "0.0.0" && // if never installed false
			this.settings.savedVersion !== this.manifest.version // if reinstall false
		) {
			new NewVersion(this.app, this).open();
		} else {
			this.settings.savedVersion = this.manifest.version;
		}
		await this.saveSettings();

		this.app.workspace.onLayoutReady(() => {
			let startX: number;
			let startY: number;

			this.registerDomEvent(document, "mousedown", (evt: any) => {
				const RMB = this.settings.useRightMouse;
				const MMB = this.settings.useMiddleMouse;
				if (evt.button === 0) {
					return;
				} else if (
					(MMB && evt.button === 1) ||
					(RMB && evt.button === 2)
				) {
					startX = evt.clientX;
					startY = evt.clientY;
				}
			});

			this.registerDomEvent(document, "mouseup", (evt: any) => {
				const RMB = this.settings.useRightMouse;
				const MMB = this.settings.useMiddleMouse;
				if (
					((MMB && evt.button === 1) || (RMB && evt.button === 2)) &&
					evt.detail === 1
				) {
					let endX = evt.clientX;
					let endY = evt.clientY;
					let distanceX = Math.sqrt(Math.pow(endX - startX, 2));
					let distanceY = Math.sqrt(Math.pow(endY - startY, 2));
					if (
						distanceX > this.settings.moveThreshold ||
						distanceY > this.settings.moveThreshold
					) {
						this.isContextMenuPrevented = true;
						document.addEventListener(
							"contextmenu",
							this.contextMenuHandler
						);
						if (
							(distanceX > this.settings.moveThreshold &&
								endX < startX) ||
							(distanceY > this.settings.moveThreshold &&
								endY < startY)
						) {
							this.toggle(this.getLeftSplit());
						} else if (
							(this.settings.moveThreshold && endX > startX) ||
							(this.settings.moveThreshold && endY > startY)
						) {
							this.toggle(this.getRightSplit());
						}
					}
				}
				if (
					((MMB && evt.button === 1) || (RMB && evt.button === 2)) &&
					evt.detail === 2
				) {
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

			if (this.settings.autoHide) {
				this.registerDomEvent(document, "click", this.autoHide);
			}

			this.registerEvent(
				(this.app as any).workspace.on("resize", () => this.onResize())
			);
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

	getLeftSplit() {
		return (this.app as any).workspace.leftSplit;
	}

	getRightSplit() {
		return (this.app as any).workspace.rightSplit;
	}

	getRootSplit() {
		return (this.app as any).workspace.rootSplit;
	}

	onResize() {
		const LS = this.getLeftSplit();
		const RS = this.getRightSplit();
		if (
			!this.settings.autoMinRootWidth ||
			(!this.isOpen(LS) && !this.isOpen(RS))
		) {
			return;
		}
		const editorWidth = this.getRootSplit().containerEl.clientWidth;
		if (editorWidth < this.settings.minRootWidth) {
			this.toggleBothSidebars();
		}
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

	autoHide = (evt: any) => {
		const rootSplitEl = (this.app as any).workspace.rootSplit.containerEl;
		const clickedElement = evt.target;
		// body content only
		const isBody = clickedElement.classList.contains("cm-content");
		const isLine = clickedElement.classList.contains("cm-line");
		const isLink = clickedElement.classList.contains("cm-underline");// links
		const isRoot = rootSplitEl.contains(clickedElement);
		if (!isRoot) return; // || !isLine || !isBody
		if (isLine || isBody || isLink) {
			const leftSplit = this.app.workspace.leftSplit;
			const rightSplit = this.app.workspace.rightSplit;
			if (!leftSplit.collapsed || !rightSplit.collapsed) {
				this.toggleBothSidebars();
			}
		}
	};
}

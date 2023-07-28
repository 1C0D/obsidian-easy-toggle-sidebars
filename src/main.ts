import { Notice, Plugin, WorkspaceSidedock } from "obsidian";
import { NewVersion } from "./modal";
import { ETSSettingTab } from "src/settings";

interface ETSSettings {
	savedVersion: string;
	useRightMouse: boolean;
	useMiddleMouse: boolean;
	moveThreshold: number;
	autoHide: boolean;
	autoHideRibbon: boolean;
	autoMinRootWidth: boolean;
	minRootWidth: number;
}

export const DEFAULT_SETTINGS: ETSSettings = {
	savedVersion: "0.0.0",
	useRightMouse: true,
	useMiddleMouse: true,
	moveThreshold: 150,
	autoHide: false,
	autoHideRibbon: true,
	autoMinRootWidth: false,
	minRootWidth: 300,
};

export default class EasytoggleSidebar extends Plugin {
	isContextMenuPrevented = false;
	settings: ETSSettings;
	ribbonIconEl!: HTMLElement | null;
	startX: number;
	startY: number;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ETSSettingTab(this.app, this));
		this.updateInfo()
		if (this.settings.autoHideRibbon) {
			this.autoHideON()
		}

		this.app.workspace.onLayoutReady(() => {
			this.registerDomEvent(document, "mousedown", this.mousedownHandler)
			
			this.registerDomEvent(document, "mouseup", this.mouseupHandler);

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

	mousedownHandler = (evt: MouseEvent) => {
		if (evt.button === 0) return;
		const RMB = this.settings.useRightMouse;
		const MMB = this.settings.useMiddleMouse;
		if (
			(MMB && evt.button === 1) ||
			(RMB && evt.button === 2)
		) {
			this.startX = evt.clientX;
			this.startY = evt.clientY;
		}
	};

	mouseupHandler = (evt: MouseEvent) => { 
		const RMB = this.settings.useRightMouse;
		const MMB = this.settings.useMiddleMouse;
		if (
			((MMB && evt.button === 1) || (RMB && evt.button === 2)) &&
			evt.detail === 1
		) {
			let endX = evt.clientX;
			let endY = evt.clientY;
			let distanceX = Math.sqrt(Math.pow(endX - this.startX, 2));
			let distanceY = Math.sqrt(Math.pow(endY - this.startY, 2));
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
						endX < this.startX) ||
					(distanceY > this.settings.moveThreshold &&
						endY < this.startY)
				) {
					this.toggle(this.getLeftSplit());
				} else if (
					(this.settings.moveThreshold && endX > this.startX) ||
					(this.settings.moveThreshold && endY > this.startY)
				) {
					this.toggle(this.getRightSplit());
				}
			}
		}
		if (
			((MMB && evt.button === 1) || (RMB && evt.button === 2)) &&
			evt.detail === 2
		) {
			if (evt.button === 2) {
				this.isContextMenuPrevented = true;
				document.addEventListener(
					"contextmenu",
					this.contextMenuHandler
				);
			}
			this.toggleBothSidebars();
		}
	}

	async updateInfo() {
		if (
			this.settings.savedVersion !== "0.0.0" && // never installed
			this.settings.savedVersion !== this.manifest.version // new version
		) {
			new NewVersion(this.app, this).open();
		}

		await this.saveSettings();
	}

	autoHideON = () => {
		this.ribbonIconEl = this.addRibbonIcon('move-horizontal', 'autoHide switcher', async () => {
			this.settings.autoHide = !this.settings.autoHide;
			await this.saveSettings()
			this.toggleAutoHideEvent()
			this.toggleColor()
			new Notice(this.settings.autoHide ? 'AutoHide Enabled' : 'AutoHide Disabled');
		});
		this.toggleColor()
	}

	toggleColor() {
		this.settings.autoHide ? this.ribbonIconEl?.addClass("ribbon-color") :
			this.ribbonIconEl?.removeClass("ribbon-color")
	}

	toggleAutoHideEvent = () => {
		if (this.settings.autoHide) {
			this.registerDomEvent(
				document,
				'click',
				this.autoHide
			);
		} else {
			document.removeEventListener("click", this.autoHide)
		}
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
		let keepOn = false
		if (editorWidth < this.settings.minRootWidth) {
			const leftSplit = document.querySelector('.mod-left-split') as HTMLElement;
			const rightSplit = document.querySelector('.mod-right-split') as HTMLElement;
			if (LS.containerEl.clientWidth > 200) {
				leftSplit.style.width = '200px';
			}
			if (RS.containerEl.clientWidth > 200) {
				rightSplit.style.width = '200px';
			}
			keepOn = true
		}
		if (keepOn) {
			const updatedEditorWidth = this.getRootSplit().containerEl.clientWidth;
			if (updatedEditorWidth < this.settings.minRootWidth) {
				this.toggleBothSidebars();
			}
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
		//Root body content only
		const isBody = clickedElement.classList.contains("cm-content");
		const isLine = clickedElement.classList.contains("cm-line");
		const isLink = clickedElement.classList.contains("cm-underline");// links
		const isRoot = rootSplitEl.contains(clickedElement);
		if (!isRoot) return;
		if (isLine || isBody || isLink) {
			const leftSplit = this.app.workspace.leftSplit;
			const rightSplit = this.app.workspace.rightSplit;
			if (!leftSplit.collapsed || !rightSplit.collapsed) {
				this.toggleBothSidebars();
			}
		}
	};

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
}

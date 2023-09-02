import { Notice, Plugin, WorkspaceSidedock } from "obsidian";
import { ETSSettingTab } from "./settings";

interface ETSSettings {
	useRightMouse: boolean;
	useMiddleMouse: boolean;
	moveThreshold: number;
	autoHide: boolean;
	autoHideRibbon: boolean;
	autoMinRootWidth: boolean;
	minRootWidth: number;
}

export const DEFAULT_SETTINGS: ETSSettings = {
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
		const { settings } = this
		const RMB = settings.useRightMouse;
		const MMB = settings.useMiddleMouse;
		if (
			(MMB && evt.button === 1) ||
			(RMB && evt.button === 2)
		) {
			this.startX = evt.clientX;
			this.startY = evt.clientY;
		}
	};

	mouseupHandler = (evt: MouseEvent) => {
		const { settings } = this
		const RMB = settings.useRightMouse;
		const MMB = settings.useMiddleMouse;
		if (
			((MMB && evt.button === 1) || (RMB && evt.button === 2)) &&
			evt.detail === 1
		) {
			let endX = evt.clientX;
			let endY = evt.clientY;
			let distanceX = Math.sqrt(Math.pow(endX - this.startX, 2));
			let distanceY = Math.sqrt(Math.pow(endY - this.startY, 2));
			if (
				distanceX > settings.moveThreshold ||
				distanceY > settings.moveThreshold
			) {
				this.isContextMenuPrevented = true;
				document.addEventListener(
					"contextmenu",
					this.contextMenuHandler
				);
				if (
					(distanceX > settings.moveThreshold &&
						endX < this.startX) ||
					(distanceY > settings.moveThreshold &&
						endY < this.startY)
				) {
					this.toggle(this.getLeftSplit());
				} else if (
					(settings.moveThreshold && endX > this.startX) ||
					(settings.moveThreshold && endY > this.startY)
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

	autoHideON = () => {
		const { settings } = this
		this.ribbonIconEl = this.addRibbonIcon('move-horizontal', 'autoHide switcher', async () => {
			settings.autoHide = !settings.autoHide;
			await this.saveSettings()
			this.toggleAutoHideEvent()
			this.toggleColor()
			new Notice(settings.autoHide ? 'AutoHide Enabled' : 'AutoHide Disabled');
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
		const { settings } = this
		const { minRootWidth } = settings

		if (
			!settings.autoMinRootWidth ||
			(!this.isOpen(LS) && !this.isOpen(RS))
		) {
			return;
		}
		const editorWidth = this.getRootSplit().containerEl.clientWidth;
		if (editorWidth < minRootWidth) {
			if (LS.containerEl.clientWidth > 200) {
				LS.setSize(200)
			}
			if (RS.containerEl.clientWidth > 200) {
				RS.setSize(200)
			}
			
		}
		if (editorWidth < minRootWidth) {
			const updatedEditorWidth = this.getRootSplit().containerEl.clientWidth;
			if (updatedEditorWidth < minRootWidth) {
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
		const { app: { workspace } } = this as any
		const rootSplitEl = workspace.rootSplit.containerEl;
		const clickedElement = evt.target;
		//Root body content only
		const isBody = clickedElement.classList.contains("cm-content");
		const isLine = clickedElement.classList.contains("cm-line");
		const isLink = clickedElement.classList.contains("cm-underline");// links
		const isRoot = rootSplitEl.contains(clickedElement);
		if (!isRoot) return;
		if (isLine || isBody || isLink) {
			const leftSplit = workspace.leftSplit;
			const rightSplit = workspace.rightSplit;
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

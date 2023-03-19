import {
	Plugin,
	WorkspaceSidedock,
} from "obsidian";

export default class EasytoggleSidebar extends Plugin {
	leftSplit: WorkspaceSidedock;
	rightSplit: WorkspaceSidedock;
	rootSplitEl: HTMLElement;
	leftSplitEl: HTMLElement;
	rightSplitEl: HTMLElement;
	doubleClickTimer: NodeJS.Timeout | null;
	isDoubleClickTimerStarted: boolean;

	async onload() {
		this.app.workspace.onLayoutReady(() => {
			this.params();
			let startX = 0;
			let threshold = 200;

			this.registerDomEvent(
				this.app.workspace.containerEl,
				"mousedown",
				(evt: any) => {
					if (evt.button !== 1) {
						return;
					} else {
						startX = evt.clientX;
					}
				}
			);

			this.registerDomEvent(
				this.app.workspace.containerEl,
				"mouseup",
				(evt: any) => {
					if (evt.button === 1 && evt.detail === 1) {
						let endX = evt.clientX;
						let endY = evt.clientY;
						let distance = Math.sqrt(Math.pow(endX - startX, 2));
						if (distance > threshold) {
							if (endX < startX) {
								this.toggle(this.leftSplit);
							} else {
								this.toggle(this.rightSplit);
							}
						} 
					}
					if (evt.button === 1 && evt.detail === 2){
						const isLeftOpen = this.isOpen(this.leftSplit);
						const isRightOpen = this.isOpen(this.rightSplit);
						if (isLeftOpen && !isRightOpen) {
							this.toggle(this.leftSplit);
						} else if (isRightOpen && !isLeftOpen) {
							this.toggle(this.rightSplit);
						} else {
							this.toggle(this.leftSplit);
							this.toggle(this.rightSplit);
						}
						
					}
				}
			);
		});
	}

	params() {
		this.leftSplit = this.app.workspace.leftSplit;
		this.rightSplit = this.app.workspace.rightSplit;
		this.rootSplitEl = (this.app as any).workspace.rootSplit.containerEl;
		this.leftSplitEl = (this.app as any).workspace.leftSplit.containerEl;
		this.rightSplitEl = (this.app as any).workspace.rightSplit.containerEl;
	}

	toggle(side: WorkspaceSidedock) {
		if (this.isOpen(side)) {
			side.expand();
		} else {
			side.collapse();
		}
	}

	isOpen(side: WorkspaceSidedock) {
		if (side.collapsed == true) return true;
		else return false;
	}

}
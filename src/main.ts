import { Plugin, WorkspaceSidedock } from "obsidian";

export default class EasytoggleSidebar extends Plugin {
	leftSplit: WorkspaceSidedock;
	rightSplit: WorkspaceSidedock;

	async onload() {
		this.app.workspace.onLayoutReady(() => {
			let startX = 0;
			let threshold = 150;

			this.registerDomEvent(document, "mousedown", (evt: any) => {
				if (evt.button !== 1) {
					return;
				} else {
					startX = evt.clientX;
				}
			});

			this.registerDomEvent(document, "mouseup", (evt: any) => {
				if (evt.button === 1 && evt.detail === 1) {
					let endX = evt.clientX;
					let distance = Math.sqrt(Math.pow(endX - startX, 2));
					if (distance > threshold) {
						if (endX < startX) {
							this.toggle(this.getLeftSplit());
						} else {
							this.toggle(this.getRightSplit());
						}
					}
				}
				if (evt.button === 1 && evt.detail === 2) {
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

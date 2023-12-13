import { Editor, Plugin, Menu, Notice } from "obsidian";
import { InsertLinkModal } from "./src/modal";

export default class InsertLinkPlugin extends Plugin {
	async onload() {
		this.setMenu();
		this.addCommand({
			id: "insert-link",
			name: "Insert link",
			editorCallback: (editor: Editor) => {
				const selectedText = editor.getSelection();
				const onSubmit = (text: string, url: string) => {
					editor.replaceSelection(`[${text}](${url})`);
				};

				new InsertLinkModal(this.app, selectedText, onSubmit).open();
			},
		});
	}

	onunload() {
		console.log("unloading plugin");
	}

	//
	setMenu() {
		this.addRibbonIcon("dice", "Open menu", (event) => {
			const menu = new Menu();
			menu.addItem((item) =>
				item
					.setTitle("Copy")
					.setIcon("documents")
					.onClick(() => {
						new Notice("Copied");
						const selectedText =
							this.app?.workspace?.activeEditor.getSelection();
						navigator.clipboard.writeText(selectedText);
					})
			);

			menu.addItem((item) =>
				item
					.setTitle("Paste")
					.setIcon("paste")
					.onClick(async () => {
						new Notice("Pasted");
						const text = await navigator.clipboard.readText();
						this.app?.workspace?.activeLeaf?.view?.editor?.replaceSelection(
							text
						);
					})
			);

			menu.showAtMouseEvent(event);
		});
	}
}

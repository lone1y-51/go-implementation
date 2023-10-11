import * as vscode from "vscode";
import { AnnotationLensProvider } from "./AnnotateLensProvider";

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("go-implementation.GoImplementation", (args: vscode.Location) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return
    }
    const position = editor.selection.active
    var newPosition = position.with(args.range.start.line, args.range.start.character);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection
    vscode.commands.executeCommand("editor.action.goToImplementation")
  })
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      [{ language: "go" }],
      new AnnotationLensProvider()
    )
  );
}

export function deactivate() { }

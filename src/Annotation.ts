import * as vscode from "vscode";

export class Annotation {
  public constructor(
    public readonly from: vscode.SymbolInformation & vscode.DocumentSymbol,
  ) { }
}

import * as vscode from "vscode";
import { Annotation } from "./Annotation";
import { AnnotationLens } from "./AnnotationLens";
import { SymbolInfo } from "./SymbolInfo";

export class AnnotationLensProvider
  implements vscode.CodeLensProvider<AnnotationLens>
{
  public async provideCodeLenses(
    document: vscode.TextDocument
  ): Promise<vscode.CodeLens[]> {
    const goSymbols = await this.getGoSymbols(document);

    const results: AnnotationLens[] = [];
    for (const goSymbol of goSymbols) {
      const symbolInfo = await SymbolInfo.create(goSymbol);
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return [];
      }
      results.push(new AnnotationLens(new Annotation(symbolInfo.symbol)));

      // const locations = await this.getSymbolLocations(activeEditor, symbolInfo) ?? [];
      // const symbols = await Promise.all(locations.map(SymbolInfo.getSymbol));
      // if (symbols.length === 0) {
      //   continue;
      // }

      // const annotation = new Annotation(symbolInfo.symbol, symbols);
      // results.push(new AnnotationLens(annotation));
    }

    return results;
  }

  private async getGoSymbols(document: vscode.TextDocument) {
    const result: (vscode.SymbolInformation & vscode.DocumentSymbol)[] = []
    const symbols = (await vscode.commands.executeCommand<
      (vscode.SymbolInformation & vscode.DocumentSymbol)[]
    >("vscode.executeDocumentSymbolProvider", document.uri))!.forEach(
      (symbol) => {
        if (symbol.kind === vscode.SymbolKind.Interface) {
          symbol.children.forEach((children) => {
            if (children.kind === vscode.SymbolKind.Method) {
              const t = <vscode.SymbolInformation & vscode.DocumentSymbol><unknown>(children)
              result.push(t)
            }
          })
        }
      }
      // symbol.kind === vscode.SymbolKind.Property ||
      // symbol.kind === vscode.SymbolKind.TypeParameter
    );
    return result;
  }
}


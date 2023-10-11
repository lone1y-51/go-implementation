import * as vscode from "vscode";
import { Annotation } from "./Annotation";

export class AnnotationLens extends vscode.CodeLens {
  public constructor(annotation: Annotation) {
    const from = annotation.from;
    super(from.location.range, {
      command: "go-implementation.GoImplementation",
      title: "@go to implementation",
      arguments: [
        from.location
      ]
    });
  }
}

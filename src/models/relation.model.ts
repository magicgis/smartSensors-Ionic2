export class RelationModel {
  public direction: string;
  public abstraction: string;
  public parent: string;
  public next: string;
  public previous: string

  constructor(
    input: any
  ){
    this.direction = input["direction"] || "";
    this.abstraction = input["abstraction"] || "";
    this.parent = input["parent"] || "";
    this.next = input["next"] || "";
    this.previous = input["previous"] || "";
  }
}

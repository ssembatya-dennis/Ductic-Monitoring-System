import Column from "./Column.js";

export default class Kanban {
  constructor(root) {
    this.root = root;

    Kanban.columns().forEach((column) => {
      const columnView = new Column(column.id, column.name);
      this.root.appendChild(columnView.elements.root);
    });
  }

  static columns() {
    return [
      { id: 1, name: "Not Started" },
      { id: 2, name: "In Progress" },
      { id: 3, name: "Completed" },
    ];
  }
}

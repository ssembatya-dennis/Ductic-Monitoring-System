import KanbanAPI from "../api/KanbanAPI.js";

export default class Ticket {
  constructor(id, content) {
    this.elements = {};
    this.elements.root = Ticket.createRoot();
    this.elements.input = this.elements.root.querySelector(
      ".kanban__ticket-content"
    );

    this.elements.root.dataset.id = id;
    this.elements.input.textContent = content;
    this.content = content;

    const onBlur = () => {
      const newContent = this.elements.input.textContent.trim();

      if (newContent == this.content) {
        return;
      }

      this.content = newContent;
      KanbanAPI.updateTicket(id, { content: this.content });
    };

    this.elements.input.addEventListener("blur", onBlur);
    this.elements.input.addEventListener("dblclick", () => {
      const check = confirm("Are you sure you want to delete this ticket?");
      if (check) {
        KanbanAPI.deleteTicket(id);

        this.elements.input.removeEventListener("blur", onBlur);
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });

    this.elements.root.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
    });

    this.elements.root.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  }

  static createRoot() {
    const range = document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
        <div class="kanban__column-ticket-input" draggable="true">
            <div class="kanban__ticket-content" contenteditable></div>
        </div> 
    `).children[0];
  }
}

import KanbanAPI from "../api/KanbanAPI.js";
import Ticket from "./Ticket.js";

export default class Column {
  constructor(id, name) {
    this.elements = {};
    this.elements.root = Column.createRoot();
    this.elements.title = this.elements.root.querySelector(
      ".kanban__column-title"
    );
    this.elements.tickets = this.elements.root.querySelector(
      ".kanban__column-tickets"
    );
    this.elements.addTicket =
      this.elements.root.querySelector(".kanban__button");

    this.elements.root.dataset.id = id;
    this.elements.title.textContent = name;

    this.elements.addTicket.addEventListener("click", () => {
      const newTicket = KanbanAPI.insertTicket(id, "");

      this.renderTickets(newTicket);
    });

    KanbanAPI.getTickets(id).forEach((ticket) => {
      this.renderTickets(ticket);
    });
  }

  static createRoot() {
    const range = document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
        <div class="kanban__column">
            <h2 class="kanban__column-title"></h2>
            <div class="kanban__column-tickets"></div>
            <button class="kanban__button">+ Add Item</button>
        </div> 
    `).children[0];
  }

  renderTickets(tickets) {
    const ticket = new Ticket(tickets.id, tickets.content);

    this.elements.tickets.appendChild(ticket.elements.root);
  }
}

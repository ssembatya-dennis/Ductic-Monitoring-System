export default class KanbanAPI {
  static getTickets(columnId) {
    const column = read().find((column) => column.id == columnId);
    if (!column) {
      return [];
    }
    return column.tickets;
  }

  static insertTicket(columnId, content) {
    const data = read();
    const column = data.find((column) => column.id == columnId);
    const ticket = {
      id: Math.floor(Math.random() * 100000),
      content,
    };

    if (!column) {
      throw new Error("Column not found");
    }

    column.tickets.push(ticket);
    save(data);

    return ticket;
  }

  static updateTicket(ticketId, newProps) {
    const data = read();

    const [ticket, currentColumn] = (() => {
      for (const column of data) {
        const ticket = column.tickets.find((ticket) => ticket.id == ticketId);

        if (ticket) {
          return [ticket, column];
        }
      }
    })();

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.content = newProps.content ?? ticket.content;

    // console.log(currentColumn, ticket);

    // move ticket to another column
    if (newProps.columnId !== undefined && newProps.position !== undefined) {
      const targetColumn = data.find(
        (column) => column.id == newProps.columnId
      );

      if (!targetColumn) {
        throw new Error("Target column not found");
      }

      // remove ticket from original column
      currentColumn.tickets.splice(currentColumn.tickets.indexOf(ticket), 1);

      // insert ticket into target column at specified position
      targetColumn.tickets.splice(newProps.position, 0, ticket);
    }

    save(data);
  }

  static deleteTicket(ticketId) {
    const data = read();
    for (const column of data) {
      const ticket = column.tickets.find((ticket) => ticket.id == ticketId);

      if (ticket) {
        column.tickets.splice(column.tickets.indexOf(ticket), 1);
      }
    }

    save(data);
  }
}

function read() {
  const json = localStorage.getItem("kanban-data");

  if (!json) {
    return [
      {
        id: 1,
        tickets: [],
      },
      {
        id: 1,
        tickets: [],
      },
      {
        id: 1,
        tickets: [],
      },
    ];
  }

  return JSON.parse(json);
}

function save(data) {
  localStorage.setItem("kanban-data", JSON.stringify(data));
}

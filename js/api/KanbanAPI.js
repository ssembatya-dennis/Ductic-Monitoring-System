export default class KanbanAPI {}

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

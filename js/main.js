import KanbanController from "./controller/KanbanController.js";
import KanbanView from "./view/KanbanView.js";

const KanbanUI = new KanbanView();
const kanbanManager = new KanbanController(KanbanUI);

kanbanManager.init();

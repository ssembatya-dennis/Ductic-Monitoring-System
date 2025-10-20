# Project Plan

## Problem Statement

The "Pixel & Quill" agency needs a digital tool for assigning tasks, tracking progress and saving these tasks on completion for a longer period of time like over 2 years that's accessible by the entire team anywhere as referenced here in their email.

> No Visibility: I have no clear, at-a-glance overview of who is working on what. Tasks are getting forgotten or duplicated.
> Remote Work is Impossible: One of our best designers now works remotely two days a week, and she's completely disconnected from the board. It's causing delays.
> It's Fragile: The sticky notes fall off, the handwriting can be illegible, and there's no way to track details about a task without cramming tiny text onto a small piece of paper.

## Proposed Solution

- Using social channels (e.g. WhatsApp group, Slack channel)

This solution is easy to use and to adapt to very quickly however it's really hard to record progress on tasks. Writing clear details on an ongoing task is also not very advisable and with increase in scale, information gets really bulky to quickly have a clear glance overview of who is working on what.

- Digital Kanban Software (most suitable solution)

### Cons (❌)

- Setup Time: Requires an initial investment in time to set up the board, columns, user accounts
- Less Immediate: The instant, highly visible nature of the large wall-mounted whiteboard is lost; team members have to actively check the digital board.

### Pros (✅)

- Real-Time Access: Tasks are accessible anywhere, supporting remote work and providing instant status updates
- Detailed Task Information: Each "sticky note" (ticket) can hold attachments, comments, checklists, due dates, and activity history—details impossible on a physical note.
- Familiar Visual Layout: The drag-and-drop card interface is a direct digital translation of sticky notes, making the transition intuitive for your team.

## Digital Kanban Software (Ductic Web Application).

## Must haves

- A board with both the navigation panel and content section area should be rendered after a loading screen is displayed all without first authenticating user Login credentials.

- A navigation panel, that routes to different sections of the dashboard e.g (Home, Tasks, Inbox)

- the Tasks sub-route should be divided into three column (i.e "Tasks for Today", "In Progress", "Successfully Accomplished")

- A task ticket modal card on the board to write/add a task instantly but also can as well be triggered on mouse click to open a form fill in more information about the task ticket like the description, due-date and more important details about the task

- A task ticket can be saved after being declared

- A task ticket can be dragged from one column and dropped in another column

- The contents of the task in the ticket can be edited.

- A user should be able to delete an already assigned ticket.

- Task tickets should be displayed in the order of creation where the last ticket to be created should appear first, and the first ones appear last at the bottom unless the user manually alters the arrangement and moves a ticket to a different position.

> NB: A task ticket is equivalent to a sticky note that was used before on the white board to write and attach a task on the white board.

## Good to haves

- A user must be able to change the color of the ticket to imitate the "sticky notes" nature

- A ticket should be able to disappear on the board when ticked done/complete

- A visual animation should be rendered on the entire screen upon successfully completing all tickets assigned in the day to give a user the sense of accomplishment.

## The Core Features (MVP)

Since I've decided to build this Kanban board in **vanilla JavaScript**, I am primarily going to first focus on the very basic functionality of the board and later lone after ensuring that everything works fine as expected, I can then re-visit back this project and add advanced functionality like changing themes, adding user Authentication with Firebase, integrating with external API's and much more.

For now, the user will be able to;

- Write/add a task in the task ticket card

- Save a task after declaring it or after its completed.

- Move the task ticket card in different columns of board (i.e "TO DO", "In Progress", "Completed")

- Edit the contents of an already declared task ticket card.

## Development Process Plan

- Start developing the Tasks Page which actually contains most of the Kanban board functionality.

- For the HTML structure, create a Kanban container, inside this container add a "Kanban_column" container, in the "Kanban_column" container, add a "title", a "Kanban_ticket" container and the "add ticket" button. In the "Kanban_ticket" container, create a "Kanban_ticket-input" container and give it an attribute `contenteditable` to allow the user to actually edit or use this element to enter a task in the task ticket card and a "Kanban_dropzone" container which is actually that area that gets highlighted when the user is dropping a ticket around the card ticket.

- HTML Structure.

```html
<div class="kanban">
  <div class="kanban__column">
    <h2 class="kanban__column-title">Not Started</h2>
    <div class="kanban__tickets">
      <div contenteditable="" class="kanban__ticket-input">Wash the dishes</div>
      <div class="kanban__dropzone"></div>
    </div>
    <button class="kanban__button">+ Add Item</button>
  </div>
</div>
```

### Data structures

- Use micro-storage to persist data on the Kanban Board.

- For data storage, a JSON data array that contains three objects, One for each column **(i.e. "TO-DO", "In-progress", and "Completed")** respectively.

- Each column has its own id **`id: 0`**, and also a tickets array **`tickets: []`**.

- Inside the **tickets array** is an object with two items, the ticket id **`id: 42237`**, and the content string, **`content: ""`**

- column data example

```js
[
  {
    id: 0,
    tickets: [],
  },

  {
    id: 1,
    tickets: [],
  },

  {
    id: 3,
    tickets: [],
  },
];
```

- tickets data example

```js
{
  tickets: [
    {
      id: 72714,
      content: "Wash the dishes 💦",
    },
  ];
}
```

### API & Local Storage Access

- Create an api folder under the js directory and create the `KanbanAPI.js` file

- The API file is going to contain all the code for the local storage components

- Create a class, **`class KanbanAPI {}`** and this class is going to contain a bunch of static methods to interact with the local storage

- Define some basic functions outside the "KanbanAPI" class in the same file to actually interact directly with the local storage. These basic functions are `function read() {}` and `function save (data) {}` functions

- The class, **`class KanbanAPI {}`** actually consists of a few static methods e.g. `getTicket() {}`, `insertTicket() {}`, `deleteTicket() {}` and `updateTicket() {}` as shown in the example below.

```js
export default class KanbanAPI {
  static getTicket(columnId) {
    // get ticket logic
  }

  static insertTicket(columnId, content) {
    // insert ticket logic
  }

  static updateTicket(ticketId, newProps) {
    // update ticket logic
  }

  static deleteTicket(columnId) {
    // delete ticket logic
  }
}
```

> NB: On this layer we just handle basic API interaction such read, update and delete functionality.

### User Interface / The View layer

- Create another folder, view under the js folder still and then create the `Kanban.js` file

- Inside this file, create the class **`class Kanban {}`** and this class is going to define the entry points for user Interface code.

- The `class Kanban {}` class's constructor is going to take in a root element as a parameter which actually point's to the "Kanban container" root in the HTML where the entire board's structure is stored.

> NB: Remember how I told at the start of this development process that the entire HTML structure is going to be generated by JavaScript. Now this is the layer responsible for that.

- Add static methods to the `class Kanban {}` class to build a dynamic board structure and include methods such as the `columns() {}` method which returns an array of every single column and its name/title.

- Inside the view directory, create a `Column.js` file with the `class Column {}` class which represents the structure of each single _column_, this class uses static methods like `createColumn() {}` that simply generate the HTML for the column just like we saw before in the HTML file using JavaScript

- After creating the columns successfully, now inside the view layer, we now start interacting with the API layer to get data that we're actually going to populate in this individual columns.

- So again in the View layer, we add another file `Ticket.js` and create the `class Ticket {}` class that defines the structure of the ticket just the way we did with the column. This approach is very important to create stand-alone re-usable components, separate concerns and as well as simply logic blocks for every individual component.

- Using the available API methods like update, delete e.t.c, we add functionality to the `class Ticket {}` class to allow the user edit contents of an already created ticket card or delete entirely and existing ticket card entirely.

### DRAG and DROP

- Alright the first step to ensure that the **drag and drop** is working perfectly fine as expected is going in the `class Ticket {}` class and add a new event listener which is the "dragstart" event which is basically one way we can communicate between two elements that are being dragged and dropped as specified in _"drag and drop"_ API.

- Create a new file `DropZone.js file` and then add a new class `class DropZone {}` which is actually responsible to ensure our drag and drop is working as expected.

- In this class they're methods like `createDropZone() {}` which is responsible for creating the HTML structure of the "dropzone" node container that I did actually show you before in our HTML structure.

- Then we finally add all the logic required to implement the drag and drop in this file, and we check to confirm that every thing looks good then publish our very first (MVP) for this project.

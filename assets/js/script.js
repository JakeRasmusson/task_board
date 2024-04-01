// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let cardColumns = document.querySelectorAll(".card-lane");
let nextId = JSON.parse(localStorage.getItem("nextId"));
let addTaskForm = document.getElementById("inputForm");

// Todo: create a function to generate a unique task id
function generateTaskId() {
    //Give each card a random ID
  return Math.random();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  //Create card div
  const div = document.createElement("div");
  const now = dayjs();
  const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY')
   //Set div id to the objects id
   div.id = task.id;
   //Add class elements
   div.classList.add("card", "draggable");
  //Set default late var
  let late = "Due in future";
  //Check due date and add class accordingly
  if (now.isSame(dueDate, 'day') && task.laneID !== 'done-cards') {
    div.classList.add("due-soon");
    late = "Due soon";
  } else if (now.isAfter(dueDate, 'day') && task.laneID !== 'done-cards') {
    div.classList.add("over-due");
    late = "Past due";
  }
  //If laneid done-cards set late var and keep white regardless of due date
  if (task.laneID == 'done-cards') {
  late = 'Done'
  }
 
  //set card html
  div.innerHTML = `
    <div class='card-content'>
    <h2 class='card-head'> ${task.title} </h2>
    <h3>${late}</h3>
    <h3 class='card-due'>${task.dueDate}</h3>
    <p class='card-p'> ${task.text} </p>
    <button type='button' class='delete-task'>Delete</button>
    </div>`;
  return div;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    cardColumns.forEach(column => 
    column.innerHTML = '' )
    taskList.forEach(task => {
        // task.daysTillDue = handleDate(task.dueDate)
        const cardelement = createTaskCard(task)
        const lane = document.getElementById(task.laneID)
        lane?.append(cardelement)
    });
    saveTasksToStorage()
    // localStorage.setItem('tasks', JSON.stringify(taskList))
    $('.draggable').draggable({
        zIndex: 1
    });


}

// Todo: create a function to handle adding a new task
function handleAddTask(e){
    e.preventDefault()
    const title = $('#taskTitle').val()
    const dueDate = $('#dueDate').val()
    const taskDesc = $('#taskDesc').val()
    if (title === '' || dueDate === '' || taskDesc === '') {
        alert('Please fill out all fields!')
        return
    }
    taskList.push(
        {
            title: title,
            text: taskDesc,
            dueDate: dueDate,
            id : generateTaskId(),
            laneID: 'todo-cards'}
    )
    //Reset form fields
    addTaskForm.reset()
    //Renders all cards
    renderTaskList()
        }
    //Helper function to save tasks to local storage
function saveTasksToStorage(){
  localStorage.setItem('tasks', JSON.stringify(taskList))
}
// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const target = event.target
    if (target.className == 'delete-task') {
        parent = target.parentNode
        grandParent = parent.parentNode
        id = grandParent.id
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].id == id) {
                taskList.splice(i, 1)
            }
        }
        saveTasksToStorage()
        grandParent.remove(parent)
    } 
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    //Takes the event and ui from a drop event and moves the card to the correct row
  const cardEL = ui.draggable[0];
  const cardid = cardEL.id;
  const nextCol = event.target.id;
  const data = taskList.find(({ id }) => id === parseFloat(cardid));
  data.laneID = nextCol;
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  if (taskList === null) {
  } else {
    renderTaskList();
  }
  //event delegation for deleting task cards
  $(".card-lane").on("click", handleDeleteTask);
  //event listener for form submission
  $("#inputForm").on("submit", handleAddTask);
  //Datepicker for form
  $("#dueDate").datepicker({
    format: "yyyy-mm-dd",
  });
  //Droppable listener for drag and drop function
  $(".card-lane").droppable({
    accept: ".draggable",
    drop: function (event, ui) {
      handleDrop(event, ui);
    },
  });
});

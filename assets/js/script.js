// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let cardColumns = document.querySelectorAll(".card-lane");
let nextId = JSON.parse(localStorage.getItem("nextId"));
let addTaskForm = document.getElementById("inputForm");

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return Math.random();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  //Create card div
  const div = document.createElement("div");
  //Set default late var
  let late = "Due in future";
  //Check due date and add class accordingly
  if (task.daysTillDue < 3 && task.daysTillDue > 0 && task.laneID !== 'done-cards') {
    div.classList.add("due-soon");
    late = "Due soon";
  } else if (task.daysTillDue <= 0 && task.laneID !== 'done-cards') {
    div.classList.add("over-due");
    late = "Past due";
  }
  //If laneid done-cards set late var and keep white regardless of due date
  if (task.laneID == 'done-cards') {
  late = 'Done'
  }
  //Set div id to the objects id
  div.id = task.id;
  //Add class elements
  div.classList.add("card", "draggable");
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
        task.daysTillDue = handleDate(task.dueDate)
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
    // const daysTillDue = handleDate()
    taskList.push(
        {
            title: title,
            text: taskDesc,
            dueDate: dueDate,
            daysTillDue: 0,
            id : generateTaskId(),
            laneID: 'todo-cards'}
    )
    addTaskForm.reset()
    renderTaskList()
    // console.log(title, dueDate, taskDesc)

        }
function handleDate(inputDate){
    const dueDate = new Date(inputDate)
    const date = new Date();
    const dateMath = dueDate - date
    const daysTillDue = Math.ceil(dateMath / (1000 * 60 * 60 * 24));
    return daysTillDue
}

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
        // localStorage.setItem('tasks', JSON.stringify(taskList))
        grandParent.remove(parent)
    } 
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  console.log(ui);
  const cardEL = ui.draggable[0];
  const cardid = cardEL.id;
  console.log(event);
  const nextCol = event.target.id;
  console.log(nextCol);
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
  $(".card-lane").on("click", handleDeleteTask);
  $("#inputForm").on("submit", handleAddTask);
  $("#dueDate").datepicker({
    format: "yyyy-mm-dd",
  });
  $(".card-lane").droppable({
    accept: ".draggable",
    drop: function (event, ui) {
      handleDrop(event, ui);
    },
  });
});

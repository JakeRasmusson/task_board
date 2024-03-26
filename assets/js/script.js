

const starterTask = [
    {
    title: 'Title 1',
    text: 'test 1',
    dueDate: '06/25/24',
    id : generateTaskId(),
    laneID: 'todo-cards'} ,

    {
    title: 'Title 2',
    text: 'test 2',
    dueDate: '01/11/24',
    id : generateTaskId(),
    laneID: 'in-progress-cards'} ,

    {
    title: 'Title 3',
    text: 'test 3',
    dueDate: '12/24/25',
    id : generateTaskId(),
    laneID: 'done-cards'},
]




// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || starterTask;
let cardColumns = document.querySelectorAll('.card-lane');
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return Math.random()
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const div = document.createElement('div');
    div.id = task.id
    div.classList.add('card', 'draggable')
    div.innerHTML = `
        <div class='card-content'>
        <h2 class='card-head'> ${task.title} </h2>
        <h3 class='card-due'>${task.dueDate}</h3>
        <p class='card-p'> ${task.text} </p>
        <button type='button' class='delete-task'>Delete</button>
        </div>`

    // const div2 = $(`<div>`,{
    //     id: task.id,
    //     class: 'card draggable card-content'
    // }).html(`<p class='card-p'> ${task.text} </p>`)
    // console.log(div2)
    return div


}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    cardColumns.forEach(column => 
    column.innerHTML = '' )
    taskList.forEach(task => {
        const cardelement = createTaskCard(task)
        const lane = document.getElementById(task.laneID)
        // const lane = $('task.laneID')
        lane?.append(cardelement)
    });
    $('.draggable').draggable({
        zIndex: 1
    });


}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    console.log('success')
    }


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const target = event.target
    if (target.className == 'delete-task') {
        parent = target.parentNode
        grandParent = parent.parentNode
        id = grandParent.id
        taskList.forEach(task => {
            if (task.id == id) {
                console.log(task.id)
                taskList.pop(task)
                console.log(id)
                console.log(taskList)
            }
        })
        grandParent.remove(parent)
    } 
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const cardEL = ui.draggable[0]
    console.log(cardEL)
    const cardid = cardEL.id
    const nextCol = event.target.id
    console.log(nextCol)
    const data = taskList.find(({id}) => id === parseFloat(cardid))
    data.laneID = nextCol
    console.log(event)
    renderTaskList()
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList()
    $('#btn1').on('click', handleAddTask)

    $('.card-lane').on('click', handleDeleteTask)

    $('.card-lane').droppable({
        accept: '.draggable',
        drop : function(event, ui) {
            handleDrop(event, ui)

        }
    })

});

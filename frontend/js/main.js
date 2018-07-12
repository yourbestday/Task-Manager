function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function parseJson(response) {
  return response.json(); // Далее будем использовать только JSON из тела ответа
}

function error(error) {
  console.log('Request failed', error);
}

function updateDashboard () {
  fetch('http://localhost:3000/projects', {
    method: 'GET'
  })
  .then(parseJson)
  .then(function (projects) {
    var ul = document.getElementById("list");
    ul.innerHTML = '';
    var result = '';
    for (var i=0; i<projects.length; i++) {
      result += '<input type="checkbox" id="checkbox_'+ i +'"><li>';
      //projects[i].id = generateId();
      //var id = 'project'+i;
      result += '<div class="project"><label for="checkbox_'+ i +'">';
      var progressValue;
      //if project have task,then add checkbox for view task and set status of project
      if (projects[i].tasks.length != 0){
        result += '<span class="open">▼</span><span class="close">▲</span></label>';
        progressValue  = ProgressBar(projects[i].tasks);
      } else {
        result += '</label>';
        progressValue = '0%';
      }

      result += '<div class="progress"><div id="progress"><div id="bar" style="width:'+ progressValue +'"><div class="barText">'+ progressValue +'</div></div></div></div>';
      result += '<div class="nameProject">'+ projects[i].name +'</div>';
      result += '<div class="titlePriority"><div class="priorityProject"></div></div>';
      result += '<div class="deadlineProject">'+ projects[i].dueto +'</div><div class="createSubtask"><a href="#" class="tip" data-id="'+ projects[i]._id +'">+<span>Create Subtask</span></a></div></div></li>';
      result += CreateTask (projects[i]._id);
      if (projects[i].tasks.length !=0){
        result +='<ul class="ListSubTask">';
        var tasks = projects[i].tasks;
        for (var j=0; j<tasks.length; j++) {
          result += CreateTask (tasks[j]);
        }
        result +='</ul>';
      }
    }
    ul.innerHTML = result;
  });
  //console.log(result);

};
updateDashboard ();

function createProject () {
  var name = document.getElementById("CreateNameProject").value;
  var dueto = '2018-08-08';
  var tasks = [];
  fetch('http://localhost:3000/projects', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {'name': name,'dueto': dueto,'tasks': tasks})
  })
  .then(parseJson)
  .then(function (projects) {});
}
document.getElementById("createProject").addEventListener('click', function(event) {
  createProject();
  updateDashboard ();
});

function getCountComplited (tasks) {
  var count = 0;
  for( var i=0; i<tasks.length; i++){
    if (tasks[i].status === 'completed'){
      count++;
    }
  }
  return count;
}
function ProgressBar (tasks) {
  var value = Math.round(getCountComplited (tasks)/tasks.length *100);
  //var bar = document.getElementById("bar");
  return value +'%';
}
//----------------------------------------------------------------------
document.getElementById("list").addEventListener('click', function(event) {

  // console.log(parent);
  var parent = event.target.parentElement;
  parent = parent.parentElement;
  var id = parent.getAttribute('data-id');
  if (event.target.tagName == 'A') {
    //get id from custom button and show form for New Task by id
    var id = event.target.getAttribute('data-id');
    var divs = document.querySelectorAll('.new');
    for (var i=0; i<divs.length; i++){
      if (divs[i].getAttribute('data-id') == id ) {
        divs[i].removeAttribute('style');
      }
    }
  }
  //get data from form check for Validate and set to projects
  if (event.target.tagName == 'BUTTON') {
    if (event.target.name == 'createButton') {
      var newTask = {};

      newTask.name = document.querySelector('#newTaskInput').value;
      var selectPriority= document.querySelector('#priority');
      newTask.priority = selectPriority.options[selectPriority.selectedIndex].value;
      var selectAssign = document.querySelector('#assignChoose');
      newTask.assignto = selectAssign.options[selectAssign.selectedIndex].value;
      newTask.dueto = document.querySelector('#dateInput').value;
      //setTask(id,newTask);
      fetch('http://localhost:3000/project/tasks/'+id, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( {'tasks': newTask} )
      })
      .then(checkStatus)
      .then(parseJson)
      // .then(function(data) {
      //   getTodo();
      // })
      .catch(error);
    }
    if (event.target.name == 'cancelButton') {
      parent.setAttribute('style','display:none');
    }
  }
  //console.log(event.target.tagName);
});


function CreateTask (tasks) {
  var result = '';
  var status;
  var name;
  var priority;
  var assign;
  var dueto;
  var assignName;
  var buttons='';
  var statusForm = '';
  if ( typeof(tasks) != "string") {
    status = tasks.status;
    name = tasks.name;
    priority = '<div class="priorityProject '+ tasks.priority +'">'+ tasks.priority +'</div>';
    dueto = tasks.dueto;
    assignName = tasks.assignto;
    assign = assignName.name ? assignName.name : '';
    //assign += '<div class="photoProfile small"></div>';
  } else {
    status = 'new';
    statusForm = 'style="display:none;" data-id="'+tasks+'"';
    name = '<input type="text" placeholder="Task Name" class="newTaskInput" name="newTaskInput" id="newTaskInput">';
    priority = '<select size="1" name="priority" id="priority"><option value="low" class="low">low</option><option selected value="normal" class="normal">normal</option><option value="high" class="high">high</option></select>';
    assign = '<div class="priorityProject"><select size="1" name="assignto" id="assignChoose"><option value="1">Svitlana</option><option value="2">Den</option></select></div>';
    dueto = '<input type="date" id="dateInput"';
    buttons ='<div class="buttons"><button name="createButton">Create</button><button name="cancelButton">Cancel</button></div>';
  }

  result += '<li><div class="task '+ status +'"'+ statusForm +'><div class="taskStatus '+status+'Icon"><a href="#" class="tip"><span>'+status+'</span></a></div>';
  result += '<div class="nameTask">'+name+'</div>';
  result += '<div class="titlePriority">'+priority+'</div>';
  result += '<div class="assignName">'+ assign +'</div>';
  result += '<div class="deadlineProject">'+ dueto +'</div></div>'+ buttons +'</li>';

  return result;
}
//---------------------------------------------
function setTask(id,newTask) {
  // for (var i=0; i<projects.length; i++){
  //   if (projects[i].id === id){
  //     var project = projects[i];
  //     project.tasks.push(newTask);
  //     break;
  //   }
  // }
  var i = parceInt(id);
  var project = projects[i];
  project.tasks.push(newTask);
}
//----------------------------------------------
function generateId() {
  return ''+Math.floor(Math.random() * (1000 + 1));
}

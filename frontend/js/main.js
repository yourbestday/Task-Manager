window.addEventListener("load", updateDashboard, false);


var priorityArray = ['priority','low','normal','high'];
var statusArray = ['status','open','inProgress','completed'];
var assigntoArray = ['assignto','Svitlana','Den','Alex'];
//var prioritySelect = createSelect ('select ',priorityArray,'normal');
// var statusSelect = createSelect ('taskStatus icon',statusArray,'open');
// var assigntoSelect = createSelect ('priorityProject',assigntoArray,'Svitlana');


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
      //result += '<input type="checkbox" id="checkbox_'+ i +'"><li>';
      result += '<li>';
      //projects[i].id = generateId();
      //var id = 'project'+i;
      result += '<div class="project" data-id="' +projects[i]._id + '"><label for="checkbox_'+ i +'">';
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
      // result += '<div class="deadlineProject">'+ projects[i].dueto +'</div><div class="createSubtask"><a href="#" class="tip" data-id="'+ projects[i]._id +'">+<span>Create Subtask</span></a></div></div></li>';
      result += '<div class="deadlineProject">'+ '' +'</div><div class="createSubtask"><a href="#" class="tip" data-id="'+ projects[i]._id +'">+<span>Create Subtask</span></a></div></div></li>';
      result += CreateTask (projects[i]._id);
      if (projects[i].tasks.length !=0){
        result +='<ul class="ListSubTask">';
        result += '<input type="checkbox" id="checkbox_'+ i +'">';
        var tasks = projects[i].tasks;
        for (var j=0; j<tasks.length; j++) {
          result += CreateTask (projects[i]._id,tasks[j]);
        }
        result +='</ul>';
      }
    }
    ul.innerHTML = result;
    //console.log(result);
    var list  = document.getElementsByClassName("titlePriority");
    for(let i = 0; i< list.length; i++){
      // list[i].addEventListener('click', function(){
      //   console.log('test', i);
      // });
      list[i].addEventListener('change', function(){
        //console.log('change test', i,'list=',list[i]);
        var elem = list[i].firstChild;
        //elem = elem.firstChild;
        var priority = elem.options[elem.selectedIndex].value;
        elem.setAttribute('class',priority);
        //console.log('value',priority);
      });
    }
      var list  = document.getElementsByClassName("taskStatus");
      for(let i = 0; i< list.length; i++){
        // console.log('taskStatus', list[i]);
        // list[i].addEventListener('click', function(){
        //   console.log('test', i);
        // });
        list[i].addEventListener('change', function(){
          console.log('change test', i,'list=',list[i]);
          //var elem = list[i].firstChild;

          elem = list[i];
          var select = elem.firstChild;
          var className = select.options[select.selectedIndex].value;
          elem.setAttribute('class','taskStatus icon'+className);
          var parent = elem.parentElement;
          parent.setAttribute('class','task '+className);
          console.log('value',className);
        });
      }

  });

};


function createProject () {
  var name = document.getElementById("CreateNameProject").value;
  var dueto = new Date();
  //dueto.
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
        break;
      }
    }
  }
  //get data from form and set to projects
  if (event.target.tagName == 'INPUT') {
    var newTask = {};
    if (event.target.name == 'createButton') {
      // var parent = event.target.parentElement;
      // var id = parent.getAttribute('data-id');
      // var id = event.target.getAttribute('data-id');
      var divs = document.querySelectorAll('.new');
      for (var i=0; i<divs.length; i++){
        if (divs[i].getAttribute('data-id') == id ) {
          //var div = div[i];
          newTask.name = divs[i].querySelector('#newTaskInput').value;
          var selectAssign = divs[i].querySelector('#assignChoose');
          //newTask.assignto = {};
          //newTask.assignto.name = selectAssign.options[selectAssign.selectedIndex].value;
          //newTask.assignto.email = "bjbj@gmail.com";
          let obj = {'name': selectAssign.options[selectAssign.selectedIndex].value, 'email': "new@gmail.com"};
	        newTask.assignto = obj;
          newTask.dueto = divs[i].querySelector('#dateInput').value;
          if (newTask.dueto === '' || typeof newTask.dueto === undefined) {
            newTask.dueto = new Date();
          }
          var selectPriority= divs[i].querySelector('#priority');
          newTask.priority = selectPriority.options[selectPriority.selectedIndex].value;
          newTask.status = "open";
          break;
        }
      }

      fetch('http://localhost:3000/projects/tasks/'+id, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( newTask )
      })
      .then(checkStatus)
      .then(parseJson)
      .catch(error);
      updateDashboard ();
    }
    if (event.target.name == 'cancelButton') {
      parent.setAttribute('style','display:none');
    }
  }
  //console.log(event.target.tagName);
});

// document.getElementById("list").addEventListener('dblclick', function(event) {
//   if (event.target.tagName == 'DIV') {
//     var listInput = event.target.getElementsByTagName("input");
//     console.log('inputlist=',listInput);
//   //  var child = event.targer.firstChild;
//   //  removeDisabled(id)
//   }
// });


function CreateTask (id,tasks) {
  var result = '';
  var status;
  var name='';
  var priority;
  var assign='';
  var dueto;
  var assignName;
  var buttons='';
  var statusForm = '';
  var disabled = '';
  if ( typeof(tasks) == "object") {
    status = tasks.status;
    name = tasks.name;
    statusForm = 'data-id="'+id+'"';
    priority = tasks.priority;
    dueto = tasks.dueto;
    assignName = tasks.assignto;
    assign = assignName.name ? assignName.name : '';
    disabled ='disabled="disabled"';
  } else {
    status = 'new';
    statusForm = 'style="display:none;" data-id="'+id+'"';
    priority  = '';
    dueto = new Date();
    buttons ='<div class="buttons"><input type="button" name="createButton" value="+"><input type="button" name="cancelButton" value="x"></div>';
  }

  //result += '<li><div class="task '+ status +'"'+ statusForm +'><div class="taskStatus '+status+'Icon"><a href="#" class="tip"><span>'+status+'</span></a></div>';
  result += '<li><div class="task '+ status +'"'+ statusForm +'>'+ createSelect ('taskStatus icon',statusArray,status);
  result += '<div class="nameTask"><input type="text" placeholder="Task Name" class="newTaskInput" name="newTaskInput" id="newTaskInput" value="'+name+'"'+disabled+'></div>';
  result += '<div class="titlePriority">'+ createSelect ('select ',priorityArray,priority)  +'</div>';
  result += '<div class="assignName">'+createSelect ('priorityProject ',assigntoArray,assign)+'</div>';
  result += '<div class="deadlineProject"><input type="date" id="dateInput" value="'+ dateToString(dueto) +'"'+disabled+'></div>'+ buttons +'</li>';

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
  // var i = parceInt(id);
  // var project = projects[i];
  // project.tasks.push(newTask);
}
//----------------------------------------------
// function generateId() {
//   return ''+Math.floor(Math.random() * (1000 + 1));
// }

function dateToString (date) {
  if (typeof date === 'string'){
    date = new Date(date);
  }
  return date.getFullYear() +'-'+ addZero(date.getMonth()) +'-'+ addZero(date.getDate());

}
function addZero (date) {
  if (date < 10) {
    return date = '0' + date;
  }
  return date;
}


function createSelect (className,array,selectedName) {
  var result='';
  var classOption ='';
  var disabled ='';

  if (selectedName == 'new') {
    disabled ='disabled="disabled"';
  }
  if (selectedName == '') {
    selectedName = array[1];
  } else {
    disabled ='disabled="disabled"';
  }

  result += '<div class="'+ className + selectedName +'">';
  result += '<select size="1" name="'+ array[0] +'" class="'+selectedName+'"'+disabled+'>';
  for (var i=1; i< array.length; i++) {
    if (array[0] == 'priority') {
      classOption = '" class="'+ array[i];
    }
    var selected = (array[i] == selectedName) ? ' selected' : '';
    result += '<option value="'+ array[i] + classOption +'"'+ selected+'>'+ array[i] +'</option>';
  }
  result += '</select></div>';
  return result;

  //<div class="taskStatus icon'+ status +'"><select size="1" name="status"><option value="open">open</option><option value="inProgress">inProgress</option><option value="completed">completed</option></select></div>
  //<div class="select '+ priority +'"><select size="1" name="priority"><option value="low" class="low">low</option><option value="normal" class="normal">normal</option><option value="high" class="high">high</option></select></div>
  //<div class="priorityProject"><select size="1" name="assignto"><option value="Svitlana">Svitlana</option><option value="Den">Den</option></select></div>
}

// document.querySelectorAll("name="priority"").addEventListener("click", function() {
//     var options = activities.querySelectorAll("option");
//     var count = options.length;
//     if(typeof(count) === "undefined" || count < 2)
//     {
//         addActivityItem();
//     }
// });
// //
// document.addEventListener('DOMContentLoaded',function() {
//     document.querySelector('select[name="priority"]').onchange=function() {
//   //if (event.target.tagName == 'SELECT') {
//     //var parent = event.target.parentElement;
//     //if (event.target.name == 'priority') {
//       priority = event.target.options[event.target.selectedIndex].value;
//       var className = event.target.setAttribute('class',priority);
//     //}
//     //document.querySelectorAll('select').addEventListener("change",
//     // className = className.split('+')[0];
//     // //parent = parent.parentElement;
//     // //var id = parent.getAttribute('data-id');
//     // parent.setAttribute("class",className + ' ' + priority);
//   }
//   },false);



function setSelected(divString,value) {
  //var parent = div.parentElement;
  //var className = div.getAttribute("class");

  //convert String to DOM object
  var e = document.createElement('div');
  e.setAttribute('class', className + ' ' + value);
  e.innerHTML = divString;
  document.body.appendChild(e);
  var div = e.lastChild.childNodes; // the HTML converted into a DOM element :), now let remove the
  document.body.removeChild(e);


  console.log('div.class:',div.class);
  className = className.split(' ')[0];
  parent.setAttribute("class",className + ' ' + value);
  var search = 'value="'+value+'"';
  var element = div.querySelector(search);
  element.setAttribute('selected');

  return
}
function removeSelected(div,value) {
  var element = div.querySelector('value="'+value+'"');
  element.removeAttribute('selected');
}

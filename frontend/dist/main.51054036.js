// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/main.js":[function(require,module,exports) {
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

function updateDashboard() {
  fetch('http://localhost:3000/projects', {
    method: 'GET'
  }).then(parseJson).then(function (projects) {
    var ul = document.getElementById("list");
    ul.innerHTML = '';
    var result = '';
    for (var i = 0; i < projects.length; i++) {
      result += '<input type="checkbox" id="checkbox_' + i + '"><li>';
      //projects[i].id = generateId();
      //var id = 'project'+i;
      result += '<div class="project"><label for="checkbox_' + i + '">';
      var progressValue;
      //if project have task,then add checkbox for view task and set status of project
      if (projects[i].tasks.length != 0) {
        result += '<span class="open">▼</span><span class="close">▲</span></label>';
        progressValue = ProgressBar(projects[i].tasks);
      } else {
        result += '</label>';
        progressValue = '0%';
      }

      result += '<div class="progress"><div id="progress"><div id="bar" style="width:' + progressValue + '"><div class="barText">' + progressValue + '</div></div></div></div>';
      result += '<div class="nameProject">' + projects[i].name + '</div>';
      result += '<div class="titlePriority"><div class="priorityProject"></div></div>';
      result += '<div class="deadlineProject">' + projects[i].dueto + '</div><div class="createSubtask"><a href="#" class="tip" data-id="' + projects[i]._id + '">+<span>Create Subtask</span></a></div></div></li>';
      result += CreateTask(projects[i]._id);
      if (projects[i].tasks.length != 0) {
        result += '<ul class="ListSubTask">';
        var tasks = projects[i].tasks;
        for (var j = 0; j < tasks.length; j++) {
          result += CreateTask(tasks[j]);
        }
        result += '</ul>';
      }
    }
    ul.innerHTML = result;
  });
  //console.log(result);
};
updateDashboard();

function createProject() {
  var name = document.getElementById("CreateNameProject").value;
  var dueto = '2018-08-08';
  var tasks = [];
  fetch('http://localhost:3000/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'name': name, 'dueto': dueto, 'tasks': tasks })
  }).then(parseJson).then(function (projects) {});
}
document.getElementById("createProject").addEventListener('click', function (event) {
  createProject();
  updateDashboard();
});

function getCountComplited(tasks) {
  var count = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].status === 'completed') {
      count++;
    }
  }
  return count;
}
function ProgressBar(tasks) {
  var value = Math.round(getCountComplited(tasks) / tasks.length * 100);
  //var bar = document.getElementById("bar");
  return value + '%';
}
//----------------------------------------------------------------------
document.getElementById("list").addEventListener('click', function (event) {

  // console.log(parent);
  var parent = event.target.parentElement;
  parent = parent.parentElement;
  var id = parent.getAttribute('data-id');
  if (event.target.tagName == 'A') {
    //get id from custom button and show form for New Task by id
    var id = event.target.getAttribute('data-id');
    var divs = document.querySelectorAll('.new');
    for (var i = 0; i < divs.length; i++) {
      if (divs[i].getAttribute('data-id') == id) {
        divs[i].removeAttribute('style');
      }
    }
  }
  //get data from form check for Validate and set to projects
  if (event.target.tagName == 'BUTTON') {
    if (event.target.name == 'createButton') {
      var newTask = {};

      newTask.name = document.querySelector('#newTaskInput').value;
      var selectPriority = document.querySelector('#priority');
      newTask.priority = selectPriority.options[selectPriority.selectedIndex].value;
      var selectAssign = document.querySelector('#assignChoose');
      newTask.assignto = selectAssign.options[selectAssign.selectedIndex].value;
      newTask.dueto = document.querySelector('#dateInput').value;
      //setTask(id,newTask);
      fetch('http://localhost:3000/project/tasks/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'tasks': newTask })
      }).then(checkStatus).then(parseJson)
      // .then(function(data) {
      //   getTodo();
      // })
      .catch(error);
    }
    if (event.target.name == 'cancelButton') {
      parent.setAttribute('style', 'display:none');
    }
  }
  //console.log(event.target.tagName);
});

function CreateTask(tasks) {
  var result = '';
  var status;
  var name;
  var priority;
  var assign;
  var dueto;
  var assignName;
  var buttons = '';
  var statusForm = '';
  if (typeof tasks != "string") {
    status = tasks.status;
    name = tasks.name;
    priority = '<div class="priorityProject ' + tasks.priority + '">' + tasks.priority + '</div>';
    dueto = tasks.dueto;
    assignName = tasks.assignto;
    assign = assignName.name ? assignName.name : '';
    //assign += '<div class="photoProfile small"></div>';
  } else {
    status = 'new';
    statusForm = 'style="display:none;" data-id="' + tasks + '"';
    name = '<input type="text" placeholder="Task Name" class="newTaskInput" name="newTaskInput" id="newTaskInput">';
    priority = '<select size="1" name="priority" id="priority"><option value="low" class="low">low</option><option selected value="normal" class="normal">normal</option><option value="high" class="high">high</option></select>';
    assign = '<div class="priorityProject"><select size="1" name="assignto" id="assignChoose"><option value="1">Svitlana</option><option value="2">Den</option></select></div>';
    dueto = '<input type="date" id="dateInput"';
    buttons = '<div class="buttons"><button name="createButton">Create</button><button name="cancelButton">Cancel</button></div>';
  }

  result += '<li><div class="task ' + status + '"' + statusForm + '><div class="taskStatus ' + status + 'Icon"><a href="#" class="tip"><span>' + status + '</span></a></div>';
  result += '<div class="nameTask">' + name + '</div>';
  result += '<div class="titlePriority">' + priority + '</div>';
  result += '<div class="assignName">' + assign + '</div>';
  result += '<div class="deadlineProject">' + dueto + '</div></div>' + buttons + '</li>';

  return result;
}
//---------------------------------------------
function setTask(id, newTask) {
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
  return '' + Math.floor(Math.random() * (1000 + 1));
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '56067' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.51054036.map
// function Model (data){
//   if (data) {
//     this._dataStorage.push(data);
//   } else {
//     this._dataStorage = [];
//   }
// }
// Model.prototype.get = function(){
//     return this._dataStorage;
// }
// //----------------------------------------------------------
// function Project (data) {
//   Model.call(this, data);
// }
// Project.prototype = Object.create(Model.prototype);
// Project.prototype.constructor = Project;
//
// Project.prototype.get = function(id){
//   // if (!id) {
//   //   for (var i = 0; i<this._dataStorage.length; i++){
//   //     if (id === this._dataStorage._id){
//   //       return this._dataStorage[i];
//   //     }
//   //   }
//   // }
//   Model.prototype.get.call(this);
// }
// //----------------------------------------------------------
// function Task (data) {
//   Project.call(this, data);
// }
// Task.prototype = Object.create(Project.prototype);
// Task.prototype.constructor = Task;
//----------------------------------------------------------
var projectStorage = [
  { name: 'Learn Java Script',
    owner: {
      name: 'Svitlana',
      email: 'svitlana.tarasova.v@gmail.com'
    },
    dueto: '2018',
    tasks: [
      { name: 'JavaScript Basic',
        assignto: {
          name: 'Svitlana',
          email: 'svitlana.tarasova.v@gmail.com'
        },
        dueto: '2018',
        priority: 'low',
        status: 'inProgress'
      },
      { name: 'JavaScript Functions',
        assignto: {},
        dueto: '2018',
        priority: 'high',
        status: 'open'
      },
      { name: 'JavaScript Object',
        assignto: {
          name: 'Svitlana',
          email: 'svitlana.tarasova.v@gmail.com'
        },
        dueto: '2018',
        priority: 'normal',
        status: 'completed'
      },
      { name: 'JavaScript Searching and Sorting Algorithm',
        assignto: {
          name: 'Svitlana',
          email: 'svitlana.tarasova.v@gmail.com'
        },
        dueto: '2018',
        priority: 'high',
        status: 'completed'
      }
    ]
  },
  {
    name: 'Learn HTML',
    owner: {
        name: 'den',
        email: 'svitlana.tarasova.v@gmail.com'
    },
    dueto: '2018',
    tasks: [ ]
  },
  {
    name: 'Learn CSS',
    owner: {
        name: 'Svitlana',
        email: 'svitlana.tarasova.v@gmail.com'
    },
    dueto: '2018',
    tasks: [ ]
  }
]

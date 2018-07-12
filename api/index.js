const yup = require('yup');
const Schemas = require('./schemas');

const path = require('path');
const NedbDatastore = require('nedb');
const db = new NedbDatastore({
  filename: path.resolve(__dirname, 'projects.nedb'),
  autoload: true
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const api = express.Router();

api.use(cors());
api.use(bodyParser.json());

if (process.argv.indexOf('simulate-errors') !== -1) {
  api.use((req, res, next) => {
    if (Math.random() < 0.5) {
      next(new Error('Unexpected error occurred'));
    } else {
      next();
    }
  });
}

api.get('/', (req, res, next) => {
  console.log('in get');
  db.find({}, (err, projects) => {
    if (err) {
      return next(err);
    }

    res.json(projects);
  })
});

api.post('/', (req, res, next) => {
  Schemas.NewProject.validate(req.body, {stripUnknown: true}, (err, data) => {
    if (err) {
      return next(err);
    }

  //  db.insert({text: data.text, done: false}, (err, project) => {
  db.insert({name: data.name, dueto: data.dueto, tasks: data.tasks}, (err, project) => {

      if (err) {
        console.log(err);

        return next(err);
      }

      res.json(project);
    });
  });
});

api.delete('/', (req, res, next) => {
  db.remove({}, {multi: true}, (err) => {
    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
});

api.get('/:id', (req, res, next) => {
  db.findOne({_id: req.params.id}, (err, doc) => {
    if (err) {
      return next(err);
    }

    if (doc) {
      res.json(doc);
    } else {
      res.sendStatus(404);
    }
  });
});
// change Project with _id
api.patch('/:id', (req, res, next) => {
  Schemas.ExistingProject.validate(req.body, {stripUnknown: true}, (err, data) => {
    if (err) {
      return next(err);
    }

    db.update({_id: req.params.id}, {$set: data}, {}, (err, numUpdated) => {//$push:
      if (err) {
        return next(err);
      }

      if (numUpdated > 0) {
        db.findOne({_id: req.params.id}, (err, doc) => {
          if (err) {
            return next(err);
          }

          res.json(doc);
        });
      } else {
        res.sendStatus(404);
      }
    });
  });
});
// add new task to project with _id by method PATCH
api.patch('/tasks/:id', (req, res, next) => {
  Schemas.ExistingProject.validate(req.body, {stripUnknown: true}, (err, data) => {
    if (err) {
      return next(err);
    }

    db.update({_id: req.params.id}, {$push: data}, {}, (err, numUpdated) => {
      if (err) {

        return next(err);
      }

      if (numUpdated > 0) {
        db.findOne({_id: req.params.id}, (err, doc) => {
          if (err) {
            return next(err);
          }

          res.json(doc);
        });
      } else {
        res.sendStatus(404);
      }
    });
  });
});

api.delete('/:id', (req, res, next) => {
  db.remove({_id: req.params.id}, {}, (err, numRemoved) => {
    if (err) {
      return next(err);
    }

    if (numRemoved > 0) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });
});


app.use('/projects', api);

app.all('*', (req, res, next) => next(new Error(`Cannot ${req.method} ${req.path}`)));

app.use((err, req, res, next) => {
  if (err instanceof yup.ValidationError) {
    res.status(422).json({reason: err.toString(), errors: err.errors});
  } else {
    res.status(500).json({reason: err.toString()});
  }
});

const server = app.listen(3000, 'localhost', () => {
  const addr = server.address();
  console.log('API listening at http://%s:%s', addr.address, addr.port);
});

const express = require('express'),
  path = require('path'),
  mongo = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser');

const app = express();

mongo.Promise = global.Promise;
mongo.connect('mongodb://localhost:27017/assignmentDB2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('Sikerült csatlakozni az adatbázishoz.')
  },
  error => {
    console.log('Hiba történt: ' + error)
  }
)

const Schema = mongo.Schema;

const parfumeRoute = express.Router();
let Parfume = new Schema({
  parfumeName: {
    type: String
  },
  parfumeCode: {
    type: String,
    unique: true
  },
  type: {
    type: String
  },
  parfumeFor: {
    type: String
  },
  releaseDate: {
    type: Date
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  amount: {
    type: Number
  }
}, {
  collection: 'parfume'
});

var parfumeModel = mongo.model('parfume', Parfume, 'parfume');

parfumeModel.ensureIndexes((err) => {
  if (err) console.error(err);
});

parfumeRoute.route('/addParfume').post((req, res, next) => {
  parfumeModel.create(req.body, (error, data) => {
    if (error) {
      if (error.code === 11000) {
        res.status(400).send({ message: 'Parfume code must be unique' });
      } else {
        next(error);
      }
    } else {
      res.json(data);
    }
  });
});

parfumeRoute.route('/checkParfumeCode/:code').get((req, res) => {
  const code = req.params.code;
  parfumeModel.findOne({ parfumeCode: code }, (error, data) => {
    if (error) {
      res.status(400).send({ exists: false });
    } else {
      res.json({ exists: true });
    }
  });
});

parfumeRoute.route('/getParfume').get((req, res) => {
  parfumeModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

parfumeRoute.route('/deleteParfume/:id')
  .delete((req, res) => {
    const id = req.params.id;
    parfumeModel.findByIdAndDelete(id, (error, result) => {
      if (error) {
        res.status(500).send({ message: 'Error deleting perfume' });
      } else if (!result) {
        res.status(404).send({ message: 'Perfume not found' });
      } else {
        res.status(200).send({ message: 'Perfume deleted successfully' });
      }
    });
  });

  parfumeRoute.route('/updateParfume/:id').put((req, res, next) => {
    const id = req.params.id;
    parfumeModel.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    });
  });

const userRoute = express.Router();
let User = new Schema({
  uname: {
    type: String
  },
  password: {
    type: String
  }
}, {
  collection: 'users'
})

var userModel = mongo.model('users', User, 'users');

userRoute.route('/addUser').post((req, res, next) => {
  userModel.create(req.body, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      res.json(data)
    }
  })
});

userRoute.route('/getallUser').get((req, res) => {
  userModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

userRoute.route('/getUser/:id').get((req, res) => {
  userModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/assignment')));
app.use('/', express.static(path.join(__dirname, 'dist/assignment')));

app.use('', userRoute)
app.use('', parfumeRoute)

app.listen(8080);
console.log('8080 porton elindult az adatbázisszerver.');

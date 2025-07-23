import { Meteor } from 'meteor/meteor';
import { Accounts} from 'meteor/accounts-base';
import { TasksCollection } from '../imports/db/TasksCollection.js';
import '../imports/api/tasksMethods.js';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

const insertTask = taskText =>
TasksCollection.insert({
  text: taskText,
  userId: user._id,
  createdAt: new Date(), // current time
});

Meteor.startup(() => {
  // If the user doesn't exist, create it.
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  
  const user = Accounts.findUserByUsername(SEED_USERNAME);

  // If the TasksCollection is empty, add some sample data.
  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user));
  }
});



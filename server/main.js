import { Meteor } from 'meteor/meteor';
import { Accounts} from 'meteor/accounts-base';
import '../imports/api/tasksMethods.js';
import '../imports/api/tasksPublications.js';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  // If the user doesn't exist, create it.
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
});



import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection';
import './Task.html';

Template.task.events({
    'click.toggle-checked'() {
        // Set the checked property to the opposite of its current value
        TasksCollection.update(this._id, {
            $set: { checked: !this.checked },
        });
    },
    'click .delete'() {
        // Remove this task from the collection
        TasksCollection.remove(this._id);
    }
});
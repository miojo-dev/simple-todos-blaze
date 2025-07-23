import { Template } from 'meteor/templating';
import './Task.html';
import { Meteor } from 'meteor/meteor';

Template.task.events({
    'click.toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setIsChecked', _id, !isChecked);
    },
    'click .delete'() {
        // Remove this task from the collection
        Meteor.call('tasks.remove', _id);
    }
});
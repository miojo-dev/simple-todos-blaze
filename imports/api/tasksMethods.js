import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'tasks.insert'(text, description) {
        check(text, String);
        check(description, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        TasksCollection.insert({
            text,
            description,
            createdAt: new Date(),
            userId: this.userId,
            isChecked: false,
        });
    },

    'tasks.remove'(taskId) {
        check(taskId, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized');
        }

        const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }

        TasksCollection.remove(taskId);
    },

    'tasks.setIsChecked'(taskId, isChecked) {
        check(taskId, String);
        check(isChecked, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized');
        }

        const task = TasksCollection.findOne({ _id: taskId, userId: this.userId })

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }


        TasksCollection.update(taskId, { 
            $set: { 
                isChecked: isChecked
            } 
        });
    },

});


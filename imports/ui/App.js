import { Template } from 'meteor/templating';
import { TasksCollection } from '../db/TasksCollection.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './App.html';
import './Task.js';
import './Login.js';

const HIDE_COMPLETED_STRING = 'hideCompleted';

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();
const IS_LOADING_STRING = 'isLoading';

const getTasksFilter = () => {
    const user = getUser();

    const hideCompletedFilter = { isChecked: { $ne: true } };

    const userFilter = user ? { userId: user._id } : {};

    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    return { userFilter, pendingOnlyFilter };
}

Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();

    const handler = Meteor.subscribe('tasks');
    Tracker.autorun(() => {
        this.state.set(IS_LOADING_STRING, !handler.ready());
    });
});

Template.mainContainer.helpers ({
    tasks() {
        const instance = Template.instance();
        const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
        
        const  { pendingOnlyFilter, userFilter } = getTasksFilter();

        if (!isUserLogged()) {
            return [];
        }

        return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, { 
            sort: { createdAt: -1 } 
        }).fetch();
    },

    isLoading() {
        const instance = Template.instance();
        return instance.state.get(IS_LOADING_STRING);
    },

    hideCompleted() {
        return Template.instance().state.get(HIDE_COMPLETED_STRING);
    },

    incompleteCount() {
        if (!isUserLogged()) {
            return '';
        }

        const { pendingOnlyFilter } = getTasksFilter();

        const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
        return incompleteTasksCount ? ` (${incompleteTasksCount})` : '';
    },

    isUserLogged() {
        return isUserLogged();
    },
    
    getUser() {
        return getUser();
    }
});

Template.mainContainer.events({
    "click #hide-completed-button"(event, instance) {
        const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
        instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
        console.log('Hide completed tasks:', !currentHideCompleted);
    },

    'click .user'() {
        Meteor.logout();
    }
});

Template.form.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();
})

Template.form.events({
    "submit .task-form"(event) {
        
        //Prevent default browser form submit
        event.preventDefault();

        //Get value from form element
        const target = event.target;
        const text = target.text.value;
        const description = target.description.value;

        //Set the first letter of text and description to uppercase
        //This is just a stylistic choice to make the UI look better
        const Text = text.replace(/^./, c => c.toUpperCase());
        const Description = description.replace(/^./, c => c.toUpperCase());

        
        //Insert a task into the collection
        Meteor.call('tasks.insert', Text, Description);

        //Clear form
        target.text.value = '';
        target.description.value = '';
    }
});
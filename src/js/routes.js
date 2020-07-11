import axios from 'axios';

import Projects from '../pages/projects.vue';
import FormPage from '../pages/form.vue';
import SettingsPage from '../pages/settings.vue';

import ProjectView from '../pages/project-view.vue';
import IssuesList from '../pages/issues-list.vue';
import IssueView from '../pages/issue-view.vue';
import NotFoundPage from '../pages/404.vue';
import vue from './app'
import $$ from 'dom7';

let projectsPageSavedScrollTop = null;
let issuePageSavedScrooTop = null;

var routes = [
  {
    path: '/',
    name: 'projects',
    component: Projects,
    on: {
      
      pageBeforeIn(e) {
        // restore scrollTop
        $$(e.currentTarget).find('.page-content').scrollTop(projectsPageSavedScrollTop);
      },
      pageBeforeOut(e) {
        // save scrollTop
        projectsPageSavedScrollTop = $$(e.currentTarget).find('.page-content').scrollTop(); 
      },
    }
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },
  {
    path: '/projects/:id/:key/',
    name: 'project',
    component: ProjectView,
    beforeEnter: function (routeTo, routeFrom, resolve, reject) {
      vue.$f7.panel.allowOpen = false;
      resolve();
    },
    beforeLeave: function (routeTo, routeFrom, resolve, reject) {
      vue.$f7.panel.allowOpen = true;
      resolve();
    }
  },
  {
    path: '/projects/issues/:id/:key/',
    name: 'issuesList',
    component: IssuesList
  },
  {
    path: '/issues/:id/:key/',
    name: 'issue',
    component: IssueView,
    beforeEnter: function (routeTo, routeFrom, resolve, reject) {
      vue.$f7.panel.allowOpen = false;
      resolve();
    },
    beforeLeave: function (routeTo, routeFrom, resolve, reject) {
      vue.$f7.panel.allowOpen = true;
      resolve();
    }
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;

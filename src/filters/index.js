import daysFromNow from './days.from.now.js';
import formatHours from './format.hours.js';
import statusIcon from './status.icon.js';
import priorityColor from './priority.color.js';

export default {
    install(Vue) {
        Vue.filter('daysFromNow', daysFromNow);
        Vue.filter('formatHours', formatHours);
        Vue.filter('statusIcon', statusIcon);
        Vue.filter('priorityColor', priorityColor);
    }
}
import moment from 'moment';
moment.locale('ru');

export default function formatHours(hours) {
    return moment(hours).format('LT');
}
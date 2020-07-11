import moment from 'moment';

export default function dateFromNow(date) {
    return moment(date).fromNow();
}
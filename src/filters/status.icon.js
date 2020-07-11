export default function statusIcon(payload) {
    const status = payload.toLowerCase();
    switch (status) {
        case "новая":
            return "folder";
        case "к исполнению":
            return "timer";
        case "в работе":
            return "play_fill";
        case "выполнено":
            return "checkmark_alt";
        case "закрыта":
            return "checkmark_alt";
        case "приостановлено":
            return "hourglass_bottomhalf_fill";
        case "требуется уточнение":
            return "question_circle_fill";
        case "отклонена":
            return "multiply_circle_fill";
    }
}
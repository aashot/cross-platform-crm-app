export default function priorityColor(priority) {
    switch (priority) {
        case 3:
            return "bg-blue";
        case 4:
            return "bg-pink";
        case 5:
            return "bg-red";
    }
}
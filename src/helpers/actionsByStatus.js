export default function actionsByStatus(status) {
    if (
        status.toLowerCase() === "новый" &&
        status.toLowerCase() === "приостановлено"
    ) {
        return [{
                title: "в работу",
                backgroundColor: "rgb(214, 184, 205)",
                changeStatusTo: 2
            },
            {
                title: "Отменить",
                backgroundColor: "rgb(214, 184, 205)",
                changeStatusTo: 5
            }
        ];
    }

    if (status.toLowerCase() === "к исполнению") {
        return [{
                title: "Отменить",
                backgroundColor: "rgb(214, 184, 205)",
                changeStatusTo: 6
            },
            {
                title: "приостановить",
                backgroundColor: "rgb(214, 184, 205)",
                changeStatusTo: 7
            }
        ];
    }

    if (status.toLowerCase() === "в работе") {
        return [{
                title: "Отменить",
                backgroundColor: "rgb(214, 184, 205)",
                changeStatusTo: 6
            },
            {
                title: "приостановить",
                backgroundColor: "rgb(214, 184, 205)",
                changeStatusTo: 7
            }
        ];
    }

    if (status.toLowerCase() === "к исполнению") {
        return [{
            title: "в работу",
            backgroundColor: "rgb(214, 184, 205)",
            changeStatusTo: 2
        }];
    }
}
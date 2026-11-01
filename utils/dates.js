function today() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
}

const dayjs = require("dayjs");

function dueLabel(dueOn, todayStr) {
    const days = dayjs(dueOn).diff(dayjs(todayStr), "day");

    if (days < 0) return "Overdue by " + Math.abs(days) + (Math.abs(days) === 1 ? " day" : " days");
    if (days === 0) return "Due today";
    return "Due in " + days + (days === 1 ? " day" : " days");
}

module.exports = { today, dueLabel };
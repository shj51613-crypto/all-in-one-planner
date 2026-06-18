let currentDate = new Date();

let schedules = [];
let selectedDay = null;

document.addEventListener("DOMContentLoaded", () => {

    const navButtons =
        document.querySelectorAll(".bottom-nav button");

    const pages =
        document.querySelectorAll(".page");

    navButtons.forEach(button => {

        button.addEventListener("click", () => {

            const targetPage =
                button.dataset.page;

            pages.forEach(page => {
                page.classList.remove("active");
            });

            navButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            document
                .getElementById(targetPage)
                .classList.add("active");

            button.classList.add("active");

        });

    });

    document
        .getElementById("prevMonth")
        .addEventListener("click", previousMonth);

    document
        .getElementById("nextMonth")
        .addEventListener("click", nextMonth);

    document
        .getElementById("closeDayView")
        .addEventListener("click", () => {

            document
                .getElementById("dayViewModal")
                .classList.remove("open");

        });

    document
        .getElementById("cancelSchedule")
        .addEventListener("click", () => {

            document
                .getElementById("scheduleModal")
                .classList.remove("open");

        });

    document
        .getElementById("saveSchedule")
        .addEventListener("click", saveSchedule);

    renderCalendar();

});

function previousMonth(){

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar();

}

function nextMonth(){

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar();

}

function renderCalendar(){

    const calendarGrid =
        document.querySelector(".calendar-grid");

    const monthTitle =
        document.getElementById("currentMonth");

    calendarGrid.innerHTML = "";

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    monthTitle.textContent =
        `${year}년 ${month + 1}월`;

    const firstDay =
        new Date(year, month, 1);

    const startDay =
        firstDay.getDay();

    const lastDate =
        new Date(year, month + 1, 0).getDate();

    const prevLastDate =
        new Date(year, month, 0).getDate();

    let dayNumber = 1;
    let nextDay = 1;

    for(let i = 0; i < 42; i++){

        const day =
            document.createElement("div");

        day.className = "day";

        let displayNumber = "";
        let extraClass = "";

        if(i < startDay){

            displayNumber =
                prevLastDate - startDay + i + 1;

            extraClass = "other-month";

        }
        else if(dayNumber <= lastDate){

            displayNumber = dayNumber;
            dayNumber++;

        }
        else{

            displayNumber = nextDay;
            nextDay++;

            extraClass = "other-month";

        }

        day.innerHTML = `
            <div class="date-area">
                <div class="date-number ${extraClass}">
                    ${displayNumber}
                </div>
            </div>

            <div class="schedule-area"></div>
        `;

        const dateArea =
            day.querySelector(".date-area");

        const scheduleArea =
            day.querySelector(".schedule-area");

        const daySchedules =
            schedules.filter(item =>
                item.year === year &&
                item.month === month + 1 &&
                item.day === displayNumber
            );

        daySchedules
            .slice(0,2)
            .forEach(item => {

                const schedule =
                    document.createElement("div");

                const categoryMap = {

    "개인일정":"personal",
    "계획":"plan",
    "가족일정":"family",
    "스포츠일정":"sports"

};

schedule.className =
    `calendar-schedule ${
        item.allDay ? "allday" : "time"
    } ${
        categoryMap[item.category]
    }`;

schedule.textContent =
    item.allDay
        ? item.title
        : `${item.startTime} ${item.title}`;

                scheduleArea.appendChild(schedule);

            });

        dateArea.addEventListener("click", (e) => {

            e.stopPropagation();

            openDayView(displayNumber);

        });

        scheduleArea.addEventListener("click", (e) => {

            e.stopPropagation();

            openScheduleModal(displayNumber);

        });

        calendarGrid.appendChild(day);

    }

}

function openDayView(dayNumber){

    const modal =
        document.getElementById("dayViewModal");

    const selectedDate =
        document.getElementById("selectedDate");

    const month =
        currentDate.getMonth() + 1;

    selectedDate.textContent =
        `${month}월 ${dayNumber}일`;

    createTimeGrid();

    modal.classList.add("open");

}

function createTimeGrid(){

    const timeGrid =
        document.getElementById("timeGrid");

    if(!timeGrid) return;

    timeGrid.innerHTML = "";

    const header =
        document.createElement("div");

    header.className = "time-header";

    let headerHtml = "<div></div>";

    for(let i = 5; i <= 60; i += 5){

        headerHtml += `
            <div class="minute-label">
                ${String(i).padStart(2,"0")}
            </div>
        `;

    }

    header.innerHTML = headerHtml;

    timeGrid.appendChild(header);

    for(let hour = 0; hour < 24; hour++){

        const row =
            document.createElement("div");

        row.className = "hour-row";

        let blocks = "";

        for(let i = 0; i < 12; i++){

            blocks += `
                <div class="time-block"></div>
            `;

        }

        row.innerHTML = `
            <div class="hour-label">
                ${String(hour).padStart(2,"0")}
            </div>

            ${blocks}
        `;

        timeGrid.appendChild(row);

    }

}

function openScheduleModal(dayNumber){

    selectedDay = dayNumber;

    document
        .getElementById("scheduleModal")
        .classList.add("open");

}

function saveSchedule(){

    const title =
        document
        .getElementById("scheduleTitle")
        .value;

    if(!title) return;

    schedules.push({

        year:
            currentDate.getFullYear(),

        month:
            currentDate.getMonth() + 1,

        day:
            selectedDay,

        title:

            document
            .getElementById("allDayCheck")
            .checked

                title: title,

                : title,

        category:
            document
            .getElementById("scheduleCategory")
            .value,

        allDay:
            document
            .getElementById("allDayCheck")
            .checked,

        startTime:
            document
            .getElementById("startTime")
            .value

    });

    document
        .getElementById("scheduleModal")
        .classList.remove("open");

    document
        .getElementById("scheduleTitle")
        .value = "";

    renderCalendar();

}

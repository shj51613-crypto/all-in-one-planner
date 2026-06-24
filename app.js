let currentDate = new Date();

let schedules =
    JSON.parse(
        localStorage.getItem("schedules")
    ) || [];

let selectedDay = null;

let editingIndex = null;

let expandedDays = {};

let dayMemos =
    JSON.parse(
        localStorage.getItem("dayMemos")
    ) || {};

function getLunarText(year, month, day){

    if(
        typeof KoreanLunarCalendar ===
        "undefined"
    ){
        return "";
    }

    const lunar =
        new KoreanLunarCalendar();

    lunar.setSolarDate(
        year,
        month,
        day
    );

    const lunarMonth =
        Number(
            lunar.lunarMonth
        );

    const lunarDay =
        Number(
            lunar.lunarDay
        );

    const prefix =
        lunar.isIntercalation
            ? "윤"
            : "음";

    return `${prefix}${lunarMonth}.${lunarDay}`;
}

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

    document
.getElementById("closeActionModal")
.addEventListener("click", () => {

    document
        .getElementById("scheduleActionModal")
        .classList.remove("open");

});

document
.getElementById("editScheduleBtn")
.addEventListener("click", () => {

    const item =
        window.selectedScheduleItem;

    if(!item) return;

    editingIndex =
        schedules.findIndex(
            schedule =>
                schedule === item
        );

    document
        .getElementById("scheduleTitle")
        .value = item.title;

    document
        .getElementById("scheduleCategory")
        .value = item.category;

    document
        .getElementById("allDayCheck")
        .checked = item.allDay;

    document
        .getElementById("startTime")
        .value = item.startTime || "";

    document
        .getElementById("repeatType")
        .value =
            item.repeatType || "none";

    document
        .getElementById("weeklyRepeatBox")
        .style.display =
            item.repeatType === "weekly"
                ? "block"
                : "none";
    
    document
        .getElementById("repeatEndDate")
        .value =
            item.repeatEndDate || "";

    document
        .querySelectorAll(
            "#weeklyRepeatBox input"
        )
        .forEach(checkbox => {

            checkbox.checked = false;

            if(
                item.repeatDays &&
                item.repeatDays.includes(
                    Number(checkbox.value)
                )
            ){
                checkbox.checked = true;
            }

        });

    selectedDay = item.day;

    document
        .getElementById("scheduleActionModal")
        .classList.remove("open");

    document
        .getElementById("scheduleModal")
        .classList.add("open");

});

document
.getElementById("deleteScheduleBtn")
.addEventListener("click", () => {

    const item =
        window.selectedScheduleItem;

    if(!item) return;

    const index =
        schedules.findIndex(
            schedule =>
                schedule === item
        );

    if(index !== -1){

        schedules.splice(index, 1);

        localStorage.setItem(
            "schedules",
            JSON.stringify(schedules)
        );

    }

    document
        .getElementById("scheduleActionModal")
        .classList.remove("open");

    renderCalendar();

});

    
    const trackerTab =
    document.getElementById("trackerTab");

const memoTab =
    document.getElementById("memoTab");

trackerTab.addEventListener("click", () => {

    trackerTab.classList.add("active");
    memoTab.classList.remove("active");

    document
        .getElementById("trackerContent")
        .style.display = "block";

    document
        .getElementById("memoContent")
        .style.display = "none";

});

memoTab.addEventListener("click", () => {

    memoTab.classList.add("active");
    trackerTab.classList.remove("active");

    document
        .getElementById("trackerContent")
        .style.display = "none";

    document
        .getElementById("memoContent")
        .style.display = "block";

});

    document
    .getElementById("dayMemo")
    .addEventListener("input", () => {

        if(selectedDay === null) return;

        const memoKey =
            `${currentDate.getFullYear()}-${
                currentDate.getMonth() + 1
            }-${selectedDay}`;

        dayMemos[memoKey] =
            document
                .getElementById("dayMemo")
                .value;

        localStorage.setItem(
            "dayMemos",
            JSON.stringify(dayMemos)
        );

    });

    document
        .getElementById("repeatType")
        .addEventListener("change", (e) => {

    document
        .getElementById("weeklyRepeatBox")
        .style.display =
            e.target.value === "weekly"
                ? "block"
                : "none";

        });
    
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

        const lunarText =
            extraClass === ""
                ? getLunarText(
                    year,
                    month + 1,
                    displayNumber
                )
                : "";

        day.innerHTML = `
            <div class="date-area">
                <div class="date-number ${extraClass}">
                    ${displayNumber}

                    ${
                        lunarText
                        ? `<span class="lunar-date">
                            ${lunarText}
                           </span>`
                        : ""
                    }
                </div>
            </div>

            <div class="schedule-area"></div>
`        ;

        const dateArea =
            day.querySelector(".date-area");

        const scheduleArea =
            day.querySelector(".schedule-area");

        const daySchedules =
            schedules.filter(item => {

                if(
                    item.year === year &&
                    item.month === month + 1 &&
                    item.day === displayNumber
                ){
                    return true;
                }

                const current =
                    new Date(
                        year,
                        month,
                        displayNumber
                    );

                const original =
                    new Date(
                        item.year,
                        item.month - 1,
                        item.day
                    );

                if(item.repeatEndDate){

                    const endDate =
                        new Date(item.repeatEndDate);

                    endDate.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    const currentDateObj =
                        new Date(
                            year,
                            month,
                            displayNumber
                        );

                    if(currentDateObj > endDate){
                        return false;
                    }
                }

                switch(item.repeatType){

                    case "daily":
                        return current > original;

                    case "weekly":

                        const repeatDays =
                            item.repeatDays || [
                                original.getDay()
                            ];

                        return (
                            current > original &&
                            repeatDays.includes(
                                current.getDay()
                            )
                        );

                    case "monthly":
                        return (
                            current > original &&
                            current.getDate() ===
                            original.getDate()
                        );

                    case "yearly":
                        return (
                            current > original &&
                            current.getDate() ===
                            original.getDate() &&
                            current.getMonth() ===
                            original.getMonth()
                        );

                    default:
                        return false;
                }

            });
        
        daySchedules.sort((a, b) => {

            if(a.allDay && !b.allDay) return -1;
            if(!a.allDay && b.allDay) return 1;

            return (a.startTime || "")
                .localeCompare(b.startTime || "");

});

        const visibleSchedules =
            expandedDays[
                `${year}-${month + 1}-${displayNumber}`
            ]
                ? daySchedules
                : daySchedules.slice(0,2);

        visibleSchedules.forEach(item => {

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

schedule.addEventListener("click", (e) => {

    e.stopPropagation();

    window.selectedScheduleItem = item;

    document
        .getElementById("scheduleActionModal")
        .classList.add("open");

});
                
                scheduleArea.appendChild(schedule);

            });

        const dayKey =
            `${year}-${month + 1}-${displayNumber}`;
        
        if(
            daySchedules.length > 2 ||
            expandedDays[dayKey]
        ){
            
            const more =
                document.createElement("div");

            more.className =
                "calendar-more";

            const expanded =
                expandedDays[dayKey];

            if(expanded){

                more.textContent = "접기";

            }else{

                more.textContent =
                    `+${daySchedules.length - 2}개 더`;

            }
            
            more.addEventListener("click", (e) => {

                e.stopPropagation();

                expandedDays[dayKey] =
                    !expandedDays[dayKey];

                renderCalendar();

            });

            scheduleArea.appendChild(more);

}

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

    selectedDay = dayNumber;

    const modal =
        document.getElementById("dayViewModal");

    const selectedDate =
        document.getElementById("selectedDate");

    const month =
        currentDate.getMonth() + 1;

    selectedDate.textContent =
        `${month}월 ${dayNumber}일`;

    createTimeGrid(dayNumber);

    renderDaySchedules(dayNumber);

    const memoKey =
    `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
    }-${dayNumber}`;

    document
        .getElementById("dayMemo")
        .value =
            dayMemos[memoKey] || "";
    
    modal.classList.add("open");

}

function renderDaySchedules(dayNumber){

    const scheduleList =
        document.getElementById("dayScheduleList");

    if(!scheduleList) return;

    scheduleList.innerHTML = "";

    const month =
        currentDate.getMonth() + 1;

    const year =
        currentDate.getFullYear();

    const daySchedules =
        schedules.filter(item =>
            item.year === year &&
            item.month === month &&
            item.day === dayNumber
        );

    daySchedules.forEach(item => {

        const div =
            document.createElement("div");

        div.className = "day-schedule-item";

        div.textContent =
            item.allDay
                ? item.title
                : `${item.startTime} ${item.title}`;

        scheduleList.appendChild(div);

    });

}

function createTimeGrid(dayNumber){

    const timeGrid =
        document.getElementById("timeGrid");

    if(!timeGrid) return;

    timeGrid.innerHTML = "";

    const selectedSchedules =
        schedules.filter(item =>
            item.year === currentDate.getFullYear() &&
            item.month === currentDate.getMonth() + 1 &&
            item.day === dayNumber
        );

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

    if(editingIndex === null){

        document
            .getElementById("repeatType")
            .value = "none";

        document
            .getElementById("repeatEndDate")
            .value = "";

        document
            .getElementById("weeklyRepeatBox")
            .style.display = "none";

        document
            .querySelectorAll(
                "#weeklyRepeatBox input"
            )
            .forEach(
                checkbox =>
                    checkbox.checked = false
            );

    }

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

    const scheduleData = {

        year:
            currentDate.getFullYear(),

        month:
            currentDate.getMonth() + 1,

        day:
            selectedDay,

        title: title,

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
            .value,

        repeatType:
            document
            .getElementById("repeatType")
            .value,

        repeatDays:
            Array.from(
                document.querySelectorAll(
                    "#weeklyRepeatBox input:checked"
                )
            ).map(
                checkbox =>
                    Number(checkbox.value)
            ),

        repeatEndDate:
            document
                .getElementById("repeatEndDate")
                .value

    };

if(editingIndex !== null){

    schedules[editingIndex] =
        scheduleData;

    editingIndex = null;

}else{

    schedules.push(
        scheduleData
    );

}

    localStorage.setItem(
    "schedules",
    JSON.stringify(schedules)
);
    
    document
        .getElementById("scheduleModal")
        .classList.remove("open");

    document
        .getElementById("scheduleTitle")
        .value = "";

    document
        .getElementById("repeatType")
        .value = "none";

    document
        .getElementById("repeatEndDate")
        .value = "";

    document
        .getElementById("weeklyRepeatBox")
        .style.display = "none";

    document
        .querySelectorAll(
            "#weeklyRepeatBox input"
        )
        .forEach(
            checkbox =>
                checkbox.checked = false
        );
    
    editingIndex = null;

    renderCalendar();

}

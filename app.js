let currentDate = new Date();

document.addEventListener("DOMContentLoaded", () => {

    const navButtons = document.querySelectorAll(".bottom-nav button");
    const pages = document.querySelectorAll(".page");

    navButtons.forEach(button => {

        button.addEventListener("click", () => {

            const targetPage = button.dataset.page;

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

    renderCalendar();

});

function previousMonth() {

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar();

}

function nextMonth() {

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar();

}

function renderCalendar() {

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

    for (let i = 0; i < 42; i++) {

        const day = document.createElement("div");
        day.className = "day";

        let displayNumber = "";
        let extraClass = "";

        if (i < startDay) {

            displayNumber =
                prevLastDate - startDay + i + 1;

            extraClass = "other-month";

        } else if (
            dayNumber <= lastDate
        ) {

            displayNumber = dayNumber;
            dayNumber++;

        } else {

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

day.addEventListener("click", () => {

    openDayView(displayNumber);

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

    modal.classList.add("open");

}

document.addEventListener("DOMContentLoaded", () => {

    const closeBtn =
        document.getElementById("closeDayView");

    if(closeBtn){

        closeBtn.addEventListener("click", () => {

            document
                .getElementById("dayViewModal")
                .classList.remove("open");

        });

    }

});

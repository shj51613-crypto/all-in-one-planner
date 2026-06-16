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

    createCalendar();

});

function createCalendar() {

    const calendarGrid = document.querySelector(".calendar-grid");

    if (!calendarGrid) return;

    for (let i = 1; i <= 35; i++) {

        const day = document.createElement("div");
        day.className = "day";

        day.innerHTML = `
            <div class="date-area">
                ${i}
            </div>

            <div class="schedule-area">
            </div>
        `;

        calendarGrid.appendChild(day);

    }

}

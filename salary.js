document.getElementById("work-date").valueAsDate = new Date();
const hourlyWageInput = document.getElementById("hourly-wage");
const workDateInput = document.getElementById("work-date");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const addHoursButton = document.getElementById("add-hours");
const workEntriesTableBody = document.getElementById("work-entries-table-body");
const calculateSalaryButton = document.getElementById("calculate-salary");
const totalSalary = document.getElementById("total-salary");
const dailySalaryTable = document.getElementById("daily-salary-table");
const increaseWageButton = document.getElementById("increase-wage");
const decreaseWageButton = document.getElementById("decrease-wage");
document.addEventListener("DOMContentLoaded", function () {
    var hourlyWage = 20000;
    var workEntries = [];
    var tableVisible = false;
    var dailySalaries = new Map();

    hourlyWageInput.addEventListener("change", function () {
        hourlyWage = parseFloat(hourlyWageInput.value);
        calculateTotalSalary();
    });

    increaseWageButton.addEventListener("click", function () {
        hourlyWage += 1000;
        hourlyWageInput.value = hourlyWage;
        calculateTotalSalary();
    });

    decreaseWageButton.addEventListener("click", function () {
        if (hourlyWage > 0) {
            hourlyWage -= 1000;
            hourlyWageInput.value = hourlyWage;
            calculateTotalSalary();
        }
    });

    addHoursButton.addEventListener("click", function () {
        const date = new Date(workDateInput.value);
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        if (!isNaN(date.getTime()) && startTime && endTime) {
            const startTimeObj = new Date(`1970-01-01T${startTime}`);
            const endTimeObj = new Date(`1970-01-01T${endTime}`);
            const hoursWorked = (endTimeObj - startTimeObj) / (1000 * 60 * 60);

            if (!isNaN(hoursWorked)) {
                const entry = {
                    date: formatDate(date),
                    startTime: startTime,
                    endTime: endTime,
                    hoursWorked: hoursWorked,
                };

                workEntries.push(entry);
                
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${entry.date}</td>
                    <td>${entry.startTime}</td>
                    <td>${entry.endTime}</td>
                    <td>${entry.hoursWorked.toFixed(2)}</td>
                    <td>${(entry.hoursWorked * hourlyWage)}</td>
                    <td><button style="width:100%" class="delete-button" 
                    data-date="${entry.date}" data-start="${entry.startTime}" data-end="${entry.endTime}">
                    <i class="fa-solid fa-trash"></i></button></td>
                `;

                workEntriesTableBody.appendChild(newRow);
                sumSalary() 
                const deleteButtons = document.querySelectorAll(".delete-button");
                deleteButtons.forEach(button => {
                    button.addEventListener("click", function () {
                        const dateToDelete = button.getAttribute("data-date");
                        const startTimeToDelete = button.getAttribute("data-start");
                        const endTimeToDelete = button.getAttribute("data-end");
                        const indexToDelete = workEntries.findIndex(entry => entry.date === dateToDelete && 
                            entry.startTime === startTimeToDelete && entry.endTime === endTimeToDelete);
                            sumSalary();
                        if (indexToDelete !== -1) {
                            workEntries.splice(indexToDelete, 1);
                            workEntriesTableBody.removeChild(newRow);
                            checkTableVisibility();
                            calculateTotalSalary();
                            updateDailySalaryTable();
                        }
                    });
                });

                checkTableVisibility();
                calculateTotalSalary();
                updateDailySalaryTable();
            }
        }
    });

    calculateSalaryButton.addEventListener("click", function () {
        // Calculate total monthly salary by summing up daily salaries
        const totalMonthlySalary = Array.from(dailySalaries.values()).reduce((acc, dailySalary) => acc + dailySalary, 0);
        totalSalary.innerHTML = `<div class="total-container">Lương tháng: ${totalMonthlySalary} đồng</div>`;
    });

    function calculateTotalSalary() {
        const totalHours = workEntries.reduce((acc, entry) => acc + entry.hoursWorked, 0);
        const totalMonthlySalary = totalHours * hourlyWage;
        totalSalary.innerHTML = `<div class="total-container">Lương tháng: ${totalMonthlySalary} đồng</div>`;
    }

    function updateDailySalaryTable() {
        // Clear previous entries
        dailySalaries.clear();

        // Calculate daily salaries
        workEntries.forEach(entry => {
            const date = entry.date;
            const dailyWage = entry.hoursWorked * hourlyWage;
            if (dailySalaries.has(date)) {
                dailySalaries.set(date, dailySalaries.get(date) + dailyWage);
            } else {
                dailySalaries.set(date, dailyWage);
            }
        });

        // Clear the table
        while (dailySalaryTable.firstChild) {
            dailySalaryTable.removeChild(dailySalaryTable.firstChild);
        }

        // Populate the table with daily salaries
        dailySalaries.forEach((value, date) => {
            const dailyRow = document.createElement("tr");
            dailyRow.innerHTML = `
                <td>${date}</td>
                <td>${value.toFixed(2)}</td>
            `;
            dailySalaryTable.appendChild(dailyRow);
        });
    }

    function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function checkTableVisibility() {
        if (workEntries.length === 0) {
            tableVisible = false;
            const table = document.getElementById("table-salary");
            table.style.display = "none";
        } else {
            tableVisible = true;
            const table = document.getElementById("table-salary");
            table.style.display = "table";
        }
    }
});
function sumSalary(){
    const table = document.getElementById("table-salary");
    var total = 0;
    // Lặp qua các hàng của bảng, bắt đầu từ hàng thứ 1 (hàng đầu tiên chứa tiêu đề)
    for (var i = 1; i < table.rows.length; i++) {
        // Lấy giá trị từ cột thứ 2 (cột "Giá trị") trong hàng hiện tại
        var cell = table.rows[i].cells[4];
        
        // Chuyển đổi giá trị từ chuỗi sang số (nếu cần)
        var value = parseFloat(cell.innerText);
        
        // Thêm giá trị này vào tổng
        if (!isNaN(value)) {
        total += value;
        }
    }
    
    // In ra tổng
    totalSalary.innerHTML = `<div class="total-container">Lương tháng: ${total} đồng</div>`;
}

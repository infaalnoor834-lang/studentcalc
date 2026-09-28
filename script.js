/* =========================
   CGPA CALCULATOR
========================= */

const subjectsContainer = document.getElementById("subjectsContainer");
const addSubjectBtn = document.getElementById("addSubject");
const calculateCGPABtn = document.getElementById("calculateCGPA");


// Add new subject
addSubjectBtn.addEventListener("click", function () {

    const subjectRow = document.createElement("div");

    subjectRow.className = "subject-row";

    subjectRow.innerHTML = `
        <input
            type="text"
            placeholder="e.g. Web Engineering"
            class="subject-name"
        >

        <input
            type="number"
            min="1"
            max="10"
            value="3"
            class="credit-hours"
        >

        <select class="grade">
            <option value="4.0">A</option>
            <option value="3.7">A-</option>
            <option value="3.3">B+</option>
            <option value="3.0" selected>B</option>
            <option value="2.7">B-</option>
            <option value="2.3">C+</option>
            <option value="2.0">C</option>
            <option value="1.7">C-</option>
            <option value="1.3">D+</option>
            <option value="1.0">D</option>
            <option value="0.0">F</option>
        </select>

        <input
            type="text"
            value="3.0"
            class="grade-point"
            readonly
        >

        <button
            class="delete-btn"
            onclick="removeSubject(this)"
        >
            ×
        </button>
    `;

    subjectsContainer.appendChild(subjectRow);

    updateGradePoints();
});


// Remove subject
function removeSubject(button) {

    const rows = document.querySelectorAll(".subject-row");

    if (rows.length <= 1) {
        alert("You need at least one subject.");
        return;
    }

    button.parentElement.remove();

    calculateCGPA();
}


// Update grade points
function updateGradePoints() {

    const rows = document.querySelectorAll(".subject-row");

    rows.forEach(row => {

        const grade = row.querySelector(".grade");
        const gradePoint = row.querySelector(".grade-point");

        gradePoint.value = parseFloat(grade.value).toFixed(1);

        grade.addEventListener("change", function () {
            gradePoint.value = parseFloat(grade.value).toFixed(1);
        });
    });
}


// Calculate CGPA
function calculateCGPA() {

    const rows = document.querySelectorAll(".subject-row");

    let totalCredits = 0;
    let totalQualityPoints = 0;

    rows.forEach(row => {

        const creditHours = parseFloat(
            row.querySelector(".credit-hours").value
        ) || 0;

        const gradePoint = parseFloat(
            row.querySelector(".grade").value
        ) || 0;

        totalCredits += creditHours;

        totalQualityPoints += creditHours * gradePoint;
    });


    let cgpa = 0;

    if (totalCredits > 0) {
        cgpa = totalQualityPoints / totalCredits;
    }


    document.getElementById("cgpaValue").textContent =
        cgpa.toFixed(2);

    document.getElementById("totalCredits").textContent =
        totalCredits.toFixed(1);

    document.getElementById("qualityPoints").textContent =
        totalQualityPoints.toFixed(2);
}


calculateCGPABtn.addEventListener("click", calculateCGPA);


// Calculate automatically when grade/credit changes
subjectsContainer.addEventListener("input", function () {
    updateGradePoints();
});

subjectsContainer.addEventListener("change", function () {
    calculateCGPA();
});


// Initial calculation
updateGradePoints();
calculateCGPA();


/* =========================
   ATTENDANCE CALCULATOR
========================= */

const calculateAttendanceBtn =
    document.getElementById("calculateAttendance");


calculateAttendanceBtn.addEventListener("click", function () {

    const conducted =
        parseInt(document.getElementById("conducted").value);

    const attended =
        parseInt(document.getElementById("attended").value);

    const required =
        parseFloat(
            document.getElementById("requiredAttendance").value
        );


    // Validation

    if (
        isNaN(conducted) ||
        isNaN(attended) ||
        isNaN(required)
    ) {

        alert("Please enter all attendance details.");

        return;
    }


    if (conducted <= 0) {

        alert("Classes conducted must be greater than 0.");

        return;
    }


    if (attended < 0 || attended > conducted) {

        alert(
            "Classes attended cannot be greater than classes conducted."
        );

        return;
    }


    if (required <= 0 || required > 100) {

        alert(
            "Required attendance must be between 1% and 100%."
        );

        return;
    }


    // Current attendance

    const currentPercentage =
        (attended / conducted) * 100;


    document.getElementById("attendancePercentage").textContent =
        currentPercentage.toFixed(1) + "%";


    const status =
        document.getElementById("attendanceStatus");


    const canMissElement =
        document.getElementById("canMiss");

    const classesNeededElement =
        document.getElementById("classesNeeded");


    /*
        Calculate how many future classes
        can be missed while staying above
        required attendance.
    */

    let canMiss = 0;

    if (currentPercentage >= required) {

        /*
            We need:

            attended / (conducted + x) >= required / 100

            Solve for x:

            x <= attended * 100 / required - conducted
        */

        canMiss = Math.floor(
            (attended * 100 / required) - conducted
        );

        if (canMiss < 0) {
            canMiss = 0;
        }

        classesNeededElement.textContent = "0";

        status.textContent =
            `You are above the required ${required}% attendance.`;

        status.style.color = "#238636";

    } else {

        canMiss = 0;

        /*
            Find number of consecutive classes
            student needs to attend.

            (attended + x) / (conducted + x) >= required / 100
        */

        const requiredDecimal = required / 100;

        const needed =
            Math.ceil(
                (
                    requiredDecimal * conducted - attended
                ) /
                (1 - requiredDecimal)
            );

        classesNeededElement.textContent =
            Math.max(0, needed);

        status.textContent =
            `You need to attend approximately ${Math.max(0, needed)} more class(es) to reach ${required}%.`;

        status.style.color = "#d1242f";
    }


    canMissElement.textContent = canMiss;
});


/* =========================
   DARK MODE
========================= */

const themeToggle =
    document.getElementById("themeToggle");


themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeToggle.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    } else {

        themeToggle.textContent = "🌙";

        localStorage.setItem("theme", "light");
    }
});


// Remember theme
if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀️";
}


/* =========================
   SMOOTH BUTTON BEHAVIOR
========================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const target =
            document.querySelector(this.getAttribute("href"));

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});
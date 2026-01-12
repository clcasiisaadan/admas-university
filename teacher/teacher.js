// ================= LOAD STUDENT =================
const student = JSON.parse(localStorage.getItem("studentApplication"));
const info = document.getElementById("studentInfo");

if (student) {
    info.innerHTML = `
        <b>Name:</b> ${student.fullName}<br>
        <b>Department:</b> ${student.department}
    `;
} else {
    info.textContent = "No student registered yet.";
}

// ================= SAVE ATTENDANCE =================
function saveAttendance() {
    const attendance = {
        date: attDate.value,
        subject: attSubject.value,
        status: attStatus.value
    };

    if (!attendance.date || !attendance.subject) {
        alert("Please fill date and subject");
        return;
    }

    let attendanceList = JSON.parse(localStorage.getItem("attendanceList")) || [];
    attendanceList.push(attendance);

    localStorage.setItem("attendanceList", JSON.stringify(attendanceList));
    alert("Attendance saved ✔");

    attDate.value = "";
    attSubject.value = "";
}

// ================= SAVE EXAM =================
function saveExam() {
    const exam = {
        subject: examSubject.value,
        examName: examName.value,
        score: examScore.value
    };

    if (!exam.subject || !exam.examName || !exam.score) {
        alert("Please fill all exam fields");
        return;
    }

    let exams = JSON.parse(localStorage.getItem("examResults")) || [];
    exams.push(exam);

    localStorage.setItem("examResults", JSON.stringify(exams));
    alert("Exam score saved ✔");

    examSubject.value = "";
    examName.value = "";
    examScore.value = "";
}

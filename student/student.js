  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    window.onload = function() {
        if (!currentUser) {
            window.location.href = "../login/index.html";
            return;
        }

        document.getElementById("welcomeText").innerText = `Ku soo dhowaw, ${currentUser.name}`;
        document.getElementById("studentIDDisplay").innerText = `Student ID: ${currentUser.id}`;
        document.getElementById("displayFaculty").innerText = currentUser.faculty || "General";
        
        loadAttendance();
        loadGrades();
        loadAssignedClasses();
        loadExams();
    };

    // 1. ATTENDANCE LOAD (Halkan ayaa muhiim ah)
    function loadAttendance() {
        const allAttendance = JSON.parse(localStorage.getItem("attendance_records")) || [];
        
        // Sifee (Filter) kaliya attendance-ka ardaygan leeyahay
        const myAttendance = allAttendance.filter(a => a.student.includes(`(${currentUser.id})`));

        const aBody = document.getElementById("attendanceTableBody");
        if (myAttendance.length === 0) {
            aBody.innerHTML = "<tr><td colspan='3' style='text-align:center'>No attendance records found.</td></tr>";
            return;
        }

        let presentCount = 0;
        aBody.innerHTML = myAttendance.map(a => {
            if(a.status === "Present") presentCount++;
            const statusColor = a.status === "Present" ? "#22c55e" : "#ef4444";
            return `<tr>
                <td>${a.date}</td>
                <td>${a.course}</td>
                <td style="color:${statusColor}; font-weight:700">${a.status}</td>
            </tr>`;
        }).reverse().join(''); // Reverse si kan u dambeeyay kor u yimaado

        // Dashboard Summary
        let percentage = Math.round((presentCount / myAttendance.length) * 100);
        document.getElementById("attSummary").innerText = percentage + "%";
    }

    // 2. GRADES LOAD
    function loadGrades() {
        const allGrades = JSON.parse(localStorage.getItem("student_grades")) || [];
        const myGrades = allGrades.filter(g => g.student.includes(`(${currentUser.id})`));

        const gBody = document.getElementById("gradesTableBody");
        gBody.innerHTML = myGrades.map(g => {
            const score = parseInt(g.score);
            return `<tr>
                <td><b>${g.course}</b> (${g.type})</td>
                <td>${g.score}</td>
                <td><span class="badge ${score >= 50 ? 'bg-pass' : 'bg-fail'}">${score >= 50 ? 'PASS' : 'FAIL'}</span></td>
            </tr>`;
        }).join('') || "<tr><td colspan='3' style='text-align:center'>No grades recorded yet.</td></tr>";
    }

    function loadAssignedClasses() {
        const classes = JSON.parse(localStorage.getItem("assignedClasses")) || [];
        const cBody = document.getElementById("coursesTableBody");
        cBody.innerHTML = classes.map(cls => `
            <tr><td><b>${cls.course}</b></td><td><i class="fas fa-user-tie"></i> ${cls.teacher}</td><td>3 Credits</td></tr>
        `).join('') || "<tr><td colspan='3' style='text-align:center'>No courses assigned.</td></tr>";
        document.getElementById("courseCountDisplay").innerText = classes.length;
    }

    function loadExams() {
        const exams = JSON.parse(localStorage.getItem("exams")) || [];
        const eBody = document.getElementById("examsTableBody");
        eBody.innerHTML = exams.map(ex => `
            <tr><td><b>${ex.course}</b></td><td>${ex.type}</td><td>${ex.date}</td><td>${ex.time || '--:--'}</td></tr>
        `).join('') || "<tr><td colspan='4' style='text-align:center'>No exams scheduled.</td></tr>";
    }

    function showSection(id, element) {
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        element.classList.add('active');
    }

    function logout() {
        localStorage.removeItem("currentUser");
        window.location.href = "../login/index.html";
    }
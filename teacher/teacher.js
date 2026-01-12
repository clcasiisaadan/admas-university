 // 1. Load Courses from Admin
    window.onload = function() {
        const courses = JSON.parse(localStorage.getItem("globalCourses")) || [];
        const subjectSelect = document.getElementById("gradeSubject");
        
        if(courses.length === 0) {
            subjectSelect.innerHTML = "<option>Ma jiro koorso...</option>";
        } else {
            courses.forEach(c => {
                subjectSelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
            });
        }
    };

    // 2. Save Grade Logic
    function saveGrade() {
        const sId = document.getElementById("gradeStudentId").value.trim();
        const subject = document.getElementById("gradeSubject").value;
        const mid = document.getElementById("midGrade").value;
        const final = document.getElementById("finalGrade").value;

        if(!sId || !mid || !final) return alert("Fadlan buuxi dhamaan meelaha banaan!");

        // Soo qaado diiwaanka guud ee ardayda (Grades/Attendance)
        let records = JSON.parse(localStorage.getItem("studentRecords")) || {};

        // Haddii ardaygu uusan lahayn diiwon hore, u samee mid cusub
        if(!records[sId]) {
            records[sId] = { grades: [], attendanceDetails: [] };
        }

        // Ku dar darajada cusub
        records[sId].grades.push({
            subject: subject,
            mid: mid,
            final: final,
            crh: 3 // Credit hours (default)
        });

        localStorage.setItem("studentRecords", JSON.stringify(records));
        alert("Darajada si guuleysato ayaa loo diray Ardayga " + sId);
        
        // Clear fields
        document.getElementById("gradeStudentId").value = "";
        document.getElementById("midGrade").value = "";
        document.getElementById("finalGrade").value = "";
    }

    // 3. Save Attendance Logic
    function saveAttendance() {
        const sId = document.getElementById("attStudentId").value.trim();
        const status = document.getElementById("attStatus").value;
        const subject = document.getElementById("gradeSubject").value; // Maadada hadda la doortay
        const today = new Date().toLocaleDateString();

        if(!sId) return alert("Geli Student ID!");

        let records = JSON.parse(localStorage.getItem("studentRecords")) || {};

        if(!records[sId]) {
            records[sId] = { grades: [], attendanceDetails: [] };
        }

        records[sId].attendanceDetails.push({
            date: today,
            subject: subject,
            status: status
        });

        localStorage.setItem("studentRecords", JSON.stringify(records));
        alert(`Attendance-ka ${status} waa loo kaydiyey ardayga ${sId}`);
        document.getElementById("attStudentId").value = "";
    }

    function switchTab(tab) {
        document.getElementById('grades-section').style.display = (tab === 'grades') ? 'block' : 'none';
        document.getElementById('attendance-section').style.display = (tab === 'attendance') ? 'block' : 'none';
        
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }
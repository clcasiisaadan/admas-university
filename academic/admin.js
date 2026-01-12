 // --- LOGOUT FUNCTION ---
    function logoutAdmin() {
        if(confirm("Are you sure you want to logout?")) {
            window.location.href = "login.html"; // Bedel kani magaca boggaaga login-ka
        }
    }

    // --- NAVIGATION & RENDER ---
    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(l => l.getAttribute('onclick').includes(tabId));
        if(activeLink) activeLink.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        renderAll();
    }

    function renderAll() {
        renderRequests();
        renderStudents();
        renderTeachers();
        renderCourses();
        renderClasses();
        renderExams();
        renderGrades();
        renderAttendance();
        updateDropdowns();
    }

    function renderStudents() {
        const s = JSON.parse(localStorage.getItem("students")) || [];
        displayStudentList(s);
    }

    function displayStudentList(list) {
        document.getElementById('studentTable').innerHTML = list.map(x => `
            <tr><td>${x.name}</td><td>${x.id}</td><td>${x.faculty}</td>
            <td><button class="btn-edit" onclick="editStudent('${x.id}')">Edit</button>
            <button class="btn-delete" onclick="deleteItem('students','id','${x.id}')">X</button></td></tr>`).join('');
    }

    function searchStudents() {
        const query = document.getElementById('studentSearch').value.toLowerCase();
        const s = JSON.parse(localStorage.getItem("students")) || [];
        displayStudentList(s.filter(x => x.name.toLowerCase().includes(query) || x.id.toString().includes(query)));
    }

    function saveStudent() {
        const id = document.getElementById('regID').value;
        const eid = document.getElementById('editStudentId').value;
        let s = JSON.parse(localStorage.getItem("students")) || [];
        const data = { id, name: document.getElementById('regName').value, email: document.getElementById('regEmail').value, faculty: document.getElementById('regFaculty').value };
        if(eid) { s[s.findIndex(x => x.id == eid)] = data; } else { s.push(data); }
        localStorage.setItem("students", JSON.stringify(s));
        resetForms(); renderStudents();
    }

    function renderGrades() {
        const g = JSON.parse(localStorage.getItem("student_grades")) || [];
        document.getElementById('gradeTableBody').innerHTML = g.map((x, i) => `
            <tr><td>${x.student}</td><td>${x.course}</td><td>${x.type}</td><td><b>${x.score}</b></td>
            <td><button class="btn-delete" onclick="deleteIndex('student_grades', ${i})">X</button></td></tr>`).join('');
    }

    function saveGrade() {
        const data = {
            student: document.getElementById('gradeStudent').value,
            course: document.getElementById('gradeCourse').value,
            type: document.getElementById('gradeType').value,
            score: document.getElementById('gradeScore').value
        };
        if(!data.score) return alert("Enter score");
        let g = JSON.parse(localStorage.getItem("student_grades")) || [];
        g.push(data);
        localStorage.setItem("student_grades", JSON.stringify(g));
        renderGrades();
    }

    function renderAttendance() {
        const a = JSON.parse(localStorage.getItem("attendance_records")) || [];
        document.getElementById('attTableBody').innerHTML = a.map((x, i) => `
            <tr><td>${x.date}</td><td>${x.student}</td><td>${x.course}</td><td>${x.status}</td>
            <td><button class="btn-delete" onclick="deleteIndex('attendance_records', ${i})">X</button></td></tr>`).join('');
    }

    function saveAttendance() {
        const data = {
            date: document.getElementById('attDate').value,
            student: document.getElementById('attStudent').value,
            course: document.getElementById('attCourse').value,
            status: document.getElementById('attStatus').value
        };
        if(!data.date) return alert("Select Date");
        let a = JSON.parse(localStorage.getItem("attendance_records")) || [];
        a.push(data);
        localStorage.setItem("attendance_records", JSON.stringify(a));
        renderAttendance();
    }

    function updateDropdowns() {
        const s = JSON.parse(localStorage.getItem("students")) || [];
        const c = JSON.parse(localStorage.getItem("globalCourses")) || [];
        const t = JSON.parse(localStorage.getItem("teachers")) || [];
        
        const sOpts = s.map(x => `<option>${x.name} (${x.id})</option>`).join('');
        const cOpts = c.map(x => `<option>${x.name}</option>`).join('');
        const tOpts = t.map(x => `<option>${x.name}</option>`).join('');

        document.getElementById('gradeStudent').innerHTML = sOpts;
        document.getElementById('attStudent').innerHTML = sOpts;
        document.getElementById('gradeCourse').innerHTML = cOpts;
        document.getElementById('attCourse').innerHTML = cOpts;
        document.getElementById('classTeacher').innerHTML = tOpts;
        document.getElementById('classCourse').innerHTML = cOpts;
        document.getElementById('examCourse').innerHTML = cOpts;
    }

    function renderRequests() {
        const r = JSON.parse(localStorage.getItem("admas_registrations")) || [];
        document.getElementById('reqBadge').innerText = r.length;
        document.getElementById('requestTable').innerHTML = r.map((x, i) => `<tr><td>${x.name}</td><td>${x.user||'N/A'}</td><td>${x.faculty}</td><td><button class="btn-view" onclick="reviewRequest(${i})">Review</button></td></tr>`).join('');
    }

    function reviewRequest(index) {
        const r = JSON.parse(localStorage.getItem("admas_registrations")) || [];
        const data = r[index];
        if(!data) return;

        document.getElementById('viewName').innerText = data.name;
        document.getElementById('viewID').innerText = data.user || 'N/A';
        document.getElementById('viewParent').innerText = data.parentName || 'N/A';
        document.getElementById('viewPPhone').innerText = data.parentPhone || 'N/A';
        document.getElementById('viewPhoto').src = data.photo || '';
        document.getElementById('viewCert').src = data.certificate || '';

        document.getElementById('approveBtn').onclick = () => {
            let s = JSON.parse(localStorage.getItem("students")) || [];
            s.push({id: data.user || Date.now(), name: data.name, faculty: data.faculty});
            localStorage.setItem("students", JSON.stringify(s));
            r.splice(index, 1);
            localStorage.setItem("admas_registrations", JSON.stringify(r));
            closeModal(); renderAll(); alert("Student Approved!");
        };
        document.getElementById('rejectBtn').onclick = () => {
            if(confirm("Reject this?")) { r.splice(index, 1); localStorage.setItem("admas_registrations", JSON.stringify(r)); closeModal(); renderAll(); }
        };

        document.getElementById('detailsModal').style.display = "block";
    }

    function deleteItem(k, p, v) { if(confirm("Delete?")) { let list = JSON.parse(localStorage.getItem(k)).filter(x => x[p] != v); localStorage.setItem(k, JSON.stringify(list)); renderAll(); } }
    function deleteIndex(k, i) { if(confirm("Delete this record?")) { let d = JSON.parse(localStorage.getItem(k)); d.splice(i, 1); localStorage.setItem(k, JSON.stringify(d)); renderAll(); } }
    
    function resetForms() { document.querySelectorAll('input').forEach(i => i.value = ""); document.getElementById('studentSaveBtn').innerText = "Save Student"; }
    function closeModal() { document.getElementById('detailsModal').style.display = "none"; }

    function saveTeacher() {
        let t = JSON.parse(localStorage.getItem("teachers")) || [];
        t.push({name:document.getElementById('tName').value, user:document.getElementById('tUser').value, dept:document.getElementById('tDept').value});
        localStorage.setItem("teachers", JSON.stringify(t)); renderTeachers();
    }
    function renderTeachers() {
        const t = JSON.parse(localStorage.getItem("teachers")) || [];
        document.getElementById('teacherTableBody').innerHTML = t.map(x => `<tr><td>${x.name}</td><td>${x.user}</td><td>${x.dept}</td><td><button class="btn-delete" onclick="deleteItem('teachers','user','${x.user}')">X</button></td></tr>`).join('');
    }
    function saveCourse() {
        let c = JSON.parse(localStorage.getItem("globalCourses")) || [];
        c.push({id:Date.now(), name:document.getElementById('courseName').value, crh:document.getElementById('courseCrh').value});
        localStorage.setItem("globalCourses", JSON.stringify(c)); renderCourses();
    }
    function renderCourses() {
        const c = JSON.parse(localStorage.getItem("globalCourses")) || [];
        document.getElementById('courseTableBody').innerHTML = c.map(x => `<tr><td>${x.name}</td><td>${x.crh}</td><td><button class="btn-delete" onclick="deleteItem('globalCourses','id','${x.id}')">X</button></td></tr>`).join('');
    }
    function saveClass() {
        let cl = JSON.parse(localStorage.getItem("assignedClasses")) || [];
        cl.push({id:Date.now(), teacher:document.getElementById('classTeacher').value, course:document.getElementById('classCourse').value});
        localStorage.setItem("assignedClasses", JSON.stringify(cl)); renderClasses();
    }
    function renderClasses() {
        const cl = JSON.parse(localStorage.getItem("assignedClasses")) || [];
        document.getElementById('classTableBody').innerHTML = cl.map(x => `<tr><td>${x.teacher}</td><td>${x.course}</td><td><button class="btn-delete" onclick="deleteItem('assignedClasses','id','${x.id}')">X</button></td></tr>`).join('');
    }
    function saveExam() {
        let e = JSON.parse(localStorage.getItem("exams")) || [];
        e.push({id:Date.now(), course:document.getElementById('examCourse').value, type:document.getElementById('examType').value, date:document.getElementById('examDate').value});
        localStorage.setItem("exams", JSON.stringify(e)); renderExams();
    }
    function renderExams() {
        const e = JSON.parse(localStorage.getItem("exams")) || [];
        document.getElementById('examTableBody').innerHTML = e.map(x => `<tr><td>${x.course}</td><td>${x.type}</td><td>${x.date}</td><td><button class="btn-delete" onclick="deleteItem('exams','id','${x.id}')">X</button></td></tr>`).join('');
    }

    window.onload = renderAll;
// --- AUTH & LOGOUT ---
    function logoutAdmin() {
        localStorage.removeItem("currentUser");
        window.location.href = "../login/index.html";
    }

    // --- NAVIGATION & RENDER ---
    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(tabId)) {
                link.classList.add('active');
            }
        });

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

    // --- STUDENT MANAGEMENT ---
    function renderStudents() {
        // Halkan waxaan ka soo akhrineynaa xogta hadda jirta
        const s = JSON.parse(localStorage.getItem("students")) || [];
        displayStudentList(s);
    }

    function displayStudentList(list) {
        const table = document.getElementById('studentTable');
        table.innerHTML = ""; // Nadiifi table-ka horta

        list.forEach(x => {
            const row = `
                <tr>
                    <td>${x.name}</td>
                    <td>${x.id}</td>
                    <td>${x.faculty}</td>
                    <td>
                        <button class="btn-edit" onclick="editStudent('${x.id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteItem('students','id','${x.id}')">X</button>
                    </td>
                </tr>`;
            table.innerHTML += row;
        });
    }

    // --- SEARCH FUNCTION (Halkan ayaa la saxay) ---
    function searchStudents() {
        const query = document.getElementById('studentSearch').value.toLowerCase();
        const allStudents = JSON.parse(localStorage.getItem("students")) || [];
        
        // Shaandhee liiska iyadoo la eegayo magaca ama ID-ga
        const filtered = allStudents.filter(s => {
            return s.name.toLowerCase().includes(query) || 
                   s.id.toString().toLowerCase().includes(query);
        });

        // Dib u tusi liiska la shaandheeyay
        displayStudentList(filtered);
    }

    function saveStudent() {
        const id = document.getElementById('regID').value;
        const eid = document.getElementById('editStudentId').value;
        let s = JSON.parse(localStorage.getItem("students")) || [];
        
        const data = { 
            id, 
            name: document.getElementById('regName').value, 
            email: document.getElementById('regEmail').value, 
            faculty: document.getElementById('regFaculty').value 
        };

        if(!data.name || !data.id) return alert("Please fill Name and ID");
        
        if(eid) { 
            const idx = s.findIndex(x => x.id == eid);
            if(idx !== -1) s[idx] = data; 
        } else { 
            s.push(data); 
        }
        
        localStorage.setItem("students", JSON.stringify(s));
        resetForms(); 
        renderStudents();
    }

    function editStudent(id) {
        const s = JSON.parse(localStorage.getItem("students")) || [];
        const student = s.find(x => x.id == id);
        if(student) {
            document.getElementById('regName').value = student.name;
            document.getElementById('regID').value = student.id;
            document.getElementById('regEmail').value = student.email || "";
            document.getElementById('regFaculty').value = student.faculty;
            document.getElementById('editStudentId').value = student.id;
            document.getElementById('studentSaveBtn').innerText = "Update Student";
            window.scrollTo(0,0);
        }
    }

    // --- GRADES ---
    function renderGrades() {
        const g = JSON.parse(localStorage.getItem("student_grades")) || [];
        document.getElementById('gradeTableBody').innerHTML = g.map((x, i) => `
            <tr>
                <td>${x.student}</td>
                <td>${x.course}</td>
                <td>${x.type}</td>
                <td><b>${x.score}</b></td>
                <td><button class="btn-delete" onclick="deleteIndex('student_grades', ${i})">X</button></td>
            </tr>`).join('');
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

    // --- ATTENDANCE ---
    function renderAttendance() {
        const a = JSON.parse(localStorage.getItem("attendance_records")) || [];
        document.getElementById('attTableBody').innerHTML = a.map((x, i) => `
            <tr>
                <td>${x.date}</td>
                <td>${x.student}</td>
                <td>${x.course}</td>
                <td>${x.status}</td>
                <td><button class="btn-delete" onclick="deleteIndex('attendance_records', ${i})">X</button></td>
            </tr>`).join('');
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

    // --- UI HELPERS ---
    function updateDropdowns() {
        const s = JSON.parse(localStorage.getItem("students")) || [];
        const c = JSON.parse(localStorage.getItem("globalCourses")) || [];
        const t = JSON.parse(localStorage.getItem("teachers")) || [];
        
        const sOpts = s.length ? s.map(x => `<option value="${x.name} (${x.id})">${x.name} (${x.id})</option>`).join('') : "<option>No Students</option>";
        const cOpts = c.length ? c.map(x => `<option value="${x.name}">${x.name}</option>`).join('') : "<option>No Courses</option>";
        const tOpts = t.length ? t.map(x => `<option value="${x.name}">${x.name}</option>`).join('') : "<option>No Teachers</option>";

        document.getElementById('gradeStudent').innerHTML = sOpts;
        document.getElementById('attStudent').innerHTML = sOpts;
        document.getElementById('gradeCourse').innerHTML = cOpts;
        document.getElementById('attCourse').innerHTML = cOpts;
        document.getElementById('classTeacher').innerHTML = tOpts;
        document.getElementById('classCourse').innerHTML = cOpts;
        document.getElementById('examCourse').innerHTML = cOpts;
    }

    // --- ADMISSION REQUESTS ---
    function renderRequests() {
        const r = JSON.parse(localStorage.getItem("admas_registrations")) || [];
        document.getElementById('reqBadge').innerText = r.length;
        document.getElementById('requestTable').innerHTML = r.map((x, i) => `
            <tr>
                <td>${x.name}</td>
                <td>${x.user||'N/A'}</td>
                <td>${x.faculty}</td>
                <td><button class="btn-view" onclick="reviewRequest(${i})">Review</button></td>
            </tr>`).join('');
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
            if(confirm("Reject this?")) { 
                r.splice(index, 1); 
                localStorage.setItem("admas_registrations", JSON.stringify(r)); 
                closeModal(); 
                renderAll(); 
            }
        };

        document.getElementById('detailsModal').style.display = "block";
    }

    // --- GENERAL DELETE & FORM RESET ---
    function deleteItem(k, p, v) { 
        if(confirm("Delete?")) { 
            let list = JSON.parse(localStorage.getItem(k)) || [];
            list = list.filter(x => x[p] != v); 
            localStorage.setItem(k, JSON.stringify(list)); 
            renderAll(); 
        } 
    }
    
    function deleteIndex(k, i) { 
        if(confirm("Delete this record?")) { 
            let d = JSON.parse(localStorage.getItem(k)) || [];
            d.splice(i, 1); 
            localStorage.setItem(k, JSON.stringify(d)); 
            renderAll(); 
        } 
    }
    
    function resetForms() { 
        document.querySelectorAll('input').forEach(i => i.value = ""); 
        if(document.getElementById('studentSaveBtn')) document.getElementById('studentSaveBtn').innerText = "Save Student"; 
        document.getElementById('editStudentId').value = "";
    }
    
    function closeModal() { 
        document.getElementById('detailsModal').style.display = "none"; 
    }

    // --- TEACHERS, COURSES, CLASSES & EXAMS ---
    function saveTeacher() {
        let t = JSON.parse(localStorage.getItem("teachers")) || [];
        t.push({name:document.getElementById('tName').value, user:document.getElementById('tUser').value, dept:document.getElementById('tDept').value});
        localStorage.setItem("teachers", JSON.stringify(t)); 
        renderTeachers();
        resetForms();
    }
    
    function renderTeachers() {
        const t = JSON.parse(localStorage.getItem("teachers")) || [];
        document.getElementById('teacherTableBody').innerHTML = t.map(x => `<tr><td>${x.name}</td><td>${x.user}</td><td>${x.dept}</td><td><button class="btn-delete" onclick="deleteItem('teachers','user','${x.user}')">X</button></td></tr>`).join('');
    }
    
    function saveCourse() {
        let c = JSON.parse(localStorage.getItem("globalCourses")) || [];
        c.push({id:Date.now(), name:document.getElementById('courseName').value, crh:document.getElementById('courseCrh').value});
        localStorage.setItem("globalCourses", JSON.stringify(c)); 
        renderCourses();
        resetForms();
    }
    
    function renderCourses() {
        const c = JSON.parse(localStorage.getItem("globalCourses")) || [];
        document.getElementById('courseTableBody').innerHTML = c.map(x => `<tr><td>${x.name}</td><td>${x.crh}</td><td><button class="btn-delete" onclick="deleteItem('globalCourses','id','${x.id}')">X</button></td></tr>`).join('');
    }
    
    function saveClass() {
        let cl = JSON.parse(localStorage.getItem("assignedClasses")) || [];
        cl.push({id:Date.now(), teacher:document.getElementById('classTeacher').value, course:document.getElementById('classCourse').value});
        localStorage.setItem("assignedClasses", JSON.stringify(cl)); 
        renderClasses();
    }
    
    function renderClasses() {
        const cl = JSON.parse(localStorage.getItem("assignedClasses")) || [];
        document.getElementById('classTableBody').innerHTML = cl.map(x => `<tr><td>${x.teacher}</td><td>${x.course}</td><td><button class="btn-delete" onclick="deleteItem('assignedClasses','id','${x.id}')">X</button></td></tr>`).join('');
    }
    
    function saveExam() {
        let e = JSON.parse(localStorage.getItem("exams")) || [];
        e.push({id:Date.now(), course:document.getElementById('examCourse').value, type:document.getElementById('examType').value, date:document.getElementById('examDate').value});
        localStorage.setItem("exams", JSON.stringify(e)); 
        renderExams();
        resetForms();
    }
    
    function renderExams() {
        const e = JSON.parse(localStorage.getItem("exams")) || [];
        document.getElementById('examTableBody').innerHTML = e.map(x => `<tr><td>${x.course}</td><td>${x.type}</td><td>${x.date}</td><td><button class="btn-delete" onclick="deleteItem('exams','id','${x.id}')">X</button></td></tr>`).join('');
    }

    window.onload = renderAll;
 let currentRole = "Student";

    function selectRole(role) {
        currentRole = role;
        document.querySelectorAll('.role-item').forEach(item => item.classList.remove('active'));
        document.getElementById('role' + role).classList.add('active');
        document.getElementById('loginTitle').innerText = role + " Access";
        document.getElementById('regLink').style.visibility = (role === 'Student') ? 'visible' : 'hidden';
    }

    function handleLogin() {
        // Waxaan ku daray .trim() si haddii boos (space) uu jiro looga saaro
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value.trim();

        if (!user || !pass) {
            alert("Fadlan geli Username iyo Password!");
            return;
        }

        if (currentRole === "Admin") {
            if (user === "admin" && pass === "1234") {
                window.location.href = "../academic/admin-dashboard.html";
            } else {
                alert("Admin Credentials incorrect!");
            }
        } 
        else if (currentRole === "Instructor") {
            const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
            const found = teachers.find(t => (t.user === user || t.id === user) && t.pass === pass);
            if (found) {
                localStorage.setItem('currentUser', JSON.stringify(found));
                window.location.href = "../teacher/teacher-dashboard.html";
            } else {
                alert("Macallin lama helin!");
            }
        } 
        else {
            // LOGIN-KA ARDAYGA (Halkan ayaa muhiim ah)
            const students = JSON.parse(localStorage.getItem('students')) || [];
            
            // Waxaan hubineynaa ID-ga iyo Password-ka
            // FG: Hubi in Admin-ka uu ku daray 'password' ee uusan u qorin 'pass'
            const found = students.find(s => s.id === user && s.password === pass);

            if (found) {
                localStorage.setItem('currentUser', JSON.stringify(found));
                alert("Si guul leh ayaad u soo gashay, " + found.name);
                window.location.href = "../student/student-dashboard.html";
            } else {
                alert("ID ama Password-ka waa khalad! Hubi in Admin-ku ku daray si sax ah.");
            }
        }
    }
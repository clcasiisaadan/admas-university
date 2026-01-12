 let currentRole = "Student";

    function selectRole(role) {
        currentRole = role;
        document.querySelectorAll('.role-item').forEach(el => el.classList.remove('active'));
        document.getElementById('role' + role).classList.add('active');
        document.getElementById('loginTitle').innerText = role + " Login";
        document.getElementById('regFooter').style.display = (role === 'Student') ? 'block' : 'none';
    }

    function toggleModal(show) { document.getElementById('regModal').style.display = show ? 'flex' : 'none'; }

    // Convert Image to Base64
    const toBase64 = file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    });

    // Handle Registration
    document.getElementById('admissionForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const photo = await toBase64(document.getElementById('stdPhoto').files[0]);
        const cert = await toBase64(document.getElementById('stdCert').files[0]);

        const data = {
            name: document.getElementById('stdName').value,
            id: document.getElementById('stdID').value,
            password: document.getElementById('stdPass').value,
            parentName: document.getElementById('pName').value,
            parentPhone: document.getElementById('pPhone').value,
            photoData: photo,
            certData: cert,
            status: "Pending"
        };

        let pending = JSON.parse(localStorage.getItem('admas_registrations')) || [];
        pending.push(data);
        localStorage.setItem('admas_registrations', JSON.stringify(pending));
        alert("Codsigaaga si guul leh ayaa loo diray! Fadlan sug inta Admin-ku ka ansixinayo.");
        location.reload();
    });

    // LOGIN FUNCTION
    function handleLogin() {
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        if (currentRole === "Admin") {
            if (user === "admin" && pass === "1234") {
                window.location.href = "../academic/admin-dashboard.html"; 
            } else {
                alert("Admin login failed!");
            }
        } 
        else if (currentRole === "Instructor") {
            let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
            // Macalinka wuxuu ku galayaa Username iyo Password
            const t = teachers.find(x => x.user === user && x.pass === pass);
            if (t) {
                localStorage.setItem("currentUser", JSON.stringify(t));
                window.location.href = "../teacher/teacher-dashboard.html";
            } else {
                alert("Macalinka: Username ama Password waa khalad!");
            }
        } 
        else {
            let students = JSON.parse(localStorage.getItem('students')) || [];
            // Ardayga wuxuu ku galayaa ID-gii uu doortay iyo Password-kiisii
            const s = students.find(x => x.id === user && x.password === pass);
            if (s) {
                localStorage.setItem("currentUser", JSON.stringify(s));
                window.location.href = "../student/student-dashboard.html";
            } else {
                alert("Ardayga: ID ama Password waa khalad!");
            }
        }
    }
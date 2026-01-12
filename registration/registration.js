const form = document.getElementById("registerForm");
const photoInput = document.getElementById("photo");

let photoBase64 = "";

// Convert image to Base64
photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        photoBase64 = reader.result;
    };
    reader.readAsDataURL(file);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const studentData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        department: document.getElementById("department").value,
        parentName: document.getElementById("parentName").value,
        parentPhone: document.getElementById("parentPhone").value,
        photo: photoBase64,
        status: "Pending"
    };

    // Save for Student Portal
    localStorage.setItem(
        "studentApplication",
        JSON.stringify(studentData)
    );

    alert("✅ Application Submitted Successfully");

    // redirect
    window.location.href = "student.html";
});

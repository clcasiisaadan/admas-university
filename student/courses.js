window.onload = function() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const records = JSON.parse(localStorage.getItem("studentRecords")) || {};

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const myData = records[user.id];
    const grid = document.getElementById("courseGrid");
    const emptyState = document.getElementById("noCourses");
    const countBadge = document.getElementById("totalCourseNum");

    // Maaddooyinka waxaa laga soo saaraa qaybta 'grades' ee Admin-ku soo dhigay
    if (myData && myData.grades && myData.grades.length > 0) {
        const courses = myData.grades;
        countBadge.innerText = courses.length;
        grid.innerHTML = "";

        courses.forEach((course, index) => {
            const card = `
                <div class="course-card" style="animation-delay: ${index * 0.1}s">
                    <h3>${course.subject}</h3>
                    <div class="course-meta">
                        <div class="meta-item">
                            <i class="fas fa-hashtag"></i>
                            <span>Code: ${course.subject.substring(0,3).toUpperCase()}-101</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>Credit Hours: ${course.crh} Units</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>Instructor: Dr. Assigned</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <span class="status-active">● Active</span>
                        <span style="font-size: 0.8rem; color: #94a3b8;">Semester 1</span>
                    </div>
                </div>`;
            grid.innerHTML += card;
        });
    } else {
        grid.style.display = "none";
        emptyState.style.display = "block";
    }
};
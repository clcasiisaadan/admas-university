window.onload = function() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const records = JSON.parse(localStorage.getItem("studentRecords")) || {};

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const myData = records[user.id];
    if (myData && myData.attendanceDetails) {
        const history = myData.attendanceDetails;
        const tableBody = document.getElementById("attendanceData");
        
        let presentCount = 0;
        tableBody.innerHTML = ""; // Nadiifi shaxda horta

        // 1. Soo bandhig xogta (Ugu dambaysay xagga sare)
        history.reverse().forEach(entry => {
            const isPresent = entry.status === "Present";
            if (isPresent) presentCount++;

            const row = `
                <tr>
                    <td>${entry.date}</td>
                    <td>${entry.subject}</td>
                    <td>
                        <span class="status-label ${isPresent ? 'status-present' : 'status-absent'}">
                            ${entry.status}
                        </span>
                    </td>
                </tr>`;
            tableBody.innerHTML += row;
        });

        // 2. Xisaabi Statistics-ka
        const total = history.length;
        const absentCount = total - presentCount;
        const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

        // 3. Cusboonaysii interface-ka
        document.getElementById("totalSessions").innerText = total;
        document.getElementById("presentCount").innerText = presentCount;
        document.getElementById("absentCount").innerText = absentCount;
        document.getElementById("attendancePercent").innerText = percentage + "%";
        document.getElementById("progressFill").style.width = percentage + "%";
    }
};
window.onload = function() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const records = JSON.parse(localStorage.getItem("studentRecords")) || {};

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const myData = records[user.id];
    if (myData && myData.grades) {
        const gradeRows = document.getElementById("gradeRows");
        let totalWeightedPoints = 0;
        let totalCrh = 0;

        gradeRows.innerHTML = ""; // Nadiifi shaxda

        myData.grades.forEach(g => {
            const mid = parseInt(g.mid) || 0;
            const final = parseInt(g.final) || 0;
            const crh = parseInt(g.crh) || 0;
            const total = mid + final;

            // Xisaabinta Grade-ka iyo Point-ga
            let letterGrade, points;
            if (total >= 90) { letterGrade = 'A'; points = 4.0; }
            else if (total >= 80) { letterGrade = 'B'; points = 3.0; }
            else if (total >= 70) { letterGrade = 'C'; points = 2.0; }
            else if (total >= 50) { letterGrade = 'D'; points = 1.0; }
            else { letterGrade = 'F'; points = 0.0; }

            totalWeightedPoints += (points * crh);
            totalCrh += crh;

            const row = `
                <tr>
                    <td>${g.subject}</td>
                    <td>${mid}</td>
                    <td>${final}</td>
                    <td><strong>${total}</strong></td>
                    <td><span class="grade-badge grade-${letterGrade}">${letterGrade}</span></td>
                    <td>${points.toFixed(1)}</td>
                </tr>`;
            gradeRows.innerHTML += row;
        });

        // Xisaabi GPA-ga Kama dambaysta ah
        const finalGPA = totalCrh > 0 ? (totalWeightedPoints / totalCrh).toFixed(2) : "0.00";
        
        // Cusboonaysii interface-ka
        document.getElementById("gpaScore").innerText = finalGPA;
        document.getElementById("totalCrh").innerText = totalCrh;
        document.getElementById("totalPoints").innerText = totalWeightedPoints.toFixed(1);

        // GPA Status Message
        const statusBox = document.getElementById("gpaStatus");
        if (finalGPA >= 3.5) statusBox.innerText = "Excellent / Honor List";
        else if (finalGPA >= 2.5) statusBox.innerText = "Good Standing";
        else statusBox.innerText = "Academic Warning";
    }
};
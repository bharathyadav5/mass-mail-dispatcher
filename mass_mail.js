
let upload = document.getElementById('upload');
upload.addEventListener('change', () => {
    let frm = new FileReader();
    frm.readAsText(upload.files[0]);

    frm.onload = function () {
        let arr = frm.result.split(/\r?\n|\n/).map(e => e.split(','));

        // Initialize counts and arrays
        window.valNo = 0;
        let invalNo = 0;
        window.valMail = [];

        arr.forEach(e => {
            let email = String(e).trim();
            let rowContent = e.map(item => `<td>${item}</td>`).join('');
            let newRow = document.createElement("tr");
            newRow.innerHTML = rowContent;

            if (email) {
                // Simple email regex to validate structure
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (emailRegex.test(email)) {
                    // Store the row and email for sending later
                    window.valMail.push({ email, row: newRow });
                } else {
                    document.querySelector("table#inval").appendChild(newRow);
                    invalNo += 1;
                }
            }
        });

        // Update invalid email count
        document.querySelector('#invalCount').textContent = invalNo;
    };
});

// Sending Emails and updating rows based on success/failure
function emailSend() {
    if (!window.valMail.length) {
        alert("No valid emails to send.");
        return;
    }

    const subject = document.querySelector('#subject').value;
    const body = document.getElementById('mesg').value;

    if (!subject || !body) {
        alert("Subject and message body are required.");
        return;
    }

    let successfulEmails = 0;
    let failedEmails = 0;

    window.valMail.forEach(({ email, row }) => {
        Email.send({
            Host: "smtp.elasticemail.com",
            Username: "gunamonibharath@gmail.com",
            Password: "bharath123", // Replace with a secure way to store passwords
            To: email,
            From: "gunamonibharath@gmail.com",
            Subject: subject,
            Body: body
        }).then(message => {
            // Append row to valid table on success
            document.querySelector("table#val").appendChild(row);
            successfulEmails++;
            updateCounts();
        }).catch(error => {
            // Append row to invalid table on failure
            console.error(`Failed to send email to ${email}:`, error);
            document.querySelector("table#inval").appendChild(row);
            failedEmails++;
            updateCounts();
        });
    });

    function updateCounts() {
        document.querySelector('#valCount').textContent = successfulEmails;
        if(invalNo){
            document.querySelector('#invalCount').textContent = invalNo;
        }
        else{
            document.querySelector('#invalCount').textContent = failedEmails;
        }
    }

    console.log("Subject:", subject);
    console.log("Body:", body);
}

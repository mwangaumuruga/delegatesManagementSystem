document.addEventListener('DOMContentLoaded', function () {
    const delegateForm = document.getElementById('delegateForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const orgInput = document.getElementById('organization');
    const genderInput = document.getElementById('gender');
    const positionInput = document.getElementById('position');
    const partyInput = document.getElementById('party'); // Assuming "party" dropdown exists
    const delegateList = document.getElementById('delegateList');
    const submitBtn = document.getElementById('submitBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    let delegates = [];
    let editIndex = null;
    let chatStep = 0; // To track chat prompts
    let currentCandidate = {}; // Store candidate during chat input

    // Function to render delegates in the table
    function renderDelegates() {
        delegateList.innerHTML = '';
        delegates.forEach((delegate, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${delegate.firstName} ${delegate.lastName}</td>
                <td>${delegate.email}</td>
                <td>${delegate.organization}</td>
                <td>${delegate.gender}</td>
                <td>${delegate.position}</td>
                <td>${delegate.party}</td>
                <td>
                    <div class="actions">
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </div>
                </td>
            `;
            delegateList.appendChild(row);
        });

        updateCharts(); // Update the charts when the delegates are rendered
    }

    // Function to add a message to the chatbox
    function addChatMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom
    }

    // Chat functionality to process commands
    document.getElementById('sendMessage').addEventListener('click', function () {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage(`You: ${message}`);
            processChatCommand(message);
            chatInput.value = ''; // Clear the chat input
        }
    });

    // Function to process chat commands
    function processChatCommand(command) {
        if (chatStep === 0 && command.toLowerCase() === 'add candidate') {
            addChatMessage('Please enter the first name:');
            chatStep = 1;
        } else if (chatStep === 1) {
            currentCandidate.firstName = command;
            addChatMessage(`First Name set to: ${command}. Please enter the last name:`);
            chatStep = 2;
        } else if (chatStep === 2) {
            currentCandidate.lastName = command;
            addChatMessage(`Last Name set to: ${command}. Please enter the email:`);
            chatStep = 3;
        } else if (chatStep === 3) {
            currentCandidate.email = command;
            addChatMessage(`Email set to: ${command}. Please enter the organization:`);
            chatStep = 4;
        } else if (chatStep === 4) {
            currentCandidate.organization = command;
            addChatMessage(`Organization set to: ${command}. Please select gender (male/female/other):`);
            chatStep = 5;
        } else if (chatStep === 5) {
            if (['male', 'female', 'other'].includes(command.toLowerCase())) {
                currentCandidate.gender = command;
                addChatMessage(`Gender set to: ${command}. Please select position (secretary/treasurer/director/governor):`);
                chatStep = 6;
            } else {
                addChatMessage('Please enter a valid gender (male/female/other):');
            }
        } else if (chatStep === 6) {
            if (['secretary', 'treasurer', 'director', 'governor'].includes(command.toLowerCase())) {
                currentCandidate.position = command;
                addChatMessage(`Position set to: ${command}. Please select political party (democratic/republican):`);
                chatStep = 7;
            } else {
                addChatMessage('Please enter a valid position (secretary/treasurer/director/governor):');
            }
        } else if (chatStep === 7) {
            if (['democratic', 'republican'].includes(command.toLowerCase())) {
                currentCandidate.party = command;
                delegates.push(currentCandidate); // Save the candidate to the delegate list
                renderDelegates(); // Re-render the delegate list
                addChatMessage('Candidate added successfully!');
                currentCandidate = {}; // Reset candidate
                chatStep = 0; // Reset chat step
            } else {
                addChatMessage('Please enter a valid political party (democratic/republican):');
            }
        } else if (command.toLowerCase().startsWith('show candidate')) {
            const name = command.replace('show candidate', '').trim().toLowerCase();
            const found = delegates.find(d => 
                `${d.firstName} ${d.lastName}`.toLowerCase() === name
            );
            if (found) {
                addChatMessage(`Candidate: ${found.firstName} ${found.lastName}, Email: ${found.email}, Party: ${found.party}`);
            } else {
                addChatMessage(`No candidate found with the name: ${name}`);
            }
        }
    }

    // Function to update charts
    function updateCharts() {
        const maleCount = delegates.filter(d => d.gender === 'male').length;
        const femaleCount = delegates.filter(d => d.gender === 'female').length;
        const otherCount = delegates.filter(d => d.gender === 'other').length;

        const democraticCount = delegates.filter(d => d.party === 'democratic').length;
        const republicanCount = delegates.filter(d => d.party === 'republican').length;

        // Update Pie Chart
        const pieChart = document.getElementById('genderChart').getContext('2d');
        new Chart(pieChart, {
            type: 'doughnut',
            data: {
                labels: ['Male', 'Female', 'Other'],
                datasets: [{
                    data: [maleCount, femaleCount, otherCount],
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
                }]
            }
        });

        // Update Bar Chart
        const barChart = document.getElementById('partyChart').getContext('2d');
        new Chart(barChart, {
            type: 'bar',
            data: {
                labels: ['Democratic', 'Republican'],
                datasets: [{
                    data: [democraticCount, republicanCount],
                    backgroundColor: ['#4e73df', '#e74a3b']
                }]
            }
        });
    }
});

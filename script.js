import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCXbM_3wl8NPPouJqYaDm-ljZ6h5kiUQc0",
    authDomain: "hungry4beers.firebaseapp.com",
    databaseURL: "https://hungry4beers-default-rtdb.firebaseio.com",
    projectId: "hungry4beers",
    storageBucket: "hungry4beers.appspot.com",
    messagingSenderId: "602382468716",
    appId: "1:602382468716:web:7e223d6b26c5e42e8d7a49",
    measurementId: "G-Z4CPL8YEX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    // Add event listeners after DOM content has loaded
    document.getElementById('submit-answer-button').addEventListener('click', submitAnswer);
    document.getElementById('submit-name-button').addEventListener('click', submitName);

    // Load responses from Firebase
    loadResponsesFromFirebase();
});


// Function to add a response to Firebase
function addResponse(name, response) {
    console.log("Attempting to add response: ", { name, response });  // Log for debugging

    const newResponseKey = push(ref(database, 'responses')).key;  // Generate a unique key
    const responseData = {
        name: name || "Anonymous",
        response: response
    };

    // Save response to Firebase
    set(ref(database, 'responses/' + newResponseKey), responseData)
        .then(() => {
            console.log("Response successfully added to Firebase");
        })
        .catch((error) => {
            console.error("Error saving data to Firebase: ", error);
        });
}

// Function to load and display responses from Firebase
function loadResponsesFromFirebase() {
    const tableBody = document.getElementById("table-body");

    // Fetch data from Firebase Realtime Database
    onValue(ref(database, 'responses'), (snapshot) => {
        const responses = snapshot.val();
        console.log("Responses received from Firebase: ", responses);  // Log received data

        tableBody.innerHTML = '';  // Clear the table

        // Iterate through each response and display it
        for (let key in responses) {
            const response = responses[key];
            const newRow = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = response.name;
            newRow.appendChild(nameCell);

            const responseCell = document.createElement("td");
            responseCell.textContent = response.response;
            newRow.appendChild(responseCell);

            tableBody.appendChild(newRow);
        }
    });
}

// Function to handle form submission for the "Yes" option
function submitName() {
    const name = document.getElementById("name").value;

    if (name.trim() !== "") {
        console.log("Submitting name: ", name);  // Log to confirm function is running

        // Add the response with their name for "Yes" choice
        addResponse(name, "butt itchy, want beer");

        // Hide the name input after submission
        document.getElementById("name-section").style.display = "none";

        // Now show the message after they submit their name
        const messageDiv = document.getElementById("result-message");
        messageDiv.textContent = "Regards with itchy butts drink beers with me after work!";

        // Show the responses table after submission
        document.getElementById("response-table").style.display = "block";

        // Apply the "message" class for styling
        messageDiv.classList.add("message");
    } else {
        alert("Please enter your name!");
    }
}


// Function to handle Yes/No response
function submitAnswer() {
    const choice = document.getElementById("beer-choice").value;
    const messageDiv = document.getElementById("result-message");
    const nameSection = document.getElementById("name-section");

    // Disable the submit-answer button to prevent multiple submissions
    document.getElementById('submit-answer-button').disabled = true;

    if (choice === "yes") {
        // Don't show the message yet, just show the name input section
        nameSection.style.display = "block";  // Show name input section if "Yes"
        messageDiv.textContent = "";  // Clear any previous message
    } else {
        // Show the message immediately if they select "No"
        messageDiv.textContent = "LIGMA!";
        nameSection.style.display = "none";  // Hide name input section for "No"

        // Automatically store their name as "Regard" and record the response as "No"
        addResponse("Regard", "Loser! No itchy butt, hates beer!");

        // Show the responses table immediately
        document.getElementById("response-table").style.display = "block";

        // Apply the "message" class for styling
        messageDiv.classList.add("message");
    }
}

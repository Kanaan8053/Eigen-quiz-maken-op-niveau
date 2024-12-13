// Globale variabelen
let teacherPassword = ""; // Dit wordt ingesteld door de docent
let quizzes = { basisschool: [], middelbaar: [], universiteit: [] }; // Quiz per niveau
let currentLevel = null;
let currentQuestions = [];
let questionNumber = 1; // Houdt het nummer van de vraag bij
let studentAnswers = []; // Houdt de antwoorden van de student bij

// Functie om wachtwoord in te stellen
document.getElementById("set-password-button").addEventListener("click", function() {
    const newPassword = prompt("Voer je nieuwe wachtwoord in:");
    if (newPassword) {
        teacherPassword = newPassword;
        alert("Wachtwoord is ingesteld!");
    }
});

// Docent login functie met foutmelding
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const password = document.getElementById("teacher-password").value;
    if (!password) {
        alert("Dit veld invullen"); // Foutmelding als wachtwoord niet ingevuld is
    } else if (password === teacherPassword) {
        document.getElementById("teacher-login").classList.add("hidden");
        document.getElementById("create-quiz").classList.remove("hidden");
    } else {
        alert("Ongeldig wachtwoord!");
    }
});

// Functie om een vraag toe te voegen
function addQuestion() {
    document.getElementById("question-form").classList.remove("hidden");
}

// Functie om de vraag op te slaan en aan de lijst toe te voegen
document.getElementById("save-question-button").addEventListener("click", function() {
    const questionText = document.getElementById("question-text").value;
    const optionA = document.getElementById("option-a").value;
    const optionB = document.getElementById("option-b").value;
    const optionC = document.getElementById("option-c").value;
    const optionD = document.getElementById("option-d").value;
    const correctAnswer = document.getElementById("correct-answer").value.toUpperCase();

    if (questionText && optionA && optionB && optionC && optionD && correctAnswer) {
        const question = {
            question: questionText,
            options: [optionA, optionB, optionC, optionD],
            correctAnswer: correctAnswer
        };
        currentQuestions.push(question); // Voeg de vraag toe aan de lijst van huidige vragen
        displayQuestions(); // Toon de vragen opnieuw
        alert("Vraag toegevoegd!");
        document.getElementById("question-form").classList.add("hidden");

        // Reset de velden
        document.getElementById("question-text").value = "";
        document.getElementById("option-a").value = "";
        document.getElementById("option-b").value = "";
        document.getElementById("option-c").value = "";
        document.getElementById("option-d").value = "";
        document.getElementById("correct-answer").value = "";

        questionNumber++; // Verhoog de vraagnummering
    } else {
        alert("Vul eerst een vraag in voordat je opslaat!");
    }
});

// Functie om alle toegevoegde vragen weer te geven met vraagnummers
function displayQuestions() {
    const questionsContainer = document.getElementById("question-container");
    questionsContainer.innerHTML = ""; // Leeg de lijst voordat we nieuwe vragen tonen

    currentQuestions.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <p><strong>Vraag ${index + 1}:</strong> ${question.question}</p>
            <ul>
                <li>A: ${question.options[0]}</li>
                <li>B: ${question.options[1]}</li>
                <li>C: ${question.options[2]}</li>
                <li>D: ${question.options[3]}</li>
            </ul>
            <p><strong>Juiste antwoord:</strong> ${question.correctAnswer}</p>
        `;
        questionsContainer.appendChild(questionElement);
    });
}

// Functie om quiz op te slaan
function saveQuiz() {
    const level = document.getElementById("level").value;
    quizzes[level] = [...currentQuestions]; // Sla de vragen op per niveau
    alert("Quiz succesvol opgeslagen!");

    // Verberg de vraagsectie en reset de lijst
    document.getElementById("question-form").classList.add("hidden");
    document.getElementById("question-container").classList.add("hidden");
    document.getElementById("questions").classList.add("hidden");

    // Reset de vragenlijst
    currentQuestions = [];
    questionNumber = 1; // Reset de vraagnummering

    // Verberg de docent login sectie en quiz sectie
    document.getElementById("teacher-login").classList.add("hidden");
    document.getElementById("create-quiz").classList.add("hidden");

    // Laat de login sectie voor leerlingen zien
    document.getElementById("student-login").classList.remove("hidden");
    document.getElementById("student-register").classList.remove("hidden");
}

// Voor de registratie en login van studenten
let students = {};

document.getElementById("student-register-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    if (username && password) {
        students[username] = password;
        alert("Registratie succesvol! Log in met je gebruikersnaam.");
        document.getElementById("student-register").classList.add("hidden");
        document.getElementById("student-login").classList.remove("hidden");
    } else {
        alert("Vul alle velden in!");
    }
});

// Functie voor studenten login
document.getElementById("student-login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("student-username").value;
    const password = document.getElementById("student-password").value;
    if (students[username] === password) {
        alert("Welkom, " + username);

        // Als inloggen succesvol is, redirecten naar de quiz
        redirectToQuiz(username);
    } else {
        alert("Ongeldige gebruikersnaam of wachtwoord!");
    }
});

// Functie om naar de quiz van de docent te gaan
function redirectToQuiz(username) {
    const level = prompt("Kies je niveau (basisschool, middelbaar, universiteit):").toLowerCase();

    // Controleer of de docent een quiz heeft gemaakt voor het geselecteerde niveau
    if (quizzes[level] && quizzes[level].length > 0) {
        alert("Je wordt doorgestuurd naar de quiz!");
        // Toon de quiz
        showQuiz(quizzes[level]);
    } else {
        alert("Deze quiz bestaat niet, omdat de docent geen quiz voor dit niveau heeft aangemaakt.");
    }
}

// Functie om de quiz weer te geven
function showQuiz(questions) {
    let score = 0;
    let currentQuestionIndex = 0;
    studentAnswers = [];

    const quizContainer = document.createElement("div");
    quizContainer.innerHTML = "<h2>Quiz</h2>";
    document.body.appendChild(quizContainer);

    // Toon de eerste vraag
    displayQuestion();

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            quizContainer.innerHTML = `
                <p><strong>Vraag ${currentQuestionIndex + 1}:</strong> ${question.question}</p>
                <ul>
                    <li><input type="radio" name="answer" value="A"> ${question.options[0]}</li>
                    <li><input type="radio" name="answer" value="B"> ${question.options[1]}</li>
                    <li><input type="radio" name="answer" value="C"> ${question.options[2]}</li>
                    <li><input type="radio" name="answer" value="D"> ${question.options[3]}</li>
                </ul>
                <button id="next-question">Volgende vraag</button>
            `;

            // Voeg eventlistener toe aan de knop "Volgende vraag"
            document.getElementById("next-question").addEventListener("click", function() {
                const selectedAnswer = document.querySelector('input[name="answer"]:checked');
                if (selectedAnswer) {
                    studentAnswers.push({
                        question: question.question,
                        studentAnswer: selectedAnswer.value,
                        correctAnswer: question.correctAnswer
                    });
                    if (selectedAnswer.value === question.correctAnswer) {
                        score++;
                    }
                    currentQuestionIndex++;
                    displayQuestion(); // Toon de volgende vraag
                } else {
                    alert("Selecteer een antwoord voordat je verder gaat.");
                }
            });
        } else {
            displayResults();
        }
    }

    function displayResults() {
        quizContainer.innerHTML = `<h2>Quiz voltooid!</h2><p>Je score is: ${score}/${questions.length}</p><h3>Resultaten:</h3>`;
        studentAnswers.forEach(answer => {
            quizContainer.innerHTML += `
                <p>Vraag: ${answer.question}</p>
                <p>Jouw antwoord: ${answer.studentAnswer}</p>
                <p>Juiste antwoord: ${answer.correctAnswer}</p><hr>`;
        });
    }
}

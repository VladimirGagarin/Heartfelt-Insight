document.addEventListener('DOMContentLoaded', async () => {
    const questionArea = document.querySelector('.question-div');
    const choicesArea = document.querySelector('.choices-div');
    const buttonsFromMainContainer = document.querySelector('.container .button-container');
    const buttons = [...buttonsFromMainContainer.querySelectorAll('button')];
    const nextBtn = buttons[0];
    const prevBtn = buttons[1];
    const quoteBtn = buttons[2];
    const copyBtn = buttons[3];
    const copyAllBtn = buttons[4];
    const quoteOverlay = document.querySelector('.quote-overlay');
    // const quoteContent = document.querySelector('.quote-content');
    const quoteClose = document.querySelector('.quote-close');
    const quoteDiv = document.querySelector('.quote-div');
    const answerOverlay = document.querySelector('.answer-overlay');
    const answerClose = document.querySelector('.answer-close');
    const answerArea = document.querySelector('.answer-div');
    const noteArea = document.querySelector('.note-div');
    const buttonFromAnswerContent = document.querySelector('.answer-content .button-container');
    const answerClosebtn = buttonFromAnswerContent.querySelector('button');
    const buttonsFromQuoteContent = document.querySelector('.quote-content .button-container');
    const quoteContentButtons = [...buttonsFromQuoteContent.querySelectorAll('button')];
    const getAnotherQuoteBtn = quoteContentButtons[0];
    const copyQuoteBtn = quoteContentButtons[1];
    const closeOverlay = quoteContentButtons[2];
    const notificationContainer = document.querySelector('.notification-div');
    const closeNotification = document.querySelector('.notification-close');
    const notificationMessage = document.querySelector('.notification-message');
    const closeWelcome = document.querySelector('.close-welcome');

    let currentQuestionIndex = 0;  // Track the current question index
    let currentQuote = -1;
    const questions = [];
    const quotesList = [];


    nextBtn.disabled = false;
    prevBtn.disabled = false;

    await fetchQuestion();
    await getQuote();

    if (questions.length > 0) {
        displayQuestion(0);  // Display the first question
        updateButtonState(); // Enable/disable buttons appropriately
    }

    // Event listeners
    quoteBtn.addEventListener('click', () => {
        quoteOverlay.classList.add('active');
        displayRandomQuote(quoteDiv);
    });

    quoteClose.addEventListener('click', () => {
        quoteOverlay.classList.remove('active');
    });

    closeOverlay.addEventListener('click', () => {
        quoteOverlay.classList.remove('active');
    });

    getAnotherQuoteBtn.addEventListener('click', () => {
        displayRandomQuote(quoteDiv);  // Logic to fetch and display another quote
    });

    answerClosebtn.addEventListener('click', () => {
        answerOverlay.classList.remove('active');
    });

    answerClose.addEventListener('click', () => {
        answerOverlay.classList.remove('active');
    });

    nextBtn.addEventListener('click', () => {
        getNextQuestion();
        updateButtonState();
    });

    prevBtn.addEventListener('click', () => {
        getPrevQuestion();
        updateButtonState();
    });

    copyBtn.addEventListener('click', () => {
        copyQuestion();
    });

    copyAllBtn.addEventListener('click', () => {
        copyQuestionAndOptions();
    });

    copyQuoteBtn.addEventListener('click', () => {
        copyQuote();
    });

    closeNotification.addEventListener('click', () => {
        notificationContainer.classList.remove('active');
    });

    closeWelcome.addEventListener('click', () => {
        closeIntro();
    })

    // Fetch questions from JSON file
    async function fetchQuestion() {
        try {
            const response = await fetch('question.json');
            if (!response.ok) {
                throw new Error('Network error was not ok');
            }
            const data = await response.json();
            questions.push(...data.questions);
        } catch (error) {
            console.error(`There was a problem with the fetch operation: ${error}`);
        }
    }

    // Display a question and its options
    function displayQuestion(index) {
        if (questions[index]) {
            currentQuestionIndex = index;  // Update current question index
            const currentQuestion = questions[index];  // Get current question
            questionArea.innerHTML = `<h2><span>${index + 1}.</span> ${currentQuestion.question}</h2>`;  // Display the question

            // Display the answer options in choicesArea
            choicesArea.innerHTML = '';  // Clear previous answers
            for (const key in currentQuestion.options) {
                const option = document.createElement('div');
                option.classList.add('list-div');
                option.textContent = `${key}: ${currentQuestion.options[key]}`;
                choicesArea.appendChild(option);

                option.addEventListener('click', () => {
                    const isCorrect = checkAnswer(currentQuestion, key);  // Check if answer is correct

                    if (isCorrect) {
                        displayAnswerNote(currentQuestion.note, currentQuestion.answer);  // Show correct answer note
                    } else {
                        vibrateContent(option);  // Vibrate on wrong answer
                    }
                });
            }
        }
    }

    // Update button state based on the current question index
    function updateButtonState() {
        prevBtn.disabled = currentQuestionIndex === 0; // Disable if on the first question
        nextBtn.disabled = currentQuestionIndex === questions.length - 1; // Disable if on the last question
    }

    // Get the next question in the list
    function getNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {  // Check if there is a next question
            displayQuestion(currentQuestionIndex + 1);  // Display the next question
        } else {
            console.log('No more questions!');  // Handle end of questions
            nextBtn.disabled = true;
        }
    }

    function getPrevQuestion() {
        if (currentQuestionIndex >= 0) {  // Check if there is a next question
            displayQuestion(currentQuestionIndex - 1);  // Display the next question
        } else {
            console.log('No more questions!');  // Handle end of questions
            prevBtn.disabled = true;
        }
        
    }

    // Check if the clicked option is correct
    function checkAnswer(question, selectedKey) {
        const correctOption = question.answer;  // Get correct answer from the 'answer' key
        return selectedKey === correctOption;  // Compare the key of the selected option with the correct answer
    }

    // Display the answer note and correct answer
    function displayAnswerNote(note, answer) {
        if (note) {
            answerOverlay.classList.add('active');  // Show the answer overlay
            noteArea.innerHTML = `<p>${note}</p>`;  // Display the note
        }

        answerArea.innerHTML = `<h2>Correct answer: ${answer}</h2>`;  // Display the correct answer
    }

    // Vibrate the content on wrong answer
    function vibrateContent(element) {
        element.classList.add('vibrate');  // Add vibration class
        setTimeout(() => {
            element.classList.remove('vibrate');  // Remove vibration class after the animation
        }, 500);  // Adjust the duration to match CSS animation
    }

    async function getQuote() {
        try {
            const  response = await fetch('quotes.json');
            if(!response.ok) {
                throw new Error ('Network Error');
            }

            const data = await response.json();
            quotesList.push(... data.quotes);
        } catch (error) {
            console.error('Error fetching data');
        }
    }
    
    function   displayRandomQuote(element) {
        const randomIndex = Math.floor(Math.random() * quotesList.length);
        const quote = quotesList[randomIndex];
        currentQuote = randomIndex;

        element.innerHTML = `<h2>${quote.quote}</h2><br> <h4>${quote.author}</h4>`;
    }

    function showMessage (message) {
        notificationContainer.classList.add('active');
        notificationMessage.innerHTML = `<p>${message}</p>`;

        // Automatically hide after 5 seconds
        setTimeout(() => {
            notificationContainer.classList.remove('active');
        }, 5000);
    }
    
    function copyQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        const questionText = `Q: ${currentQuestion.question}`;  // Only copy the question text
        
        navigator.clipboard.writeText(questionText).then(() => {
            showMessage(`Current question ${currentQuestionIndex + 1} copied!`);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    function copyQuote() {
        const currentQuoteObject = quotesList[currentQuote];
        const quoteText = `"${currentQuoteObject.quote}"\n- ${currentQuoteObject.author}`;
    
        navigator.clipboard.writeText(quoteText).then(() => {
            showMessage(`Current quote ${currentQuote + 1} copied!`);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
    
    function copyQuestionAndOptions() {
        const currentQuestion = questions[currentQuestionIndex];
        const questionText = `Q: ${currentQuestion.question}\nOptions:\n`;
        
        // Format the options to be readable
        let optionsText = '';
        for (const key in currentQuestion.options) {
            optionsText += `${key}: ${currentQuestion.options[key]}\n`;
        }
        
        const fullQuestionText = `${questionText}${optionsText}`;
            
        navigator.clipboard.writeText(fullQuestionText).then(() => {
            showMessage(`Current question ${currentQuestionIndex + 1} copied!`);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
        
    }

    function closeIntro() {
        const intro = document.getElementById('welcomeIntro');
        intro.classList.add('fade-out');
        setTimeout(() => {
            document.querySelector('.welcome-overlay').style.display = 'none';
        }, 1000); // Match this duration with the CSS transition duration
    }
});
//-----------------------------------------------------------------------------------------------------------

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
      console.log('Service Worker registration failed:', error);
    });
}

//------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt; // Variable to hold the event

    window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Update UI to notify the user they can install the PWA
    document.getElementById('button-div').style.display = 'block';
    });

    document.getElementById('install-button').addEventListener('click', () => {
    // Hide the install button
    document.getElementById('button-div').style.display = 'none';
    // Show the install prompt
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
        });
    }
    });

    window.addEventListener('appinstalled', (evt) => {
    // Log installation
    console.log('PWA was installed');
    });

})
  
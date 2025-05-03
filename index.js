const timeButtons = document.querySelectorAll('#time-categories button');
const previousStrings = {
    daily: "Yesterday - ",
    weekly: "Last Week - ",
    monthly: "Last Month - "
}

// Gets the JSON that contains the time tracking data.
fetch('/data.json').then((response) => {
    if(!response.ok) return console.log('Error fetching.');
    return response.json();
}).then((data) => {
    // By default, fills the DOM using the weekly data.
    fillDOM(data, 'weekly', true);
    timeButtons[1].classList.add('active');

    // Adds an event listener to each time-categories button.
    timeButtons.forEach((button) => 
        button.addEventListener('click', (event) => {
        // Deletes the clas 'active' of each button.
        timeButtons.forEach((button) =>{button.classList.remove('active')});

        // Adds the class 'active' to the button which fires the event.
        (event.target).classList.add('active');

        // Fills the DOM using the selected time category.
        fillDOM(data, event.target.id);
    }));
    
});

// Fills the DOM using the JSON data.
function fillDOM(data, selectedTimeframe, firstFill) {
    data.forEach(element => {
        // Fills the current hours for each card
        updateTextContent(document.querySelector(`#${normalizeClass(element.title)}-card .hours`),genCurrentString(element, selectedTimeframe), firstFill);
        // Fills the previous hours for each card
        updateTextContent(document.querySelector(`#${normalizeClass(element.title)}-card .last-period`), genPreviousString(element, selectedTimeframe), firstFill);
    });
}

// Normalizes the class names strings.
function normalizeClass(str) {
    return str.toLowerCase().replace(/\s+/g, "-");
}

// Generates the current hours string.
function genCurrentString(element, selectedTimeframe){
    const value = element.timeframes[selectedTimeframe].current;
    return  value + (value!==1? "hrs" : "hr");
}

// Generates the previous hours string.
function genPreviousString(element, selectedTimeframe){
    const value = element.timeframes[selectedTimeframe].previous;
    return  previousStrings[selectedTimeframe] + value + (value!==1? "hrs" : "hr");
}

// Updates the element text content displaying a tiny animation.
function updateTextContent(element, newContent, firstFill) {
    if(firstFill){
        element.textContent = newContent;
    }else{
        // Fade out for the actual text
        gsap.to(element, { opacity: 0, duration: 0.5 });
    
        // After the fade out, update the text.
        setTimeout(() => {
            element.textContent = newContent;
            // Fade in after updating the text.
            gsap.to(element, { opacity: 1, duration: 0.5 });
        }, 500);
    }
}
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
    fillDOM(data, 'weekly');
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
function fillDOM(data, selectedTimeframe) {
    data.forEach(element => {
        // Fills the current hours for each card
        document.querySelector(`#${normalizeClass(element.title)}-card .hours`).textContent = genCurrentString(element, selectedTimeframe);

        // Fills the previous hours for each card
        document.querySelector(`#${normalizeClass(element.title)}-card .last-period`).textContent = genPreviousString(element, selectedTimeframe);
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
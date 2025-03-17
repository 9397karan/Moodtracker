let moods=JSON.parse(localStorage.getItem('moods'))||[]
// Select the container where the dates will be displayed
let dateContainer = document.getElementById('dates');
let currentDates;
// Create a new Date object to track the current date
let date = new Date();


console.log(moods)

//Months array
let month=[
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

// Get the current year and month from the Date object
let currentYear;
let currentMonth
// Function to render the calendar
function renderDate() {
    
    currentYear = date.getFullYear();
    currentMonth = date.getMonth();
    // Clear previous calendar content
    dateContainer.innerHTML = "";

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    // Get the last date of the current month (e.g., 28, 30, 31)
    let lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get the last date of the previous month (for filling empty spaces)
    let lastPrevDate = new Date(currentYear, currentMonth, 0).getDate();

    // Add empty slots for the last few days of the previous month
    for (let i = firstDay; i > 0; i--) {
        let emptyDate = document.createElement('div');
        emptyDate.textContent = lastPrevDate - i + 1;
        emptyDate.classList.add('empty'); // Apply CSS for styling
        dateContainer.appendChild(emptyDate);
    }

    // Add dates of the current month
    for (let i = 1; i <= lastDate; i++) {
        currentDates = document.createElement('div');
        currentDates.innerHTML = `<p class="d">${i}</p>`;
        currentDates.classList.add('date'); // Apply CSS for styling
        currentDates.addEventListener('dragover',dragOver);
        currentDates.addEventListener('drop',allowDrop);
        dateContainer.appendChild(currentDates);


        // Highlight the current date
        if (i == date.getDate() && currentMonth == new Date().getMonth() && currentYear == new Date().getFullYear()) {
            currentDates.classList.add('active'); // Add a class to highlight today
        }

        let savedMoods=moods.find(m=> m.date == i && m.month == currentMonth && m.year == currentYear)
        if(savedMoods){
            let el=document.createElement('div')
            el.classList.add('dra')
            el.textContent=savedMoods.emoji
            currentDates.appendChild(el)
        }
    }

    // Calculate the number of empty slots needed for the next month
    let nextMonthDate = (7 - new Date(currentYear, currentMonth, lastDate).getDay() - 1) % 7;

    // Add empty slots for the next month to complete the row
    for (let i = 1; i <= nextMonthDate; i++) {

        let nextDates = document.createElement('div');
        nextDates.textContent= i;
        nextDates.classList.add('empty'); // Apply CSS for styling
        
        dateContainer.appendChild(nextDates);
    }

    // Update the displayed month and year in the header
    document.getElementById('dateYear').textContent = `${month[currentMonth]}, ${currentYear}`
}

// Call renderDate() to display the current month on page load
renderDate();

// Event listener for the "Previous" button to go to the previous month
document.getElementById('prev').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderDate();
});

// Event listener for the "Next" button to go to the next month
document.getElementById('next').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderDate();
});

document.querySelectorAll(".dra").forEach(d=>{
    d.addEventListener('dragstart',dragStart);
    d.addEventListener("dragend",dragEnd);
})

function dragStart(){
    this.classList.add('flying')
}

function dragEnd(){
    this.classList.remove('.flying')
}
function dragOver(e){
e.preventDefault();
  
}

function allowDrop(e){
    e.preventDefault()
    let elem=document.querySelector('.flying')
    this.appendChild(elem)
    let text=this.querySelector(".d")
    let obj={
        month:currentMonth,
        year:currentYear,
        emoji:elem.textContent,
        date:text.textContent       
    }
    moods.push(obj)
    saveToLocalStorage()
    console.log(moods)
}

function saveToLocalStorage(){
    localStorage.setItem('moods',JSON.stringify(moods));
    window.location.reload()
}
renderDate()


function clash(numberofPeople, numberofDays) {
    var birthdays = [], i, day, clashes = 0;
    
    for (i = 0; i < numberofDays; i++) {
	birthdays[i] = 0;
    }
    for (i = 0; i < numberofPeople; i++) {
	day = Math.floor(Math.random() * numberofDays)
	birthdays[day]++;
	if (birthdays[day] > 1) {
	    clashes++;
	}
    }
    return clashes;
}

console.log(clash(2100, 28000));
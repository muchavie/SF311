

// returns the probability that given n people over d days
// that each person will have a unique birthday
function pigeonhole (n, d) 
{
    var i, result;

    for (i = 1, result = 1; i < (n - 1); i++)
    {
	result = result * (1 - (i/d));
	console.log(result);
    }
    return result;
}



console.log(pigeonhole(1600,28000));
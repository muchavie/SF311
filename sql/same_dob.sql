SELECT person_dob, count(person_dob) as cd
FROM Person
GROUP BY person_dob
HAVING cd > 1;
 
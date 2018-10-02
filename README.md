Student paging system: SPS

To help 
	1. Parents get their kids faster.
	2. Notify students clearly.
	3. No crowded on school gate.

To do list:
	[x] create git repo
	[x] create the server
	[x] create the package.json
	[x] create gitignore file
	[x] create the app.js file
	[x] create config file for routing
	[x] create and test database connection
	[x] create the home page and test it works
	[x] register users.
	[ ] create users profiles [admin, schoolAdmin, gradeAdmin, parent].
	[ ] To add grades to model.schoolProfile.grades (controller) fetched from gradesDB filtered by school id
	[ ] add grade profile files and route in config
	[ ] update the .env file


System parts:
users types:
	admin
	school
	grade
	parent

1. Admin account:
	<Template> <Controllers> <Services>
	Responsibilities:
		a. Create schools accounts.

2. School account:
	<Template> <Controllers> <Services>
	Responsibilities:
	a. Create grades accounts.
	b. Create students list.
	c. Create parents accounts.

3. Grade account:
	<Template> <Controllers> <Services>
	Responsibilities:
	a. Show studints list.


4. Parents account:
	<Template> <Controllers> <Services>
	Responsibilities:
	a. Request pick-up.
	b. Confirm pick-up.


Procedures:
1. School contact us to participate.
2. we list the school details in schools database.
3. we issue school account credential by email provided by school and temp password and ask them to change it with the first login.
4. school login and start add the grades details required.
5. school ask each student parent to fill the required details especially the email address.
6. school create the parent's credential by email and temp password and ask them to change it by the first login.
7. parent login - change password and start use the system.


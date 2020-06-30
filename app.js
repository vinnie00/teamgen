const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const idArray = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function appMenu() {
  function createManager() {
    console.log("Please build your team");
    inquirer.prompt([
      {
        type: "input",
        name: "managerName",
        message: "What is your managers name?",
        validate: (answers) => {
          if (answers !== "") {
            return true;
          }
          return "Please return atleast one character";
        },
      },
      {
          type: "input",
          name: "managerId",
          message: "What is your manager ID?",
          validate: answers => {
            const pass = answers.match(
                /^[1-9]\d*$/
            )
            if (pass) {
              return true;
            }
            return "Please return a positive number greater than 0";
          },
      },
      {
          type: 'input',
          name: 'managerEmail',
          message: 'What is your email manager email address?',
          validate: answers => {
              const pass = answers.match(
                  /\S+@\S+\.\S+/
              )
              if (pass) {
                  return true;
              }
              return 'Please enter a valid email.'
          }

      },
      {
          type: 'input',
          name: 'officeNumber',
          message: 'What is the office number?',
          validate: answers => {
            const pass = answers.match(
                /^[1-9]\d*$/
            )
            if (pass) {
              return true;
            }
            return "Please return a valid office number";
        }
      }
    ]).then(answers => {
        let manager = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.officeNumber);
        teamMembers.push(manager);
        idArray.push(answers.managerId);
        createTeam();
    }





    )
  }
  createTeam = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What type of member would you like to add?',
            choices: [
                'Engineer','Intern', 'I have no other team members to add.'
            ]
        }
    ]).then(response => {
        switch(response.choices){
            case "Engineer":
                addEngineer()
            break;
            case 'Intern':
                addIntern()
            break;
            default: 
            buildTeam();

        }
    })
  }
  addEngineer = () => {
    inquirer.prompt ([
        {
            type: "input",
            name: "engineerName",
            message: "What is your engineer name?",
            validate: (answers) => {
              if (answers !== "") {
                return true;
              }
              return "Please return atleast one character";
            },
          },
          {
              type: "input",
              name: "engineerId",
              message: "What is your engineer ID?",
              validate: answer => {
                const pass = answer.match(
                  /^[1-9]\d*$/
                );
                if (pass) {
                  if (idArray.includes(answer)) {
                    return "This ID is already taken. Please enter a different number.";
                  } else {
                    return true;
                  }
                }
                return "Please enter a positive number greater than zero.";
              },
          },
          {
              type: 'input',
              name: 'engineerEmail',
              message: 'What is your email engineer email address?',
              validate: answers => {
                  const pass = answers.match(
                      /\S+@\S+\.\S+/
                  )
                  if (pass) {
                      return true;
                  }
                  return 'Please enter a valid email.'
              }
    
          },
          {
              type: 'input',
              name: 'github',
              message: 'What is the github username?',
              validate: answers => {
                if (answers !== "") {
                  return true;
                }
                return "Please enter a valid github username";
            }
          }
        ]).then(answers => {
            let engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.github);
            teamMembers.push(engineer);
            idArray.push(answers.engineerId);
            createTeam();
        })
  }

  addIntern = () => {
    inquirer.prompt ([
        {
            type: "input",
            name: "internName",
            message: "What is your intern name?",
            validate: (answers) => {
              if (answers !== "") {
                return true;
              }
              return "Please return atleast one character";
            },
          },
          {
              type: "input",
              name: "internId",
              message: "What is your intern ID?",
              validate: answer => {
                const pass = answer.match(
                  /^[1-9]\d*$/
                );
                if (pass) {
                  if (idArray.includes(answer)) {
                    return "This ID is already taken. Please enter a different number.";
                  } else {
                    return true;
                  }
                }
                return "Please enter a positive number greater than zero.";
              },
          },
          {
              type: 'input',
              name: 'internEmail',
              message: 'What is your email intern email address?',
              validate: answers => {
                  const pass = answers.match(
                      /\S+@\S+\.\S+/
                  )
                  if (pass) {
                      return true;
                  }
                  return 'Please enter a valid email.'
              }
    
          },
          {
              type: 'input',
              name: 'school',
              message: 'What is the school name?',
              validate: answers => {
                if (answers !== "") {
                  return true;
                }
                return "Please enter a valid school name";
            }
          }
        ]).then(answers => {
            let intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.school);
            teamMembers.push(intern);
            idArray.push(answers.internId);
            createTeam();
        })
  }
  buildTeam = () => {
      if (!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR)
      }
      fs.writeFileSync(outputPath, render(teamMembers), 'utf-8')
  }
  createManager();
}
appMenu();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

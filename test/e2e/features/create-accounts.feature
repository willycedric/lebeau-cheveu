  Feature:create customer
  As a user of the application
  I would like to be able to create an account
    
Scenario Outline: create a customer  account with valide credentials
  Given I am using the app
  And I click on the button login
  And I click on singup link
  When User I enter the username <username>
  And I enter the  firstname <firstname>
  And I enter the  lastname <lastname>
  And I enter the email <email>
  And I enter the  password <password>
  And I enter the password confirmation <password2>
  Then I click on the button save

 Examples: 
	|username | firstname | lastname | email | password | password2|
	|customer1|MARIE|DUVAL|lebeaucheveu+marie@gmail.com|root2016|root2016|
	#|jeannedupont|JEANNE|DUPONT|lebeaucheveu+jeanne@gmail.com|root2016|root2016|



Scenario Outline: create an hairdresser  account with valide credentials
  Given I am using the app
  And I click on the button login
  And I click on singup link
  When User I enter the username <username>
  And I enter the  firstname <firstname>
  And I enter the  lastname <lastname>
  And I enter the email <email>
  And I enter the  password <password>
  And I enter the password confirmation <password2>
  And I select the hairdresser checkbox
  Then I click on the button save

 Examples: 
	|username | firstname | lastname | email | password | password2|
	|hairdresser1|Pascal|Marieval|lebeaucheveu+pascal@gmail.com|root2016|root2016|
	
	
	

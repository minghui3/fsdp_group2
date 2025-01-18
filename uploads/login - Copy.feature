Feature: Employee Login

    @3c0ab250-0c6a-478b-a641-2ff3694b6801
    @tag1 @tag2 a @tag3
    Scenario: Successful login attempt
        Given I am on the login page     
        And I fill in the email as "superman@dailyplanet.com"     
        And I fill in the password as "epassword"     
        When I click on the login button     
        Then I see the alert "Login successful"

    @e4185b64-1158-4ab5-b5bb-a6056108fbde
    @tag2 @tag4
    Scenario: Successful login attempt
        Given I am on the login page     
        And I fill in the email as "superman@dailyplanet.com"     
        And I fill in the password as "epassword"     
        When I click on the login button     
        Then I see the alert "asdasdasd"

    @295dae45-22d8-4fb5-8ac0-378030c00dd4
    Scenario: Unsuccessful login attempt
        Given I am on the login page     
        And I fill in the email as "superman@as.com"     
        And I fill in the password as "asdasdasdasdasdasd"     
        When I click on the login button     
        Then I see the alert "Invalid email or password given"

    
    




const {v4: uuidv4} = require('uuid');

describe('payment', () => {
  it('User can make payment', () => {

    // Log the user in
    cy.visit('http://localhost:3000/signin');
    cy.findByRole('textbox', {name: /username/i}).type('johndoe');
    cy.findByLabelText(/password/i).type('s3cret');
    cy.findByRole('checkbox', {name: /remember me/i}).check();
    cy.findByRole('button', {name: /sign in/i}).click();

    // Check Account Balance - everything in Cypress is 'findBy' not 'getBy'
    let oldBalance;
    cy.get('[data-test="sidenav-user-balance"]')
      .then($balance => {
        oldBalance = $balance.text();
        return oldBalance;
      })

    // Click on new button
    cy.findByRole('button', {  name: /new/i}).click();

    // Search for a user
    cy.findByRole('textbox').type('devon becker');
    cy.findByText(/devon becker/i).click();

    // Add an Amount and note and click pay
    const paymentAmount = "5.00";
    const note = uuidv4();
    cy.findAllByPlaceholderText(/amount/i).type(paymentAmount);
    cy.findAllByPlaceholderText(/add a note/i).type(note);
    cy.findByRole('button', {  name: /pay/i}).click();

    // Return to transactions
    cy.findByRole('button', {  name: /return to transactions/i}).click();

    // Go to the personal payments tab
    cy.findByRole('tab', {  name: /mine/i}).click();

    // Click on payment
    cy.findByText(note).click({force: true});

    // Verify if the correct payment was made
    cy.findByText(`-$${paymentAmount}`).should('be.visible');
    cy.findByText(note).should('be.visible');

    // Get the current balance from the sidenav element
    cy.get('[data-test="sidenav-user-balance"]').then($balance => {
      // Convert the old and new balances (extracted earlier) into numeric values
      const convertedOldBalance = parseFloat(oldBalance.replace(/\$|,/g, ""));
      const convertedNewBalance = parseFloat($balance.text().replace(/\$|,/g, ""));

      /* Ensure that the deduction of the payment amount from the old balance
       * results in the expected new balance (paymentAmount) */
      expect(convertedOldBalance - convertedNewBalance).to.equal(
        parseFloat(paymentAmount)
      );
    });
  })
})
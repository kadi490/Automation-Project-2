describe('Issue delete', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click()
      cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    });
  });

  it('Test 1 Deleting an issue', () => {
    //System finds modal for deleting issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-details"]').within(() => {
        //System finds a trashcan icon and clicks it
        cy.get('[data-testid="icon:trash"]')
        .click();
    });

    cy.get('[data-testid="modal:confirm"]').within(() => {
        //System finds a Delete issue button and clicks it
        cy.contains('button', 'Delete issue')
        .click()
    });

    //Assert that deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    //Assert that the issue was deleted
    cy.contains('This is an issue of type: Task.').should('not.exist')
    
  });

  it('Test 2 Cancelling the deletion of an issue', () => {
    
    cy.get('[data-testid="modal:issue-details"]').within(() => {
        //System finds a trashcan icon and clicks it
        cy.get('[data-testid="icon:trash"]')
        .click();
    });

    cy.get('[data-testid="modal:confirm"]').within(() => {
        //System finds a Cancel button and clicks it
        cy.contains('button', 'Cancel')
        .click()
    });

    //Closes the issue details modal
    cy.get('[data-testid="icon:close"]').eq(0).click();

    //Assert that confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.reload();

    //Assert that the issue was not deleted
    cy.contains('This is an issue of type: Task.').should('exist')
    
  });
  
});
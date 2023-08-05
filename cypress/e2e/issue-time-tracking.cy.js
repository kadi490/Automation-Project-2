import { faker } from '@faker-js/faker';

describe('Ticket creation and time tracking', () => {
    const randomTitle = faker.animal.type();
    const randomDescr = faker.company.buzzPhrase();
    
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board?modal-issue-create=true');
     });
    });
        
        it('Ticket for tinkering with time tracker', () => {
            cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('.ql-editor').type(randomDescr);
            cy.get('input[name="title"]').type(randomTitle);
            cy.get('button[type="submit"]').click();
            });
        
            cy.get('[data-testid="modal:issue-create"]').should('not.exist');
            cy.contains('Issue has been successfully created.').should('be.visible');
            cy.reload();
            cy.contains('Issue has been successfully created.').should('not.exist');
            cy.get('[data-testid="board-list:backlog').should('be.visible');
            cy.get('[data-testid="list-issue"]').first().contains(randomTitle);

            //Adds a time estimation    
            cy.contains(randomTitle).click();
            cy.get('input[placeholder="Number"]').click().type("value=10");
            cy.contains('10h estimated').should('exist');
            cy.get('button i[data-testid="icon:close"]').click();
            cy.contains(randomTitle).click();
            cy.contains('10h estimated').should('exist');

            //Updates the estimation
            cy.get('input[placeholder="Number"]').click().clear().type("value=20");
            cy.contains('20h estimated').should('exist');
            cy.get('button i[data-testid="icon:close"]').click();
            cy.contains(randomTitle).click();
            cy.contains('20h estimated').should('exist');

            //Deletes the estimation
            cy.get('input[placeholder="Number"]').click().clear();
            cy.contains('20h estimated').should('not.exist');
            cy.get('button i[data-testid="icon:close"]').click();
            cy.contains(randomTitle).click();
            cy.contains('20h estimated').should('not.exist');

            //Logging time
            cy.get('i[data-testid="icon:stopwatch"]').click();
            cy.get('[data-testid="modal:tracking"]').should('be.visible');
            cy.get('input[placeholder="Number"]').eq(1).click().type('value=2');
            cy.get('input[placeholder="Number"]').eq(2).click().type('value=5');
            cy.get('[data-testid="modal:tracking"]').contains('button', 'Done').click();
            cy.contains('No time logged').should('not.exist');
            cy.get('[data-testid="icon:stopwatch"]').next().should('contain', '2h logged')
            .should('not.contain', 'No time logged').and('contain', '5h remaining');

            //Delete logged time
            cy.get('i[data-testid="icon:stopwatch"]').click();
            cy.get('[data-testid="modal:tracking"]').should('be.visible');
            cy.get('input[placeholder="Number"]').eq(1).click().clear();
            cy.get('input[placeholder="Number"]').eq(2).click().clear();
            cy.get('[data-testid="modal:tracking"]').contains('button', 'Done').click();
            cy.get('[data-testid="icon:stopwatch"]').next().should('contain', 'No time logged');
         });
});
        
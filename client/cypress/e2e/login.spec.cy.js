/// <reference types="cypress" />

describe('Home page e2e', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should show network error trying to login without api server', () => {
    cy.intercept('POST', '**/auth/login', { statusCode: 500, body: { msg: 'Network Error' } })
      .as('login');

    cy.contains(/login/gi).click({ force: true });

    cy.get('.chakra-modal__content input#name')
      .type('test');

    cy.get('.chakra-modal__content input#password')
      .type('test');

    cy.get('.chakra-modal__content button[type="submit"]')
      .click();
    // cy.get('.chakra-modal__content button[type="submit"]')
    //   .should('have.attr', 'data-loading');

    cy.wait('@login');

    cy.contains(/network error/gi);
  });

  it('Should login successfully with valid credentials', () => {
    cy.intercept('POST', '**/auth/login', { fixture: 'user.json' }).as('login');

    cy.contains(/login/gi).click({ force: true });

    cy.get('.chakra-modal__content input#name')
      .type('test');

    cy.get('.chakra-modal__content input#password')
      .type('test');

    cy.get('.chakra-modal__content button[type="submit"]')
      .click();
    // cy.get('.chakra-modal__content button[type="submit"]')
    //   .should('have.attr', 'data-loading');

    cy.wait('@login');

    cy.contains(/Logged in successfully/gi);
    cy.get('button')
      .contains(/welcome test/gi)
      .then(() => {
        expect(localStorage.getItem('JWT_TOKEN')).to.equal('Bearer superToken');
      });
  });
});

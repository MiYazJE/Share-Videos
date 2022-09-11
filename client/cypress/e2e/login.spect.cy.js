/// <reference types="cypress" />

describe('Home page e2e', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should show network error trying to login without api server', () => {
    cy.contains(/login/gi).click({ force: true });

    cy.get('.chakra-modal__content input#name')
      .type('test');

    cy.get('.chakra-modal__content input#password')
      .type('test');

    cy.get('.chakra-modal__content button[type="submit"]')
      .click();
    cy.get('.chakra-modal__content button[type="submit"]')
      .should('have.attr', 'data-loading');

    cy.intercept('POST', '**/auth/login', { statusCode: 500, body: { msg: 'Network Error' } })
      .as('login');
    cy.wait('@login');

    cy.contains(/network error/gi);
  });

  it('Should login successfully with valid credentials', () => {
    cy.contains(/login/gi).click({ force: true });

    cy.get('.chakra-modal__content input#name')
      .type('test');

    cy.get('.chakra-modal__content input#password')
      .type('test');

    cy.get('.chakra-modal__content button[type="submit"]')
      .click();
    cy.get('.chakra-modal__content button[type="submit"]')
      .should('have.attr', 'data-loading');

    cy.fixture('user').then((user) => {
      cy.intercept('POST', '**/auth/login', user)
        .as('login');
      cy.wait('@login');
    });

    cy.contains(/Logged in successfully/gi);
    cy.get('button')
      .contains(/welcome test/gi);
  });
});

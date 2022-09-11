/// <reference types="cypress" />

describe('Home page e2e', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Home page should render', () => {
    cy.contains(/share videos/gi);
    cy.get('[data-test-id="homeForm"] button').contains('Create room');
    cy.get('[data-test-id="homeForm"] button').contains(/join room/gi);
    cy.get('[data-test-id="homeForm"] label').contains(/nickname/gi);
    cy.get('[data-test-id="homeForm"] input#nickName')
      .should('have.attr', 'placeholder')
      .and('match', /enter your nickname/gi);
  });

  it('Change theme should work', () => {
    cy.get('button[data-test-id=changeThemeButton]')
      .should('be.visible');

    cy.get('body')
      .invoke('attr', 'class')
      .then((cl) => {
        cy.get('body')
          .should('have.class', cl.match(/light/gi) ? 'chakra-ui-light' : 'chakra-ui-dark');

        cy.get('button[data-test-id=changeThemeButton]')
          .click({ force: true });

        cy.get('body')
          .should('have.class', cl.match(/light/gi) ? 'chakra-ui-dark' : 'chakra-ui-light');
      });
  });

  it('Login form should be render', () => {
    cy.contains(/login/gi).click({ force: true });
    cy.get('.chakra-modal__content')
      .contains(/login/gi)
      .should('be.visible');

    cy.contains(/nickname/gi);
    cy.get('.chakra-modal__content input#name')
      .should('have.attr', 'placeholder')
      .and('match', /enter your nickname/gi);

    cy.contains(/password/gi);
    cy.get('.chakra-modal__content input#password')
      .should('have.attr', 'placeholder')
      .and('match', /enter your password/gi);

    cy.get('.chakra-modal__content button')
      .contains(/close/gi)
      .click();
    cy.get('.chakra-modal__content')
      .should('not.exist');
  });

  it('Register form should be render', () => {
    cy.contains(/register/gi).click({ force: true });
    cy.get('.chakra-modal__content')
      .contains(/register/gi)
      .should('be.visible');

    cy.contains(/nickname/gi);
    cy.get('.chakra-modal__content input#name')
      .should('have.attr', 'placeholder')
      .and('match', /enter your nickname/gi);

    cy.contains(/password/gi);
    cy.get('.chakra-modal__content input#password')
      .should('have.attr', 'placeholder')
      .and('match', /enter your password/gi);

    cy.contains(/repeat/gi);
    cy.get('.chakra-modal__content input#repeatPassword')
      .should('have.attr', 'placeholder')
      .and('match', /repeat password/gi);

    cy.get('.chakra-modal__content button')
      .contains(/close/gi)
      .click();
    cy.get('.chakra-modal__content')
      .should('not.exist');
  });

  it('Join room modal should be render', () => {
    cy.contains(/or join room/gi).click({ force: true });
    cy.get('.chakra-modal__content')
      .contains(/join room/gi)
      .should('be.visible');

    cy.get('label').contains(/room/gi);
    cy.get('.chakra-modal__content input#roomId')
      .should('have.attr', 'placeholder')
      .and('match', /enter the room/gi);

    cy.get('.chakra-modal__content button')
      .contains(/close/gi)
      .click();
    cy.get('.chakra-modal__content')
      .should('not.exist');
  });
});

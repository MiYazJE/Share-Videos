/// <reference types="cypress" />

function openJoinDialog() {
  cy.intercept('GET', '**/auth/whoAmI', {
    statusCode: 401,
    body: { msg: 'Unauthorized' },
  }).as('session');
  cy.visit('/');
  cy.wait('@session');
  cy.contains('button', /Or join room/i).click();
}

function roomInput() {
  return cy.get('.chakra-modal__content input#roomId');
}

function joinButton() {
  return cy.contains('.chakra-modal__content button', /^(Join|Retry)$/);
}

describe('Room entry validation', () => {
  beforeEach(() => {
    localStorage.removeItem('JWT_TOKEN');
  });

  it('does not validate while typing and validates once on explicit submission', () => {
    cy.intercept('GET', '**/rooms/**/isValid').as('validateRoom');
    openJoinDialog();

    roomInput().type('partial-room');
    cy.get('@validateRoom.all').should('have.length', 0);

    joinButton().click();
    cy.wait('@validateRoom');
    cy.get('@validateRoom.all').should('have.length', 1);
  });

  it('trims the identifier and does not request empty normalized input', () => {
    cy.intercept('GET', '**/rooms/trimmed-room/isValid', { body: false }).as('trimmedRoom');
    openJoinDialog();

    joinButton().click();
    cy.contains('Room is empty').should('be.visible');
    roomInput().type('   ');
    joinButton().click();
    cy.contains('Room is empty').should('be.visible');
    cy.get('@trimmedRoom.all').should('have.length', 0);

    roomInput().clear().type('  trimmed-room  ');
    joinButton().click();
    cy.wait('@trimmedRoom');
    cy.contains('Room does not exist').should('be.visible');
  });

  it('blocks duplicate submission while validation is pending', () => {
    cy.intercept('GET', '**/rooms/slow-room/isValid', {
      delay: 800,
      body: false,
    }).as('validateRoom');
    openJoinDialog();
    roomInput().type('slow-room');

    joinButton().click();
    cy.get('.chakra-modal__content button[data-loading]').should('be.disabled');
    cy.get('.chakra-modal__content button[data-loading]').click({ force: true });

    cy.wait('@validateRoom');
    cy.get('@validateRoom.all').should('have.length', 1);
  });

  it('navigates with the normalized identifier when the room exists', () => {
    cy.intercept('GET', '**/rooms/existing-room/isValid', { body: true }).as('validateRoom');
    openJoinDialog();
    roomInput().type('  existing-room  ');

    joinButton().click();

    cy.wait('@validateRoom');
    cy.location('pathname').should('eq', '/room/existing-room');
  });

  it('shows missing-room feedback and clears it when the input changes', () => {
    cy.intercept('GET', '**/rooms/missing-room/isValid', { body: false }).as('validateRoom');
    openJoinDialog();
    roomInput().type('missing-room');

    joinButton().click();
    cy.wait('@validateRoom');
    cy.contains('Room does not exist').should('be.visible');

    roomInput().type('-edited');
    cy.contains('Room does not exist').should('not.exist');
    cy.location('pathname').should('eq', '/');
  });

  it('distinguishes server and unusable-response failures from a missing room', () => {
    let requestCount = 0;
    cy.intercept('GET', '**/rooms/problem-room/isValid', (request) => {
      requestCount += 1;
      if (requestCount === 1) {
        request.reply({
          statusCode: 503,
          body: { message: 'Service unavailable' },
        });
      } else request.reply({ body: { unexpected: true } });
    }).as('validateRoom');
    openJoinDialog();
    roomInput().type('problem-room');

    joinButton().click();
    cy.wait('@validateRoom');
    cy.contains('Unable to validate the room. Try again.').should('be.visible');
    cy.contains('Room does not exist').should('not.exist');

    joinButton().should('contain.text', 'Retry').click();
    cy.wait('@validateRoom');
    cy.get('@validateRoom.all').should('have.length', 2);
    cy.contains('Unable to validate the room. Try again.').should('be.visible');
  });

  it('shows recoverable feedback when the endpoint does not respond', () => {
    cy.intercept('GET', '**/rooms/offline-room/isValid', {
      forceNetworkError: true,
    }).as('validateRoom');
    openJoinDialog();
    roomInput().type('offline-room');

    joinButton().click();
    cy.wait('@validateRoom');
    cy.contains('Unable to validate the room. Try again.').should('be.visible');
    cy.location('pathname').should('eq', '/');

    roomInput().type('-edited');
    cy.contains('Unable to validate the room. Try again.').should('not.exist');
  });

  it('does not navigate when the dialog closes during validation', () => {
    cy.intercept('GET', '**/rooms/late-room/isValid', {
      delay: 700,
      body: true,
    }).as('validateRoom');
    openJoinDialog();
    roomInput().type('late-room');
    joinButton().click();

    cy.contains('.chakra-modal__content button', 'Close').click();
    cy.wait('@validateRoom');

    cy.location('pathname').should('eq', '/');
    cy.get('.chakra-modal__content').should('not.exist');
  });

  it('keeps direct route validation immediate', () => {
    cy.intercept('GET', '**/auth/whoAmI', {
      statusCode: 401,
      body: { msg: 'Unauthorized' },
    });
    cy.intercept('GET', '**/rooms/direct-room/isValid', { body: true }).as('validateRoom');

    cy.visit('/room/direct-room');

    cy.wait('@validateRoom');
    cy.contains('Enter your nickname').should('be.visible');
  });
});

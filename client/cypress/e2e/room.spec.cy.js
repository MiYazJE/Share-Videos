/// <reference types="cypress" />

const visitRoom = (viewport) => {
  cy.viewport(...viewport);
  cy.intercept('GET', '**/auth/whoAmI', {
    body: {
      user: {
        id: 'viewer-1',
        name: 'Miya',
        avatarBase64: '',
        color: '#3182ce',
      },
    },
  });
  cy.intercept('GET', '**/rooms/design-room/isValid', { body: true });
  cy.intercept('GET', '**/videos/autocomplete/youtube/**', { body: [] });
  cy.visit('/room/design-room');
};

describe('Room workspace', () => {
  it('keeps every collaboration area available without drawers', () => {
    visitRoom([1440, 900]);

    cy.get('[data-test-id="room-workspace"]').should('be.visible');
    cy.get('#room-search').should('be.visible').and('contain', 'Find the next video');
    cy.get('#room-playlist').should('be.visible').and('contain', 'Shared playlist');
    cy.get('#room-chat').should('be.visible').and('contain', 'Room chat');
    cy.get('#room-people').should('not.exist');
    cy.get('button[aria-label="Copy room invitation link"]').should('be.visible');
    cy.get('.chakra-drawer__content').should('not.exist');

    cy.get('#searchVideo').should('be.enabled').type('ambient set');
    cy.get('#room-chat input[placeholder="Send a message"]').should('be.enabled');
    cy.get('#room-chat button').contains('Send').should('be.enabled');
    cy.get('button[aria-label="Leave room"]').should('be.visible');
  });

  it('uses a responsive player and a single-column phone flow', () => {
    visitRoom([390, 844]);

    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
    });

    cy.get('[data-test-id="room-player"]').then(($player) => {
      const { width, height } = $player[0].getBoundingClientRect();
      expect(width / height).to.be.closeTo(16 / 9, 0.08);
    });

    cy.get('#room-search').then(($search) => {
      cy.get('#room-playlist').then(($playlist) => {
        cy.get('#room-chat').then(($chat) => {
          expect($search[0].offsetTop).to.be.lessThan($playlist[0].offsetTop);
          expect($playlist[0].offsetTop).to.be.lessThan($chat[0].offsetTop);
        });
      });
    });

    cy.get('#room-search').should('have.attr', 'aria-labelledby', 'room-search-title');
    cy.get('button[data-test-id="changeThemeButton"]').should('have.attr', 'aria-label');
    cy.get('button[aria-label="Leave room"]').click();
    cy.location('pathname').should('eq', '/');
  });
});

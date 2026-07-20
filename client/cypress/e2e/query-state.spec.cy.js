describe('Query state and request recovery', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/auth/whoAmI', {
      body: {
        user: {
          id: 'user-id', name: 'Miya', avatarBase64: '', color: '#ffffff',
        },
      },
    });
  });

  it('stays home after room creation failure', () => {
    cy.intercept('POST', '**/rooms/create', {
      statusCode: 500,
      body: { message: 'Internal server error' },
    }).as('createRoom');
    cy.visit('/');
    cy.contains('button', 'Create room').click();
    cy.wait('@createRoom');
    cy.location('pathname').should('eq', '/');
    cy.contains('Internal server error').should('be.visible');
  });

  it('prevents duplicate room creation while the mutation is pending', () => {
    cy.intercept('POST', '**/rooms/create', {
      delay: 500,
      statusCode: 200,
      body: {
        id: 'room-1', users: [], queue: [], chat: [],
      },
    }).as('createRoom');
    cy.intercept('GET', '**/rooms/room-1/isValid', {
      body: true,
    });
    cy.visit('/');
    cy.contains('button', 'Create room').click().should('be.disabled');
    cy.wait('@createRoom');
  });

  it('keeps room search usable and offers retry after discovery failure', () => {
    cy.intercept('POST', '**/rooms/create', {
      statusCode: 200,
      body: {
        id: 'room-1', users: [], queue: [], chat: [],
      },
    });
    cy.intercept('GET', '**/rooms/room-1/isValid', {
      body: true,
    });
    cy.intercept('GET', '**/videos/youtube/ambient*', {
      statusCode: 502,
      body: { message: 'YouTube search is temporarily unavailable' },
    }).as('videoSearch');
    cy.visit('/');
    cy.contains('button', 'Create room').click();
    cy.location('pathname').should('eq', '/room/room-1');
    cy.contains('[role="status"]', 'Loading videos.').should('not.exist');
    cy.get('#searchVideo').type('ambient{enter}');
    cy.wait('@videoSearch');
    cy.contains('Videos could not be loaded.').should('be.visible');
    cy.contains('button', 'Retry').should('be.visible');
    cy.get('#searchVideo').should('be.enabled');
  });
});

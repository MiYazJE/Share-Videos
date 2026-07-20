/// <reference types="cypress" />

const authenticatedUser = {
  id: 'user-id', name: 'Miya', avatarBase64: '', color: '#ffffff',
};

function interceptAnonymousSession(delay = 0) {
  cy.intercept('GET', '**/auth/whoAmI', {
    delay,
    statusCode: 401,
    body: { msg: 'Unauthorized' },
  }).as('session');
}

function interceptCreatedRoom() {
  cy.intercept('POST', '**/rooms/create', {
    statusCode: 200,
    body: {
      id: 'room-1', host: 'Miya', users: [], queue: [], chat: [],
    },
  }).as('createRoom');
  cy.intercept('GET', '**/rooms/room-1/isValid', {
    body: true,
  });
}

function submitLogin() {
  cy.get('.chakra-modal__content input#name').type('Miya');
  cy.get('.chakra-modal__content input#password').type('password');
  cy.get('.chakra-modal__content button[type="submit"]').click();
}

describe('Authenticated room creation', () => {
  beforeEach(() => {
    localStorage.removeItem('JWT_TOKEN');
  });

  it('shows authentication choices without creating a room for an anonymous visitor', () => {
    interceptAnonymousSession();
    cy.intercept('POST', '**/rooms/create').as('createRoom');
    cy.visit('/');
    cy.wait('@session');

    cy.contains('button', 'Create room').click();

    cy.contains('Sign in to create a room').should('be.visible');
    cy.contains('.chakra-modal__content button', 'Login').should('be.visible');
    cy.contains('.chakra-modal__content button', 'Register').should('be.visible');
    cy.get('@createRoom.all').should('have.length', 0);
  });

  it('cancels pending creation when the visitor dismisses the gate', () => {
    interceptAnonymousSession();
    cy.intercept('POST', '**/rooms/create').as('createRoom');
    cy.visit('/');
    cy.wait('@session');

    cy.contains('button', 'Create room').click();
    cy.contains('.chakra-modal__content button', 'Not now').click();

    cy.get('.chakra-modal__content').should('not.exist');
    cy.get('@createRoom.all').should('have.length', 0);
  });

  it('creates exactly one room after gate-initiated login', () => {
    interceptAnonymousSession();
    interceptCreatedRoom();
    cy.intercept('POST', '**/auth/login', {
      body: { user: authenticatedUser, token: 'Bearer token' },
    }).as('login');
    cy.visit('/');
    cy.wait('@session');

    cy.contains('button', 'Create room').click();
    cy.contains('.chakra-modal__content button', 'Login').click();
    submitLogin();

    cy.wait('@login');
    cy.wait('@createRoom');
    cy.get('@createRoom.all').should('have.length', 1);
    cy.location('pathname').should('eq', '/room/room-1');
  });

  it('creates exactly one room after gate-initiated registration and login', () => {
    interceptAnonymousSession();
    interceptCreatedRoom();
    cy.intercept('POST', '**/auth/register', {
      body: { error: false, msg: 'Registered' },
    }).as('register');
    cy.intercept('POST', '**/auth/login', {
      body: { user: authenticatedUser, token: 'Bearer token' },
    }).as('login');
    cy.visit('/');
    cy.wait('@session');

    cy.contains('button', 'Create room').click();
    cy.contains('.chakra-modal__content button', 'Register').click();
    cy.get('.chakra-modal__content input#name').type('Miya');
    cy.get('.chakra-modal__content input#password').type('password');
    cy.get('.chakra-modal__content input#repeatPassword').type('password');
    cy.get('.chakra-modal__content button[type="submit"]').click();

    cy.wait('@register');
    cy.wait('@login');
    cy.wait('@createRoom');
    cy.get('@createRoom.all').should('have.length', 1);
  });

  it('does not create a room after independent login', () => {
    interceptAnonymousSession();
    cy.intercept('POST', '**/rooms/create').as('createRoom');
    cy.intercept('POST', '**/auth/login', {
      body: { user: authenticatedUser, token: 'Bearer token' },
    });
    cy.visit('/');
    cy.wait('@session');

    cy.contains('button', /^LOGIN$/).click();
    submitLogin();

    cy.contains(/Logged in successfully/i).should('be.visible');
    cy.get('@createRoom.all').should('have.length', 0);
  });

  it('does not create or navigate when gate-initiated login fails', () => {
    interceptAnonymousSession();
    cy.intercept('POST', '**/rooms/create').as('createRoom');
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { msg: 'Invalid credentials' },
    }).as('login');
    cy.visit('/');
    cy.wait('@session');

    cy.contains('button', 'Create room').click();
    cy.contains('.chakra-modal__content button', 'Login').click();
    submitLogin();

    cy.wait('@login');
    cy.contains('Invalid credentials').should('be.visible');
    cy.get('@createRoom.all').should('have.length', 0);
    cy.location('pathname').should('eq', '/');
  });

  it('disables creation while session restoration is pending', () => {
    interceptAnonymousSession(10000);
    cy.intercept('POST', '**/rooms/create').as('createRoom');
    cy.visit('/');

    cy.get('[aria-label="Loading session"]').should('be.visible');
    cy.contains('button', 'Create room').should('not.exist');
    cy.get('@createRoom.all').should('have.length', 0);
  });

  it('creates directly for a restored session and reports authorization failure', () => {
    localStorage.setItem('JWT_TOKEN', 'Bearer token');
    cy.intercept('GET', '**/auth/whoAmI', { body: { user: authenticatedUser } }).as('session');
    cy.intercept('POST', '**/rooms/create', {
      statusCode: 401,
      body: { msg: 'Invalid or expired token.' },
    }).as('createRoom');
    cy.visit('/');
    cy.wait('@session');

    cy.contains('button', 'Create room').click();

    cy.wait('@createRoom');
    cy.contains('Invalid or expired token.').should('be.visible');
    cy.contains('Sign in to create a room').should('not.exist');
    cy.location('pathname').should('eq', '/');
  });

  it('keeps validation and guest joining public', () => {
    interceptAnonymousSession();
    cy.intercept('GET', '**/rooms/guest-room/isValid', { body: true }).as('validateRoom');
    cy.visit('/');
    cy.wait('@session');

    cy.contains('button', /Or join room/i).click();
    cy.get('.chakra-modal__content input#roomId').type('guest-room');
    cy.contains('.chakra-modal__content button', 'Join').click();

    cy.wait('@validateRoom');
    cy.location('pathname').should('eq', '/room/guest-room');
    cy.contains('Enter your nickname').should('be.visible');
  });
});

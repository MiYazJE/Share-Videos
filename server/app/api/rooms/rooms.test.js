const jwt = require('jsonwebtoken');
const supertest = require('supertest');

const users = require('../../models/users.model');
const config = require('../../../config/config');

jest.mock('../../models/users.model', () => ({
  findById: jest.fn(),
}));

const app = require('../../../app');

const api = supertest(app);
const roomsCtrl = {
  create: jest.fn(),
  get: jest.fn(),
};

function createToken(id = 'user-id') {
  return `Bearer ${jwt.sign({ id }, config.accessSecretToken)}`;
}

describe('Rooms HTTP API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    app.locals.roomsCtrl = roomsCtrl;
  });

  test('creates a room for an authenticated user using the stored name', async () => {
    users.findById.mockResolvedValue({ id: 'user-id', name: 'Stored name' });
    roomsCtrl.create.mockResolvedValue({ id: 'room-id', host: 'Stored name' });

    const result = await api
      .post('/rooms/create')
      .set('Authorization', createToken())
      .send({ name: 'Spoofed name' })
      .expect(200);

    expect(roomsCtrl.create).toHaveBeenCalledTimes(1);
    expect(roomsCtrl.create).toHaveBeenCalledWith('Stored name');
    expect(result.body).toMatchObject({ id: 'room-id', host: 'Stored name' });
  });

  test('rejects room creation without authentication', async () => {
    await api.post('/rooms/create').send({}).expect(401);

    expect(roomsCtrl.create).not.toHaveBeenCalled();
  });

  test('rejects room creation when the token user no longer exists', async () => {
    users.findById.mockResolvedValue(null);

    await api
      .post('/rooms/create')
      .set('Authorization', createToken('deleted-user'))
      .send({})
      .expect(401);

    expect(roomsCtrl.create).not.toHaveBeenCalled();
  });

  test('keeps room validation public', async () => {
    roomsCtrl.get.mockResolvedValue({ id: 'room-id' });

    const result = await api.get('/rooms/room-id/isValid').expect(200);

    expect(result.body).toBe(true);
    expect(roomsCtrl.get).toHaveBeenCalledWith('room-id');
  });
});

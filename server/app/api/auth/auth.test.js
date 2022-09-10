const supertest = require('supertest');

const User = require('../../models/users.model');
const Playlist = require('../../models/playlists.model');
const clientDb = require('../../../config/createDatabase');
const app = require('../../../app');

const api = supertest(app);

describe('Auth E2E test', () => {
  beforeAll(async () => {
    await clientDb.connect();
  });

  afterAll(async () => {
    await clientDb.close();
  });

  afterEach(async () => {
    await clientDb.dropCollections();
  });

  describe('Register', () => {
    test('Should throw bad request if not password provided - (400)', async () => {
      const result = await api
        .post('/auth/register')
        .send({})
        .expect(400);

      expect(result.body.message).toMatch(/password/gi);
    });

    test('Should throw bad request if not username provided - (400)', async () => {
      const result = await api
        .post('/auth/register')
        .send({ password: 'pass' })
        .expect(400);

      expect(result.body.message).toMatch(/username/gi);
    });

    test('Should create a user - (200)', async () => {
      await api
        .post('/auth/register')
        .send({ password: 'pass', name: 'test' })
        .expect(200);

      const user = await User.findOne({ name: 'test' });
      expect(user).toBeDefined();
      expect(user.name).toBe('test');
      expect(user.avatarBase64).toBeDefined();
      expect(user.color).toHaveLength(7);
      expect(user.color[0]).toBe('#');

      const playlist = await Playlist.findOne({ userId: user._id }).lean();
      expect(playlist).toBeDefined();
      expect(playlist.title).toBe('Default Playlist');
      expect(playlist.videos).toEqual([]);
    });

    test('Should throw bad request if username already exists - (400)', async () => {
      await api.post('/auth/register')
        .send({ name: 'exists', password: 'exists' });

      const result = await api.post('/auth/register')
        .send({ name: 'exists', password: 'exists' })
        .expect(400);

      expect(result.body.msg).toBe('That nickname already exists. Please, choose another.');
    });
  });

  describe('Login', () => {
    test('Should throw bad request without password - (400)', async () => {
      const result = await api.post('/auth/login')
        .send({ name: 'name' })
        .expect(400);

      expect(result.body.message).toMatch(/password/gi);
    });

    test('Should throw bad request without username - (400)', async () => {
      const result = await api.post('/auth/login')
        .send({ password: 'pass' })
        .expect(400);

      expect(result.body.message).toMatch(/name/gi);
    });

    test('Should throw unauthorized with invalid credentials - (401)', async () => {
      const result = await api.post('/auth/login')
        .send({ password: 'pass', name: 'random' })
        .expect(401);

      expect(result.body.msg).toBe('Password or nickname are incorrects');
    });

    test('Should login a user - (200)', async () => {
      await api.post('/auth/register')
        .send({ password: 'pass', name: 'random' });

      const result = await api.post('/auth/login')
        .send({ password: 'pass', name: 'random' })
        .expect(200);

      expect(result.body.user).toBeDefined();
      expect(result.body.token).toMatch(/Bearer/);
    });
  });
});

import { query } from '../config/db.js';

export async function findUserByEmail(email) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function findUserById(id) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createUser({ email, password_hash, role }) {
  const result = await query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
    [email, password_hash, role]
  );
  return result.rows[0];
}

export async function createOrganization({ user_id, name, description, website, phone, address, city, state, country }) {
  const result = await query(
    `INSERT INTO organizations
      (user_id, name, description, website, phone, address, city, state, country)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [user_id, name, description, website, phone, address, city, state, country]
  );
  return result.rows[0];
}

export async function createVolunteer({ user_id, full_name, bio, skills, interests, phone, city, state, country }) {
  const result = await query(
    `INSERT INTO volunteers
      (user_id, full_name, bio, skills, interests, phone, city, state, country)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [user_id, full_name, bio, skills, interests, phone, city, state, country]
  );
  return result.rows[0];
}

-- Estrutura inicial de banco de dados para plataforma de ONGs e voluntários
-- PostgreSQL

-- Tabela de usuários gerais
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('organization', 'volunteer')),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Tabela de organizações
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT organization_role_check CHECK ((SELECT role FROM users WHERE users.id = user_id) = 'organization')
);

-- Tabela de voluntários
CREATE TABLE volunteers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  skills TEXT,
  interests TEXT,
  phone VARCHAR(50),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT volunteer_role_check CHECK ((SELECT role FROM users WHERE users.id = user_id) = 'volunteer')
);

-- Tabela de campanhas/publicações criadas por organizações
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  cause VARCHAR(100),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Tabela de interesses/encontros entre voluntários e campanhas
CREATE TABLE campaign_interests (
  id SERIAL PRIMARY KEY,
  volunteer_id INTEGER NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE (volunteer_id, campaign_id)
);

-- Trigger simples para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_timestamp();

CREATE TRIGGER trigger_set_timestamp_organizations
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION set_timestamp();

CREATE TRIGGER trigger_set_timestamp_volunteers
BEFORE UPDATE ON volunteers
FOR EACH ROW EXECUTE FUNCTION set_timestamp();

CREATE TRIGGER trigger_set_timestamp_campaigns
BEFORE UPDATE ON campaigns
FOR EACH ROW EXECUTE FUNCTION set_timestamp();

CREATE TRIGGER trigger_set_timestamp_campaign_interests
BEFORE UPDATE ON campaign_interests
FOR EACH ROW EXECUTE FUNCTION set_timestamp();

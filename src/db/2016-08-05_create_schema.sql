CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP SCHEMA IF EXISTS hunttracker CASCADE;
CREATE SCHEMA hunttracker;

CREATE TABLE hunttracker.user (
  "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
  CONSTRAINT user_pk PRIMARY KEY ("id"),
  "firstName" VARCHAR(100) NOT NULL,
	"lastName" VARCHAR(100) NOT NULL,
  "email" VARCHAR(60) UNIQUE NOT NULL,
  "passwordHash" VARCHAR(100) NOT NULL,
  "settings" JSONB,
  "filters" JSONB
);

CREATE TABLE hunttracker.team (
  "id" UUID NOT NULL,
  CONSTRAINT team_pk PRIMARY KEY ("id"),
  "adminId" UUID NOT NULL REFERENCES hunttracker.user(id),
  "name" VARCHAR(1000),
  "description" VARCHAR(1000)
);

CREATE TABLE hunttracker.team_user (
  "teamId" UUID NOT NULL REFERENCES hunttracker.team(id),
  "userId" UUID NOT NULL REFERENCES hunttracker.user(id),
  "status" VARCHAR(100) NOT NULL,
	CONSTRAINT valid_status CHECK (status in ('admin','active','paused', 'invited', 'requestingMembership'))
);

CREATE TABLE hunttracker.marker (
  "id" UUID NOT NULL,
  CONSTRAINT marker_pk PRIMARY KEY ("id"),
  "userId" UUID NOT NULL REFERENCES hunttracker.user(id),
  "description" VARCHAR(1000),
  "dateTime" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "icon" VARCHAR(100) NOT NULL,
  "lat" FLOAT NOT NULL,
  "lon" FLOAT NOT NULL
);

CREATE TABLE hunttracker.marker_team (
  "markerId" UUID NOT NULL REFERENCES hunttracker.marker(id),
  "teamId" UUID NOT NULL REFERENCES hunttracker.team(id)
);
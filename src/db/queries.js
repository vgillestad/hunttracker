module.exports.GET_USER_BY_ID = `
SELECT * 
FROM 
  hunttracker.user 
WHERE 
  id = $1`

module.exports.GET_USER_BY_EMAIL = `
SELECT * 
FROM 
  hunttracker.user 
WHERE 
  email=$1`

module.exports.UPD_USER = `
UPDATE hunttracker."user" 
SET 
  settings = $1, filters = $2 
WHERE id = $3`;

module.exports.INSERT_USER = `
INSERT INTO hunttracker."user" ("firstName", "lastName", email, "passwordHash") 
VALUES ($1,$2,$3,$4)`

module.exports.UPDATE_USER_PASSWORD = `
UPDATE hunttracker."user"
SET 
  "passwordHash" = $1
WHERE id = $2`;

module.exports.GET_MARKER_BY_ID = `
SELECT 
  marker.*,
  (SELECT array_to_json(array_agg("teamId")) FROM hunttracker.marker_team WHERE "markerId" = marker.id) as "sharedWithTeamIds" 
FROM 
  hunttracker.marker
WHERE 
  id = $1`

module.exports.GET_MARKERS = `
SELECT
  marker.*,
  (SELECT array_to_json(array_agg("teamId")) FROM hunttracker.marker_team WHERE "markerId" = marker.id) as "sharedWithTeamIds"
FROM
  hunttracker.marker marker
WHERE
  marker."userId" = $1

UNION ALL

SELECT
  marker.*,
  (SELECT array_to_json(array_agg("teamId")) FROM hunttracker.marker_team WHERE "markerId" = marker.id) as "sharedWithTeamIds"
FROM
  hunttracker.team_user,
  hunttracker.marker_team,
  hunttracker.marker
WHERE
  team_user."userId" = $1
  AND marker_team."teamId" = team_user."teamId"
  AND marker.id = marker_team."markerId"
  AND marker."userId" != $1`;

module.exports.INSERT_MARKER = `
INSERT INTO hunttracker.marker (id, "userId", description, "dateTime", icon, lat, lon) 
VALUES ($1,$2,$3,$4,$5,$6,$7)`;

module.exports.UPDATE_MARKER = `
UPDATE hunttracker.marker 
SET "userId" = $2, description = $3, "dateTime" = $4, icon = $5, lat = $6, lon = $7 
WHERE id = $1`;

module.exports.DELETE_MARKER = `
DELETE FROM hunttracker.marker 
WHERE id = $1`

module.exports.INSERT_MARKER_TEAM = `
INSERT INTO hunttracker.marker_team ("markerId", "teamId") 
VALUES ($1,$2)`;

module.exports.DELETE_MARKER_TEAM = `
DELETE FROM hunttracker.marker_team 
WHERE "markerId" = $1 AND "teamId" = $2`

module.exports.DELETE_MARKER_TEAM_BY_MARKER = `
DELETE FROM hunttracker.marker_team 
WHERE "markerId" = $1`

module.exports.DELETE_MARKER_TEAM_BY_TEAM = `
DELETE FROM hunttracker.marker_team 
WHERE "teamId" = $1`

module.exports.GET_TEAMS = `
SELECT * 
FROM 
  hunttracker.team_user team_user, 
  hunttracker.team team 
WHERE 
  team_user."userId" = $1
  AND team.id = team_user."teamId"`;

module.exports.GET_TEAMS_ACTIVE = `
SELECT * 
FROM 
  hunttracker.team_user team_user, 
  hunttracker.team team 
WHERE 
  team_user."userId" = $1 
  AND team.id = team_user."teamId"
  AND team_user.status in (\'admin\',\'active\')`;

module.exports.INSERT_TEAM = `
INSERT INTO hunttracker.team (id, "adminId", name, description) 
VALUES ($1,$2,$3,$4)`

module.exports.DELETE_TEAM = `
DELETE FROM hunttracker.team
WHERE id = $1`

module.exports.GET_TEAM_MEMBERS = ` 
SELECT u.id as "userId", u."firstName", u."lastName", u.email, tu.status
FROM
  hunttracker.team t,
  hunttracker.team_user tu,
  hunttracker.user u
WHERE
  t.id = $1
  AND tu."teamId" = t.id
  AND tu."userId" = u.id`;

module.exports.INSERT_TEAM_USER = `
INSERT INTO hunttracker.team_user ("teamId", "userId", status) 
VALUES ($1,$2,$3)`;

module.exports.UPDATE_TEAM_USER = `
UPDATE hunttracker.team_user 
SET status = $3
WHERE 
  "teamId" = $1 
  AND "userId" = $2`;

module.exports.DELETE_TEAM_USER = `
DELETE FROM hunttracker.team_user
WHERE 
  "teamId" = $1
  AND "userId" = $2`;

module.exports.DELETE_TEAM_USER_BY_TEAM = `
DELETE FROM hunttracker.team_user
WHERE 
  "teamId" = $1`;
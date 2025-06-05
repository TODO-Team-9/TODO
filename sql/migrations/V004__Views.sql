CREATE OR REPLACE VIEW all_teams AS
SELECT
    t.team_id,
    t.team_name,
    t.team_description,
    COUNT(m.member_id) AS member_count
FROM teams t
INNER JOIN members m ON t.team_id = m.team_id
WHERE m.removed_at IS NULL
GROUP BY t.team_id
ORDER BY t.team_name ASC;

CREATE OR REPLACE VIEW team_members_usernames AS
SELECT
    t.team_id,
    t.team_name,
    m.member_id,
    u.username
FROM teams t
INNER JOIN members m ON t.team_id = m.team_id
INNER JOIN users u ON m.user_id = u.user_id
WHERE m.removed_at IS NULL;

CREATE OR REPLACE VIEW team_active_members_roles AS
SELECT
    t.team_id,
    t.team_name,
    m.member_id,
    u.username,
    tr.team_role_name
FROM teams t
JOIN members m ON t.team_id = m.team_id
JOIN users u ON m.user_id = u.user_id
JOIN team_roles tr ON m.team_role_id = tr.team_role_id
WHERE m.removed_at IS NULL;

CREATE OR REPLACE VIEW tasks_overview AS
SELECT
    t.task_id,
    t.task_name,
    t.task_description,
    tm.team_name,
    s.status_name,
    p.priority_name,
    u.username AS assigned_to,
    t.created_at,
    t.completed_at
FROM tasks t
JOIN teams tm ON t.team_id = tm.team_id
JOIN statuses s ON t.status_id = s.status_id
JOIN priorities p ON t.priority_id = p.priority_id
LEFT JOIN members m ON t.member_id = m.member_id
LEFT JOIN users u ON m.user_id = u.user_id;
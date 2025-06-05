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
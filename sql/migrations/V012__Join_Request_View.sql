CREATE OR REPLACE VIEW all_join_requests AS
SELECT 
    jr.request_id,
    jr.team_id,
    t.team_name,
    jr.user_id,
    u.username,
    rs.request_status_name as status,
    jr.requested_at
FROM join_requests jr
INNER JOIN teams t ON jr.team_id = t.team_id
INNER JOIN users u ON jr.user_id = u.user_id
INNER JOIN request_statuses rs ON jr.request_status = rs.request_status_id
ORDER BY jr.requested_at DESC; 
CREATE OR REPLACE FUNCTION get_user_join_requests(p_user_id INT)
RETURNS TABLE (
    request_id INT,
    team_id INT,
    team_name VARCHAR(32),
    team_description VARCHAR(128),
    requested_at TIMESTAMPTZ,
    request_status_id INT,
    request_status_name VARCHAR(16)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jr.request_id,
        t.team_id,
        t.team_name,
        t.team_description,
        jr.requested_at,
        rs.request_status_id,
        rs.request_status_name
    FROM join_requests jr
    INNER JOIN teams t ON jr.team_id = t.team_id
    INNER JOIN request_statuses rs ON jr.request_status = rs.request_status_id
    WHERE jr.user_id = p_user_id
    ORDER BY jr.requested_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_teams(p_user_id INT)
RETURNS TABLE (
    team_id INT,
    team_name VARCHAR(32),
    team_description VARCHAR(128),
    member_id INT,
    team_role_id INT,
    team_role_name VARCHAR(16)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.team_id,
        t.team_name,
        t.team_description,
        m.member_id,
        tr.team_role_id,
        tr.team_role_name
    FROM members m
    INNER JOIN teams t ON m.team_id = t.team_id
    INNER JOIN team_roles tr ON m.team_role_id = tr.team_role_id
    WHERE m.user_id = p_user_id
    AND m.removed_at IS NULL
    ORDER BY t.team_name;
END;
$$ LANGUAGE plpgsql; 
CREATE OR REPLACE FUNCTION get_tasks (p_team_id INT)
RETURNS TABLE (
    task_id INT,
    task_name VARCHAR(32),
    task_description VARCHAR(256),
    status_name VARCHAR(16),
    priority_name VARCHAR(16),
    created_at TIMESTAMPTZ,
    username VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.task_id,
        t.task_name,
        t.task_description,
        s.status_name,
        p.priority_name,
        t.created_at,
        u.username
    FROM tasks t
    INNER JOIN statuses s ON t.status_id = s.status_id
    INNER JOIN priorities p ON t.priority_id = p.priority_id
    INNER JOIN members m ON t.member_id = m.member_id
    INNER JOIN users u ON m.user_id = u.user_id
    WHERE t.team_id = p_team_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_team_members_usernames(p_team_id INT)
RETURNS TABLE (
    member_id INT,
    username VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.member_id, u.username
    FROM members m
    INNER JOIN users u ON m.user_id = u.user_id
    WHERE m.team_id = p_team_id AND m.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_tasks(p_user_id INT)
RETURNS TABLE (
    task_id INT,
    task_name VARCHAR,
    task_description VARCHAR,
    team_name VARCHAR,
    status_name VARCHAR,
    priority_name VARCHAR,
    created_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.task_id,
        t.task_name,
        t.task_description,
        tm.team_name,
        s.status_name,
        p.priority_name,
        t.created_at,
        t.completed_at
    FROM tasks t
    INNER JOIN teams tm ON t.team_id = tm.team_id
    INNER JOIN statuses s ON t.status_id = s.status_id
    INNER JOIN priorities p ON t.priority_id = p.priority_id
    LEFT JOIN members m ON t.member_id = m.member_id
    WHERE m.user_id = p_user_id AND m.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
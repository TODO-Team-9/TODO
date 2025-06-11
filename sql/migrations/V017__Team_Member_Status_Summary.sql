DROP FUNCTION IF EXISTS get_team_daily_task_stats(INT, TIMESTAMPTZ, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION get_team_daily_task_stats(
    p_team_id INT,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
    username VARCHAR(50),
    backlog INT,
    in_progress INT,
    completed INT,
    total INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.username,
        COALESCE(SUM(CASE WHEN s.status_name = 'Backlog' THEN 1 ELSE 0 END)::INT, 0) AS backlog,
        COALESCE(SUM(CASE WHEN s.status_name = 'In Progress' THEN 1 ELSE 0 END)::INT, 0) AS in_progress,
        COALESCE(SUM(CASE WHEN s.status_name = 'Completed' THEN 1 ELSE 0 END)::INT, 0) AS completed,
        COUNT(t.task_id)::INT AS total
    FROM members m
    JOIN users u ON m.user_id = u.user_id
    LEFT JOIN tasks t ON t.member_id = m.member_id
        AND t.team_id = p_team_id
        AND t.created_at BETWEEN p_start_date AND p_end_date
    LEFT JOIN statuses s ON t.status_id = s.status_id
    WHERE m.team_id = p_team_id
      AND m.removed_at IS NULL
    GROUP BY u.username
    ORDER BY u.username;
END;
$$ LANGUAGE plpgsql; 
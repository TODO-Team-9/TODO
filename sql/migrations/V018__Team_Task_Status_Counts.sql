CREATE OR REPLACE FUNCTION get_team_task_status_counts(
    p_team_id INT
)
RETURNS TABLE (
    backlog INT,
    in_progress INT,
    completed INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN s.status_name = 'Backlog' THEN 1 ELSE 0 END)::INT, 0) AS backlog,
        COALESCE(SUM(CASE WHEN s.status_name = 'In Progress' THEN 1 ELSE 0 END)::INT, 0) AS in_progress,
        COALESCE(SUM(CASE WHEN s.status_name = 'Completed' THEN 1 ELSE 0 END)::INT, 0) AS completed
    FROM tasks t
    LEFT JOIN statuses s ON t.status_id = s.status_id
    WHERE t.team_id = p_team_id;
END;
$$ LANGUAGE plpgsql; 
CREATE OR REPLACE FUNCTION get_team_task_activity_report(
    p_team_id INT,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
    task_name VARCHAR(32),
    task_description VARCHAR(256),
    assigned_username VARCHAR(50),
    created_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    task_status VARCHAR(16)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.task_name,
        t.task_description,
        u.username AS assigned_username,
        t.created_at,
        t.completed_at,
        s.status_name AS task_status
    FROM tasks t
    LEFT JOIN members m ON t.member_id = m.member_id
    LEFT JOIN users u ON m.user_id = u.user_id
    INNER JOIN statuses s ON t.status_id = s.status_id
    WHERE t.team_id = p_team_id
    AND (
        -- Include tasks that were created or completed within the date range
        (t.created_at BETWEEN p_start_date AND p_end_date)
        OR 
        (t.completed_at BETWEEN p_start_date AND p_end_date)
    )
    ORDER BY 
        COALESCE(t.completed_at, t.created_at) ASC,
        t.task_name ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a view for quick access to daily task statistics
CREATE OR REPLACE VIEW team_daily_task_stats AS
SELECT 
    team_id,
    DATE(created_at) AS activity_date,
    COUNT(*) AS total_tasks,
    COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) AS completed_tasks,
    COUNT(CASE WHEN completed_at IS NULL THEN 1 END) AS open_tasks,
    COUNT(CASE WHEN member_id IS NOT NULL THEN 1 END) AS assigned_tasks,
    COUNT(CASE WHEN member_id IS NULL THEN 1 END) AS unassigned_tasks
FROM tasks
GROUP BY team_id, DATE(created_at)
ORDER BY team_id, DATE(created_at);

-- Function to get daily task statistics for a team within a date range
CREATE OR REPLACE FUNCTION get_team_daily_task_stats(
    p_team_id INT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    activity_date DATE,
    total_tasks BIGINT,
    completed_tasks BIGINT,
    open_tasks BIGINT,
    assigned_tasks BIGINT,
    unassigned_tasks BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        stats.activity_date,
        stats.total_tasks,
        stats.completed_tasks,
        stats.open_tasks,
        stats.assigned_tasks,
        stats.unassigned_tasks
    FROM team_daily_task_stats stats
    WHERE stats.team_id = p_team_id
    AND stats.activity_date BETWEEN p_start_date AND p_end_date
    ORDER BY stats.activity_date;
END;
$$ LANGUAGE plpgsql;

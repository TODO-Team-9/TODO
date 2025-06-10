CREATE OR REPLACE FUNCTION get_team_daily_task_stats(
    p_team_id INT,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
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

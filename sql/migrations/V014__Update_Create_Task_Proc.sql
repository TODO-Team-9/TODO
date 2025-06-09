CREATE OR REPLACE PROCEDURE create_task(
    p_task_name VARCHAR(32),
    p_team_id INT,
    p_priority_id INT,
    p_task_description VARCHAR(256) DEFAULT NULL,
    p_member_id INT DEFAULT NULL
) LANGUAGE plpgsql AS $$
DECLARE
    v_status_id INT;
BEGIN
    -- Validate priority exists
    IF NOT EXISTS (SELECT 1 FROM priorities WHERE priority_id = p_priority_id) THEN
        RAISE EXCEPTION 'Priority does not exist';
    END IF;

    -- Get default status (Backlog)
    SELECT status_id INTO v_status_id FROM statuses WHERE status_name = 'Backlog';
    IF v_status_id IS NULL THEN
        RAISE EXCEPTION 'Default status "Backlog" does not exist';
    END IF;

    -- Insert the new task
    INSERT INTO tasks (
        task_name, task_description, team_id, status_id, priority_id, member_id
    ) VALUES (
        p_task_name, p_task_description, p_team_id, v_status_id, p_priority_id, p_member_id
    );

    RAISE NOTICE 'Task created successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error creating task: %', SQLERRM;
END;
$$; 
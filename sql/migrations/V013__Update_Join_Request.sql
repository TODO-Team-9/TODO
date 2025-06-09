CREATE OR REPLACE PROCEDURE update_join_request(
    p_request_id INT,
    p_new_status INT
) LANGUAGE plpgsql AS $$
DECLARE
    v_team_id INT;
    v_user_id INT;
    v_status_name VARCHAR(16);
    v_current_status INT;
    v_member_exists INT;
    v_pending_status INT;
BEGIN
    -- Get the PENDING status ID once
    SELECT request_status_id INTO v_pending_status
    FROM request_statuses 
    WHERE request_status_name = 'PENDING';

    -- Check if request exists and get current state
    SELECT 
        team_id, 
        user_id,
        request_status INTO v_team_id, v_user_id, v_current_status
    FROM join_requests
    WHERE request_id = p_request_id;

    IF v_team_id IS NULL OR v_user_id IS NULL THEN
        RAISE EXCEPTION 'Join request does not exist';
    END IF;

    -- Get the new status name
    SELECT request_status_name INTO v_status_name
    FROM request_statuses
    WHERE request_status_id = p_new_status;

    IF v_status_name IS NULL THEN
        RAISE EXCEPTION 'Invalid request status';
    END IF;

    -- Check if the request is still pending
    IF v_current_status != v_pending_status THEN
        RAISE EXCEPTION 'Join request has already been processed';
    END IF;

    -- If accepting, check if user is already a member of the team
    IF v_status_name = 'ACCEPTED' THEN
        SELECT 1 INTO v_member_exists
        FROM members
        WHERE user_id = v_user_id 
        AND team_id = v_team_id
        AND removed_at IS NULL;

        IF v_member_exists IS NOT NULL THEN
            RAISE EXCEPTION 'User is already a member of this team';
        END IF;

        -- First update the request status
        UPDATE join_requests 
        SET request_status = p_new_status 
        WHERE request_id = p_request_id;

        -- Then create the member record
        CALL add_member(v_user_id, v_team_id);
    ELSE
        -- Just update the status for non-accept cases
        UPDATE join_requests 
        SET request_status = p_new_status 
        WHERE request_id = p_request_id;
    END IF;

    RAISE NOTICE 'Join request updated successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error updating join request: %', SQLERRM;
END;
$$; 
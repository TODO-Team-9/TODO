CREATE OR REPLACE PROCEDURE promote_member (
    p_member_id INT,
    p_team_id INT
) LANGUAGE plpgsql AS $$
DECLARE
    v_lead_id INT;
    v_role_id INT;
    v_member_exists INT;
BEGIN
    -- Check if member exists in the specified team
    SELECT 1 INTO v_member_exists
    FROM members
    WHERE member_id = p_member_id 
    AND team_id = p_team_id
    AND removed_at IS NULL;

    IF v_member_exists IS NULL THEN
        RAISE EXCEPTION 'Member does not exist in the specified team or has been removed';
    END IF;
    
    SELECT team_role_id INTO v_lead_id
    FROM team_roles
    WHERE team_role_name = 'Team Lead';

    SELECT team_role_id INTO v_role_id
    FROM members
    WHERE member_id = p_member_id;

    IF v_role_id = v_lead_id THEN
        RAISE EXCEPTION 'Member has already been promoted in this team';
    END IF;

    UPDATE members
    SET team_role_id = v_lead_id
    WHERE member_id = p_member_id
    AND team_id = p_team_id;

    RAISE NOTICE 'Member promoted successfully in the specified team';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error promoting member: %', SQLERRM;
END;
$$;
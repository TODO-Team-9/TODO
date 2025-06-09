CREATE OR REPLACE PROCEDURE update_member (
    p_member_id INT,
    p_team_id INT,
    p_team_role_id INT
) LANGUAGE plpgsql AS $$
DECLARE
    v_lead_id INT;
    v_role_id INT;
    v_member_exists INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM members WHERE member_id = p_member_id) THEN
        RAISE EXCEPTION 'Member does not exist';
    END IF;

    SELECT 1 INTO v_member_exists
    FROM members
    WHERE member_id = p_member_id 
    AND team_id = p_team_id
    AND removed_at IS NULL;

    IF v_member_exists IS NULL THEN
        RAISE EXCEPTION 'Member does not exist in the specified team or has been removed';
    END IF;
    
    SELECT team_role_id INTO v_role_id
    FROM members
    WHERE member_id = p_member_id;

    IF v_role_id = p_team_role_id THEN
        RAISE EXCEPTION 'Member already has that team role';
    END IF;

    UPDATE members
    SET team_role_id = p_team_role_id
    WHERE member_id = p_member_id;

    RAISE NOTICE 'Member team role updated successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error updating team role of member: %', SQLERRM;
END;
$$;

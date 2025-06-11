CREATE OR REPLACE PROCEDURE add_member (
    p_user_id INT,
    p_team_id INT,
    p_team_role_id INT
) LANGUAGE plpgsql AS $$
DECLARE
    v_member_id INT;
    v_removed TIMESTAMPTZ;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM teams WHERE team_id = p_team_id) THEN
        RAISE EXCEPTION 'Team does not exist';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM team_roles WHERE team_role_id = p_team_role_id) THEN
        RAISE EXCEPTION 'Team role does not exist';
    END IF;

    SELECT
        member_id INTO v_member_id
    FROM members
    WHERE user_id = p_user_id AND team_id = p_team_id;

    SELECT removed_at INTO v_removed
    FROM members
    WHERE member_id = v_member_id;
    
    IF v_member_id IS NOT NULL AND v_removed IS NULL THEN
        RAISE EXCEPTION 'User is already a member of this team';
    END IF;

    INSERT INTO members (user_id, team_id, team_role_id)
    VALUES (p_user_id, p_team_id, p_team_role_id);

    RAISE NOTICE 'Added user to the team successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error adding member: %', SQLERRM;
END;
$$; 
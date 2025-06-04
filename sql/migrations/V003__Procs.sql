CREATE OR REPLACE PROCEDURE deactivated_user (
    p_user_id INT
) LANGUAGE plpgsql AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM users
    WHERE user_id = p_user_id
    AND deactivated_at IS NOT NULL;

    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;

    IF v_count > 0 THEN
        RAISE EXCEPTION 'User is already deactivated';
    END IF;

    UPDATE users
    SET deactivated_at = NOW()
    WHERE user_id = p_user_id;

    RAISE NOTICE 'User deactivated successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error deactivating user: %',
                SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE create_team (
    p_team_name VARCHAR(32),
    p_team_description VARCHAR(128) DEFAULT NULL
) LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO teams (team_name, team_description)
    VALUES (p_team_name, p_team_description);
END;
$$;

CREATE OR REPLACE PROCEDURE remove_member (
    p_user_id INT,
    p_team_id INT
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

    SELECT member_id INTO v_member_id
    FROM members
    WHERE user_id = p_user_id AND team_id = p_team_id;

    IF v_member_id IS NULL THEN
        RAISE EXCEPTION 'User does not exist in that team';
    END IF;

    SELECT removed_at INTO v_removed
    FROM members
    WHERE member_id = v_member_id;

    IF v_removed IS NOT NULL THEN
        RAISE EXCEPTION 'User has already been removed from this team';
    END IF;

    UPDATE members
    SET removed_at = NOW()
    WHERE member_id = v_member_id;

    RAISE NOTICE 'Member removed successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error removing member: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE add_member (
    p_user_id INT,
    p_team_id INT
) LANGUAGE plpgsql AS $$
DECLARE
    v_member_id INT;
    v_removed TIMESTAMPTZ;
    v_role_id INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM teams WHERE team_id = p_team_id) THEN
        RAISE EXCEPTION 'Team does not exist';
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

    SELECT team_role_id INTO v_role_id
    FROM team_roles
    WHERE team_role_name = 'TODO User';

    INSERT INTO members (user_id, team_id, team_role_id)
    VALUES (p_user_id, p_team_id, v_role_id);

    RAISE NOTICE 'Added user to the team successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error adding member: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE promote_member (
    p_member_id INT
) LANGUAGE plpgsql AS $$
DECLARE
    v_lead_id INT;
    v_role_id INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM members WHERE member_id = p_member_id) THEN
        RAISE EXCEPTION 'Member does not exist';
    END IF;
    
    SELECT team_role_id INTO v_lead_id
    FROM team_roles
    WHERE team_role_name = 'Team Lead';

    SELECT team_role_id INTO v_role_id
    FROM members
    WHERE member_id = p_member_id;

    IF v_role_id = v_lead_id THEN
        RAISE EXCEPTION 'Member has already been promoted';
    END IF;

    UPDATE members
    SET team_role_id = v_lead_id
    WHERE member_id = p_member_id;

    RAISE NOTICE 'Member promoted successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error promoting member: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE add_user (
  p_username VARCHAR(50),
  p_email_address VARCHAR(128),
  p_password_hash VARCHAR(180),
  p_two_factor_secret VARCHAR(256)
) LANGUAGE plpgsql AS $$
DECLARE
    v_system_role INT;
BEGIN
    p_username := TRIM(p_username);
    p_email_address := TRIM(p_email_address);

    SELECT system_role_id INTO v_system_role
    FROM system_roles
    WHERE system_role_name = 'System User';

    INSERT INTO users
        (username, email_address, password_hash, two_factor_secret, system_role_id)
    VALUES
        (p_username, p_email_address, p_password_hash, p_two_factor_secret, v_system_role);

    RAISE NOTICE 'Added user successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error adding user: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE deactivate_user (
    p_user_id INT
) LANGUAGE plpgsql AS $$
DECLARE
    v_deactivated TIMESTAMPTZ;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;

    SELECT deactivated_at INTO v_deactivated
    FROM users
    WHERE user_id = p_user_id;

    IF v_deactivated IS NOT NULL THEN
        RAISE EXCEPTION 'User is already deactivated';
    END IF;

    UPDATE users
    SET deactivated_at = NOW()
    WHERE user_id = p_user_id;

    RAISE NOTICE 'Deactivated user successfully';

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Error deactivating user: %', SQLERRM;
END;
$$;
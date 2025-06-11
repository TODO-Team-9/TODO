ALTER TABLE users DROP COLUMN IF EXISTS email_address;
-- Update add_user procedure to remove email parameter
CREATE OR REPLACE PROCEDURE add_user (
        p_username VARCHAR(50),
        p_password_hash VARCHAR(180),
        p_two_factor_secret VARCHAR(256)
    ) LANGUAGE plpgsql AS $$
DECLARE v_system_role INT;
BEGIN p_username := TRIM(p_username);
SELECT system_role_id INTO v_system_role
FROM system_roles
WHERE system_role_name = 'System User';
INSERT INTO users (
        username,
        password_hash,
        two_factor_secret,
        system_role_id
    )
VALUES (
        p_username,
        p_password_hash,
        p_two_factor_secret,
        v_system_role
    );
RAISE NOTICE 'Added user successfully';
EXCEPTION
WHEN others THEN RAISE EXCEPTION 'Error adding user: %',
SQLERRM;
END;
$$;
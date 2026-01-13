-- Insert Tony Stark
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update Tony Stark to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = (
        SELECT account_id
        FROM account
        WHERE account_email = 'tony@starkent.com'
    );
-- Delete Tony Stark
DELETE FROM account
WHERE account_id = (
        SELECT account_id
        FROM account
        WHERE account_email = 'tony@starkent.com'
    );
-- Update GM Hummer description: replace 'small interiors' -> 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = (
        SELECT inv_id
        FROM inventory
        WHERE inv_make = 'GM'
            AND inv_model = 'Hummer'
    );
-- INNER JOIN: Sport inventory -> return make, model, classification name
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- Update ALL inventory image paths to include "/vehicles" in the middle
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image NOT LIKE '%/images/vehicles/%'
    OR inv_thumbnail NOT LIKE '%/images/vehicles/%';
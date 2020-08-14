-- To test that the correct FK ID's are being used start eqch seuence number with a different value to avoid false positives when ID's happen to match
ALTER SEQUENCE assignments_id_seq RESTART 100;
SELECT nextval('assignments_id_seq');

ALTER SEQUENCE clients_id_seq RESTART 200;
SELECT nextval('clients_id_seq');

ALTER SEQUENCE contributions_id_seq RESTART 300;
SELECT nextval('contributions_id_seq');

ALTER SEQUENCE messages_id_seq RESTART 400;
SELECT nextval('messages_id_seq');

ALTER SEQUENCE module_leaders_id_seq RESTART 500;
SELECT nextval('module_leaders_id_seq');

ALTER SEQUENCE project_assignments_id_seq RESTART 600;
SELECT nextval('project_assignments_id_seq');

ALTER SEQUENCE project_groups_id_seq RESTART 700;
SELECT nextval('project_groups_id_seq');

ALTER SEQUENCE project_proposals_id_seq RESTART 800;
SELECT nextval('project_proposals_id_seq');

ALTER SEQUENCE projects_id_seq RESTART 900;
SELECT nextval('projects_id_seq');

ALTER SEQUENCE proposal_reviews_id_seq RESTART 1000;
SELECT nextval('proposal_reviews_id_seq');

ALTER SEQUENCE studentfiles_id_seq RESTART 1100;
SELECT nextval('studentfiles_id_seq');

ALTER SEQUENCE students_id_seq RESTART 1200;
SELECT nextval('students_id_seq');

ALTER SEQUENCE submissions_id_seq RESTART 1300;
SELECT nextval('submissions_id_seq');

ALTER SEQUENCE supervisors_id_seq RESTART 1400;
SELECT nextval('supervisors_id_seq');

ALTER SEQUENCE users_id_seq RESTART 1500;
SELECT nextval('users_id_seq');

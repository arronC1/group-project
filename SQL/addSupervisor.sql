INSERT INTO public.supervisors(
	id, firstname, surname, email, "createdAt", "updatedAt")
	VALUES (nextval('supervisors_id_seq'), 'Super', 'Visor', 'p1@test.org', now(), now());
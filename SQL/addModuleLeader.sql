INSERT INTO public.module_leaders(
	id, firstname, surname, email, "createdAt", "updatedAt")
	VALUES (nextval('module_leaders_id_seq'), 'Mod', 'Leader', 'm1@test.org', now(), now());
	
	
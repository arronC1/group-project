INSERT INTO public.clients(
	id, firstname, surname, email, "createdAt", "updatedAt")
	VALUES (nextval('clients_id_seq'), 'Clive', 'Client', 'c1@test.org', now(), now());
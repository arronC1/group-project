INSERT INTO public.students(
	id, firstname, surname, student_number, email, "createdAt", "updatedAt", "projectGroupId")
	VALUES (nextval('students_id_seq'), 'Stu', 'Student', 1, 's1@test.org', now(), now(), null);
-- Table: public.Hero

-- DROP TABLE public."Hero";

CREATE TABLE IF NOT EXISTS public."Hero"
(
    "Id" smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
    "Name" character varying COLLATE pg_catalog."default" NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE public."Hero"
    OWNER to postgres;


INSERT INTO public."Hero"("Name")
	VALUES 
	('Spider Man'), 
	('Captain America'),
	('Shocker'),
	('Magneto'),
	('Mystic'),
	('Polaris'),
	('Daredevil'),
	('Bloodstone'),	
	('Dr Strange'),
	('Wolverine'),
	('Deadpool');
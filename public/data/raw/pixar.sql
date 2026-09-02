PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE movies (
    id integer primary key autoincrement,
    title text,
    director text,
    year integer, 
    length_minutes integer
);
INSERT INTO movies VALUES(1,'Toy Story','John Lasseter',1995,81);
INSERT INTO movies VALUES(2,'A Bug''s Life','John Lasseter',1998,95);
INSERT INTO movies VALUES(3,'Toy Story 2','John Lasseter',1999,93);
INSERT INTO movies VALUES(4,'Monsters, Inc.','Pete Docter',2001,92);
INSERT INTO movies VALUES(5,'Finding Nemo','Andrew Stanton',2003,107);
INSERT INTO movies VALUES(6,'The Incredibles','Brad Bird',2004,116);
INSERT INTO movies VALUES(7,'Cars','John Lasseter',2006,117);
INSERT INTO movies VALUES(8,'Ratatouille','Brad Bird',2007,115);
INSERT INTO movies VALUES(9,'WALL-E','Andrew Stanton',2008,104);
INSERT INTO movies VALUES(10,'Up','Pete Docter',2009,101);
INSERT INTO movies VALUES(11,'Toy Story 3','Lee Unkrich',2010,103);
INSERT INTO movies VALUES(12,'Cars 2','John Lasseter',2011,120);
INSERT INTO movies VALUES(13,'Brave','Brenda Chapman',2012,102);
INSERT INTO movies VALUES(14,'Monsters University','Dan Scanlon',2013,110);
CREATE TABLE movie_location (
    movie_id integer,
    city text
);
INSERT INTO movie_location VALUES(4,'Monstropolis');
INSERT INTO movie_location VALUES(5,'Sydney, Australia');
INSERT INTO movie_location VALUES(6,'Nomanisan Island');
INSERT INTO movie_location VALUES(7,'Radiator Springs');
INSERT INTO movie_location VALUES(8,'Paris, France');
CREATE TABLE boxoffice (
    -- id integer primary key autoincrement,
    movie_id integer,
    rating real,
    domestic_sales real,
    international_sales real
);
INSERT INTO boxoffice VALUES(5,8.199999999999999289,380843261.0,555900000.0);
INSERT INTO boxoffice VALUES(14,7.400000000000000355,268492764.0,475066843.0);
INSERT INTO boxoffice VALUES(8,8.0,206445654.0,417277164.0);
INSERT INTO boxoffice VALUES(12,6.400000000000000355,191452396.0,368400000.0);
INSERT INTO boxoffice VALUES(3,7.900000000000000355,245852179.0,239163000.0);
INSERT INTO boxoffice VALUES(6,8.0,261441092.0,370001000.0);
INSERT INTO boxoffice VALUES(9,8.5,223808164.0,297503696.0);
INSERT INTO boxoffice VALUES(11,8.400000000000000355,415004880.0,648167031.0);
INSERT INTO boxoffice VALUES(1,8.300000000000000711,191796233.0,170162503.0);
INSERT INTO boxoffice VALUES(7,7.200000000000000177,244082982.0,217900167.0);
INSERT INTO boxoffice VALUES(10,8.300000000000000711,293004164.0,438338580.0);
INSERT INTO boxoffice VALUES(4,8.099999999999999645,289916256.0,272900000.0);
INSERT INTO boxoffice VALUES(2,7.200000000000000177,162798565.0,200600000.0);
INSERT INTO boxoffice VALUES(13,7.200000000000000177,237283207.0,301700000.0);
INSERT INTO sqlite_sequence VALUES('movies',14);
COMMIT;

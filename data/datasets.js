/* Conjuntos de datos disponibles en las lecciones y en el Playground.
   Cada dataset es un script SQL que se ejecuta sobre una base SQLite en memoria (sql.js). */
(function () {
  const D = {};

  /* ------------------------------------------------------------------ *
   * pixar — base original de SQLBolt (movies / boxoffice / movie_location)
   * ------------------------------------------------------------------ */
  D.pixar = {
    id: 'pixar',
    name: 'Pixar',
    description: 'Películas de Pixar, su recaudación y sus localizaciones. Es la base original de SQLBolt.',
    i18n: { en: { name: 'Pixar', description: "Pixar movies, their box office and their locations. This is SQLBolt's original database." } },
    tables: ['movies', 'boxoffice', 'movie_location'],
    sql: `
CREATE TABLE movies (
    id integer primary key autoincrement,
    title text,
    director text,
    year integer,
    length_minutes integer
);
INSERT INTO movies (id, title, director, year, length_minutes) VALUES
 (1,'Toy Story','John Lasseter',1995,81),
 (2,'A Bug''s Life','John Lasseter',1998,95),
 (3,'Toy Story 2','John Lasseter',1999,93),
 (4,'Monsters, Inc.','Pete Docter',2001,92),
 (5,'Finding Nemo','Andrew Stanton',2003,107),
 (6,'The Incredibles','Brad Bird',2004,116),
 (7,'Cars','John Lasseter',2006,117),
 (8,'Ratatouille','Brad Bird',2007,115),
 (9,'WALL-E','Andrew Stanton',2008,104),
 (10,'Up','Pete Docter',2009,101),
 (11,'Toy Story 3','Lee Unkrich',2010,103),
 (12,'Cars 2','John Lasseter',2011,120),
 (13,'Brave','Brenda Chapman',2012,102),
 (14,'Monsters University','Dan Scanlon',2013,110);

CREATE TABLE movie_location (
    movie_id integer,
    city text
);
INSERT INTO movie_location VALUES
 (4,'Monstropolis'),
 (5,'Sydney, Australia'),
 (6,'Nomanisan Island'),
 (7,'Radiator Springs'),
 (8,'Paris, France');

CREATE TABLE boxoffice (
    movie_id integer,
    rating real,
    domestic_sales real,
    international_sales real
);
INSERT INTO boxoffice VALUES
 (5,8.2,380843261,555900000),
 (14,7.4,268492764,475066843),
 (8,8.0,206445654,417277164),
 (12,6.4,191452396,368400000),
 (3,7.9,245852179,239163000),
 (6,8.0,261441092,370001000),
 (9,8.5,223808164,297503696),
 (11,8.4,415004880,648167031),
 (1,8.3,191796233,170162503),
 (7,7.2,244082982,217900167),
 (10,8.3,293004164,438338580),
 (4,8.1,289916256,272900000),
 (2,7.2,162798565,200600000),
 (13,7.2,237283207,301700000);
`
  };

  /* ------------------------------------------------------------------ *
   * misc — base original de SQLBolt (employees / buildings / ciudades)
   * ------------------------------------------------------------------ */
  D.misc = {
    id: 'misc',
    name: 'Oficina y ciudades',
    description: 'Empleados, edificios y ciudades de Norteamérica. Base original de SQLBolt para JOINs, NULLs y agregados.',
    i18n: { en: { name: 'Office and cities', description: "Employees, buildings and North American cities. SQLBolt's original database for JOINs, NULLs and aggregates." } },
    tables: ['employees', 'buildings', 'north_american_cities'],
    sql: `
CREATE TABLE buildings (
    building_name text,
    capacity int
);
INSERT INTO buildings VALUES ('1e',24),('1w',32),('2e',16),('2w',20);

CREATE TABLE employees (
    role text,
    name text,
    building text,
    years_employed integer
);
INSERT INTO employees VALUES
 ('Engineer','Becky A.','1e',4),
 ('Engineer','Dan B.','1e',2),
 ('Engineer','Sharon F.','1e',6),
 ('Engineer','Dan M.','1e',4),
 ('Engineer','Malcom S.','1e',1),
 ('Artist','Tylar S.','2w',2),
 ('Artist','Sherman D.','2w',8),
 ('Artist','Jakob J.','2w',6),
 ('Artist','Lillia A.','2w',7),
 ('Artist','Brandon J.','2w',7),
 ('Manager','Scott K.','1e',9),
 ('Manager','Shirlee M.','1e',3),
 ('Manager','Daria O.','2w',6);

CREATE TABLE north_american_cities (
    city text,
    country text,
    population integer,
    latitude real,
    longitude real
);
INSERT INTO north_american_cities VALUES
 ('Guadalajara','Mexico',1500800,20.659699,-103.349609),
 ('Toronto','Canada',2795060,43.653226,-79.383184),
 ('Houston','United States',2195914,29.760427,-95.369803),
 ('New York','United States',8405837,40.712784,-74.005941),
 ('Philadelphia','United States',1553165,39.952584,-75.165222),
 ('Havana','Cuba',2106146,23.05407,-82.345189),
 ('Mexico City','Mexico',8555500,19.432608,-99.133208),
 ('Phoenix','United States',1513367,33.448377,-112.074037),
 ('Los Angeles','United States',3884307,34.052234,-118.243685),
 ('Ecatepec de Morelos','Mexico',1742000,19.601841,-99.050674),
 ('Montreal','Canada',1717767,45.501689,-73.567256),
 ('Chicago','United States',2718782,41.878114,-87.629798);
`
  };

  /* ------------------------------------------------------------------ *
   * tienda — dataset propio para los temas avanzados
   * (fechas, CTEs, ventanas, vistas, índices, triggers, transacciones…)
   * ------------------------------------------------------------------ */
  D.tienda = {
    id: 'tienda',
    name: 'Tienda online',
    description: 'Clientes, productos, pedidos y sus detalles. Incluye fechas, NULLs y claves foráneas: sirve para vistas, índices, CTEs, funciones de ventana, triggers y transacciones.',
    i18n: { en: { name: 'Online store', description: 'Customers, products, orders and their line items. It has dates, NULLs and foreign keys, so it works for views, indexes, CTEs, window functions, triggers and transactions.' } },
    tables: ['clientes', 'categorias', 'productos', 'pedidos', 'detalle_pedido', 'empleados'],
    sql: `
PRAGMA foreign_keys = ON;

CREATE TABLE categorias (
    id          INTEGER PRIMARY KEY,
    nombre      TEXT NOT NULL UNIQUE,
    margen      REAL NOT NULL DEFAULT 0.25
);
INSERT INTO categorias VALUES
 (1,'Portátiles',0.12),
 (2,'Periféricos',0.35),
 (3,'Monitores',0.20),
 (4,'Audio',0.40),
 (5,'Almacenamiento',0.28);

CREATE TABLE clientes (
    id           INTEGER PRIMARY KEY,
    nombre       TEXT NOT NULL,
    email        TEXT UNIQUE,
    ciudad       TEXT,
    pais         TEXT NOT NULL DEFAULT 'España',
    fecha_alta   TEXT NOT NULL,
    vip          INTEGER NOT NULL DEFAULT 0 CHECK (vip IN (0,1))
);
INSERT INTO clientes VALUES
 (1,'Lucía Ferrer','lucia@correo.es','Valencia','España','2021-03-14',1),
 (2,'Marc Oliva','marc@mail.cat','Barcelona','España','2021-07-02',0),
 (3,'Ana Ruiz','ana@correo.es','Madrid','España','2022-01-20',1),
 (4,'Tomás Neira','tomas@empresa.pe','Lima','Perú','2022-05-30',0),
 (5,'Sofía Duarte','sofia@mail.pt',NULL,'Portugal','2022-09-11',0),
 (6,'Iván Cabral','ivan@correo.co','Bogotá','Colombia','2023-02-08',1),
 (7,'Nuria Peña','nuria@correo.es','Sevilla','España','2023-06-19',0),
 (8,'Diego Salas','diego@mail.cl','Santiago','Chile','2023-11-27',0),
 (9,'Elena Vidal','elena@empresa.es','Madrid','España','2024-01-15',1),
 (10,'Pablo Mena',NULL,'Ciudad de México','México','2024-04-03',0);

CREATE TABLE empleados (
    id            INTEGER PRIMARY KEY,
    nombre        TEXT NOT NULL,
    puesto        TEXT NOT NULL,
    salario       REAL NOT NULL CHECK (salario > 0),
    jefe_id       INTEGER REFERENCES empleados(id),
    fecha_ingreso TEXT NOT NULL
);
INSERT INTO empleados VALUES
 (1,'Rosa Iglesias','Directora',82000,NULL,'2019-01-07'),
 (2,'Kevin Arce','Jefe de ventas',54000,1,'2020-02-17'),
 (3,'Marta Sen','Comercial',36000,2,'2021-04-05'),
 (4,'Hugo Prats','Comercial',34500,2,'2021-09-13'),
 (5,'Leo Duran','Jefe de soporte',49000,1,'2020-06-01'),
 (6,'Berta Gil','Soporte',31000,5,'2022-03-21'),
 (7,'Iker Moya','Soporte',30500,5,'2023-08-14');

CREATE TABLE productos (
    id           INTEGER PRIMARY KEY,
    nombre       TEXT NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id),
    precio       REAL NOT NULL CHECK (precio >= 0),
    stock        INTEGER NOT NULL DEFAULT 0,
    descatalogado INTEGER NOT NULL DEFAULT 0
);
INSERT INTO productos VALUES
 (1,'Portátil Aura 14',1,1199.00,12,0),
 (2,'Portátil Aura 16',1,1549.00,5,0),
 (3,'Portátil Nimbus Pro',1,2199.00,2,0),
 (4,'Teclado mecánico K2',2,89.90,140,0),
 (5,'Ratón ergonómico M5',2,45.50,220,0),
 (6,'Alfombrilla XL',2,15.00,500,0),
 (7,'Monitor 27" 4K',3,489.00,31,0),
 (8,'Monitor 34" ultrapanorámico',3,749.00,9,0),
 (9,'Monitor 24" FHD',3,159.00,0,1),
 (10,'Auriculares HX-3',4,129.00,64,0),
 (11,'Altavoces Duo',4,79.00,28,0),
 (12,'Micrófono Studio One',4,199.00,17,0),
 (13,'SSD 1 TB NVMe',5,94.00,180,0),
 (14,'SSD 2 TB NVMe',5,168.00,73,0),
 (15,'Disco externo 4 TB',5,119.00,41,0);

CREATE TABLE pedidos (
    id           INTEGER PRIMARY KEY,
    cliente_id   INTEGER NOT NULL REFERENCES clientes(id),
    empleado_id  INTEGER REFERENCES empleados(id),
    fecha        TEXT NOT NULL,
    estado       TEXT NOT NULL DEFAULT 'pendiente'
                 CHECK (estado IN ('pendiente','enviado','entregado','cancelado')),
    descuento    REAL NOT NULL DEFAULT 0
);
INSERT INTO pedidos VALUES
 (1001,1,3,'2023-01-12','entregado',0.00),
 (1002,2,3,'2023-02-03','entregado',0.05),
 (1003,1,4,'2023-03-27','entregado',0.00),
 (1004,3,4,'2023-04-15','cancelado',0.00),
 (1005,4,3,'2023-05-09','entregado',0.10),
 (1006,5,NULL,'2023-06-21','entregado',0.00),
 (1007,3,4,'2023-07-30','entregado',0.00),
 (1008,6,3,'2023-08-18','entregado',0.05),
 (1009,7,NULL,'2023-09-02','enviado',0.00),
 (1010,1,4,'2023-10-11','entregado',0.15),
 (1011,8,3,'2023-11-23','entregado',0.00),
 (1012,9,4,'2024-01-08','entregado',0.00),
 (1013,2,3,'2024-02-14','entregado',0.05),
 (1014,10,NULL,'2024-03-05','pendiente',0.00),
 (1015,9,4,'2024-04-19','entregado',0.00),
 (1016,6,3,'2024-05-28','enviado',0.10),
 (1017,3,4,'2024-06-30','entregado',0.00),
 (1018,1,3,'2024-07-22','entregado',0.00);

CREATE TABLE detalle_pedido (
    pedido_id    INTEGER NOT NULL REFERENCES pedidos(id),
    producto_id  INTEGER NOT NULL REFERENCES productos(id),
    cantidad     INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unit  REAL NOT NULL,
    PRIMARY KEY (pedido_id, producto_id)
);
INSERT INTO detalle_pedido VALUES
 (1001,1,1,1199.00),(1001,4,1,89.90),
 (1002,5,2,45.50),(1002,6,3,15.00),
 (1003,7,2,489.00),(1003,13,1,94.00),
 (1004,3,1,2199.00),
 (1005,10,1,129.00),(1005,11,1,79.00),(1005,6,2,15.00),
 (1006,13,4,94.00),
 (1007,2,1,1549.00),(1007,8,1,749.00),
 (1008,4,3,89.90),(1008,5,3,45.50),
 (1009,12,1,199.00),
 (1010,3,1,2199.00),(1010,14,2,168.00),
 (1011,15,1,119.00),(1011,6,1,15.00),
 (1012,7,1,489.00),(1012,10,2,129.00),
 (1013,5,1,45.50),
 (1014,1,1,1199.00),
 (1015,8,1,749.00),(1015,4,1,89.90),(1015,13,2,94.00),
 (1016,11,2,79.00),(1016,12,1,199.00),
 (1017,14,3,168.00),
 (1018,2,1,1549.00),(1018,7,2,489.00),(1018,5,1,45.50);
`
  };

  window.DATASETS = D;
})();

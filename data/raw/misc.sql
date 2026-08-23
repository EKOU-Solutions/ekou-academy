PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE buildings (
    building_name text,
    capacity int
);
INSERT INTO buildings VALUES('1e',24);
INSERT INTO buildings VALUES('1w',32);
INSERT INTO buildings VALUES('2e',16);
INSERT INTO buildings VALUES('2w',20);
CREATE TABLE employees (
    -- id integer primary key autoincrement,
    role text,
    name text,
    building text,
    years_employed integer
);
INSERT INTO employees VALUES('Engineer','Becky A.','1e',4);
INSERT INTO employees VALUES('Engineer','Dan B.','1e',2);
INSERT INTO employees VALUES('Engineer','Sharon F.','1e',6);
INSERT INTO employees VALUES('Engineer','Dan M.','1e',4);
INSERT INTO employees VALUES('Engineer','Malcom S.','1e',1);
INSERT INTO employees VALUES('Artist','Tylar S.','2w',2);
INSERT INTO employees VALUES('Artist','Sherman D.','2w',8);
INSERT INTO employees VALUES('Artist','Jakob J.','2w',6);
INSERT INTO employees VALUES('Artist','Lillia A.','2w',7);
INSERT INTO employees VALUES('Artist','Brandon J.','2w',7);
INSERT INTO employees VALUES('Manager','Scott K.','1e',9);
INSERT INTO employees VALUES('Manager','Shirlee M.','1e',3);
INSERT INTO employees VALUES('Manager','Daria O.','2w',6);
CREATE TABLE north_american_cities (
    -- id integer primary key autoincrement,
    city text,
    country text,
    population integer,
    latitude real,
    longitude real
);
INSERT INTO north_american_cities VALUES('Guadalajara','Mexico',1500800,20.65969899999999982,-103.3496090000000009);
INSERT INTO north_american_cities VALUES('Toronto','Canada',2795060,43.65322599999999653,-79.38318399999999997);
INSERT INTO north_american_cities VALUES('Houston','United States',2195914,29.76042699999999997,-95.3698030000000045);
INSERT INTO north_american_cities VALUES('New York','United States',8405837,40.7127839999999992,-74.00594100000000708);
INSERT INTO north_american_cities VALUES('Philadelphia','United States',1553165,39.95258400000000165,-75.16522199999999998);
INSERT INTO north_american_cities VALUES('Havana','Cuba',2106146,23.0540699999999994,-82.34518900000000485);
INSERT INTO north_american_cities VALUES('Mexico City','Mexico',8555500,19.43260799999999832,-99.1332079999999963);
INSERT INTO north_american_cities VALUES('Phoenix','United States',1513367,33.44837700000000069,-112.0740370000000041);
INSERT INTO north_american_cities VALUES('Los Angeles','United States',3884307,34.05223399999999856,-118.2436849999999993);
INSERT INTO north_american_cities VALUES('Ecatepec de Morelos','Mexico',1742000,19.60184100000000029,-99.0506740000000007);
INSERT INTO north_american_cities VALUES('Montreal','Canada',1717767,45.50168899999999895,-73.56725600000000042);
INSERT INTO north_american_cities VALUES('Chicago','United States',2718782,41.8781139999999965,-87.62979799999999386);
COMMIT;

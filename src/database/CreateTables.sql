CREATE TABLE users (
    id serial primary key, 
    name varchar(15) not null,
    email varchar(50) not null UNIQUE, 
    password varchar(20) not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp
);

CREATE TABLE photos (
    id serial primary key,
    url varchar(255) UNIQUE not null, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id integer not null references users (id) 
);

CREATE TABLE users_address (
    id serial primary key, 
    cep integer not null UNIQUE , 
    user_id integer not null UNIQUE,
    foreign key (user_id) references users (id)
);


create table hashtags (
	name varchar(10) unique not null primary key
);


CREATE TABLE users_hashtags (
    user_id integer not null,
    hashtag_id integer not null
);
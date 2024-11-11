create database digital_store;
use digital_store;

-- CRIAÇÃO DAS TABELAS

-- tabela de usuários

create table users (
	id integer auto_increment,
    firstname varchar(50) not null,
    surname varchar(50) not null,
    email varchar(50) not null unique,
    password varchar(50) not null,
    primary key (id)
);
/*
Use a configuração timestamps: true do sequelize
para gerar as colunas created_at e updated_at
*/

create table categories (
	id integer auto_increment,
    name varchar(50) not null,
    slug varchar(50) not null,
    use_in_menu tinyint default 0 check (use_in_menu in (0, 1)),
    primary key (id)
);

/*
Use a configuração timestamps: true do sequelize
para gerar as colunas created_at e updated_at
*/

create table products (
	id integer auto_increment,
    enabled tinyint default 0 check (enabled in (0, 1)),
    name varchar(50) not null,
    slug varchar(50) not null,
    use_in_menu tinyint default 0 check (use_in_menu in (0, 1)),
    stock integer default 0,
    description varchar(300),
    price float not null,
    price_with_discount float not null,
    primary key (id)
);
/*
Use a configuração timestamps: true do sequelize
para gerar as colunas created_at e updated_at
*/

create table images_products (
	id integer auto_increment,
    product_id integer not null,
	enabled tinyint default 0 check (enabled in (0, 1)),
	path varchar(255) not null,
    primary key (id),
	foreign key (product_id) references products(id) 
);

create table options_products (
	id integer auto_increment,
    product_id integer not null,
    title varchar(50),
    shape enum("square", "circle") default "square",
    radius integer default 0,
    type enum("text", "color") default "text",
    value varchar(255) not null,
    primary key (id),
    foreign key (product_id) references products(id) 
);

create table products_categories (
	product_id integer,
    category_id integer,
    foreign key (product_id) references products(id),
    foreign key (category_id) references categories(id)
);

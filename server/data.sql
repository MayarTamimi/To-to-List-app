
CREATE TABLE todo (
    id varchar(255) PRIMARY KEY,
    user_email varchar(255),
    title varchar(255) not null,
    progress int ,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

    CREATE TABLE todo_user (
        email varchar(255) PRIMARY KEY,
        password varchar(255)
    );
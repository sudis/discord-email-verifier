CREATE DATABASE EmailConfirmator;

CREATE TABLE Verification (
    pid INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    member_id CHAR(18) NOT NULL,
    code CHAR(4) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'VERIFIED') DEFAULT 'PENDING' NOT NULL,
    expire_time CHAR(13) NOT NULL,
    creation_date DATETIME DEFAULT (CURRENT_TIME) NOT NULL
);

-- Güzel kardeşim üstteki komutları MySQL'a yazarsan otomatik olarak DB'yi kuracaktır. MySQL'a giriş nasıl yapılır diye sorma https://github.com/sudis/mysql incele.
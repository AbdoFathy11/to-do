import client from "../client";

export type userType = {
  user_id?: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  verified?: boolean;
  verification_code?: string | number
};

export default class User {
  async index() {
    try {
      const connection = await client.connect();
      const sqlQuery = `SELECT * FROM users;`;
      const users = await connection.query(sqlQuery);
      connection.release();
      return users.rows;
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }

  async create(user: userType) {
    try {
      const connection = await client.connect();
      const sqlQuery = `INSERT INTO users
            (
                first_name,
                last_name,
                username,
                email,
                password,
                image
            ) VALUES (
                ($1),
                ($2),
                ($3),
                ($4),
                ($5),
                ($6)
            )
            RETURNING *;`;
      const users = await connection.query(sqlQuery, [
        user.first_name,
        user.last_name,
        user.username,
        user.email,
        user.password,
        user.image,
      ]);
      connection.release();
      return users.rows[0];
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }

  async find(id: number) {
    try {
      const connection = await client.connect();
      const sqlQuery = `SELECT * FROM users WHERE user_id = ($1);`;
      const user = await connection.query(sqlQuery, [id]);
      connection.release();
      if (!user.rows[0]) {
        return {
          msg: `This user is not exist`,
        };
      } else {
        return user.rows[0];
      }
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }

  async deleteUser(id: number) {
    try {
      const connection = await client.connect();
      const sqlQuery = `DELETE FROM users WHERE user_id = ($1);`;
      await connection.query(sqlQuery, [id]);
      connection.release();
      return {
        succeed: "The user is deleted.",
      };
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }

  async changePassword(id: number, newPassword: string) {
    try {
      const connection = await client.connect();
      const sqlQuery = `UPDATE users SET password = ($2) WHERE user_id = ($1);`;
      await connection.query(sqlQuery, [id, newPassword]);
      connection.release();
      return {
        succeed: "The user's password is updated successfully.",
      };
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }

  async updateUser(user: userType) {
    try {
      const connection = await client.connect();
      const sqlQuery = `UPDATE users SET 
        first_name = ($2),
        last_name = ($3),
        username = ($4),
        image = ($5),
        email = ($6)
        WHERE user_id = ($1);`;
      const { first_name, last_name, username, image, email, user_id } = user;
      await connection.query(sqlQuery, [
        user_id,
        first_name,
        last_name,
        username,
        image,
        email,
      ]);
      connection.release();
      return {
        succeed: "The user is updated successfully.",
      };
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }

  async verifying(id: number) {
    try {
      const connection = await client.connect();
      const sqlQuery = `UPDATE users SET verified = ($1) WHERE user_id = ($2)`;
      await connection.query(sqlQuery, [true, id]);
      connection.release();
      return {
        succeed: "User verifyed successfully.",
      };
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }

  async getCode(id: number) {
    try {
      const connection = await client.connect();
      const sqlQuery = `SELECT verification_code FROM users WHERE user_id = ($1);`;
      const code = await connection.query(sqlQuery, [id]);
      connection.release();
      return code.rows[0];
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }
  async singIn(usernameOrEmail?: string) {
    try {
      const connection = await client.connect();
      const sqlQuery = `SELECT * FROM users WHERE username = ($1) OR email = ($1);`;
      const user = await connection.query(sqlQuery, [usernameOrEmail]);
      connection.release();
      return user.rows[0];
    } catch (error) {
      return {
        msg: { File: __filename, Error: error.message },
      };
    }
  }
}



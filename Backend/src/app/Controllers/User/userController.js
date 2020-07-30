const { v4: uuidv4 } = require("uuid");
const db = require("../../../config/database");
const { hash, compare } = require("../../../utils");
const queryString = require("query-string");

class UserController {
  async store(req, res) {
    const { name, e_mail, password, birth, group_id } = req.body;
    try {
      const hashPass = await hash(password);
      const userStore = await db.query(
        "INSERT INTO tb_user (id,name, e_mail, password, birth) VALUES($1, $2,$3,$4,$5)",
        [uuidv4(), name, e_mail, hashPass, birth]
      );
      res.status(201).json(userStore);
    } catch (error) {
      console.log(error);
      res.status(status);
    }
  }

  async index(req, res) {
    const { id } = req.params;
    let status = 200;
    try {
      const {
        rows,
        rowCount,
      } = await db.query("SELECT * FROM tb_user WHERE id = $1", [id]);

      if (rows.length == 0) {
        status = 404;
      }

      return res.status(status).json(rows);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async show(req, res) {
    const { query } = req;
    let { pageCurrent, rowsPage } = query;
    let result = {};

    delete query.pageCurrent;
    delete query.rowsPage;

    const data = queryString.parse(query);

    let status = 200;

    let offset = parseInt(rowsPage) * pageCurrent - parseInt(rowsPage);

    try {
      const {
        rows,
        rowCount,
      } = await db.query(
        "SELECT id, name, e_mail FROM tb_user ORDER BY name  LIMIT $1 OFFSET $2",
        [parseInt(rowsPage), offset]
      );

      if (rows.length === 0) {
        status = 404;
      } else {
        result = {
          pageCurrent: parseInt(pageCurrent),
          totalPages: Math.ceil(rowCount / parseInt(rowsPage)),
          nItems: rowCount,
          data: rows,
        };
      }

      return res.status(status).json(result);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, e_mail, birth, group_id } = req.body;
    try {
      const userUpdate = await db.query(
        "UPDATE tb_user SET name = $1, e_mail = $2, birth = $3, group_id = $4, updated_at = now() WHERE id = $5",
        [name, e_mail, birth, group_id, id]
      );
      return res.status(200).json(userUpdate);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const userDelete = await db.query(
        "UPDATE tb_user SET updated = now(), deleted_at = now() WHERE id = $1",
        [id]
      );
      res.status(200).json(userStore);
    } catch (error) {
      const { status } = error.response;
      res.status(status);
    }
  }

  async login(req, res) {
    const { e_mail, password } = req.body;
    let status = 200;
    let result = {};

    try {
      const {
        rows,
      } = await db.query(
        "SELECT id, name, password, e_mail  FROM tb_user WHERE e_mail = $1",
        [e_mail]
      );

      let compPass = await compare(password, rows[0].password);

      if (rows.length == 0 || !compPass) {
        status = 404;
      } else {
        result = { id: rows[0].id, name: rows[0].name, e_mail: rows[0].e_mail };
      }

      return res.status(status).json(result);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

module.exports = new UserController();

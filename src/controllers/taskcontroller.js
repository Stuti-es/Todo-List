import db from "../database/db.js";

export const getdata = (req, res) => {
  if (req.role === "admin") {
    const sql =
      "SELECT tasks.*, users.name, users.email FROM tasks JOIN users ON tasks.user_id = users.id";
    db.query(sql, (err, result) => {
      if (err) return res.json(err);
      res.json(result);
    });
  } else {
    const sql = "SELECT * FROM tasks WHERE user_id = ?";
    db.query(sql, [req.userid], (err, result) => {
      if (err) return res.json(err);
      res.json(result);
    });
  }
};

export const createtask = (req,res)=>{
  let userId = req.userid;

  if(req.role === "admin" && req.body.name){
    const sql = "SELECT id FROM users WHERE name = ? LIMIT 1";
    db.query(sql,[req.body.name],(err,result)=>{
      if(err){
      console.error("Error in task:", err);
      return res.status(500).json({ error: "Database error" });        
      }
      if(result.length === 0){
        return res.status(500).json({ error: "no data found" });
      }
      userId = result[0].id;
      inserttask(userId,req,res);
    })
  }else{
    inserttask(userId,req,res);
  }
}

export const inserttask = (userId,req, res) => {
  const sql =
    "INSERT INTO tasks (`user_id`,`title`,`description`,`due_date`,`completed`,`status`) VALUES (?)";

  const completed = req.body.completed ? 1 : 0;

  let status = "pending";

  if (completed) {
    status = "completed";
  } else if (req.body.due_date && new Date(req.body.due_date) < new Date()) {
    status = "overdue";
  }

  const values = [
    userId,
    req.body.title,
    req.body.description,
    req.body.due_date || null,
    completed,
    status,
  ];

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error creating task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json({ msg: "Task created successfully" });
  });
};

export const updatetask = (req, res) => {
  let sql =
    "UPDATE tasks SET `title`=?,`description`=?,`due_date`=?,`completed`=?,`status`=? WHERE id=? AND user_id=?";

      const completed = req.body.completed ? 1 : 0;

  let status = "pending";

  if (completed) {
    status = "completed";
  } else if (req.body.due_date && new Date(req.body.due_date) < new Date()) {
    status = "overdue";
  }

  let value = [
    req.body.title,
    req.body.description,
    req.body.due_date,
    completed,
    status,
    req.params.id,
    req.userid,
  ];

    if (req.role === "admin") {
    sql = "UPDATE tasks SET title=?, description=?, due_date=?, completed=?, status=? WHERE id=?";
    value = [
      req.body.title,
      req.body.description,
      req.body.due_date || null,
      req.body.completed ? 1 : 0,
      req.body.status,
      req.params.id
    ];
  }

  db.query(sql, value, (err, result) => {
    if (err) return res.json(err);
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "Not allowed" });
    res.json({ message: "Task updated" });
  });
};

export const deletetask = (req, res) => {
  let sql = "DELETE FROM tasks WHERE id=? AND user_id=?";
  let values = [req.params.id, req.userid];

  if (req.role === "admin") {
    sql = "DELETE FROM tasks WHERE id=?";
    values = [req.params.id];
  }

  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "Not delted" });
    res.json({ message: "Task deleted" });
  });
};

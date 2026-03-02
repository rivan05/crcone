const db = require('../config/db');

exports.getEmployees = async (req, res) => {
  try {
    const [employees] = await db.query('SELECT * FROM employees');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addEmployee = async (req, res) => {
  const { emp_name, emp_code, doj, location } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO employees (emp_name, emp_code, doj, location) VALUES (?, ?, ?, ?)',
      [emp_name, emp_code, doj, location]
    );
    
    // Log history
    await db.query(
      'INSERT INTO history (table_name, record_id, action, new_value, changed_by) VALUES (?, ?, ?, ?, ?)',
      ['employees', result.insertId, 'CREATE', JSON.stringify(req.body), req.user.id]
    );

    res.json({ id: result.insertId, emp_name, emp_code, doj, location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { emp_name, emp_code, doj, location } = req.body;
  try {
    const [old] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    await db.query(
      'UPDATE employees SET emp_name = ?, emp_code = ?, doj = ?, location = ? WHERE id = ?',
      [emp_name, emp_code, doj, location, id]
    );

    // Log history
    await db.query(
      'INSERT INTO history (table_name, record_id, action, old_value, new_value, changed_by) VALUES (?, ?, ?, ?, ?, ?)',
      ['employees', id, 'UPDATE', JSON.stringify(old[0]), JSON.stringify(req.body), req.user.id]
    );

    res.json({ msg: 'Employee updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const [old] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    await db.query('DELETE FROM employees WHERE id = ?', [id]);

    // Log history
    await db.query(
      'INSERT INTO history (table_name, record_id, action, old_value, changed_by) VALUES (?, ?, ?, ?, ?)',
      ['employees', id, 'DELETE', JSON.stringify(old[0]), req.user.id]
    );

    res.json({ msg: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const db = require('../config/db');

//get provinces list
exports.getAllProvinces = (req, res) => {
    const sql = "SELECT * FROM provinces";
    db.query(sql, (err, results) => {
        if(err) {
            return res.status(500).json({error : err.message});
        }
        res.status(200).json(results);
    });
};

//get province by id
exports.getProvinceById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM provinces WHERE province_id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Province not found" });
        res.status(200).json(results[0]);
    });
};  
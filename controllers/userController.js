import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ['password_hash', 'access_token', 'refresh_token'] },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({

      users: rows,
      total: count,
      page,
      perPage: limit
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

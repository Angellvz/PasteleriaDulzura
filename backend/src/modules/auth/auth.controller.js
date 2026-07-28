const prisma = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const userObj = await prisma.usuario.findUnique({ where: { usuario } });
    if (!userObj) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const coincide = await bcrypt.compare(password, userObj.passwordHash);
    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: userObj.id, usuario: userObj.usuario, rol: userObj.rol },
      process.env.JWT_SECRET || 'dulzura_secret_jwt_key_2026_super_secure',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: { id: userObj.id, usuario: userObj.usuario, rol: userObj.rol }
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    res.json({ usuario: req.usuario });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, me };

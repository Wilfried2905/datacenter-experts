import { Request, Response } from 'express';
import User from '../models/User';
import { sendWelcomeEmail } from '../services/emailService';
import crypto from 'crypto';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    const tempPassword = crypto.randomBytes(8).toString('hex');

    const user = new User({
      email,
      password: tempPassword,
      role,
    });

    await user.save();
    await sendWelcomeEmail(email, tempPassword);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if ((error as any).code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password -resetPasswordToken -resetPasswordExpires');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { email, role },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    if ((error as any).code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tempPassword = crypto.randomBytes(8).toString('hex');

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.password = tempPassword;
    await user.save();
    await sendWelcomeEmail(user.email, tempPassword);

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

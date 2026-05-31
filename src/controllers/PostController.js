const Post = require('../models/Post');
const User = require('../models/User');

const listPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await Post.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'role', 'avatar_url'],
        },
      ],
    });

    return res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      posts,
    });
  } catch (err) {
    console.error('Erro ao listar posts:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'role', 'avatar_url', 'bio'],
        },
      ],
    });

    if (!post) return res.status(404).json({ error: 'Post não encontrado.' });

    return res.status(200).json(post);
  } catch (err) {
    console.error('Erro ao buscar post:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, image_url, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
    }

    const post = await Post.create({
      title,
      content,
      image_url,
      category,
      user_id: req.userId,
    });

    return res.status(201).json({ message: 'Post criado com sucesso.', post });
  } catch (err) {
    console.error('Erro ao criar post:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post não encontrado.' });

    if (post.user_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissão para editar este post.' });
    }

    const { title, content, image_url, category } = req.body;
    await post.update({ title, content, image_url, category });

    return res.status(200).json({ message: 'Post atualizado.', post });
  } catch (err) {
    console.error('Erro ao atualizar post:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post não encontrado.' });

    if (post.user_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissão para deletar este post.' });
    }

    await post.destroy();
    return res.status(200).json({ message: 'Post deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar post:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = { listPosts, getPost, createPost, updatePost, deletePost };
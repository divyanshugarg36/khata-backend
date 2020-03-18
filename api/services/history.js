const getHistory = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' });
    const projects = await Project.find({});
    const history = [];

    members.forEach((m) => {
      history.push({ name: m.name, date: m.createdAt, message: 'MEMBER_CREATED' });
      if(!m.active) {
        history.push({ name: m.name, date: m.updatedAt, message: 'MEMBER_DELETED' });
      }
    });

    projects.forEach((p) => {
      history.push({ name: p.name, date: p.createdAt, message: 'PROJECT_CREATED' });
      if(!p.active) {
        history.push({ name: p.name, date: p.updatedAt, message: 'PROJECT_DELETED' });
      }
      p.assignments.forEach((a) => {
        const member = members.find((m) => m.id === a.id).name;
        history.push({ name: p.name, date: a.createdAt, member, message: 'MEMBER_ADDED' });
        if(!a.active) {
          history.push({ name: p.name, date: a.updatedAt, member, message: 'MEMBER_REMOVED' });
        }
      });
    });

    history.sort((a, b) => a.date - b.date);
    res.send({
      success: true,
      history,
    });
  } catch (err) {
    res.serverError(err);
  }
};

module.exports = {
  getHistory,
};

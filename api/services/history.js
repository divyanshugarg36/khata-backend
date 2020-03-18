const makeEntries = (iterator, entity, name, members) => {
  const history = [];
  iterator.forEach((i) => {
    const member = members && members.find((m) => m.id === i.id).name;
    history.push({
      name: name || i.name,
      date: new Date(i.createdAt),
      member,
      message: `${entity}_${name ? 'ADDED' : 'CREATED'}`
    });
    if(!i.active) {
      history.push({
        name: name || i.name,
        date: new Date(name ? i.unassignedAt : i.updatedAt),
        member,
        message: `${entity}_${name ? 'REMOVED' : 'DELETED'}`
      });
    }
  });
  return history;
};

const getHistory = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' });
    const projects = await Project.find({});
    const memberEntries = makeEntries(members, 'MEMBER');
    const projectEntries = makeEntries(projects, 'PROJECT');
    let assignmentEntries = [];
    projects.forEach((p) => {
      assignmentEntries = assignmentEntries.concat(makeEntries(p.assignments, 'MEMBER', p.name, members));
    });
    const history = [...memberEntries, ...projectEntries, ...assignmentEntries];
    history.sort((a, b) => a.date - b.date);
    res.send({
      success: true,
      history,
    });
  } catch (err) {
    res.serverError(err);
  }
};

module.exports.HistoryController = {
  getHistory,
};

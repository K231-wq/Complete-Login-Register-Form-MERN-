const welcome = async (req, res) => {
    res.status(200).send("welcom");
}
const create = async (req, res) => {
    res.status(200).json({ user: req.user });
}
const store = async (req, res) => {
    res.status(200).send("store");
}
const show = async (req, res) => {
    res.status(200).send("show");
}
const edit = async (req, res) => {
    res.status(200).send("edit");
}
const destroy = async (req, res) => {
    res.status(200).send("destroy");
}

module.exports = {
    welcome,
    create,
    store,
    show,
    edit,
    destroy
}
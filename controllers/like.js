const Sauce = require("../models/sauce");

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // utilisation du switch()

      switch (req.body.like) {
        case 1:
          // like = 1 (Likes +1)
          if (!sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
            )
              .then(() => res.status(201).json({ message: "Like +1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case -1:
          // like = -1 (dislikes = +1)
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Disliked +1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case 0:
          // like = 0 (Likes neutre, pas de vote)
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
            )

              .then(() => res.status(201).json({ message: "Like -1" }))
              .catch((error) => res.status(400).json({ error }));
          }

          // like = 0 (dislikes neutre, pas de vote)
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )

              .then(() => res.status(201).json({ message: "Disliked -1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

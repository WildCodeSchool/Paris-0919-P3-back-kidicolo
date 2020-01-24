const connection = require("../../config/config");
const express = require("express");

const router = express.Router();

//select all article
router.get("/", (req, res) => {
  connection.query(
    "SELECT * from Article  left join Users on Article.id_user_vendeur=Users.id left join Users as U on Article.id_user_acheteur=U.id left join  Photos on Article.id= Photos.id left join Categorie on Article.id = Categorie.id left join Sub_categorie on Article.id =Sub_categorie.id left join Article_gender on Article.id = Article_gender.id_article left join Article_age on Article.id = Article_age.id_article",
    (err, results) => {
      if (err) {
        res.status(500).send(`Erreur lors de la récupération des articles!`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//Route de Blocaus plus complète ( infos reçus) pour get subact par id
// router.get("/subcat/:id", (req, res) => {
//   const idSubCat = req.params.id;
//   connection.query(
//     "SELECT * from Article  left join Users on Article.id_user_vendeur=Users.id left join Users as U on Article.id_user_acheteur=U.id left join  Photos on Article.id= Photos.id left join Categorie on Article.id = Categorie.id left join Sub_categorie on Article.id =Sub_categorie.id left join Article_gender on Article.id = Article_gender.id_article left join Article_age on Article.id = Article_age.id_article WHERE id_subcategorie = ?",
// get all article from subCat
router.get("/subcat/:id", (req, res) => {
  const idSubCat = req.params.id;
  connection.query(
    "SELECT * FROM Article_subcategorie JOIN Article ON Article_subcategorie.id_article = Article.id WHERE Article_subcategorie.id_subcategorie = ?",
    idSubCat,
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send(
            `Erreur lors de la récupération  des articles lors de la séléction de la sous catégorie !`
          );
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//Select One Article
router.get("/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * from Article  left join Users on Article.id_user_vendeur=Users.id left join Users as U on Article.id_user_acheteur=U.id left join  Photos on Article.id= Photos.id left join Categorie on Article.id = Categorie.id left join Sub_categorie on Article.id =Sub_categorie.id left join Article_gender on Article.id = Article_gender.id_article left join Article_age on Article.id = Article_age.id_article WHERE id = ?",
    id,
    (err, results) => {
      if (err) {
        res.status(500).send(`Erreur lors de la récupération de l'article!`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});
//Search Bar for Article
router.post("/search", (req, res) => {
  const name = req.body.name;
  console.log(req.body);

  connection.query("SELECT * FROM Article", (err, results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la récupération de l'article!`);
    } else {
      // console.log(results)
      const resFilter = results.filter(
        elem => elem.name.toLowerCase().indexOf(name.toLowerCase()) > -1
      );
      res.status(200).json(resFilter);
    }
  });
});

//////////////////////Ajouter  un article/////////////////////
router.post("/addarticle", (req, res) => {
  const body = req.body.article;
  connection.beginTransaction(err => {
    connection.query("SET FOREIGN_KEY_CHECKS = 0", body, (err, results) => {
      if (err) {
        connection.rollback(() => {
          throw err;
        });
        res.send("Erreur.").status(500);
      } else {
        const urlPhoto = req.body.urlPhoto;
        connection.query(
          "INSERT INTO Photos (photourl) VALUES (?) ",
          urlPhoto,
          (err, results) => {
            if (err) {
              connection.rollback(() => {
                throw err;
              });
              res.send("Erreur.").status(500);
            } else {
              const idPhotos = results.insertId;
              const bodyModif = { ...body, id_photoart: idPhotos };
              connection.query(
                `INSERT INTO Article SET ?`,
                bodyModif,
                (err, results) => {
                  if (err) {
                    connection.rollback(() => {
                      throw err;
                    });
                    res.send("Erreur.").status(500);
                  } else {
                    const categoriesId = req.body.categories;
                    const articleId = results.insertId;
                    const articleCategorie = categoriesId.map(id => {
                      const line = [id, articleId];
                      return line;
                    });
                    connection.query(
                      "INSERT INTO `Article_categorie`(`id_categorie`, `id_article`) VALUES ?",
                      [articleCategorie],
                      (err, result) => {
                        if (err) {
                          connection.rollback(() => {
                            throw err;
                          });
                          res.send("Erreur.").status(500);
                        } else {
                          const subcategoriesId = req.body.subcategories;
                          const articleSubcategorie = subcategoriesId.map(
                            id => {
                              const line = [id, articleId];
                              return line;
                            }
                          );
                          connection.query(
                            "INSERT INTO `Article_subcategorie`(`id_subcategorie`, `id_article`) VALUES ? ",
                            [articleSubcategorie],
                            err => {
                              if (err) {
                                connection.rollback(() => {
                                  throw err;
                                });
                                res.send("Erreur.").status(500);
                              } else {
                                const gendersId = req.body.genders;
                                const articleGenders = gendersId.map(id => {
                                  const line = [id, articleId];
                                  return line;
                                });
                                connection.query(
                                  "INSERT INTO `Article_gender`(`id_gender`, `id_article`) VALUES ? ",
                                  [articleGenders],
                                  err => {
                                    if (err) {
                                      connection.rollback(() => {
                                        throw err;
                                      });
                                      res.send("Erreur.").status(500);
                                    } else {
                                      const agesId = req.body.ages;
                                      const articleAges = agesId.map(id => {
                                        const line = [id, articleId];
                                        return line;
                                      });
                                      connection.query(
                                        "INSERT INTO `Article_age`(`id_age`, `id_article`) VALUES ?",
                                        [articleAges],
                                        err => {
                                          if (err) {
                                            connection.rollback(() => {
                                              throw err;
                                            });
                                            res.send("Erreur.").status(500);
                                          } else {
                                            connection.commit(err => {
                                              if (err) {
                                                connection.rollback(() => {
                                                  throw err;
                                                });
                                                res.send("Erreur.").status(500);
                                              } else {
                                                connection.query(
                                                  "SET FOREIGN_KEY_CHECKS=1",
                                                  (err, results) => {
                                                    if (err) {
                                                      connection.rollback(
                                                        () => {
                                                          throw err;
                                                        }
                                                      );
                                                      res
                                                        .send("Erreur.")
                                                        .status(500);
                                                    }
                                                    res
                                                      .status(200)
                                                      .send("gooood");
                                                    // connection.end();
                                                  }
                                                );
                                              }
                                            });
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  });
});



router.put("/updatearticle/:id", (req, res) => {
  const id = req.params.id
  const body = req.body.article;
  connection.beginTransaction(err => {
    connection.query("SET FOREIGN_KEY_CHECKS = 0", body,id, (err, results) => {
      if (err) {
        connection.rollback(() => {
          throw err;
        });
        res.send("Erreur.").status(500);
      } else {
        const urlPhoto = req.body.urlPhoto;
        connection.query(
          "UPDATE Photos (photourl) VALUES (?) WHERE id = ?",
          urlPhoto, id,
          (err, results) => {
            if (err) {
              connection.rollback(() => {
                throw err;
              });
              res.send("Erreur.").status(500);
            } else {
              const idPhotos = results.insertId;
              const bodyModif = { ...body, id_photoart: idPhotos };
              connection.query(
                `UPDATE Article SET ? WHERE id = ?`,
                bodyModif, id ,
                (err, results) => {
                  if (err) {
                    connection.rollback(() => {
                      throw err;
                    });
                    res.send("Erreur.").status(500);
                  } else {
                    const categoriesId = req.body.categories;
                    const articleId = results.insertId;
                    const articleCategorie = categoriesId.map(id => {
                      const line = [id, articleId];
                      return line;
                    });
                    connection.query(
                      "UPDATE `Article_categorie`(`id_categorie`, `id_article`) VALUES ? WHERE id = ?" ,
                      [articleCategorie],id,
                      (err, result) => {
                        if (err) {
                          connection.rollback(() => {
                            throw err;
                          });
                          res.send("Erreur.").status(500);
                        } else {
                          const subcategoriesId = req.body.subcategories;
                          const articleSubcategorie = subcategoriesId.map(
                            id => {
                              const line = [id, articleId];
                              return line;
                            }
                          );
                          connection.query(
                            "UPDATE `Article_subcategorie`(`id_subcategorie`, `id_article`) VALUES ? WHERE id = ? ",
                            [articleSubcategorie],id,
                            err => {
                              if (err) {
                                connection.rollback(() => {
                                  throw err;
                                });
                                res.send("Erreur.").status(500);
                              } else {
                                const gendersId = req.body.genders;
                                const articleGenders = gendersId.map(id => {
                                  const line = [id, articleId];
                                  return line;
                                });
                                connection.query(
                                  "UPDATE `Article_gender`(`id_gender`, `id_article`) VALUES ? WHERE id = ? ",
                                  [articleGenders],id,
                                  err => {
                                    if (err) {
                                      connection.rollback(() => {
                                        throw err;
                                      });
                                      res.send("Erreur.").status(500);
                                    } else {
                                      const agesId = req.body.ages;
                                      const articleAges = agesId.map(id => {
                                        const line = [id, articleId];
                                        return line;
                                      });
                                      connection.query(
                                        "UPDATE `Article_age`(`id_age`, `id_article`) VALUES ? WHERE id = ?",
                                        [articleAges],id,
                                        err => {
                                          if (err) {
                                            connection.rollback(() => {
                                              throw err;
                                            });
                                            res.send("Erreur.").status(500);
                                          } else {
                                            connection.commit(err => {
                                              if (err) {
                                                connection.rollback(() => {
                                                  throw err;
                                                });
                                                res.send("Erreur.").status(500);
                                              } else {
                                                connection.query(
                                                  "SET FOREIGN_KEY_CHECKS=1",
                                                  (err, results) => {
                                                    if (err) {
                                                      connection.rollback(
                                                        () => {
                                                          throw err;
                                                        }
                                                      );
                                                      res
                                                        .send("Erreur.")
                                                        .status(500);
                                                    }
                                                    res
                                                      .status(200)
                                                      .send("gooood");
                                                    // connection.end();
                                                  }
                                                );
                                              }
                                            });
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  });
});

// router.route("/switch/:id").put((req, res) => {
//   const newData = req.body;
//   const id = req.params.id;
//   connection.query(
//     "UPDATE  Article  SET ? WHERE id = ? ",
//     [newData, id],
//     (err, results) => {
//       console.log(err);
//       if (err) {
//         res.status(500).send(`Erreur lors de la modification de l'article !`);
//       } else {
//         res.status(200).json(results);
//       }
//     }
//   );
// });

router.route("/delete/:id").delete((req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM Article WHERE id = ? ", id, (err, results) => {
    console.log(err);
    if (err) {
      res.status(500).send(`Erreur lors de la suppression de l'article !`);
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;

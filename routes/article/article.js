const express = require("express");
const connection = require("../../config/config");

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

// get all article form subCat a refaire!!!
router.get("/subcat/:id", (req, res) => {
  const idSubCat = req.params.id;
  connection.query(
    "SELECT * from Article  left join Users on Article.id_user_vendeur=Users.id left join Users as U on Article.id_user_acheteur=U.id left join  Photos on Article.id= Photos.id left join Categorie on Article.id = Categorie.id left join Sub_categorie on Article.id =Sub_categorie.id left join Article_gender on Article.id = Article_gender.id_article left join Article_age on Article.id = Article_age.id_article WHERE id_subcategorie = ?",
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

//select one article
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

//////////////////////Gérer un article/////////////////////
router.route("/addarticle").post((req, res) => {
  const body = req.body.article;
  connection.beginTransaction(err => {
    connection.query("SET FOREIGN_KEY_CHECKS = 0", body,
      (err,results) => {
        if(err){
          console.log(`ici l'erreur `, err);
          res.send("Erreur.").status(500);

        }else{
          connection.query(`INSERT INTO Article SET ?`, body, (err, results) => {
            if (err) {
              console.log(req.body);
              res.send(err.message);
            } else {
              const categoriesId = req.body.categories;
              const articleId = results.insertId;
              console.log(articleId);
              
             const articleCategorie = categoriesId.map(id => {
                const line = [
                  id,
                  articleId
                ]
                return line;
              }) 
              console.log(articleCategorie)
      
              connection.query(
                "INSERT INTO `Article_categorie`(`id_categorie`, `id_article`) VALUES ?", [articleCategorie],
                (err, result) => {
                  console.log(result);
                  
                  if (err) {
                    console.log('cate err');
                    
                    connection.rollback(() => {throw err})
                    res.send(err.message);
                  } else {
                    const subcategoriesId = req.body.subcategories;
                    const articleSubcategorie = subcategoriesId.map(id => {
                      const line =[
                        id,
                        articleId
                      ]
                      return line
                    })
      
                    connection.query(
                      "INSERT INTO `Article_subcategorie`(`id_subcategorie`, `id_article`) VALUES ? ",
                      [articleSubcategorie],
                      err => {
                        if (err) {
                          console.log('sub cat');
                          
                          connection.rollback(() => {throw err})
                          res.send(err.message);
                        } else {
                          const  gendersId = req.body.genders;
                          const articleGenders = gendersId.map(id => {
                            const line =[
                              id,
                              articleId
                            ]
                            return line;
                          })
      
                          connection.query(
                            "INSERT INTO `Article_gender`(`id_gender`, `id_article`) VALUES ? ",
                            [articleGenders],
                            err => {
                              if (err) {
                                console.log('gender err');
                                
                                connection.rollback(() => {throw err})
                                res.send(err.message);
                              } else{
                                 const agesId = req.body.ages;
                                 const articleAges = agesId.map(id =>{
                                const line =[
                                    id,
                                     articleId
                                   ]
                                   return  line;
                                 })
                                 connection.query(
                                  "INSERT INTO `Article_age`(`id_age`, `id_article`) VALUES ?",
                                  [articleAges],
                                  err => {
                                    if (err) {
                                      console.log('age err');
                                      
                                      connection.rollback(() => {throw err})
                                      res.send(err.message);
                                    } else {
                                      connection.commit((err) => {
                                        if(err){
                                          console.log('poil');
                                          
                                          connection.rollback(() => {throw err})
                                        } else{
                                          connection.query('SET FOREIGN_KEY_CHECKS=1', (err, results) => {
                                            if (err) {
                                              console.log(`ici l'erreur `, err);
                                              res.send("Erreur lors de l'ajout du produit.").status(500);
                                            }
                                            res.status(200).send('gooood')
                                            console.log("salut les zouzous")
                                            connection.end();
                                        
                                          })
                                        }
                                      })
      
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
        )
      }
    })
  }
})
})
})


router.route("/switch/:id").put((req, res) => {
  const newData = req.body;
  const id = req.params.id;
  connection.query(
    "UPDATE  Article  SET ? WHERE id = ? ",
    [newData, id],
    (err, results) => {
      console.log(err);
      if (err) {
        res.status(500).send(`Erreur lors de la modification de l'article !`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

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

// SELECT
Tables.findAll({
  // Récupére les données de TABLES dans la table Tables
  attributes: ['tables_id', 'tables_attribut1', 'tables_attribut2', 'tables_attribut3']
}).then((object) => {
  // Convertit l'objet en JSON
  const data = JSON.parse(JSON.stringify(object));

  // Affiche tout les élements du tableau
  data.forEach(element => {
    console.log(`id : ${element.tables_id} | Attribut 1 : ${element.tables_attribut1} | Attribut 2 : ${element.tables_attribut2} | Attribut 3 : ${element.tables_attribut3} | Attribut 4 : ${element.tables_attribut4}`);
  });
});

// INSERT INTO
Tables.create({
  tables_attribut1: 'attr1',
  tables_attribut2: 'attr2',
  tables_attribut3: 'attr3'
});

// UPDATE
Tables.update({
  tables_attribut1: 'attr1',
  tables_attribut2: 'attr2',
  tables_attribut3: 'attr3'
}, {
  // WHERE `tables_id` = 'id'
  where: {
    tables_id: 'id'
  }
});

// DELETE
Tables.destroy({
  // WHERE `tables_id` = 'id'
  where: {
    tables_id: 'id'
  }
});
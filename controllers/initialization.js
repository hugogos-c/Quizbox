/**
 * @file controller/initialization.js
 * @author Hugo CIRETTE
 */

const fs = require('fs');
const { Admins, Dossiers } = require('../databaseConnection');

module.exports = async () => {
  // Créé le dossier uploads s'il n'existe pas dans lequel il y aura toutes les images des questionnaires et des questions
  if (!fs.existsSync('public/uploads')) {
    fs.mkdir('public/uploads', (err) => {
      if (err) {
        console.error('Erreur : ' + err);
      } else {
        console.log(`Dossier 'uploads' créé avec succès`);
      }
    });
  }

  // Créé le dossier downloads s'il n'existe pas dans lequel il y aura tous classement des joueurs des questionnaires
  if (!fs.existsSync('public/downloads')) {
    fs.mkdir('public/downloads', (err) => {
      if (err) {
        console.error('Erreur : ' + err);
      } else {
        console.log(`Dossier 'downloads' créé avec succès`);
      }
    });
  }

  const [admin, adminCreated] = await Admins.findOrCreate({
    where: {
      admins_nom: 'admin',
    },
    defaults: {
      admins_email: 'admin',
      admins_nom: 'admin',
      admins_mdp: 'admin'
    }
  });

  if (adminCreated) {
    console.log(`Compte 'admin' créé avec succès`);
  }

  const [aucun, aucunCreated] = await Dossiers.findOrCreate({
    where: {
      dossiers_nom: 'Aucun',
    },
    defaults: {
      dossiers_nom: 'Aucun',
      dossiers_id_fk_admins: '1'
    }
  });

  if (aucunCreated) {
    console.log(`Dossier 'Aucun' créé avec succès`);
  }

  const [CIEL, CIELCreated] = await Dossiers.findOrCreate({
    where: {
      dossiers_nom: 'CIEL',
    },
    defaults: {
      dossiers_nom: 'CIEL',
      dossiers_id_fk_admins: '1'
    }
  });

  if (CIELCreated) {
    console.log(`Dossier 'CIEL' créé avec succès`);
  }

  const [SAM, SAMCreated] = await Dossiers.findOrCreate({
    where: {
      dossiers_nom: 'SAM',
    },
    defaults: {
      dossiers_nom: 'SAM',
      dossiers_id_fk_admins: '1'
    }
  });

  if (SAMCreated) {
    console.log(`Dossier 'SAM' créé avec succès`);
  }

  const [CG, CGCreated] = await Dossiers.findOrCreate({
    where: {
      dossiers_nom: 'CG',
    },
    defaults: {
      dossiers_nom: 'CG',
      dossiers_id_fk_admins: '1'
    }
  });

  if (CGCreated) {
    console.log(`Dossier 'CG' créé avec succès`);
  }

  const [ESF, ESFCreated] = await Dossiers.findOrCreate({
    where: {
      dossiers_nom: 'ESF',
    },
    defaults: {
      dossiers_nom: 'ESF',
      dossiers_id_fk_admins: '1'
    }
  });

  if (ESFCreated) {
    console.log(`Dossier 'ESF' créé avec succès`);
  }

  const [MCO, MCOCreated] = await Dossiers.findOrCreate({
    where: {
      dossiers_nom: 'MCO',
    },
    defaults: {
      dossiers_nom: 'MCO',
      dossiers_id_fk_admins: '1'
    }
  });

  if (MCOCreated) {
    console.log(`Dossier 'MCO' créé avec succès`);
  }
}
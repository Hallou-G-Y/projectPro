# Projet de Qualité de l'Air et de Transport

Ce projet est une application web interactive qui permet aux utilisateurs de consulter la qualité de l'air dans différentes villes et d'obtenir des informations sur les transports en Île-de-France. L'application utilise des API externes pour récupérer les données en temps réel.

## Fonctionnalités

- **Recherche de Ville** : Les utilisateurs peuvent entrer le nom d'une ville pour obtenir des informations sur la qualité de l'air.
- **Carte Interactive** : Affichage d'une carte avec la localisation de la ville recherchée.
- **Informations sur les Transports** : Affichage des horaires de transport en temps réel pour les arrêts en Île-de-France.
- **Mise à jour en temps réel** : Les données de qualité de l'air et de transport sont mises à jour régulièrement.

## Technologies Utilisées

- **Next.js** : Framework React pour le rendu côté serveur et la génération de sites statiques.
- **React** : Bibliothèque JavaScript pour construire des interfaces utilisateur.
- **Tailwind CSS** : Framework CSS pour un design moderne et réactif.
- **Leaflet** : Bibliothèque JavaScript pour créer des cartes interactives.
- **Lucide React** : Bibliothèque d'icônes pour une interface utilisateur attrayante.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-repo.git
   cd votre-repo
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez vos variables d'environnement. Créez un fichier `.env.local` à la racine du projet et ajoutez vos clés API :
   ```
   NEXT_PUBLIC_IDF_MOBILITES_API_KEY=your_api_key_here
   ```

4. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Ouvrez votre navigateur et accédez à `http://localhost:3000`.

## Utilisation

- Pour rechercher la qualité de l'air, entrez le nom d'une ville dans la barre de recherche et cliquez sur "Rechercher".
- La carte affichera la localisation de la ville recherchée.
- Les informations sur les transports seront affichées sous la section correspondante.

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez contribuer, veuillez suivre ces étapes :

1. Fork le projet.
2. Créez une nouvelle branche (`git checkout -b feature/YourFeature`).
3. Apportez vos modifications et validez (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez vos modifications (`git push origin feature/YourFeature`).
5. Ouvrez une Pull Request.

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Acknowledgments

- Merci à toutes les bibliothèques et API utilisées dans ce projet.
- Un grand merci à la communauté open source pour son soutien et ses ressources.
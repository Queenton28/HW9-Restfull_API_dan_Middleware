module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('movies', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      genres: {
        type: DataTypes.STRING,
      },
      year: {
        type: DataTypes.STRING,
      },
    });
  
    return Movie;
  };
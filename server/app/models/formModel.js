const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Form = sequelize.define("Form", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firmName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firmRegNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reviewEndDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isMandatory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isVoluntary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isSpecialCase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isNewUnit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isBoardDecision: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otherRegulator: {
    type: DataTypes.STRING,
  },
  hasConductedAudit: {
    type: DataTypes.BOOLEAN,
  },
  reviewerSameCity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  reviewerOutsideCity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  reviewerEither: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  preferredCity: {
    type: DataTypes.STRING,
  },
  communicationEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  certificateAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Client types for each service
  clientType1: DataTypes.STRING,
  clientType2: DataTypes.STRING,
  clientType3: DataTypes.STRING,
  clientType4: DataTypes.STRING,
  clientType5: DataTypes.STRING,
  clientType6: DataTypes.STRING,
  clientType7: DataTypes.STRING,
  otherService: DataTypes.STRING,
  pdfPath: DataTypes.STRING, // To store the path to generated PDF
});

module.exports = Form;
